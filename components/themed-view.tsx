// app/components/themed-view.tsx
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

interface ThemedViewProps extends ViewProps {
  children?: React.ReactNode;
}

export const ThemedView: React.FC<ThemedViewProps> = ({ children, style, ...props }) => {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? DarkTheme.colors.background : DefaultTheme.colors.background;

  return (
    <View style={[{ backgroundColor }, styles.container, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
