// utils/workUtils.ts
import { DailyWorkEntry } from '@/types';
import { getISOWeekNumber } from './dateUtils';

// -------------------------
// Apufunktioita työaikakirjauksiin liittyen.
// Käytetään mm. etusivun ja historiakorttien yhteenvetolaskuissa.
// -------------------------

// Laskee taulukon DailyWorkEntryn totalMinutes-kenttien summan.
export const sumMinutes = (arr: DailyWorkEntry[]) =>
  arr.reduce((acc, e) => acc + e.totalMinutes, 0);

// -------------------------
// Laskee numeroarvojen keskiarvon
// -------------------------
export const average = (values: number[]) =>
  values.length
    ? values.reduce((acc, val) => acc + val, 0) / values.length
    : 0;

// -------------------------
// Laskee keskiarvon suoraan entry-listasta tietylle kentälle
// -------------------------
export const avgFromEntries = (
  entries: DailyWorkEntry[],
  key: keyof DailyWorkEntry
) =>
  average(
    entries
      .map(e => Number(e[key]))
      .filter(v => !isNaN(v))
  );

// -------------------------
// Ryhmittelee kirjaukset viikottain
// Käytetään Historia-sivun kuukausinäkymässä
// -------------------------
export const groupByWeek = (entries: DailyWorkEntry[]) => {
  const weeks: Record<number, DailyWorkEntry[]> = {};

  entries.forEach(entry => {
    const week = getISOWeekNumber(new Date(entry.date));

    if (!weeks[week]) weeks[week] = [];
    weeks[week].push(entry);
  });
  return weeks;
};

