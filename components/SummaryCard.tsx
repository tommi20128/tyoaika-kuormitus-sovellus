// components/SummaryCard.tsx
import InfoCard from './InfoCard';
import InfoRow from './InfoRow';
import { Summary } from '@/types/work';

interface Props {
  title: string;
  summary: Summary;
  targetHours: number;
}

// Tämä komponentti näyttää yhteenvedon viikosta tai kuukaudesta. Käytetään etusivulla.

export default function SummaryCard({ title, summary, targetHours }: Props) {
  return (
    <InfoCard title={title}>
      <InfoRow
        label="Työtunnit"
        value={`${summary.hours} h ${summary.minutes} min / ${targetHours} h`}
      />

      <InfoRow
        label="Tavoite"
        value={
          summary.goalDiff >= 0
            ? `Edellä +${Math.floor(summary.goalDiff)} h`
            : `Jäljessä ${Math.floor(Math.abs(summary.goalDiff))} h`
        }
      />

      {summary.load && (
        <InfoRow label="Kuormitus (ka.)" value={`${summary.load}/10`} />
      )}
    </InfoCard>
  );
}
