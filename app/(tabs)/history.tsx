// app/(tabs)/history.tsx
import { View, Text, StyleSheet } from 'react-native';
import { formatWeekLabel } from '@/utils/dateUtils';
import { groupByWeek } from '@/utils/workUtils';
import { useHistoryData } from '@/hooks/useHistoryData';
import PeriodNavigator from '@/components/history/PeriodNavigator';
import ViewToggleButton from '@/components/history/ViewToggleButton';
import WeekSummaryList from '@/components/history/WeekSummaryList';
import WeekEntryList from '@/components/history/WeekEntryList';
import EmptyCard from '@/components/cards/EmptyCard';

interface HistoryPageProps {
  employeeId?: string;
}

// Historia-sivu näyttää viikko- ja kuukausinäkymän
export default function HistoryPage({ employeeId }: HistoryPageProps) {

  // Haetaan historia-data hookista
  const {
    monthOffset,          // kuinka monta kuukautta taaksepäin mennään
    setMonthOffset,       // funktio kuukausi-offsetin päivittämiseen
    weekEntries,          // kaikki kyseisen viikon kirjaukset
    weekNumber,           // nykyisen viikon numero
    weekYear,             // nykyisen viikon vuosi
    monday,               // nykyisen viikon maanantai
    sunday,               // nykyisen viikon sunnuntai
    goToPreviousWeek,
    goToNextWeek,
    selectWeek,
    selectedWeek,
    view,                 // nykyinen näkymä ('week' tai 'month')
    setView,              // funktio näkymän vaihtamiseen
    monthLabel,           // nykyisen kuukauden label (esim. "Lokakuu 2024")
    monthEntries,         // kaikki kyseisen kuukauden kirjaukset
    isFutureWeek,         // onko kyseinen viikko tulevaisuudessa
    targetMonthDate,      // kuukausinäkymän vertailupvm (kuukauden ensimmäinen päivä)
    isFutureMonth,        // onko kyseinen kuukausi tulevaisuudessa
  } = useHistoryData(employeeId);

  // Kuukausinäkymän data: ryhmitellään kuukauden kirjaukset viikoittain
  const monthWeeks = groupByWeek(monthEntries);

  // -------------------------
  // Sisäiset komponentit JSX:n selkeyttämiseen
  // -------------------------

  // Viikkonäkymä
  const WeekView = () => (
    <>
      {/* Viikkonavigointi */}
      <PeriodNavigator
        label={formatWeekLabel(weekNumber, weekYear, monday, sunday)}
        onPrev={goToPreviousWeek}
        onNext={goToNextWeek}
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
      {Object.keys(monthWeeks).length > 0 ? (
        <WeekSummaryList
          weeks={monthWeeks}
          onSelectWeek={(week) => {
            setView('week');
            selectWeek(Number(week))
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
});