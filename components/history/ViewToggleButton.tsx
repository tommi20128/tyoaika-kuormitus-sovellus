// components/history/ViewToggle.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface Props {
  value: 'week' | 'month';
  onChange: (val: 'week' | 'month') => void;
}

// Tämä komponentti näyttää toggle-napit Viikko/Kuukausi
// Käytetään historiasivulla.
export default function ViewToggleButton({ value, onChange }: Props) {
  return (
    <View style={styles.toggleContainer}>
      <Pressable
        style={[styles.toggleButton, value === 'week' && styles.activeToggle]}
        onPress={() => onChange('week')}
      >
        <Text>Viikko</Text>
      </Pressable>

      <Pressable
        style={[styles.toggleButton, value === 'month' && styles.activeToggle]}
        onPress={() => onChange('month')}
      >
        <Text>Kuukausi</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FFFFFF",
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    borderColor: "black",
    borderWidth: 0.2,
  },
  activeToggle: {
    backgroundColor: "#1E3A8A",

  }
});
