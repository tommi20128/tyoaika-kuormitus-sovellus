// hooks/useDashboardData.ts

import { useAuth } from '@/context/AuthContext';
import { WorkSummary } from '@/types';
import { DailyWorkEntry } from '@/types';
import { average, sumMinutes, calculateCareerTargetMinutes } from '@/utils/workUtils';
import { minutesToHoursMinutes } from '@/utils/timeUtils';
import { useWorkEntries } from '@/hooks/useWorkEntries';
import { useEffect, useState } from 'react';
import { getHolidayForDate } from '@/utils/holidayUtils';

type DashboardEntry = Omit<DailyWorkEntry, 'id' | 'userId'> & {
  type?: 'work' | 'holiday';
  note?: string;
};

type SummaryEntry = {
  totalMinutes: number;
  workload: number;
  stress1: number;
  stress2: number;
};

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

  // Päivän yksittäinen kirjaus
  const [todayEntry, setTodayEntry] = useState<DailyWorkEntry | null>(null);

  // Yhteenvedot eri aikajaksoille
  const [weekSummary, setWeekSummary] = useState<WorkSummary | null>(null);
  const [monthSummary, setMonthSummary] = useState<WorkSummary | null>(null);
  const [totalSummary, setTotalSummary] = useState<WorkSummary | null>(null);

  // Onko yhtään merkintää olemassa
  const [hasEntries, setHasEntries] = useState(false);

  // -------------------------
  // PYHÄPÄIVÄN LASKENTA
  // -------------------------

  // Lisää pyhäpäivät viikkodataan
  const enrichWithHolidays = (entries: DashboardEntry[]): DashboardEntry[] => {

    const now = new Date();

    const weekEntries = [...entries];

    // Käydään viikon päivät läpi
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);

      // Siirrytään viikon alkuun (maanantai)
      const day = date.getDay();
      const diff = (day === 0 ? -6 : 1) - day;

      date.setDate(date.getDate() + diff + i);

      // Tarkistetaan onko pyhäpäivä
      const holiday = getHolidayForDate(date);

      if (holiday) {

        // Tarkistetaan ettei sama päivä jo ole entriesissä
        const exists = weekEntries.find(
          e => e.date === date.toISOString().split('T')[0]
        );

        // Jos ei ole → lisätään "virtuaalinen entry"
        if (!exists) {
          weekEntries.push({
            date: date.toISOString().split('T')[0],
            workload: 0,
            stress1: 0,
            stress2: 0,

            // EI tallenneta, vain UI:lle
            type: 'holiday',

            // Kortti-merkintä
            note: `Kortti: ${holiday.name}`,

            // Lisätään työaika automaattisesti
            totalMinutes: DAILY_TARGET_HOURS * 60
          });
        }
      }
    }
    return weekEntries;
  };


  // -------------------------
  // Viikon ja Kuukauden laskentafunktiot
  // -------------------------

  // Muodostaa viikon aloituspäivän (maanantai)
  const getWeekStart = (date: Date) => {
    const weekStart = new Date(date);
    const day = weekStart.getDay();

    // Siirretään maanantaihin
    const diff = (day === 0 ? -6 : 1) - day;
    weekStart.setDate(weekStart.getDate() + diff);

    return weekStart;
  };

  // Suodattaa annetun viikon merkinnät
  const getWeekEntries = (now: Date) => {
    const weekStart = getWeekStart(now);

    return entries.filter(e => {
      const d = new Date(e.date);
      return d >= weekStart && d <= now;
    });
  };

  // Suodattaa kuukauden merkinnät
  const getMonthEntries = (now: Date) => {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return entries.filter(e => {
      const d = new Date(e.date);
      return d >= monthStart && d <= now;
    });
  };

  // Muodostaa summary-objektin
  const buildSummary = (entries: SummaryEntry[]) => {
    const totalMinutes = sumMinutes(entries as DailyWorkEntry[]);
    const time = minutesToHoursMinutes(totalMinutes);

    return {
      ...time,

      // Keskiarvot
      avgLoad: average(entries.map(e => e.workload)),
      avgStress1: average(entries.map(e => e.stress1)),
      avgStress2: average(entries.map(e => e.stress2)),

      // Erotus tavoitteeseen
      goalDiff:
        totalMinutes / 60 - entries.length * DAILY_TARGET_HOURS,
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
    const todayId = now.toISOString().split('T')[0];

    const todayData = entries.find(e => e.date === todayId) || null;

    setTodayEntry(todayData);

    // -------------------------
    // Viikkonäkymä + Pyhät
    // -------------------------
    let weekEntries: DashboardEntry[] = getWeekEntries(now);

    // Lisätään pyhäpäivät mukaan ennen laskentaa
    weekEntries = enrichWithHolidays(weekEntries);

    setWeekSummary(buildSummary(weekEntries));

    // -------------------------
    // Kuukausinäkymä
    // -------------------------

    const monthEntries = getMonthEntries(now);

    setMonthSummary(buildSummary(monthEntries));

    // -------------------------
    // Koko työura
    // -------------------------

    const totalMinutes = sumMinutes(entries);

    const careerTargetMinutes = 
      calculateCareerTargetMinutes(entries, DAILY_TARGET_HOURS);

    const totalTime = minutesToHoursMinutes(totalMinutes);

    setTotalSummary({
      ...totalTime,

      // Erotus tavoitteeseen (tunneissa)
      goalDiff: (totalMinutes - careerTargetMinutes) / 60,

      // Tarvitaan UI:ssa vertailuun
      targetMinutes: careerTargetMinutes,
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