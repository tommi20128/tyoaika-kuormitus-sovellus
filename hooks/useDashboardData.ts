// hooks/useDashboardData.ts
import { db } from '@/Config';
import { useAuth } from '@/context/AuthContext';
import { WorkSummary } from '@/types/summary';
import { DailyWorkEntry } from '@/types/work';
import { average, sumMinutes, formatHourDiff } from '@/utils/workUtils';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { calculateCareerTargetMinutes } from '@/utils/workUtils';

const DAILY_TARGET = 7.5; // tuntia / arkipäivä (vaihdetaan myöhemmin oikeaan laskutapaan)

// Tämä hook hakee ja laskee Etusivun tarvitseman datan

export function useDashboardData() {
  const { user } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [todayEntry, setTodayEntry] = useState<DailyWorkEntry | null>(null);
  const [weekSummary, setWeekSummary] = useState<WorkSummary | null>(null);
  const [monthSummary, setMonthSummary] = useState<WorkSummary | null>(null);
  const [totalSummary, setTotalSummary] = useState<WorkSummary | null>(null);

  const todayId = new Date().toISOString().split('T')[0];

  // Haetaan käyttäjän nimi
  useEffect(() => {
    const fetchName = async () => {
      if (!user) return;

      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFirstName(data.firstName || '');
      }
    };
    fetchName();
  }, [user]);

  // Haetaan ja lasketaan etusivun data (reaaliaikaisesti)
  useEffect(() => {
    if (!user) return;

    const entriesRef = collection(
      db,
      'users',
      user.uid,
      'workEntries'
    );

    // onSnapshot kuuntelee Firestore-muutoksia reaaliaikaisesti
    const unsubscribe = onSnapshot(entriesRef, snapshot => {
      const entries: DailyWorkEntry[] = snapshot.docs.map(doc =>
        doc.data() as DailyWorkEntry
      );

      // Nykyinen päivä
      const now = new Date();

      // -------------------------
      // Päivän kirjaus
      // -------------------------
      const todayData =
        entries.find(e => e.date === todayId) || null;
      setTodayEntry(todayData);

      // -------------------------
      // Viikkonäkymä
      // -------------------------
      const weekStart = new Date(now);
      const day = weekStart.getDay();
      const diff = (day === 0 ? -6 : 1) - day;
      weekStart.setDate(weekStart.getDate() + diff);

      // Viikon kirjausten suodatus
      const weekEntries = entries.filter(e => {
        const d = new Date(e.date);
        return d >= weekStart && d <= now;
      });

      // Viikon minuuttien summa
      const weekMinutes = sumMinutes(weekEntries);

      // Viikon yhteenveto
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
      const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      // Kuukauden kirjausten suodatus
      const monthEntries = entries.filter(e => {
        const d = new Date(e.date);
        return d >= monthStart && d <= now;
      });

      // Kuukauden minuuttien summa
      const monthMinutes = sumMinutes(monthEntries);

      // Kuukauden yhteenveto
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

      // Lasketaan tavoiteminuutit ensimmäisestä kirjauksesta lähtien
      const careerTargetMinutes = calculateCareerTargetMinutes(entries, DAILY_TARGET);

      // Erotus tunneissa (desimaalina)
      const careerDiffHours = (totalMinutes - careerTargetMinutes) / 60;

      setTotalSummary({
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60,
        goalDiff: careerDiffHours,
        targetMinutes: careerTargetMinutes,
      });
    });

    // Cleanup: lopetetaan kuuntelu kun komponentti unmountataan
    return () => unsubscribe();
  }, [user]);

  return {
    firstName,
    todayEntry,
    weekSummary,
    monthSummary,
    totalSummary,
  };
}
