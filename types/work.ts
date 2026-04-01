// types/work.ts

// Sisältää tyypit työaikatiedoille ja lomakedatalle

export type WorkEntryId = string;

// Työaikatiedot
export interface DailyWorkEntry {
  id: WorkEntryId;
  userId: string;
  date: string;
  totalMinutes: number;
  workload?: number;
  stress1?: number;
  stress2?: number;
  comment?: string;
  type?: 'work' | 'holiday' | 'empty';
  note?: string;
}

// Lomakedata, jota käytetään add-work-sivulla
export interface WorkEntryFormData {
  hours: string;
  minutes: string;
  workload: string;
  stress1: string;
  stress2: string;
  comment: string;
}
