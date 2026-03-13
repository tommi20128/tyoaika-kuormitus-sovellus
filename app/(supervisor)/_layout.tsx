// app/(supervisor)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, Tabs, } from "expo-router";
import { Pressable } from "react-native";

interface EmployeeRouteParams {
  id: string;
  name?: string; // nimi tulee valinnaisesti mainpagelta
}

export default function SupervisorTabs() {
   const handleLogout = () => {
      // Tähän myöhemmin kirjautuminen ulos
      router.replace('/'); // Menee kirjautumissivulle, tarviiko jotain erityistä?
    };

  return (
    <Tabs
      screenOptions={{ headerShown: true,
      headerRight: () => (
        <Pressable
        onPress={handleLogout}
        style={{marginRight: 16}}
        >
          <Ionicons name="log-out-outline" size={32} color="red" />
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
      <Tabs.Screen
        name="employee/[id]"
        options={({ route }) => {
          const params = route.params as EmployeeRouteParams | undefined;
          return {
            title: params?.name ? `${params.name} Historia` : "Historia",
            href: null,
          };
        }}
      />
      <Tabs.Screen
        name="add-employee"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
