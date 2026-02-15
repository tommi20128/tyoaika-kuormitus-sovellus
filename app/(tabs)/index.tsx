import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Config"; 

export default function HomePage() {

  const [firstName,setFirstName] = useState("");

  useEffect(() => {
  const fetchName = async () => {
    const user = getAuth().currentUser;
    if (!user) return;
    console.log(user)


    const docSnap = await getDoc(doc(db, "users", user.uid));
    setFirstName(docSnap.data()!.firstName);
  };
  fetchName();
  console.log(firstName)
  console.log(Error)
}, []);



  // Staattiset arvot testaukseen
  const todayHours = 6; // työtunnit tänään
  const todayLoad = 5; // kuormitus 1-10

  const weekHours = 32; //työtunnit tällä viikolla
  const weekGoal = 37.5; //työtuntitavoite viikossa
  const weekLoad = 6; // keskimääräinen kuormitus

  const monthHours = 120; //työtunnit tällä kuukaudella
  const monthGoal = 165; //työtuntitavoite kuukaudessa
  const monthLoad = 5.5; // keskimääräinen kuormitus

  const weekDiff = weekHours - weekGoal; // kuinka paljon edellä/jäljessä viikkotavoitteesta
  const monthDiff = monthHours - monthGoal; // kuinka paljon edellä/jäljessä kuukausitavoitteesta

  // Koko työsuhteen saldotiedot
  const totalWorkedHours = 675; // tehty 4 kuukaudessa
  const totalRequiredHours = 660; // tavoite 4 kuukaudessa
  const totalBalance = totalWorkedHours - totalRequiredHours; // kuinka paljon edellä/jäljessä koko työsuhteen ajan tavoitteesta

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcome}>Tervetuloa, {firstName}!</Text>

      {/* Päivän kortti */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tänään 20.2.2026</Text>
        <Text style={styles.cardText}>Työtunnit: {todayHours} h</Text>
        <Text style={styles.cardText}>Kuormitus: {todayLoad}/10</Text>
        <Text style={styles.cardText}>Kommentti: Paljon palavereja</Text>
      </View>

      {/* Viikon kortti */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tämä viikko</Text>
        <Text style={styles.cardText}>Työtunnit: {weekHours} h  / 37.5h</Text>
        <Text style={styles.cardText}>
          {weekDiff >= 0
            ? `Edellä tavoitteesta +${weekDiff} h`
            : `Jäljessä tavoitteesta ${Math.abs(weekDiff)} h`}
        </Text>
        <Text style={styles.cardText}>Kuormitus: {weekLoad}/10</Text>
      </View>

      {/* Kuukauden kortti */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tämä kuukausi</Text>
        <Text style={styles.cardText}>Työtunnit: {monthHours} h / 165 h</Text>
        <Text style={styles.cardText}>
          {monthDiff >= 0
            ? `Edellä tavoitteesta +${monthDiff} h`
            : `Jäljessä tavoitteesta ${Math.abs(monthDiff)} h`}
        </Text>
        <Text style={styles.cardText}>Kuormitus: {monthLoad}/10</Text>
      </View>

      {/* Koko työajan saldokortti */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Työtuntisaldo (koko työsuhteen ajalta)</Text>
        <Text
          style={[
            styles.cardText,
            totalBalance >= 0 ? styles.plus : styles.minus,
          ]}
        >
          {totalBalance >= 0
            ? `Olet +${totalBalance} h tarvittavien työtuntien edellä`
            : `Olet -${Math.abs(totalBalance)} h tarvittavien työtuntien jäljessä`}
        </Text>
      </View>

      <Text style={styles.motivation}>Hyvää työtä tähän asti!</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    paddingBottom: 100, // scroll tilaa tabin alle
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
