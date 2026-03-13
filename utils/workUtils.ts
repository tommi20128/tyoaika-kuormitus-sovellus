// utils/workUtils.ts
import { DailyWorkEntry } from '@/types';
import { getISOWeekNumber } from './dateUtils';

// -------------------------
// Apufunktioita työaikakirjauksiin liittyen.
// Käytetään mm. etusivun ja historiakorttien yhteenvetolaskuissa.
// -------------------------

// Laskee taulukon DailyWorkEntry-objektien totalMinutes-kenttien summan.
export const sumMinutes = (arr: DailyWorkEntry[]) =>
  arr.reduce((acc, e) => acc + e.totalMinutes, 0);

// Laskee annettujen DailyWorkEntry-objektien keskiarvon annetulle numerokentälle.
export const average = (
  arr: DailyWorkEntry[],
  key: keyof DailyWorkEntry
) =>
  arr.length
    ? arr.reduce(
       (acc, e) => acc + Number(e[key] ?? 0),
      0
    ) / arr.length
    : 0;

 // Laskee viikon yhteenvetotiedot (tunnit ja kuormitus)
export const calculateWeekSummary = (arr: DailyWorkEntry[]) => {
    const totalMinutes = sumMinutes(arr);

    const avgLoad = average(arr, "workload").toFixed(1);
       return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
      avgLoad,
    };
  };

   // Viikon kirjausten ryhmittely kuukauden sisällä
export const groupByWeek = (entries: DailyWorkEntry[]) => {
    const weeks: Record<number, DailyWorkEntry[]> = {};

    entries.forEach(entry => {
      const week = getISOWeekNumber(new Date(entry.date));

      if (!weeks[week]) weeks[week] = [];
      weeks[week].push(entry);
    });
    return weeks;
  };

// -------------------------
// Laskee koko työuran tavoiteminuutit
// Ensimmäisestä kirjauksesta tähän päivään asti,
// huomioiden vain arkipäivät (ma–pe).
// -------------------------
export const calculateCareerTargetMinutes = (
  entries: DailyWorkEntry[],
  dailyTargetHours: number
) => {
  if (!entries.length) return 0;

  // Etsitään ensimmäinen kirjauspäivä
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstDate = new Date(sorted[0].date);
  const today = new Date();

  let workDaysCount = 0;

  const iterator = new Date(firstDate);

  while (iterator <= today) {
    const dayOfWeek = iterator.getDay();

    // 1–5 = ma–pe
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      workDaysCount++;
    }

    iterator.setDate(iterator.getDate() + 1);
  }

  return workDaysCount * dailyTargetHours * 60;
};