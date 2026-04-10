// app/(supervisor)/(tabs)/mainpage.tsx
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useUsers } from "@/hooks/useUsers";

export default function SupervisorHome() {
  const router = useRouter();
  const { users, loading } = useUsers("mine");

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
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push({
              pathname: '/(supervisor)/employee/[id]',
              params: {
                id: item.id,
                name: `${item.firstName} ${item.lastName}`
              }
            })}
          >
            <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.role}>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
    color: "#000000",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },

  role: {
    fontSize: 16,
    color: "#1E3A8A", // tummansininen korostus
    marginTop: 8,
    fontWeight: "500",
  },
});