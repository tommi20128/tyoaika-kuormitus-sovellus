// hooks/useHistoryData.ts

import { useAuth } from '@/context/AuthContext';
import { useWorkEntries } from '@/hooks/useWorkEntries';
import {
  formatMonthLabel,
  getISOWeekNumber,
  getWeekRange,
  isFutureMonth,
  isFutureWeek
} from '@/utils/dateUtils';
import { useState } from 'react';

// --------------------------------------------------
// Historia-sivun hookki
// - tukee sekä omaa että toisen käyttäjän historiaa
// --------------------------------------------------

export function useHistoryData(employeeId?: string) {

  const { user } = useAuth();

  // ------------------------------------------------
  // Valitaan userId: jos employeeId annettu eli supervisor katsoo työntekijää
  // ------------------------------------------------
  const userId = employeeId ?? user?.uid;
  
  const entries = useWorkEntries(employeeId);

  const [monthOffset, setMonthOffset] = useState(0);
  const [view, setView] = useState<'week' | 'month'>('week');
  const [selectedWeek, setSelectedWeek] = useState<{
  week: number;
  year: number;
} | null>(null);

  const now = new Date();

  // -------------------------
  // VIIKKONÄKYMÄ
  // ------------------------
  // jos ei ole valittu viikkoa → käytä nykyistä viikkoa
  const activeWeek = selectedWeek ?? {
    week: getISOWeekNumber(now),
    year: now.getFullYear(),
  };

  const weekEntries = entries
    .filter(e => {
      const d = new Date(e.date);

      return (
        getISOWeekNumber(d) === activeWeek.week &&
        d.getFullYear() === activeWeek.year
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // viikon alku/loppu labelia varten
  const { monday, sunday } = getWeekRange(
    new Date(activeWeek.year, 0, 1 + (activeWeek.week - 1) * 7)
  );

   // -------------------------
  // NAVIGAATIO (viikko)
  // -------------------------

  const goToPreviousWeek = () => {
    const date = new Date(monday);
    date.setDate(date.getDate() - 7);

    setSelectedWeek({
      week: getISOWeekNumber(date),
      year: date.getFullYear(),
    });
  };

  const goToNextWeek = () => {
    const date = new Date(monday);
    date.setDate(date.getDate() + 7);

    setSelectedWeek({
      week: getISOWeekNumber(date),
      year: date.getFullYear(),
    });
  };

  // -------------------------
  // VALINTA KUUKAUDESTA
  // -------------------------
  const selectWeek = (week: number) => {
    setSelectedWeek({
      week,
      year: targetMonthDate.getFullYear(),
    });

    setView('week');
  };

  // -------------------------
  // KUUKAUSINÄKYMÄ
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

  const monthEntries = entries
    .filter(e => {
      const d = new Date(e.date);
      return d >= targetMonthDate && d <= monthEnd;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const monthLabel = formatMonthLabel(targetMonthDate);

  return {

    // view
    view,
    setView,

    // viikkonavigaatio
    selectedWeek,
    selectWeek,
    monday,
    sunday,
    weekNumber: activeWeek.week,
    weekYear: activeWeek.year,
    goToPreviousWeek,
    goToNextWeek,
    isFutureWeek,
    weekEntries,

    // kuukausinavigaatio
    monthOffset,
    setMonthOffset,
    monthLabel,
    monthEntries,
    targetMonthDate,
    isFutureMonth,

  };
}