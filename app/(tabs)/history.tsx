// app/(tabs)/history.tsx
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { useHistoryData } from '@/hooks/useHistoryData';
import WorkEntryCard from '@/components/WorkEntryCard';
import { formatShortDate, formatMonthLabel } from '../../utils/dateUtils';
import PeriodNavigator from '@/components/PeriodNavigator';
import ViewToggleButton from '@/components/ViewToggleButton';
import WeekSummaryList from '@/components/WeekSummaryList';
import WeekEntryList from '@/components/WeekEntryList';

export default function HistoryPage() {
  const [view, setView] = useState<'week' | 'month'>('week');

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
    isFutureWeek,         // onko kyseinen viikko tulevaisuudessa
    targetMonthDate,      // kuukausinäkymän vertailupvm (kuukauden ensimmäinen päivä)
    isFutureMonth,        // onko kyseinen kuukausi tulevaisuudessa
    groupByWeek,          // funktio joka ryhmittelee kuukauden kirjaukset viikoittain
    calculateWeekSummary, // funktio joka laskee viikon yhteenvetotiedot
  } = useHistoryData();

  // Muodostetaan kuukausilabel käytettäväksi kuukausinäkymässä
  const monthName = formatMonthLabel(targetMonthDate);

  // Ryhmitellään kuukauden kirjaukset viikoittain
  const weeks = groupByWeek();

  // Muodostetaan viikon label, esim. "Viikko 42 (2024) 14.10. – 20.10."
  const getWeekLabel = () => 
    `Viikko ${weekNumber} (${weekYear}) ${formatShortDate(monday)} – ${formatShortDate(sunday)}`;


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historia</Text>

      {/* ToggleButton viikko/kuukausi */}
      <ViewToggleButton
        value={view}
        onChange={(val) => setView(val)}
      />

      {view === 'week' ? (
        <>
          {/* Viikkonavigointi */}
          <PeriodNavigator
            label={getWeekLabel()}
            onPrev={() => setWeekOffset(weekOffset - 1)}
            onNext={() => setWeekOffset(weekOffset + 1)}
            disableNext={isFutureWeek(monday)}
          />

          {/* Viikkolista */}
          <WeekEntryList entries={weekEntries} />
        </>
      ) : (
        <>
          {/* Kuukausinavigointi */}
          <PeriodNavigator
            label={monthName}
            onPrev={() => setMonthOffset(monthOffset - 1)}
            onNext={() => setMonthOffset(monthOffset + 1)}
            disableNext={isFutureMonth(targetMonthDate)}
          />

          {/* Viikkoyhteenvetolista */}
          <WeekSummaryList
            weeks={weeks}
            calculateWeekSummary={calculateWeekSummary}
            onSelectWeek={(week) => {
              setView('week');
              setWeekOffset(week - weekNumber);
            }}
          />
        </>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16
  },
});
