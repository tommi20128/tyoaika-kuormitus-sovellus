// components/SummaryCard.tsx
import { WorkSummary } from '@/types/summary';
import InfoCard from './InfoCard';
import InfoRow from './InfoRow';
import { formatHourDiff } from '@/utils/workUtils';

interface Props {
  title: string;
  summary: WorkSummary;
  targetHours: number;
}

// Tämä komponentti näyttää yhteenvedon viikosta tai kuukaudesta. Käytetään etusivulla.

export default function SummaryCard({ title, summary, targetHours }: Props) {
  const diff = formatHourDiff(summary.goalDiff);

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
        */
        value={
          summary.targetMinutes !== undefined
            ? (() => {
              const targetHours = Math.floor(summary.targetMinutes / 60);
              const targetMinutes = summary.targetMinutes % 60;

              return `${summary.hours} h ${summary.minutes} min / ${targetHours} h ${targetMinutes} min`;
            })()
            : `${summary.hours} h ${summary.minutes} min / ${targetHours} h`
        }
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
