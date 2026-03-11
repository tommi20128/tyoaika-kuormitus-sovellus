// app/(supervisor)/mainpage.tsx
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../Config";

export default function SupervisorHome() {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // Firestore query: hae kaikki työntekijät
    const q = query(
      collection(db, "users"),
      where("role", "==", "employee")
    );

    // onSnapshot kuuntelee reaaliaikaisia muutoksia
    const unsubscribe = onSnapshot(q, (snapshot) => {

      // Muunnetaan snapshot suoraan arrayksi
      const employeeList: any[] = [];

      snapshot.forEach((doc) => {
        employeeList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setEmployees(employeeList);
      setLoading(false);

    });

    return () => unsubscribe();

  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Työntekijät</Text>

      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (

          <Pressable
            style={styles.card}
            // Pitäisi navigoida työntekijän kirjauksiin mutta menee vääriin tietoihin.
            onPress={() => router.push(`/(supervisor)/employee/${item.id}`)}
          >

            <Text style={styles.name}>
              {item.firstName} {item.lastName}
            </Text>

            <Text style={styles.role}>
              {item.title}
            </Text>

          </Pressable>

        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
