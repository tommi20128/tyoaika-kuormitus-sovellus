// hooks/useEmployeeData.ts

import { db } from '@/Config';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
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
    const fetchEmployees = async () => {
      if (!user) return;

      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (!userSnap.exists()) return;

        // Hae työntekijät joiden managerId = user.uid
        const q = query(
          collection(db, "users"),
          where("managerId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        const listEmployees: User[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            title: data.title || "",
            email: data.email || "",
            role: data.role || "employee",
            managerId: data.managerId || undefined,
          };
        });

        setEmployees(listEmployees);

      } catch (error) {
        console.log("Käyttäjiä ei voitu hakea", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [user]);

  return { employees, loading };
};