//types/history.ts

export type HistoryEntry = {
  date: string;
  totalMinutes: number;
  type: 'work' | 'holiday' | 'empty';
  note?: string;
};