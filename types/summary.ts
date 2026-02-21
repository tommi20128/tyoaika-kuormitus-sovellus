// types/summary.ts

// Tämä tiedosto sisältää tyypit, jotka liittyvät päivä- ja viikkoyhteenvetotietoihin.

// Päivä- ja viikkoyhteenveto
export interface WorkSummary {
  hours: number;
  minutes: number;
  load?: string;
  stress1?: string;
  stress2?: string;
  stress3?: string;
  goalDiff: number;
  targetMinutes?: number;
}