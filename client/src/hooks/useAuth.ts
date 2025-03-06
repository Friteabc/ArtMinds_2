import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiRequest } from '@/lib/queryClient';

interface ExtendedUser extends Omit<User, 'photoURL'> {
  photoURL: string | null;
  credits: number;
  displayName: string | null;
  email: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Créer ou mettre à jour l'utilisateur dans notre API
          const createResponse = await apiRequest('POST', '/api/users', {
            id: firebaseUser.uid,
            email: firebaseUser.email,
          });
          const userData = await createResponse.json();

          // Mettre à jour l'état avec les données de l'utilisateur
          setUser({
            ...firebaseUser,
            credits: userData.credits || 10,
          } as ExtendedUser);
        } catch (error) {
          console.error("Erreur lors de la création/mise à jour de l'utilisateur:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // L'utilisateur sera créé/mis à jour via l'effet onAuthStateChanged
      return result.user;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    logout,
  };
}