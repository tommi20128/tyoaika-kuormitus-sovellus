// hooks/useProfileData.ts
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/Config';
import { useAuth } from '@/context/AuthContext';
import { ProfileData } from '@/types/profile';

// Hookki käyttäjätietojen hakemiseen Firestoresta profiilisivua varten

export const useProfileData = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    title: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      const docSnap = await getDoc(doc(db, 'users', user.uid));

      if (docSnap.exists()) {
        const data = docSnap.data();

        setProfile({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          title: data.title || '',
          email: user.email || '',
        });
      }

      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  return {
    profile,
    loading,
  };
};