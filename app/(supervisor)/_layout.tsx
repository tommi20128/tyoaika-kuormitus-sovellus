// app/(supervisor)/_layout.tsx

import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SupervisorLayout() {
  return (
     <SafeAreaView style={{ flex: 1 }}>
    <Stack >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="employee/[id]"
        options={({ route }) => ({
          title: (route.params as EmployeeRouteParams)?.name || "Työntekijä",
        })} />
      <Stack.Screen name="add-employee"
        options={() => ({
          title:"Lisää",
        })} />
      <Stack.Screen
        name="edit-employee/[id]"
        options={({ route }) => ({
          title: (route.params as EmployeeRouteParams)?.name || "Muokkaa",
        })} />
    </Stack>
    </SafeAreaView>
  );
}


interface EmployeeRouteParams {
  id: string;
  name?: string; // nimi tulee valinnaisesti mainpagelta
}

