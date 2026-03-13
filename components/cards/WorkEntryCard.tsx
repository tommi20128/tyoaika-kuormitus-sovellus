//components/WorkEntryCard.tsx
import { DailyWorkEntry } from '@/types/work';
import { formatReverseFullDate } from '@/utils/dateUtils';
import { calculateAverageStress } from '@/utils/stressUtils';
import InfoCard from '../ui/InfoCard';
import InfoRow from '../ui/InfoRow';

interface Props {
  entry: DailyWorkEntry;
  showStress?: boolean;
}

// Tämä komponentti näyttää yhden työpäivän tiedot korttina. Käytetään sekä etusivulla että historiassa.

export default function WorkEntryCard({ entry, showStress = true }: Props) {
   const avgStress = calculateAverageStress(entry.stress1, entry.stress2);

  return (
    <InfoCard title={formatReverseFullDate(new Date(entry.date))}>
      <InfoRow
        label="Työaika"
        value={`${Math.floor(entry.totalMinutes / 60)} h ${entry.totalMinutes % 60} min`}
      />
      <InfoRow label="Kuormitus" value={`${entry.workload}/10`} />

      {showStress && (
        <>
          <InfoRow label="Stressi 1" value={`${entry.stress1}/10`} />
          <InfoRow label="Stressi 2" value={`${entry.stress2}/10`} />
          <InfoRow label="Stressi yht." value={`${avgStress.toFixed(1)}/10`} />
        </>
      )}

      {entry.comment && (
        <InfoRow label="Kommentti" value={entry.comment} />
      )}
    </InfoCard>
  );
}
