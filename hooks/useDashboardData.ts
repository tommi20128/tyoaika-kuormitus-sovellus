// hooks/useDashboardData.ts

import { useAuth } from '@/context/AuthContext';
import { DailyWorkEntry } from '@/types/work';
import { WorkSummary } from '@/types/summary';
import { average, sumMinutes } from '@/utils/workUtils';
import { minutesToHoursMinutes } from '@/utils/timeUtils';
import { useWorkEntries } from '@/hooks/useWorkEntries';
import { useEffect, useState } from 'react';
import { buildTimelineEntries } from '@/utils/timelineUtils';
import { getLocalDateString, getWeekRange, parseLocalDate } from '@/utils/dateUtils';

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

  // Käyttäjän nimi (tällä hetkellä ei käytössä)
  const [firstName, setFirstName] = useState('');

  // Päivän kirjaus
  const [todayEntry, setTodayEntry] = useState<DailyWorkEntry | null>(null);

  // Yhteenvedot eri aikajaksoille
  const [weekSummary, setWeekSummary] = useState<WorkSummary | null>(null);
  const [monthSummary, setMonthSummary] = useState<WorkSummary | null>(null);
  const [totalSummary, setTotalSummary] = useState<WorkSummary | null>(null);

  // Onko merkintää olemassa
  const [hasEntries, setHasEntries] = useState(false);

  // --------------------------------------------------
  // Summary-laskenta
  // --------------------------------------------------
  const buildSummary = (entries: DailyWorkEntry[]) => {

    // Suodatetaan vain oikeat työpäivät
    const workEntries = entries.filter(e => e.type === 'work');

    // Lasketaan kokonaisminuutit
    const totalMinutes = sumMinutes(workEntries);

    const totalTargetMinutes =
      entries.length * DAILY_TARGET_HOURS * 60;

    return {
      ...minutesToHoursMinutes(totalMinutes),

      avgLoad: average(workEntries.map(e => Number(e.workload)).filter(v => !isNaN(v))),
      avgStress1: average(workEntries.map(e => Number(e.stress1)).filter(v => !isNaN(v))),
      avgStress2: average(workEntries.map(e => Number(e.stress2)).filter(v => !isNaN(v))),

      // ✅ NYT oikein
      goalDiff: (totalMinutes - totalTargetMinutes) / 60,
    };
  };

  useEffect(() => {

    // -------------------------
    // Jos ei dataa → tyhjennetään kaikki
    // -------------------------
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

    // -------------------------
    // PÄIVÄ
    // -------------------------
    // YYYY-MM-DD → sama formaatti kuin Firestoressa
    const todayId = getLocalDateString(now);

    const todayData = entries.find(e => e.date === todayId) || null;

    setTodayEntry(todayData);

    // -------------------------
    // VIIKKO
    // -------------------------
    const { monday: weekStart } = getWeekRange(now);

    const weekEntries = buildTimelineEntries(
      entries,
      weekStart,
      now,
      DAILY_TARGET_HOURS
    );

    setWeekSummary(buildSummary(weekEntries));

    // -------------------------
    // KUUKAUSI
    // -------------------------

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthEntries = buildTimelineEntries(
      entries,
      monthStart,
      now,
      DAILY_TARGET_HOURS
    );

    setMonthSummary(buildSummary(monthEntries));

    // -------------------------
    // KOKO TYÖURA
    // -------------------------

    const sorted = [...entries].sort(
      (a, b) => a.date.localeCompare(b.date)
    );

    const firstDate = sorted.length
      ? parseLocalDate(sorted[0].date)
      : now;

    // Rakennetaan koko timeline (sis. pyhät ja tyhjät)
    const timeline = buildTimelineEntries(
      entries,
      firstDate,
      now,
      DAILY_TARGET_HOURS
    );

    const totalMinutes = sumMinutes(timeline);

    const totalTargetMinutes =
      timeline.length * DAILY_TARGET_HOURS * 60;

    const totalTime = minutesToHoursMinutes(totalMinutes);

    setTotalSummary({
      ...totalTime,

      // Erotus tavoitteeseen (tunneissa)
      goalDiff: (totalMinutes - totalTargetMinutes) / 60,

      // Tarvitaan UI:ssa vertailuun
      targetMinutes: totalTargetMinutes,
    });

  }, [entries]);

  // -------------------------
  // RETURN (UI:lle)
  // -------------------------
  return {
    firstName,
    todayEntry,
    weekSummary,
    monthSummary,
    totalSummary,
    hasEntries,
  };
}