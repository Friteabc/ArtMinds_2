import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiRequest } from '@/lib/queryClient';

interface ExtendedUser extends User {
  credits?: number;
}

export function useAuth() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Récupérer les crédits de l'utilisateur depuis l'API
          const response = await apiRequest('GET', `/api/users/${firebaseUser.uid}`);
          const userData = await response.json();

          setUser({
            ...firebaseUser,
            credits: userData.credits
          });
        } catch (error) {
          console.error("Erreur lors de la récupération des crédits:", error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Créer ou mettre à jour l'utilisateur dans notre backend
      await apiRequest('POST', '/api/users', {
        id: result.user.uid,
        email: result.user.email,
      });
      return result.user;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  };

  const logout = () => signOut(auth);

  return {
    user,
    loading,
    signInWithGoogle,
    logout,
  };
}