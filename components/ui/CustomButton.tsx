// components/ui/CustomButton.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
};

export default function CustomButton({ title, onPress }: Props) {
  return (
    <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    marginVertical: 10,
  },
  button:{
    width: "100%",
    height: 52,
    backgroundColor: "#1E3A8A", // tummansininen
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
