// hooks/useDashboardData.ts
import { db } from '@/Config';
import { useAuth } from '@/context/AuthContext';
import { WorkSummary } from '@/types/summary';
import { DailyWorkEntry } from '@/types/work';
import { average, sumMinutes } from '@/utils/workUtils';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { calculateCareerTargetMinutes } from '@/utils/workUtils';

const DAILY_TARGET = 7.5; // tuntia / arkipäivä (vaihdetaan myöhemmin oikeaan laskutapaan)

// --------------------------------------------------
// Tämä hook hakee ja laskee Etusivun tarvitseman datan
// employeeId: jos annettu, hook hakee kyseisen työntekijän datan (esim. Esihenkilölle)
// --------------------------------------------------
export function useDashboardData(employeeId?: string) {
  const { user } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [todayEntry, setTodayEntry] = useState<DailyWorkEntry | null>(null);
  const [weekSummary, setWeekSummary] = useState<WorkSummary | null>(null);
  const [monthSummary, setMonthSummary] = useState<WorkSummary | null>(null);
  const [totalSummary, setTotalSummary] = useState<WorkSummary | null>(null);

  const todayId = new Date().toISOString().split('T')[0];

  // -------------------------
  // Haetaan käyttäjän nimi
  // -------------------------
  useEffect(() => {
    const fetchName = async () => {
      // Jos ei ole employeeId eikä kirjautunutta käyttäjää, ei tehdä mitään
      if (!employeeId && !user) return;

      const uid = employeeId || user!.uid; // Käytetään employeeId:tä jos annettu, muuten kirjautuneen UID
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFirstName(data.firstName || '');
      }
    };
    fetchName();
  }, [user, employeeId]);

  // -------------------------
  // Haetaan ja lasketaan etusivun data
  // Käytetään getDocs reaaliaikaisuuden sijaan
  // -------------------------
  useEffect(() => {
    if (!employeeId && !user) return;

    const fetchEntries = async () => {
      try {
        const uid = employeeId || user!.uid;

        // Hae kaikki työntekijän workEntries
        const entriesRef = collection(db, 'users', uid, 'workEntries');
        const snapshot = await getDocs(entriesRef);
        const entries: DailyWorkEntry[] = snapshot.docs.map(doc => doc.data() as DailyWorkEntry);

        const now = new Date();

        // -------------------------
        // Päivän kirjaus
        // -------------------------
        const todayData = entries.find(e => e.date === todayId) || null;
        setTodayEntry(todayData);

        // -------------------------
        // Viikkonäkymä
        // -------------------------
        const weekStart = new Date(now);
        const day = weekStart.getDay();
        const diff = (day === 0 ? -6 : 1) - day;
        weekStart.setDate(weekStart.getDate() + diff);

        const weekEntries = entries.filter(e => {
          const d = new Date(e.date);
          return d >= weekStart && d <= now;
        });

        const weekMinutes = sumMinutes(weekEntries);
        setWeekSummary({
          hours: Math.floor(weekMinutes / 60),
          minutes: weekMinutes % 60,
          load: average(weekEntries, 'load1').toFixed(1),
          stress1: average(weekEntries, 'stressLoad1').toFixed(1),
          stress2: average(weekEntries, 'stressLoad2').toFixed(1),
          stress3: average(weekEntries, 'averageStress').toFixed(1),
          goalDiff: weekMinutes / 60 - weekEntries.length * DAILY_TARGET,
        });

        // -------------------------
        // Kuukausinäkymä
        // -------------------------
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEntries = entries.filter(e => {
          const d = new Date(e.date);
          return d >= monthStart && d <= now;
        });

        const monthMinutes = sumMinutes(monthEntries);
        setMonthSummary({
          hours: Math.floor(monthMinutes / 60),
          minutes: monthMinutes % 60,
          load: average(monthEntries, 'load1').toFixed(1),
          stress1: average(monthEntries, 'stressLoad1').toFixed(1),
          stress2: average(monthEntries, 'stressLoad2').toFixed(1),
          stress3: average(monthEntries, 'averageStress').toFixed(1),
          goalDiff: monthMinutes / 60 - monthEntries.length * DAILY_TARGET,
        });

        // -------------------------
        // Koko työuran yhteenvedot
        // -------------------------
        const totalMinutes = sumMinutes(entries);
        const careerTargetMinutes = calculateCareerTargetMinutes(entries, DAILY_TARGET);
        const careerDiffHours = (totalMinutes - careerTargetMinutes) / 60;
        setTotalSummary({
          hours: Math.floor(totalMinutes / 60),
          minutes: totalMinutes % 60,
          goalDiff: careerDiffHours,
          targetMinutes: careerTargetMinutes,
        });

      } catch (error) {
        console.log('Dashboard fetch error:', error);
      }
    };

    fetchEntries();
  }, [user, employeeId]);

  return {
    firstName,
    todayEntry,
    weekSummary,
    monthSummary,
    totalSummary,
  };
}