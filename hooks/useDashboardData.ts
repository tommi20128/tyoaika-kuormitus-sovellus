// hooks/useDashboardData.ts

import { useAuth } from '@/context/AuthContext';
import { WorkSummary } from '@/types';
import { DailyWorkEntry } from '@/types';
import { average, sumMinutes, calculateCareerTargetMinutes } from '@/utils/workUtils';
import { minutesToHoursMinutes } from '@/utils/timeUtils';
import { useWorkEntries } from '@/hooks/useWorkEntries';
import { useEffect, useState } from 'react';

const DAILY_TARGET_HOURS = 7.5; //Kovakoodattu päivän tavoitetyäaika

// --------------------------------------------------
// Hook etusivun datan laskemiseen.
//
// - käyttää useWorkEntries hookia
// Vastaa:
// - tämän päivän kirjauksesta
// - viikon yhteenvedosta
// - kuukauden yhteenvedosta
// - koko työuran saldosta
// --------------------------------------------------

export function useDashboardData(employeeId?: string) {

  const { user } = useAuth();

  // Haetaan kaikki workEntries (oma tai valitun työntekijän)
  const entries = useWorkEntries(employeeId);

  const [firstName, setFirstName] = useState('');

  // Päivän yksittäinen kirjaus
  const [todayEntry, setTodayEntry] = useState<DailyWorkEntry | null>(null);

  // Yhteenvedot eri aikajaksoille
  const [weekSummary, setWeekSummary] = useState<WorkSummary | null>(null);
  const [monthSummary, setMonthSummary] = useState<WorkSummary | null>(null);
  const [totalSummary, setTotalSummary] = useState<WorkSummary | null>(null);

  const [hasEntries, setHasEntries] = useState(false);

  // -------------------------
  // Päivitetään dashboard kun entries muuttuu
  // -------------------------

  useEffect(() => {

    if (!entries.length) {
    setHasEntries(false);
    setTodayEntry(null);
    setWeekSummary(null);
    setMonthSummary(null);
    setTotalSummary(null);
    return;
  }

  setHasEntries(true);

    const now = new Date();
    
    // YYYY-MM-DD → sama formaatti kuin Firestoressa
    const todayId = now.toISOString().split('T')[0];

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

      // Keskiarvot viikon kirjauksista
      avgLoad: average(weekEntries.map(e => e.workload)),
      avgStress1: average(weekEntries.map(e => e.stress1)),
      avgStress2: average(weekEntries.map(e => e.stress2)),

      // Erotus tavoitteeseen (tunneissa)
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

      // Keskiarvot viikon kirjauksista
      avgLoad: average(monthEntries.map(e => e.workload)),
      avgStress1: average(monthEntries.map(e => e.stress1)),
      avgStress2: average(monthEntries.map(e => e.stress2)),

      // Erotus tavoitteeseen (tunneissa)
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

      // Erotus tavoitteeseen (tunneissa)
      goalDiff: (totalMinutes - careerTargetMinutes) / 60,

      // Tarvitaan UI:ssa vertailuun
      targetMinutes: careerTargetMinutes,
    });

  }, [entries]);

  return {
    firstName,
    todayEntry,
    weekSummary,
    monthSummary,
    totalSummary,
    hasEntries,
  };
}