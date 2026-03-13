// components/SummaryCard.tsx
import { WorkSummary } from '@/types/summary';
import { formatHourDiff } from '@/utils/timeUtils';
import InfoCard from '../ui/InfoCard';
import InfoRow from '../ui/InfoRow';

interface Props {
  title: string;
  summary: WorkSummary;
  targetHours: number;
}

// Tämä komponentti näyttää yhteenvedon viikosta tai kuukaudesta. Käytetään etusivulla.

export default function SummaryCard({ title, summary, targetHours }: Props) {
  const diff = formatHourDiff(summary.goalDiff);

  const targetTimeText = summary.targetMinutes
  ? `${summary.hours} h ${summary.minutes} min / ${Math.floor(summary.targetMinutes / 60)} h ${summary.targetMinutes % 60} min`
  : `${summary.hours} h ${summary.minutes} min / ${targetHours} h`;

  return (
    <InfoCard title={title}>
      <InfoRow
        label="Työtunnit"
        /*Kumpi tapa on parempi? Tämä value vai alempana oleva. Voi kokeilla ja tehdään päätös sen jälkeen.
        value={
          summary.targetMinutes !== undefined
            ? `${summary.hours} h ${summary.minutes} min / ${(summary.targetMinutes / 60).toFixed(1)} h`
            : `${summary.hours} h ${summary.minutes} min / ${targetHours} h`
        }

          summary.targetMinutes !== undefined
            ? (() => {
              const targetHours = Math.floor(summary.targetMinutes / 60);
              const targetMinutes = summary.targetMinutes % 60;

              return `${summary.hours} h ${summary.minutes} min / ${targetHours} h ${targetMinutes} min`;
            })()
            : `${summary.hours} h ${summary.minutes} min / ${targetHours} h`
        
        */
        value={targetTimeText}
      />

      <InfoRow
        label="Tavoite"
        value={
          summary.goalDiff >= 0
            ? `Edellä +${diff.hours} h ${diff.minutes} min`
            : `Jäljessä ${diff.hours} h ${diff.minutes} min`
        }
      />

      {summary.load && (
        <InfoRow label="Kuormitus (ka.)" value={`${summary.load}/10`} />
      )}
    </InfoCard>
  );
}
