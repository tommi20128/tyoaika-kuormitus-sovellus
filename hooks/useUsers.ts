// hooks/useUsers.ts

import { db } from "@/Config";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types";
import {
  collection,
  query,
  where,
  onSnapshot,
  Query,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export const useUsers = (mode: "mine" | "all" | "supervisors") => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Oletuksena haetaan kaikki käyttäjät
    let q: Query = collection(db, "users");

    // Haetaan käyttäjät joiden managerId = nykyinen käyttäjä
    if (mode === "mine") {
      q = query(q, where("managerId", "==", user.uid));
    } 

    // Haetaan kaikki käyttäjät joilla rooli on supervisor
    if (mode === "supervisors") {
      q = query(q, where("role", "==", "supervisor"));
    }

    // Reaaliaikainen Firestore-kuuntelu3
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
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

        setUsers(list);
        setLoading(false);
      },
      (error) => {
        console.log("Users fetch error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, mode]);

  return { users, loading };
};