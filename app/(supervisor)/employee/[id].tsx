// app/(supervisor)/employee/[id].tsx
import { ScrollView, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../Config";
import InfoCard from "@/components/InfoCard";
import InfoRow from "@/components/InfoRow";

export default function EmployeeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        if (!id) return;

        const ref = doc(db, "users", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setEmployee(snap.data());
        } else {
          setEmployee(null);
        }
      } catch (error) {
        console.log("Employee fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleBack = () => {
    router.push("/(supervisor)/mainpage");
  };

  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <ActivityIndicator size="large" />
      </ScrollView>
    );
  }

  if (!employee) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Työntekijää ei löytynyt.</Text>
      </ScrollView>
    );
  }
  
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <InfoCard>
        <Text style={styles.name}>
          {employee.firstName} {employee.lastName}
        </Text>

        <Text style={styles.role}>
          {employee.title}
        </Text>
      </InfoCard>

      <InfoCard title="Työntekijän tiedot">

        <InfoRow
          label="Sähköposti"
          value={employee.email}
        />

        <InfoRow
          label="Esihenkilö"
          value={employee.manager}
        />

        <InfoRow
          label="Rooli"
          value={employee.role}
        />

      </InfoCard>

      <Pressable
        style={styles.backButton}
        onPress={handleBack}
      >
        <Text style={styles.backButtonText}>
          ← Takaisin
        </Text>
      </Pressable>

    </ScrollView>
  );
}


  const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: "#FFFFFF",
    },
    name: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 6,
    },
    role: {
      fontSize: 16,
      color: "#666666",
    },
    backButton: {
      marginBottom: 16,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: "#E0E0E0",
      borderRadius: 6,
      alignSelf: "flex-start",
    },
    backButtonText: {
      fontSize: 16,
      fontWeight: "500",
    },
  });
