// hooks/useHistoryData.ts

import { useAuth } from '@/context/AuthContext';
import { useWorkEntries } from '@/hooks/useWorkEntries';
import { getHolidayForDate } from '@/utils/holidayUtils';
import {
  formatMonthLabel,
  getISOWeekNumber,
  getWeekRange,
  isCurrentWeek,
  isCurrentMonth,
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
  const activeWeek = selectedWeek ?? {
    week: getISOWeekNumber(now),
    year: now.getFullYear(),
  };

  // Tarkistus: ollaanko nykyisessä viikossa (UI:ta varten)
  const isCurrentWeekView = isCurrentWeek(
    activeWeek.week,
    activeWeek.year
  );

  // -------------------------
  // PYHÄPÄIVÄT (viikkonäkymä)
  // -------------------------
  // Lisää "virtuaaliset" pyhäpäivät viikon dataan
  const enrichWithHolidays = (entries: any[]) => {

    const weekEntries = [...entries];

    // Lasketaan viikon maanantai
    const baseDate = new Date(
      activeWeek.year,
      0,
      1 + (activeWeek.week - 1) * 7
    );

    // Käydään koko viikko läpi (ma–su)
    for (let i = 0; i < 7; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);

      const isoDate = date.toISOString().split('T')[0];

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
            note: `Kortti: ${holiday.name}`,
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
      const d = new Date(e.date);

      // Suodatetaan vain valitun viikon päivät
      return (
        getISOWeekNumber(d) === activeWeek.week &&
        d.getFullYear() === activeWeek.year
      );
    })
    // Uusimmat ensin
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // LISÄTÄÄN PYHÄPÄIVÄT MUKAAN
  weekEntries = enrichWithHolidays(weekEntries);

  // -------------------------
  // Viikon alku ja loppu (labelia varten)
  // -------------------------
  const { monday, sunday } = getWeekRange(
    new Date(activeWeek.year, 0, 1 + (activeWeek.week - 1) * 7)
  );

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
      const d = new Date(e.date);
      return d >= targetMonthDate && d <= monthEnd;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Kuukauden label UI:ta varten
  const monthLabel = formatMonthLabel(targetMonthDate);

  // -------------------------
  // VIIKON VALINTA KUUKAUSINÄKYMÄSTÄ
  // -------------------------
  const selectWeek = (week: number) => {
    setSelectedWeek({
      week,
      year: targetMonthDate.getFullYear(),
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