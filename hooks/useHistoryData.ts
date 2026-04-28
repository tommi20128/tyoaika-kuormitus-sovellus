// hooks/useHistoryData.ts

import { useAuth } from '@/context/AuthContext';
import { useWorkEntries } from '@/hooks/useWorkEntries';
import { getHolidayForDate } from '@/utils/holidayUtils';
import {
  formatMonthLabel,
  getISOWeekNumber,
  getISOWeekYear,
  isCurrentWeek,
  isCurrentMonth,
  getLocalDateString,
  getMondayOfISOWeek,
  parseLocalDate,
} from '@/utils/dateUtils';
import { useState } from 'react';

// --------------------------------------------------
// Historia-sivun hookki
// Vastuut:
// - hakee workEntries datan
// - muodostaa viikko- ja kuukausinäkymän datan
// - hallitsee navigaatiota (prev / next / reset)
// --------------------------------------------------
export function useHistoryData(employeeId?: string) {

  const { user } = useAuth();

  // Haetaan kaikki kirjaukset (oma tai supervisorin valitsema)
  const entries = useWorkEntries(employeeId);

  // Nykyhetki (käytetään useissa laskennoissa)
  const now = new Date();

  // Kuukausinavigaatio: 0 = nykyinen kuukausi, -1 = edellinen jne.
  const [monthOffset, setMonthOffset] = useState(0);

  // Näkymä: viikko tai kuukausi
  const [view, setView] = useState<'week' | 'month'>('week');

  // Valittu viikko (jos null → käytetään automaattisesti nykyistä viikkoa)
  const [selectedWeek, setSelectedWeek] = useState<{
    week: number;
    year: number;
  } | null>(null);

  // -------------------------
  // RESET (palautus nykyhetkeen)
  // -------------------------

  // Palauttaa viikkonäkymän nykyiseen viikkoon
  const goToCurrentWeek = () => {
    setSelectedWeek(null);
  };

  // Palauttaa kuukausinäkymän nykyiseen kuukauteen
  const goToCurrentMonth = () => {
    setMonthOffset(0);
  };

  // -------------------------
  // VIIKKONÄKYMÄ
  // ------------------------
  // Aktiivinen viikko:
  // - jos käyttäjä on valinnut viikon → käytetään sitä
  // - muuten → käytetään nykyistä viikkoa
  // HUOM: käytetään ISO-viikon vuotta (voi erota kalenterivuodesta!)
  const activeWeek = selectedWeek ?? {
    week: getISOWeekNumber(now),
    year: getISOWeekYear(now),
  };

  // -------------------------
  // Viikon alku ja loppu (labelia varten)
  // -------------------------
  const monday = getMondayOfISOWeek(activeWeek.week, activeWeek.year);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  // Tarkistus: ollaanko nykyisessä viikossa (UI:ta varten)
  const isCurrentWeekView = isCurrentWeek(
    activeWeek.week,
    activeWeek.year
  );

  // -------------------------
  // PYHÄPÄIVÄT (viikkonäkymä)
  // -------------------------
  // Lisää pyhäpäivät viikon dataan
  const enrichWithHolidays = (entries: any[]) => {

    const weekEntries = [...entries];

    if (!monday || isNaN(new Date(monday).getTime())) {
      return weekEntries;
    }

    // Valitaan viikon maanantai
    const baseDate = new Date(monday);

    // Käydään koko viikko läpi (ma–su)
    for (let i = 0; i < 7; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);

      const isoDate = getLocalDateString(date);

      const holiday = getHolidayForDate(date);

      if (holiday) {

        // Estetään duplikaatit (jos user on jo tehnyt merkinnän)
        const exists = weekEntries.find(e => e.date === isoDate);

        if (!exists) {
          weekEntries.push({
            date: isoDate,
            workload: 0,
            stress1: 0,
            stress2: 0,
            totalMinutes: 7.5 * 60, // sama kuin DAILY_TARGET_HOURS

            // UI:ta varten
            type: 'holiday',
            note: `Pyhäpäivä: ${holiday.name}`,
          });
        }
      }
    }

    return weekEntries;
  };

  // -------------------------
  // Haetaan viikon kirjaukset
  // -------------------------
  let weekEntries = entries
    .filter(e => {
      const d = parseLocalDate(e.date);

      // Suodatetaan vain valitun viikon päivät
      return (
        getISOWeekNumber(d) === activeWeek.week &&
        getISOWeekYear(d) === activeWeek.year
      );
    })
    // Uusimmat ensin
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // LISÄTÄÄN PYHÄPÄIVÄT MUKAAN
  weekEntries = enrichWithHolidays(weekEntries);



  // -------------------------
  // VIIKKONAVIGAATIO
  // -------------------------

  // Siirry edelliseen viikkoon
  const goToPreviousWeek = () => {
    const date = new Date(monday);
    date.setDate(date.getDate() - 7);

    setSelectedWeek({
      week: getISOWeekNumber(date),
      year: date.getFullYear(),
    });
  };

  // Siirry seuraavaan viikkoon
  const goToNextWeek = () => {
    const date = new Date(monday);
    date.setDate(date.getDate() + 7);

    setSelectedWeek({
      week: getISOWeekNumber(date),
      year: date.getFullYear(),
    });
  };

  // -------------------------
  // KUUKAUSINÄKYMÄ
  // -------------------------

  // Kuukausi, jota tarkastellaan (offsetin perusteella)
  const targetMonthDate = new Date(
    now.getFullYear(),
    now.getMonth() + monthOffset,
    1
  );

  // Tarkistus: ollaanko nykyisessä kuukaudessa
  const isCurrentMonthView = isCurrentMonth(targetMonthDate);

  // Kuukauden viimeinen päivä
  const monthEnd = new Date(
    targetMonthDate.getFullYear(),
    targetMonthDate.getMonth() + 1,
    0
  );

  // -------------------------
  // Haetaan kuukauden kirjaukset
  // -------------------------
  const monthEntries = entries
    .filter(e => {
      const d = parseLocalDate(e.date);
      return d >= targetMonthDate && d <= monthEnd;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Kuukauden label UI:ta varten
  const monthLabel = formatMonthLabel(targetMonthDate);

  // -------------------------
  // VIIKON VALINTA KUUKAUSINÄKYMÄSTÄ
  // -------------------------
  const selectWeek = (week: number) => {
    const monday = getMondayOfISOWeek(week, targetMonthDate.getFullYear());

    const isoYear = getISOWeekYear(monday);

    setSelectedWeek({
      week,
      year: isoYear,
    });

    // Vaihdetaan automaattisesti viikkonäkymään
    setView('week');
  };



  return {

    // View
    view,
    setView,

    // Viikkodata
    selectedWeek,
    selectWeek,
    isCurrentWeekView,
    weekEntries,
    monday,
    sunday,
    weekNumber: activeWeek.week,
    weekYear: activeWeek.year,

    // Viikkonavigaatio
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,

    // Kuukausidata
    monthOffset,
    setMonthOffset,
    isCurrentMonthView,
    monthEntries,
    monthLabel,
    targetMonthDate,

    // Kuukausinavigaatio
    goToCurrentMonth,
  };
}