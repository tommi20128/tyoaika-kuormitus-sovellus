// app/(supervisor)/employee/[id].tsx
import { useLocalSearchParams } from "expo-router";
import HistoryPage from "@/app/(tabs)/history";

export default function EmployeeHistoryWrapper() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Välitetään employeeId propsina HistoryPage:lle
  return <HistoryPage employeeId={id} />;
}