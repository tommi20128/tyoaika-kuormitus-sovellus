// hooks/useEmployeeData.ts

import { db } from '@/Config';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';
import { collection, doc, getDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

// --------------------------------------------------
// Hook työntekijöiden hakemiseen Firestoresta
//
// Hakee kaikki käyttäjät joiden manager = user.uid
// --------------------------------------------------

export const useEmployeeData = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Query työntekijöille
    const q = query(
      collection(db, "users"),
      where("managerId", "==", user.uid)
    );

    // Reaaliaikainen kuuntelu
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const listEmployees: User[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          title: data.title || "",
          email: data.email || "",
          role: data.role || "employee",
          managerId: data.managerId || null,
        };
      });

      setEmployees(listEmployees);
      setLoading(false);
    }, (error) => {
      console.log("Käyttäjiä ei voitu hakea", error);
      setLoading(false);
    });

    // Cleanup (tärkeä!)
    return () => unsubscribe();

  }, [user]);

  return { employees, loading };
};