// types/work.ts

// Sisältää tyypit työaikatiedoille ja lomakedatalle

// Työaikatiedot
export interface DailyWorkEntry {
  date: string;
  totalMinutes: number;
  load1: number;
  stressLoad1: number;
  stressLoad2: number;
  averageStress: number;
  comment?: string;
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
