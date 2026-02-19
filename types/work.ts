// types/work.ts

// Sisältää tyypit työaikatiedoille, yhteenvetotiedoille ja työaikakirjauksen lomakedatalle.

// Työaikatiedot
export interface WorkEntry {
  date: string;
  totalMinutes: number;
  load1: number;
  stressLoad1: number;
  stressLoad2: number;
  averageStress: number;
  comment?: string;
}

// Päivä- ja viikkoyhteenveto
export interface Summary {
  hours: number;
  minutes: number;
  load?: string;
  stress1?: string;
  stress2?: string;
  stress3?: string;
  goalDiff: number;
}

// Lomakedata, jota käytetään add-work-sivulla
export interface WorkEntryFormData {
  hours: string;
  minutes: string;
  load1: string;
  stressLoad1: string;
  stressLoad2: string;
  comment: string;
}