import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { router } from "expo-router";

export default function TabsLayout() {
  const handleLogout = () => {
    router.replace('/');
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerRight: () => (
          <Pressable
            onPress={handleLogout}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="log-out-outline" size={38} color="#1E3A8A" />
            <Text style={{ color: '#1E3A8A', fontSize: 12 }}>Kirjaudu ulos</Text>
          </Pressable>
        )
      }}
    >
      <Tabs.Screen
        name="mainpage"
        options={{ title: "Etusivu", tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="manage"
        options={{ title: "Työntekijähallinta", tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profiili", tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }}
      />
    </Tabs>
  );
}