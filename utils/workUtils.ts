// utils/workUtils.ts
import { DailyWorkEntry } from '@/types/work';

// -------------------------
// Apufunktioita työaikakirjauksiin liittyen.
// Käytetään mm. etusivun ja historiakorttien yhteenvetolaskuissa.
// -------------------------

// Laskee taulukon DailyWorkEntry-objektien totalMinutes-kenttien summan.
export const sumMinutes = (arr: DailyWorkEntry[]) =>
  arr.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);

// Laskee annettujen DailyWorkEntry-objektien keskiarvon annetulle numerokentälle.
export const average = (
  arr: DailyWorkEntry[],
  key: keyof DailyWorkEntry
) =>
  arr.length
    ? arr.reduce(
      (acc, e) => acc + ((e[key] as number) || 0),
      0
    ) / arr.length
    : 0;

// Laskee tuntiero tavoitetuntien ja toteutuneiden tuntien välillä, ja muuntaa sen tunneiksi ja minuuteiksi.
export const formatHourDiff = (diffInHours: number) => {
  const totalMinutes = Math.round(diffInHours * 60);
  const absMinutes = Math.abs(totalMinutes);

  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;

  return {
    isPositive: diffInHours >= 0,
    hours,
    minutes,
  };
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

  // Etsitään aikaisin kirjauspäivä
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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