// hooks/useDashboardData.ts

import { useAuth } from '@/context/AuthContext';
import { WorkSummary } from '@/types';
import { DailyWorkEntry } from '@/types';
import { average, sumMinutes, calculateCareerTargetMinutes } from '@/utils/workUtils';
import { minutesToHoursMinutes } from '@/utils/timeUtils';
import { useWorkEntries } from '@/hooks/useWorkEntries';
import { useEffect, useState } from 'react';

const DAILY_TARGET_HOURS = 7.5;

// --------------------------------------------------
// Hook etusivun datan laskemiseen.
//
// - käyttää useWorkEntries hookia
// - laskee päivän, viikon ja kuukauden yhteenvedot
// --------------------------------------------------

export function useDashboardData(employeeId?: string) {

  const { user } = useAuth();

  const entries = useWorkEntries(employeeId);

  const [firstName, setFirstName] = useState('');
  const [todayEntry, setTodayEntry] = useState<DailyWorkEntry | null>(null);

  const [weekSummary, setWeekSummary] = useState<WorkSummary | null>(null);
  const [monthSummary, setMonthSummary] = useState<WorkSummary | null>(null);
  const [totalSummary, setTotalSummary] = useState<WorkSummary | null>(null);

  const todayId = new Date().toISOString().split('T')[0];

  // -------------------------
  // Päivitetään dashboard kun entries muuttuu
  // -------------------------

  useEffect(() => {

    if (!entries.length) return;

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
    const weekTime = minutesToHoursMinutes(weekMinutes);

    setWeekSummary({
      ...weekTime,
      load: average(weekEntries, 'workload').toFixed(1),
      stress1: average(weekEntries, 'stress1').toFixed(1),
      stress2: average(weekEntries, 'stress2').toFixed(1),
      goalDiff: weekMinutes / 60 - weekEntries.length * DAILY_TARGET_HOURS,
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
    const monthTime = minutesToHoursMinutes(monthMinutes);

    setMonthSummary({
      ...monthTime,
      load: average(monthEntries, 'workload').toFixed(1),
      stress1: average(monthEntries, 'stress1').toFixed(1),
      stress2: average(monthEntries, 'stress2').toFixed(1),
      goalDiff: monthMinutes / 60 - monthEntries.length * DAILY_TARGET_HOURS,
    });

    // -------------------------
    // Koko työura
    // -------------------------

    const totalMinutes = sumMinutes(entries);

    const careerTargetMinutes = calculateCareerTargetMinutes(
      entries,
      DAILY_TARGET_HOURS
    );

    const totalTime = minutesToHoursMinutes(totalMinutes);

    setTotalSummary({
      ...totalTime,
      goalDiff: (totalMinutes - careerTargetMinutes) / 60,
      targetMinutes: careerTargetMinutes,
    });

  }, [entries]);

  return {
    firstName,
    todayEntry,
    weekSummary,
    monthSummary,
    totalSummary,
  };
}