// components/history/PeriodNavigator.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface Props {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  disableNext?: boolean;
  disablePrev?: boolean;
}

// Tämä komponentti näyttää navigointipainikkeet ja labelin viikko- ja kuukausinäkymissä History-sivulla.

export default function PeriodNavigator({
  label,
  onPrev,
  onNext,
  disableNext = false,
  disablePrev = false,
}: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, disablePrev && styles.disabled]}
        onPress={onPrev}
        disabled={disablePrev}
      >
        <Text style={styles.buttonText}>◀</Text>
      </Pressable>

      <Text style={styles.label}>{label}</Text>

      <Pressable
        style={[
          styles.button, disableNext && styles.disabled]}
        onPress={onNext}
        disabled={disableNext}
      >
        <Text style={styles.buttonText}>▶</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    padding: 16,
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
