// app/(tabs)/frontpage.tsx
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useLocalSearchParams } from 'expo-router';
import SummaryCard from '@/components/cards/SummaryCard';
import WorkEntryCard from '@/components/cards/WorkEntryCard';

export default function HomePage() {
  const { id: employeeId } = useLocalSearchParams<{ id: string }>();

  // Haetaan dashboardin data hookista
  const {
    firstName,        // Käyttäjän etunimi, joka näytetään tervetuloviestissä
    todayEntry,       // Tänään tehdyt kirjaukset
    weekSummary,      // Yhteenveto kuluvan viikon tunneista (tehdyt, tavoitteet, erotus)
    monthSummary,     // Yhteenveto kuluvan kuukauden tunneista (tehdyt, tavoitteet, erotus)
    totalSummary,     // Yhteenveto koko työuran tunneista (tehdyt, tavoitteet, erotus)
  } = useDashboardData(employeeId);

  //Nämä arvot vaihdetaan oikeiksi, kun laskukaavat on tehty
  const TARGET_WEEK_HOURS = 37.5;
  const TARGET_MONTH_HOURS = 165;

  const careerTargetHours = totalSummary?.targetMinutes
    ? totalSummary.targetMinutes / 60
    : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcome}>
        Tervetuloa {firstName}!
      </Text>

      {/* Tämän päivän kirjaukset, jos niitä on. */}
      {todayEntry && <WorkEntryCard entry={todayEntry} />}

      {/* Viikkonäkymä, joka näyttää kuluvan viikon yhteenvedon.*/}
      {weekSummary && (
        <SummaryCard
          title="Tämä viikko"
          summary={weekSummary}
          targetHours={TARGET_WEEK_HOURS}
        />
      )}

      {/* Kuukausinäkymä, joka näyttää kuluvan kuukauden yhteenvedon.*/}
      {monthSummary && (
        <SummaryCard
          title="Tämä kuukausi"
          summary={monthSummary}
          targetHours={TARGET_MONTH_HOURS}
        />
      )}

      {/* Kokonaiskuva kaikista työuran aikana tehdyistä tunneista*/}
      {totalSummary && (
        <SummaryCard
          title="Työtuntisaldo"
          summary={totalSummary}
          targetHours={careerTargetHours} // Oletetaan 5 työpäivää viikossa
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
