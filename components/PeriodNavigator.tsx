// components/PeriodNavigator.tsx
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
        <Text>◀</Text>
      </Pressable>

      <Text style={styles.label}>{label}</Text>

      <Pressable
        style={[
          styles.button, disableNext && styles.disabled]}
        onPress={onNext}
        disabled={disableNext}
      >
        <Text>▶</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  button: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.3,
  },
});
