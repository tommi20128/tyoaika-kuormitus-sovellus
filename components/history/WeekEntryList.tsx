// components/history/WeekEntryList.tsx
import { DailyWorkEntry } from '@/types/work';
import { ScrollView } from 'react-native';
import WorkEntryCard from '../cards/WorkEntryCard';

interface Props {
  entries: DailyWorkEntry[];
}

// Tämä komponentti näyttää yhden viikon kaikki työpäivien kirjaukset listana. 
// Käytetään historiasivulla viikkonäkymässä, jossa näytetään kaikki viikon kirjaukset peräkkäin.
export default function WeekEntryList({ entries }: Props) {
  return (
    <ScrollView>
      {entries.map((entry) => (
        <WorkEntryCard key={entry.id} entry={entry} />
      ))}
    </ScrollView>
  );
}
