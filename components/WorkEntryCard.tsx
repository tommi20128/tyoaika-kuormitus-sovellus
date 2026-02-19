//components/WorkEntryCard.tsx
import InfoCard from './InfoCard';
import InfoRow from './InfoRow';
import { WorkEntry } from '@/types/work';
import { formatFullDate, formatReverseFullDate,  } from '@/utils/dateUtils';
interface Props {
  entry: WorkEntry;
  showStress?: boolean;
}

// Tämä komponentti näyttää yhden työpäivän tiedot korttina. Käytetään sekä etusivulla että historiassa.

export default function WorkEntryCard({ entry, showStress = true }: Props) {
  return (
    <InfoCard title={formatReverseFullDate(new Date(entry.date))}>
      <InfoRow
        label="Työaika"
        value={`${Math.floor(entry.totalMinutes / 60)} h ${entry.totalMinutes % 60} min`}
      />
      <InfoRow label="Kuormitus" value={`${entry.load1}/10`} />

      {showStress && (
        <>
          <InfoRow label="Stressi 1" value={`${entry.stressLoad1}/10`} />
          <InfoRow label="Stressi 2" value={`${entry.stressLoad2}/10`} />
          <InfoRow label="Stressi yht." value={`${entry.averageStress}/10`} />
        </>
      )}

      {entry.comment && (
        <InfoRow label="Kommentti" value={entry.comment} />
      )}
    </InfoCard>
  );
}
