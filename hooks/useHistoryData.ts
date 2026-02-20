// hooks/useHistoryData.ts
import { db } from '@/Config';
import { useAuth } from '@/context/AuthContext';
import { DailyWorkEntry } from '@/types/work';
import {
  formatMonthLabel,
  getISOWeekNumber,
  getWeekRange,
  isFutureMonth,
  isFutureWeek
} from '@/utils/dateUtils';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

// Tämä hook hakee ja laskee Historia-sivun tarvitseman datan

export function useHistoryData() {
  const { user } = useAuth();

  const [entries, setEntries] = useState<DailyWorkEntry[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [view, setView] = useState<'week' | 'month'>('week');

  // Hae kirjaukset (reaaliaikaisesti)
  useEffect(() => {
    if (!user) return;

    const entriesRef = collection(db, 'users', user.uid, 'workEntries');

    // onSnapshot kuuntelee Firestore-muutoksia reaaliaikaisesti
    const unsubscribe = onSnapshot(entriesRef, snapshot => {
      const data = snapshot.docs.map(doc => doc.data() as DailyWorkEntry);
      setEntries(data);
    });

    // Cleanup: lopetetaan kuuntelu kun komponentti unmountataan
    return () => unsubscribe();
  }, [user]);

  const now = new Date();

  // -------------------------
  // Viikkonäkymä
  // -------------------------

  // Lasketaan kohdeviikon maanantai ja sunnuntai weekOffsetin perusteella
  const targetWeekDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + weekOffset * 7
  );

  const { monday, sunday } = getWeekRange(targetWeekDate);

  // Suodatetaan viikon kirjaukset ja järjestetään ne uusimmasta vanhimpaan
  const weekEntries = entries
    .filter(e => {
      const d = new Date(e.date);
      return d >= monday && d <= sunday;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const weekNumber = getISOWeekNumber(targetWeekDate); // Viikon numero ISO-standardin mukaan
  const weekYear = targetWeekDate.getFullYear();        // Viikon vuosi 

  // Valitun viikon näyttäminen viikkonäkymässä
  const selectWeek = (week: number) => {
    setView('week');
    setWeekOffset(week - weekNumber);
  }

  // -------------------------
  // Kuukausinäkymä
  // -------------------------

  const targetMonthDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthEnd = new Date(targetMonthDate.getFullYear(), targetMonthDate.getMonth() + 1, 0);

  const monthEntries = entries
    .filter(e => {
      const d = new Date(e.date);
      return d >= targetMonthDate && d <= monthEnd;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const monthLabel = formatMonthLabel(targetMonthDate);

  // -------------------------
  // Lajittelufunktiot ja laskukaavat
  // -------------------------

  // Viikon kirjausten suodatus kuukauden sisällä
  const groupByWeek = () => {
    const weeks: Record<number, DailyWorkEntry[]> = {};
    monthEntries.forEach(entry => {
      const week = getISOWeekNumber(new Date(entry.date));
      if (!weeks[week]) weeks[week] = [];
      weeks[week].push(entry);
    });
    return weeks;
  };

  // Laskee viikon yhteenvetotiedot (tunnit ja kuormitus)
  const calculateWeekSummary = (arr: DailyWorkEntry[]) => {
    const totalMinutes = arr.reduce((sum, e) => sum + (e.totalMinutes || 0), 0);
    const avgLoad = arr.length > 0 ? (arr.reduce((sum, e) => sum + e.load1, 0) / arr.length).toFixed(1) : '0.0';
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
      avgLoad,
    };
  };

  return {
    weekOffset,
    setWeekOffset,
    monthOffset,
    setMonthOffset,
    weekEntries,
    weekNumber,
    weekYear,
    monday,
    sunday,
    monthLabel,
    view,
    setView,
    selectWeek,
    isFutureWeek,
    monthEntries,
    targetMonthDate,
    isFutureMonth,
    groupByWeek,
    calculateWeekSummary,
  };
}