// components/WeekEntryList.tsx
import { ScrollView } from 'react-native';
import WorkEntryCard from './WorkEntryCard';
import { WorkEntry } from '@/types/work';

interface Props {
  entries: WorkEntry[];
}

// Tämä komponentti näyttää yhden viikon kaikki työpäivien kirjaukset listana
export default function WeekEntryList({ entries }: Props) {
  return (
    <ScrollView>
      {entries.map((entry, index) => (
        <WorkEntryCard key={index} entry={entry} />
      ))}
    </ScrollView>
  );
}
