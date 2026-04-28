//components/history/WeekSummaryList.tsx
import { DailyWorkEntry } from "@/types/work";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { average, sumMinutes } from "@/utils/workUtils";
import { minutesToHoursMinutes } from "@/utils/timeUtils";
import { getWeekRange, formatWeekLabel, getISOWeekYear, parseLocalDate } from "@/utils/dateUtils";

// Tämä komponentti näyttää listan viikkoyhteenvedoista. Käytetään historiassa, jossa näytetään kaikki kuukauden kirjaukset viikoittain ryhmiteltynä.

interface WeekSummaryListProps {
  weeks: Record<number, DailyWorkEntry[]>;
  onSelectWeek: (week: number) => void;
}

export default function WeekSummaryList({ weeks, onSelectWeek }: WeekSummaryListProps) {

  const buildSummary = (entries: DailyWorkEntry[]) => {

    const totalMinutes = sumMinutes(entries);

    const { monday, sunday } = getWeekRange(new Date());

    return {
      ...minutesToHoursMinutes(totalMinutes),

      avgLoad: average(entries.map(e => Number(e.workload)).filter(v => !isNaN(v))),
      avgStress1: average(entries.map(e => Number(e.stress1)).filter(v => !isNaN(v))),
      avgStress2: average(entries.map(e => Number(e.stress2)).filter(v => !isNaN(v))),
    };
  };
  return (
    <ScrollView>
      {Object.keys(weeks)
        .sort((a, b) => Number(b) - Number(a))
        .map(week => {

          const weekNumber = Number(week);
          const entries = weeks[weekNumber];
          const summary = buildSummary(entries);

          // Otetaan ensimmäinen entry viikon referenssiksi
          const firstEntry = entries[0];

          const weekDate = firstEntry
            ? parseLocalDate(firstEntry.date)
            : new Date();

          const { monday, sunday } = getWeekRange(weekDate);

          const year = getISOWeekYear(weekDate);

          return (
            <Pressable
              key={week}
              style={styles.card}
              onPress={() => onSelectWeek(weekNumber)}
            >
              <Text style={{ fontWeight: 'bold' }}>
                {formatWeekLabel(weekNumber, year, monday, sunday)}
              </Text>

              <Text>Työaika: {summary.hours} h {summary.minutes} min</Text>

              <Text>Kuormitus (ka.): {summary.avgLoad}/10</Text>
              <Text>Palautuminen (ka.): {summary.avgStress1}/10</Text>
              <Text>Merkityksellisyys (ka.): {summary.avgStress2}/10</Text>
            </Pressable>
          );
        })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },
})