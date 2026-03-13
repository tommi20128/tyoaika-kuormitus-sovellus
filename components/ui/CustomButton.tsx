// components/CustomButton.tsx
import React from 'react';
import { Button, View, StyleSheet } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
};

export default function CustomButton({ title, onPress }: Props) {
  return (
    <View style={styles.container}>
      <Button title={title} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    marginVertical: 10,
  },
});
