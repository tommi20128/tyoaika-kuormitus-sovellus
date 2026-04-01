// components/history/WeekEntryList.tsx
import { DailyWorkEntry } from '@/types/work';
import { ScrollView } from 'react-native';
import WorkEntryCard from '../cards/WorkEntryCard';

// 🔹 Sama tyyppi kuin dashboardissa
type HistoryEntry = Omit<DailyWorkEntry, 'id' | 'userId'> & {
  type?: 'work' | 'holiday' | 'empty';
  note?: string;
  id?: string; // optional → React keytä varten
};

interface Props {
  entries: HistoryEntry[];
}

// Tämä komponentti näyttää yhden viikon kaikki työpäivien kirjaukset listana. 
// Käytetään historiasivulla viikkonäkymässä, jossa näytetään kaikki viikon kirjaukset peräkkäin.
export default function WeekEntryList({ entries }: Props) {
  return (
    <ScrollView>
      {entries.map((entry, index) => (
        <WorkEntryCard
          key={entry.id ?? `${entry.date}-${index}`}
          entry={entry as DailyWorkEntry}
        />
      ))}
    </ScrollView>
  );
}
