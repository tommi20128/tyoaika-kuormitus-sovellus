//components/WeekSummaryList.tsx
import { DailyWorkEntry } from "@/types/work";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

// Tämä komponentti näyttää listan viikkoyhteenvedoista. Käytetään historiassa, jossa näytetään kaikki kuukauden kirjaukset viikoittain ryhmiteltynä.

interface WeekSummaryListProps {
  weeks: Record<number, DailyWorkEntry[]>;
  calculateWeekSummary: (arr: DailyWorkEntry[]) => { hours: number; minutes: number; avgLoad: string };
  onSelectWeek: (week: number) => void;
}

export default function WeekSummaryList({ weeks, calculateWeekSummary, onSelectWeek }: WeekSummaryListProps) {
  return (
    <ScrollView>
      {Object.keys(weeks)
        .sort((a, b) => Number(b) - Number(a)) // uusin viikko ylimmäksi
        .map(week => {
          const summary = calculateWeekSummary(weeks[Number(week)]);
          return (
            <Pressable
              key={week}
              style={styles.card}
              onPress={() => onSelectWeek(Number(week))}
            >
              <Text>Viikko {week}</Text>
              <Text>{summary.hours} h {summary.minutes} min</Text>
              <Text>Ka. kuormitus {summary.avgLoad}/10</Text>
            </Pressable>
          );
        })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
})