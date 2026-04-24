// components/cards/SummaryCard.tsx
import { View } from 'react-native';
import { WorkSummary } from '@/types/summary';
import { formatHourDiff } from '@/utils/timeUtils';
import InfoCard from '../ui/InfoCard';
import InfoRow from '../ui/InfoRow';

interface Props {
  title: string;
  summary: WorkSummary;
  targetHours: number;
}

// --------------------------------------------------
// Näyttää yhteenvedon (viikko / kuukausi / koko ura)
//
// Näyttää:
// - työtunnit vs tavoite
// - tavoite-ero (edellä / jäljessä)
// - keskiarvot (jos saatavilla)
// --------------------------------------------------

export default function SummaryCard({ title, summary, targetHours }: Props) {

  // Muotoillaan tavoite-ero tunteina ja minuutteina
  const diff = formatHourDiff(summary.goalDiff);

  // Näytettävä "tehdyt tunnit / tavoite"
  const targetTimeText = summary.targetMinutes !== undefined && summary.targetMinutes !== null
    ? `${summary.hours} h ${summary.minutes} min / ${Math.floor(summary.targetMinutes / 60)} h ${summary.targetMinutes % 60} min`
    : `${summary.hours} h ${summary.minutes} min / ${targetHours} h`;

  return (
    <InfoCard title={title}>
      <InfoRow
        label="Työtunnit:"
        value={targetTimeText}
      />

      <InfoRow
        label="Tavoite:"
        value={
          summary.goalDiff >= 0
            ? `Edellä +${diff.hours} h ${diff.minutes} min`
            : `Jäljessä ${diff.hours} h ${diff.minutes} min`
        }
      />

      {summary.avgLoad !== undefined && (
        <View>
          <InfoRow label="Kuormitus (ka.):" value={summary.avgLoad !== undefined ? `${summary.avgLoad.toFixed(1)}/10` : "0/10"} />
          <InfoRow label="Palautuminen (ka.):" value={summary.avgStress1 !== undefined ? `${summary.avgStress1.toFixed(1)}/10` : "0/10"} />
          <InfoRow label="Merkityksellisyys (ka.):" value={summary.avgStress2 !== undefined ? `${summary.avgStress2.toFixed(1)}/10` : "0/10"} />
        </View>
      )}
    </InfoCard>
  );
}
