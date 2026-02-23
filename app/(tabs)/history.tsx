// app/(tabs)/history.tsx
import { View, Text, StyleSheet } from 'react-native';
import { useHistoryData } from '@/hooks/useHistoryData';
import PeriodNavigator from '@/components/PeriodNavigator';
import ViewToggleButton from '@/components/ViewToggleButton';
import WeekSummaryList from '@/components/WeekSummaryList';
import WeekEntryList from '@/components/WeekEntryList';
import { formatWeekLabel } from '@/utils/dateUtils';
import EmptyCard from '@/components/EmptyCard';

// Historia-sivu näyttää viikko- ja kuukausinäkymän
export default function HistoryPage() {

  // Haetaan historia-data hookista
  const {
    weekOffset,           // kuinka monta viikkoa taaksepäin mennään
    setWeekOffset,        // funktio viikko-offsetin päivittämiseen
    monthOffset,          // kuinka monta kuukautta taaksepäin mennään
    setMonthOffset,       // funktio kuukausi-offsetin päivittämiseen
    weekEntries,          // kaikki kyseisen viikon kirjaukset
    weekNumber,           // nykyisen viikon numero
    weekYear,             // nykyisen viikon vuosi
    monday,               // nykyisen viikon maanantai
    sunday,               // nykyisen viikon sunnuntai
    view,                 // nykyinen näkymä ('week' tai 'month')
    setView,              // funktio näkymän vaihtamiseen
    monthLabel,           // nykyisen kuukauden label (esim. "Lokakuu 2024")
    isFutureWeek,         // onko kyseinen viikko tulevaisuudessa
    targetMonthDate,      // kuukausinäkymän vertailupvm (kuukauden ensimmäinen päivä)
    isFutureMonth,        // onko kyseinen kuukausi tulevaisuudessa
    groupByWeek,         // kuukauden kirjausten ryhmittely viikoittain
    calculateWeekSummary, // funktio joka laskee viikon yhteenvetotiedot
  } = useHistoryData();

  const weeks = groupByWeek(); // Kuukausinäkymän data

  // -------------------------
  // Sisäiset komponentit JSX:n selkeyttämiseen
  // -------------------------

  // Viikkonäkymä
  const WeekView = () => (
    <>
      {/* Viikkonavigointi */}
      <PeriodNavigator
        label={formatWeekLabel(weekNumber, weekYear, monday, sunday)}
        onPrev={() => setWeekOffset(weekOffset - 1)}
        onNext={() => setWeekOffset(weekOffset + 1)}
        disableNext={isFutureWeek(monday)}
      />

      {/* Viikkolista */}
      {weekEntries.length > 0 ? (
        <WeekEntryList entries={weekEntries} />
      ) : (
        <EmptyCard message="Ei merkintöjä tällä viikolla" />
      )}
    </>
  );

  // Kuukausinäkymä
  const MonthView = () => (
    <>
      {/* Kuukausinavigointi */}
      <PeriodNavigator
        label={monthLabel}
        onPrev={() => setMonthOffset(monthOffset - 1)}
        onNext={() => setMonthOffset(monthOffset + 1)}
        disableNext={isFutureMonth(targetMonthDate)}
      />

      {/* Viikkoyhteenvetolista */}
      {Object.keys(weeks).length > 0 ? (
        <WeekSummaryList
          weeks={weeks}
          calculateWeekSummary={calculateWeekSummary}
          onSelectWeek={(week) => {
            setView('week');
            setWeekOffset(week - weekNumber);
          }}
        />
      ) : (
        <EmptyCard message="Ei merkintöjä tältä kuukaudelta" />
      )}
    </>
  );

  // -------------------------
  // Render
  // -------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historia</Text>

      {/* ToggleButton viikko/kuukausi */}
      <ViewToggleButton
        value={view}
        onChange={setView}
      />

      {/* Näytetään valittu näkymä */}
      {view === 'week' ? <WeekView /> : <MonthView />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
});