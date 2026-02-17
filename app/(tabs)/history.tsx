import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';

export default function HistoryPage() {
  const [view, setView] = useState<'week' | 'month'>('week');
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  const goPrevWeek = () => setWeekOffset(weekOffset - 1); // negatiivinen = aikaisempi viikko
  const goNextWeek = () => setWeekOffset(weekOffset + 1); // positiivinen = seuraava viikko

  const goPrevMonth = () => setMonthOffset(monthOffset - 1); // negatiivinen = aikaisempi kuukausi
  const goNextMonth = () => setMonthOffset(monthOffset + 1); // positiivinen = seuraava kuukausi

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historia</Text>

      {/* Toggle Viikko / Kuukausi */}
      <View style={styles.toggleContainer}>
        <Pressable
          style={[styles.toggleButton, view === 'week' && styles.activeToggle]}
          onPress={() => setView('week')}
        >
          <Text style={[styles.toggleText, view === 'week' && { color: '#fff' }]}>Viikko</Text>
        </Pressable>
        <Pressable
          style={[styles.toggleButton, view === 'month' && styles.activeToggle]}
          onPress={() => setView('month')}
        >
          <Text style={[styles.toggleText, view === 'month' && { color: '#fff' }]}>Kuukausi</Text>
        </Pressable>
      </View>

      {view === 'week' ? (
        <>
          {/* Viikon navigointi */}
          <View style={styles.weekNav}>
            <Pressable style={styles.navButton} onPress={goPrevWeek}>
              <Text style={styles.navText}>◀</Text>
            </Pressable>
            <Text style={styles.weekLabel}>Viikko {weekOffset === 0 ? 'tämä' : weekOffset}</Text>
            <Pressable style={styles.navButton} onPress={goNextWeek}>
              <Text style={styles.navText}>▶</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.card}>
              <Text style={styles.date}>Ma 8.2.2026</Text>
              <Text>Työaika: 7,5 h</Text>
              <Text>Kuormitus: 6 / 10</Text>
              <Text style={styles.comment}>Kommentti: Paljon palavereja</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.date}>Ti 9.2.2026</Text>
              <Text>Työaika: 8 h</Text>
              <Text>Kuormitus: 7 / 10</Text>
              <Text style={styles.comment}>Kommentti: Tiukka deadline</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.date}>Ke 10.2.2026</Text>
              <Text>Työaika: 6 h</Text>
              <Text>Kuormitus: 5 / 10</Text>
              <Text style={styles.comment}>Kommentti: Kevyt päivä</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.date}>To 11.2.2026</Text>
              <Text>Työaika: 0 h</Text>
              <Text>Kuormitus: –</Text>
              <Text style={styles.comment}>Kommentti: Saikulla</Text>
            </View>
          </ScrollView>
        </>
      ) : (
        <>
          {/* Kuukausinavigointi */}
          <View style={styles.weekNav}>
            <Pressable style={styles.navButton} onPress={goPrevMonth}>
              <Text style={styles.navText}>◀</Text>
            </Pressable>
            <Text style={styles.weekLabel}>Kuukausi {monthOffset === 0 ? 'tämä' : monthOffset}</Text>
            <Pressable style={styles.navButton} onPress={goNextMonth}>
              <Text style={styles.navText}>▶</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.card}>
              <Text style={{ fontWeight: 'bold' }}>Työtunnit yhteensä: 152 h /165</Text>
              <Text style={{ fontWeight: 'bold' }}>Keskimääräinen kuormitus: 6.2 / 10</Text>
            </View>

            {/* Viikkokortit */}
            <View style={styles.card}>
              <Text style={styles.date}>Viikko 1</Text>
              <Text>Työtunnit: 40 h</Text>
              <Text style={{ color: 'green' }}>Keskimääräinen kuormitus: 3 / 10</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.date}>Viikko 2</Text>
              <Text>Työtunnit: 38 h</Text>
              <Text style={{ color: 'blue' }}>Keskimääräinen kuormitus: 4 / 10</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.date}>Viikko 3</Text>
              <Text>Työtunnit: 42 h</Text>
              <Text style={{ color: 'blue' }}>Keskimääräinen kuormitus: 6 / 10</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.date}>Viikko 4</Text>
              <Text>Työtunnit: 32 h</Text>
              <Text style={{ color: 'red' }}>Keskimääräinen kuormitus: 8 / 10</Text>
            </View>
          </ScrollView>
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
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ddd',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeToggle: {
    backgroundColor: '#007AFF'
  },
  toggleText: {
    fontWeight: 'bold',
    color: '#000'
  },
  weekNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 6,
  },
  navText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  weekLabel: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12
  },
  date: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  comment: {
    fontStyle: 'italic',
    marginTop: 4
  },
});
