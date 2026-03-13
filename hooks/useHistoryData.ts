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

  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [view, setView] = useState<'week' | 'month'>('week');

  const now = new Date();

  // -------------------------
  // Viikkonäkymä
  // -------------------------

  const targetWeekDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + weekOffset * 7
  );

  const { monday, sunday } = getWeekRange(targetWeekDate);

  const weekEntries = entries
    .filter(e => {
      const d = new Date(e.date);
      return d >= monday && d <= sunday;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const weekNumber = getISOWeekNumber(targetWeekDate);
  const weekYear = targetWeekDate.getFullYear();

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
    weekOffset,
    setWeekOffset,
    weekNumber,
    weekYear,
    monday,
    sunday,
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