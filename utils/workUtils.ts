// utils/workUtils.ts

import { WorkEntry } from '@/types/work';

// Työaikakirjauksiin liittyviä apufunktioita

// Laskee taulukossa olevien objektien totalMinutes-kenttien summan
export const sumMinutes = (arr: WorkEntry[]) =>
  arr.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);

// Laskee taulukossa olevien objektien keskiarvon
export const average = (
  arr: WorkEntry[],
  key: keyof WorkEntry
) =>
  arr.length
    ? arr.reduce(
        (acc, e) => acc + ((e[key] as number) || 0),
        0
      ) / arr.length
    : 0;
