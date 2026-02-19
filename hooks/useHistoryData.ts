//hooks/useHistoryData.ts
import {
  getISOWeekNumber,
  getWeekRange,
  isFutureWeek,
  isFutureMonth,
} from '@/utils/dateUtils';

import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/Config';
import { useAuth } from '@/context/AuthContext';
import { WorkEntry } from '@/types/work';

// Tämä hook hakee ja laskee Historia-sivun tarvitseman datan

export function useHistoryData() {
  const { user } = useAuth();

  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  // Hae kirjaukset (reaaliaikaisesti)
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
      const data = snapshot.docs.map(doc =>
        doc.data() as WorkEntry
      );

      setEntries(data);
    });

    // Cleanup: lopetetaan kuuntelu kun komponentti unmountataan
    return () => unsubscribe();
  }, [user]);

  // -------------------------
  // Viikkonäkymä
  // -------------------------

  const now = new Date();

  // Lasketaan kohdeviikon maanantai ja sunnuntai weekOffsetin perusteella
  const targetWeekDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + weekOffset * 7
  );

  // Viikon aloitus- ja lopetuspäivämäärät
  const { monday, sunday } = getWeekRange(targetWeekDate);

  // Suodatetaan viikon kirjaukset ja järjestetään ne uusimmasta vanhimpaan
  const weekEntries = entries
    .filter(e => {
      const d = new Date(e.date);
      return d >= monday && d <= sunday;
    })
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );

  const weekNumber = getISOWeekNumber(targetWeekDate); // Viikon numero ISO-standardin mukaan
  const weekYear = targetWeekDate.getFullYear(); // Viikon vuosi 

  // -------------------------
  // Kuukausinäkymä
  // -------------------------

  const targetMonthDate = new Date(
    now.getFullYear(),
    now.getMonth() + monthOffset,
    1
  );

  const monthEnd = new Date(
    targetMonthDate.getFullYear(),
    targetMonthDate.getMonth() + 1,
    0
  );

  // Suodatetaan kuukauden kirjaukset ja järjestetään ne uusimmasta vanhimpaan
  const monthEntries = entries
    .filter(e => {
      const d = new Date(e.date);
      return d >= targetMonthDate && d <= monthEnd;
    })
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );

  // -------------------------
  // Lajittelufunktiot ja laskukaavat
  // -------------------------

  // Viikon kirjausten suodatus
  const groupByWeek = () => {
    const weeks: Record<number, WorkEntry[]> = {};

    monthEntries.forEach(entry => {
      const week = getISOWeekNumber(
        new Date(entry.date)
      );

      if (!weeks[week]) weeks[week] = [];

      weeks[week].push(entry);
    });

    return weeks;
  };

  // Laskee viikon yhteenvetotiedot (tunnit, kuormitus)
  const calculateWeekSummary = (arr: WorkEntry[]) => {
    const totalMinutes = arr.reduce(
      (sum, e) => sum + (e.totalMinutes || 0),
      0
    );

    const avgLoad =
      arr.length > 0
        ? (
            arr.reduce(
              (sum, e) => sum + e.load1,
              0
            ) / arr.length
          ).toFixed(1)
        : '0.0';

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
    isFutureWeek,
    monthEntries,
    targetMonthDate,
    isFutureMonth,
    groupByWeek,
    calculateWeekSummary,
  };
}
