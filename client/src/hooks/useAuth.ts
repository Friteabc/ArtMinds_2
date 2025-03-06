import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiRequest } from '@/lib/queryClient';

interface ExtendedUser extends Omit<User, 'photoURL'> {
  photoURL: string | null;
  credits?: number;
  displayName: string | null;
  email: string | null;
  driveConnected?: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Récupérer les informations de l'utilisateur depuis l'API
          const response = await apiRequest('GET', `/api/users/${firebaseUser.uid}`);
          const userData = await response.json();

          setUser({
            ...firebaseUser,
            credits: userData.credits,
            driveConnected: userData.driveConnected,
          } as ExtendedUser);
        } catch (error) {
          console.error("Erreur lors de la récupération des données:", error);
          // En cas d'erreur, on utilise quand même les données de Firebase
          setUser({
            ...firebaseUser,
            credits: 0,
            driveConnected: false
          } as ExtendedUser);
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
    provider.addScope('https://www.googleapis.com/auth/drive.file');
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