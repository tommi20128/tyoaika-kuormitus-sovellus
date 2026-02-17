import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../Config";
import InfoCard from '@/components/InfoCard';
import InfoRow from '@/components/InfoRow';
import { useAuth } from '@/context/AuthContext';

interface WorkEntry {
  date: string;
  totalMinutes: number;
  load1: number;
  stressLoad1: number;
  stressLoad2: number;
  averageStress: number;
  comment?: string;
}

export default function HomePage() {
  const { user, loading } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [todayEntry, setTodayEntry] = useState<WorkEntry | null>(null);
  const [weekSummary, setWeekSummary] = useState<any>(null);
  const [monthSummary, setMonthSummary] = useState<any>(null);
  const [totalSummary, setTotalSummary] = useState<any>(null);

  const todayId = new Date().toISOString().split("T")[0];

  const DAILY_TARGET = 7.5; // tuntia / arkipäivä

  // Haetaan käyttäjän etunimi
  useEffect(() => {
    const fetchName = async () => {
      if (!user) return;
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFirstName(data.firstName);
      }
    };
    fetchName();
  }, [user]
  );

  //Haetaan työtiedot joka kerta, kun sivu aktivoituu
  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      const fetchWorkEntries = async () => {
        const entriesRef = collection(db, "users", user.uid, "workEntries");
        const entriesSnap = await getDocs(entriesRef);
        const entries: WorkEntry[] = entriesSnap.docs.map(doc => doc.data() as WorkEntry);

        if (!entries.length) return;

        // Päivän kirjauksen haku
        const todayData = entries.find(e => e.date === todayId) || null;
        setTodayEntry(todayData);

        const now = new Date();

        // Ensimmäinen kirjauspäivä
        const firstDate = new Date(
          entries.reduce((prev, curr) => prev.date < curr.date ? prev : curr).date
        );

        // Funktio summaan minuutit
        const sumMinutes = (arr: WorkEntry[]) =>
          arr.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);

        const average = (arr: WorkEntry[], key: keyof WorkEntry) =>
          arr.length ? arr.reduce((acc, e) => acc + (e[key] as number || 0), 0) / arr.length : 0;


        // Viikon kirjaukset: alkaen ensimmäisestä kirjauspäivästä tai viikon alusta
        const weekStart = new Date();
        weekStart.setDate(now.getDate() - now.getDay());
        const effectiveWeekStart = firstDate > weekStart ? firstDate : weekStart;

        const weekEntries = entries.filter(e => {
          const eDate = new Date(e.date);
          return eDate >= effectiveWeekStart && eDate <= now;
        });

        // Kuukauden kirjaukset: alkaen ensimmäisestä kirjauspäivästä tai kuukauden alusta
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const effectiveMonthStart = firstDate > monthStart ? firstDate : monthStart;

        const monthEntries = entries.filter(e => {
          const eDate = new Date(e.date);
          return eDate >= effectiveMonthStart && eDate <= now;
        });

        // Viikon tavoite arkipäivien mukaan
        let weekDaysCount = 0;
        const dayIterator = new Date(effectiveWeekStart);
        while (dayIterator <= now) {
          const dayOfWeek = dayIterator.getDay();
          if (dayOfWeek >= 1 && dayOfWeek <= 5) weekDaysCount++;
          dayIterator.setDate(dayIterator.getDate() + 1);
        }
        const weekGoal = weekDaysCount * DAILY_TARGET;

        // Kuukauden tavoite arkipäivien mukaan
        let monthDaysCount = 0;
        const monthIterator = new Date(effectiveMonthStart);
        while (monthIterator <= now) {
          const dayOfWeek = monthIterator.getDay();
          if (dayOfWeek >= 1 && dayOfWeek <= 5) monthDaysCount++;
          monthIterator.setDate(monthIterator.getDate() + 1);
        }
        const monthGoal = monthDaysCount * DAILY_TARGET;

        // Viikon yhteenveto
        const weekMinutes = sumMinutes(weekEntries);
        setWeekSummary({
          hours: Math.floor(weekMinutes / 60),
          minutes: weekMinutes % 60,
          load: average(weekEntries, "load1").toFixed(1),
          stress1: average(weekEntries, "stressLoad1").toFixed(1), // Yhdistetäänkö näitä tietoja myöhemmin?
          stress2: average(weekEntries, "stressLoad2").toFixed(1),
          stress3: average(weekEntries, "averageStress").toFixed(1),
          goalDiff: weekMinutes / 60 - weekGoal,
        });

        // Kuukauden yhteenveto
        const monthMinutes = sumMinutes(monthEntries);
        setMonthSummary({
          hours: Math.floor(monthMinutes / 60),
          minutes: monthMinutes % 60,
          load: average(monthEntries, "load1").toFixed(1),
          stress1: average(monthEntries, "stressLoad1").toFixed(1), // Yhdistetäänkö näitä tietoja myöhemmin?
          stress2: average(monthEntries, "stressLoad2").toFixed(1),
          stress3: average(monthEntries, "averageStress").toFixed(1),
          goalDiff: monthMinutes / 60 - monthGoal,
        });

        // Koko työsuhteen saldo
        const today = new Date();
        let workDaysCount = 0;
        const totalDayIterator = new Date(firstDate);
        while (totalDayIterator <= today) {
          const dayOfWeek = totalDayIterator.getDay();
          if (dayOfWeek >= 1 && dayOfWeek <= 5) workDaysCount++;
          totalDayIterator.setDate(totalDayIterator.getDate() + 1);
        }
        const totalMinutesDone = sumMinutes(entries);
        const totalGoalMinutes = workDaysCount * DAILY_TARGET * 60;
        setTotalSummary({
          hours: Math.floor(totalMinutesDone / 60),
          minutes: totalMinutesDone % 60,
          goalDiff: (totalMinutesDone - totalGoalMinutes) / 60,
        });
      };

      fetchWorkEntries();
    }, [user])
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fi-FI', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcome}>Tervetuloa {firstName}!</Text>

      {/* Päivän kortti */}
      {todayEntry && (
        <InfoCard title={`Tänään ${formatDate(todayEntry.date)}`}>
          <InfoRow label="Työtunnit" value={`${Math.floor(todayEntry.totalMinutes / 60)} h ${todayEntry.totalMinutes % 60} min`} />
          <InfoRow label="Kuormitus" value={`${todayEntry.load1}/10`} />
          <InfoRow label="Stressi 1" value={`${todayEntry.stressLoad1}/10`} />
          <InfoRow label="Stressi 2" value={`${todayEntry.stressLoad2}/10`} />
          {todayEntry.comment && <InfoRow label="Kommentti" value={todayEntry.comment} />}
        </InfoCard>
      )}

      {/* Viikon kortti */}
      {weekSummary && (
        <InfoCard title="Tämä viikko">
          <InfoRow label="Työtunnit" value={`${weekSummary.hours} h ${weekSummary.minutes} min / 37.5 h`} />
          <InfoRow
            label="Tavoite"
            value={
              weekSummary.goalDiff >= 0
                ? `Edellä tavoitteesta +${Math.floor(weekSummary.goalDiff)} h ${Math.round((weekSummary.goalDiff % 1) * 60)} min`
                : `Jäljessä ${Math.floor(Math.abs(weekSummary.goalDiff))} h ${Math.round((Math.abs(weekSummary.goalDiff) % 1) * 60)} min`
            }
          />
          <InfoRow label="Kuormitus" value={`${weekSummary.load}/10`} />
          <InfoRow label="Stressi 1 (ka.)" value={`${weekSummary.stress1}/10`} />
          <InfoRow label="Stressi 2 (ka.)" value={`${weekSummary.stress2}/10`} />
          <InfoRow label="Stressi yht (ka.)" value={`${weekSummary.stress3}/10`} />
        </InfoCard>
      )}

      {/* Kuukauden kortti */}
      {monthSummary && (
        <InfoCard title="Tämä kuukausi">
          <InfoRow label="Työtunnit" value={`${monthSummary.hours} h ${monthSummary.minutes} min / 165 h`} />
          <InfoRow
            label="Tavoite"
            value={
              monthSummary.goalDiff >= 0
                ? `Edellä tavoitteesta +${Math.floor(monthSummary.goalDiff)} h ${Math.round((monthSummary.goalDiff % 1) * 60)} min edellä`
                : `Jäljessä ${Math.floor(Math.abs(monthSummary.goalDiff))} h ${Math.round((Math.abs(monthSummary.goalDiff) % 1) * 60)} min`
            }
          />
          <InfoRow label="Kuormitus" value={`${monthSummary.load}/10`} />
          <InfoRow label="Stressi 1 (ka.)" value={`${monthSummary.stress1}/10`} />
          <InfoRow label="Stressi 2 (ka.)" value={`${monthSummary.stress2}/10`} />
          <InfoRow label="Stressi yht (ka.)" value={`${monthSummary.stress3}/10`} />
        </InfoCard>
      )}

      {/* Koko työsuhteen saldokortti */}
      {totalSummary && (
        <InfoCard title="Työtuntisaldo (koko työsuhteen ajalta)">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontWeight: '500' }}>Kokonaisero</Text>
            <Text style={totalSummary.goalDiff >= 0 ? styles.plus : styles.minus}>
              {totalSummary.goalDiff >= 0
                ? `Olet +${Math.floor(totalSummary.goalDiff)} h ${Math.round((totalSummary.goalDiff % 1) * 60)} min edellä`
                : `Olet -${Math.floor(Math.abs(totalSummary.goalDiff))} h ${Math.round((Math.abs(totalSummary.goalDiff) % 1) * 60)} min jäljessä`}
            </Text>
          </View>
          <InfoRow label="Tehty yhteensä" value={`${totalSummary.hours} h ${totalSummary.minutes} min`} />
        </InfoCard>
      )}
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    paddingBottom: 40, // scroll tilaa tabin alle
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3, // android shadow
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
  motivation: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  plus: {
    color: 'green',
    fontWeight: 'bold',
  },
  minus: {
    color: 'red',
    fontWeight: 'bold',
  },
});
