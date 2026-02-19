// app/(tabs)/frontpage.tsx
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useDashboardData } from '@/hooks/useDashboardData';
import SummaryCard from '@/components/SummaryCard';
import InfoCard from '@/components/InfoCard';
import InfoRow from '@/components/InfoRow';
import WorkEntryCard from '@/components/WorkEntryCard';

export default function HomePage() {
  const {
    firstName,        // Käyttäjän etunimi, joka näytetään tervetuloviestissä
    todayEntry,       // Tänään tehdyt kirjaukset
    weekSummary,      // Yhteenveto kuluvan viikon tunneista (tehdyt, tavoitteet, erotus)
    monthSummary,     // Yhteenveto kuluvan kuukauden tunneista (tehdyt, tavoitteet, erotus)
    totalSummary,     // Yhteenveto koko työuran tunneista (tehdyt, tavoitteet, erotus)
  } = useDashboardData();

  //Nämä arvot vaihdetaan oikeiksi, kun laskukaavat on tehty
  const TARGET_WEEK_HOURS = 37.5;
  const TARGET_MONTH_HOURS = 165;

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
        <InfoCard title="Työtuntisaldo">
          <InfoRow
            label="Tehty yhteensä"
            value={`${totalSummary.hours} h ${totalSummary.minutes} min`}
          />
        </InfoCard>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
