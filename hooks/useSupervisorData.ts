// hooks/useSupervisorData.ts

import { db } from '@/Config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { User } from '@/types';

export const useSupervisors = () => {
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "supervisor")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: User[] = snapshot.docs.map((doc) => {
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

      setSupervisors(list);
      setLoading(false);
    },
      (error) => {
        console.log("Supervisor fetch error:", error);
        setLoading(false);
      }
    );


    return () => unsubscribe();
  }, []);

  return { supervisors, loading };
};