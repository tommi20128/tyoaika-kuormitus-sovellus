// app/(supervisor)/_layout.tsx

import { Stack } from "expo-router";

export default function SupervisorLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="employee/[id]" />
      <Stack.Screen name="add-employee" />
      <Stack.Screen name="edit-employee/[id]" />
    </Stack>
  );
}

//Tätä ei nykyisellä toteutuksella käytetä. Mietitään halutaanko hakea nimi.
interface EmployeeRouteParams {
  id: string;
  name?: string; // nimi tulee valinnaisesti mainpagelta
}

