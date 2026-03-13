// hooks/useProfileData.ts
import { db } from '@/Config';
import { useAuth } from '@/context/AuthContext';
import { ProfileData } from '@/types/profile';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

// Hookki kirjautuneen käyttäjän tietojen hakemiseen Firestoresta profiilisivua varten
export const useProfileData = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    managerName: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const docSnap = await getDoc(doc(db, 'users', user.uid));

        if (docSnap.exists()) {
          const data = docSnap.data();

          setProfile({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            title: data.title || '',
            email: user.email || '',      // Käytetään vain kirjautuneen käyttäjän sähköpostia
            managerName: data.manager || '',
          });
        }
      } catch (error) {
        console.log('Profiilin hakuvirhe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  return {
    profile,
    loading,
  };
};