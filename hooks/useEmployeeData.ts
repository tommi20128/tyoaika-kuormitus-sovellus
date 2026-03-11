// hooks/useEmployeeData.ts
import { useEffect, useState } from 'react';
import { doc, getDocs, query, where, collection, getDoc  } from 'firebase/firestore';
import { db } from '@/Config';
import { useAuth } from '@/context/AuthContext';
import { EmployeeData } from '@/types/employees';

// Hookki työntekijöiden hakemiseen Firestoresta 

export const useEmployeeData = () => {
  const { user } = useAuth();

const [employees, setEmployees] = useState<EmployeeData[]>([]);
const [loading, setLoading] = useState(true);

 useEffect(() => {
    const fetchEmployees = async () => {
        if (!user) return;

        try {
            const userSnap = await getDoc(doc(db, "users", user.uid));

            if (!userSnap.exists()) return;

            const userData = userSnap.data();
            const managerName = `${userData.firstName} ${userData.lastName}`;
            console.log("Manager name muodostettu:", managerName);

            const a = query(
                collection(db, "users"),
                where ("manager", "==", managerName)
            );
            const querySnapshot = await getDocs(a);

            const listEmployees: EmployeeData[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                listEmployees.push ({
                    id: doc.id,
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    title: data.title || "",
                });
            });
            setEmployees(listEmployees);
            console.log(listEmployees)
        } catch (error) {
            console.log ("Käyttäjiä ei voitu hakea", error);
        }finally {
            setLoading(false);
        }
    }
    fetchEmployees();
 }, [user]);


  return {
    employees, loading,};
};