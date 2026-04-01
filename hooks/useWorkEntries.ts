// hooks/useWorkEntries.ts

import { db } from '@/Config';
import { useAuth } from '@/context/AuthContext';
import { DailyWorkEntry } from '@/types';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

// --------------------------------------------------
// Hook joka hakee kaikki käyttäjän workEntries
// Firestoresta reaaliaikaisesti.
//
// Tätä hookia käytetään:
// - Dashboardissa
// - Historiassa
//
// Firestorea kuunnellaan vain kerran.
// --------------------------------------------------

export function useWorkEntries(employeeId?: string) {

  const { user } = useAuth();
  const [entries, setEntries] = useState<DailyWorkEntry[]>([]);

  useEffect(() => {

    if (!user && !employeeId) return;

    const uid = employeeId || user!.uid;
    if (!uid) return;

    const entriesRef = collection(db, 'users', uid, 'workEntries');

    const unsubscribe = onSnapshot(entriesRef, (snapshot) => {

      const data: DailyWorkEntry[] = snapshot.docs.map((d) => {

        const raw = d.data() as Partial<DailyWorkEntry> & {
          load1?: number
          stressLoad1?: number
          stressLoad2?: number
        };

        return {
          id: d.id,
          userId: uid,
          workload: raw.workload ?? raw.load1 ?? 0,
          stress1: raw.stress1 ?? raw.stressLoad1 ?? 0,
          stress2: raw.stress2 ?? raw.stressLoad2 ?? 0,
          comment: raw.comment ?? '',
          date: raw.date ?? '',
          totalMinutes: raw.totalMinutes ?? 0,
        };

      });

      data.sort((a, b) => b.date.localeCompare(a.date));

      setEntries(data);

    });

    return () => unsubscribe();

  }, [user, employeeId]);

  return entries;
}