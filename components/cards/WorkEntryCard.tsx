//components/cards/WorkEntryCard.tsx
import { DailyWorkEntry } from '@/types/work';
import { formatReverseFullDate, parseLocalDate } from '@/utils/dateUtils';
import InfoCard from '../ui/InfoCard';
import InfoRow from '../ui/InfoRow';

interface Props {
  entry: DailyWorkEntry;
  showStress?: boolean;
  type?: 'work' | 'holiday'
}

// Tämä komponentti näyttää yhden työpäivän tiedot korttina. Käytetään sekä etusivulla että historiassa.

export default function WorkEntryCard({ entry, showStress = true, type }: Props) {

  // Käytetään entry.type jos löytyy, muuten fallback propista tai 'work'
  const entryType = entry.type ?? type ?? 'work';

  return (
    <InfoCard title={formatReverseFullDate(parseLocalDate(entry.date))}>

      {/* ------------------------- */}
      {/* PYHÄPÄIVÄ */}
      {/* ------------------------- */}
      {entryType === 'holiday' ? (
        <>
          {/* Pyhäpäivän nimi */}
          {entry.note && (
            <InfoRow label="Päivä" value={entry.note} />
          )}
        </>
      ) : (
        <>
          {/* ------------------------- */}
          {/* NORMAALI TYÖPÄIVÄ */}
          {/* ------------------------- */}

          <InfoRow
            label="Työaika:"
            value={`${Math.floor(entry.totalMinutes / 60)} h ${entry.totalMinutes % 60} min`}
          />

          <InfoRow label="Kuormitus:" value={`${entry.workload}/10`} />

          {showStress && (
            <>
              <InfoRow label="Palautuminen:" value={`${entry.stress1}/10`} />
              <InfoRow label="Merkityksellisyys:" value={`${entry.stress2}/10`} />
            </>
          )}

          {entry.comment && (
            <InfoRow label="Kommentti:" value={entry.comment} />
          )}
        </>
      )}
    </InfoCard>
  );
}