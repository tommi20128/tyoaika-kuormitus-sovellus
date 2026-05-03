// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function TabsLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return null;

  const handleLogout = () => {
    // Tähän myöhemmin kirjautuminen ulos
    router.replace('/'); // Menee kirjautumissivulle, tarviiko jotain erityistä?
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerRight: () => (
          <Pressable
            onPress={handleLogout}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="log-out-outline" size={38} color="#1E3A8A" />
            <Text style={{ color: '#1E3A8A', fontSize: 12 }}>Kirjaudu ulos</Text>
          </Pressable>
        )
      }}
    >
      <Tabs.Screen
        name="frontpage"
        options={{
          title: 'Etusivu',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-work"
        options={{
          title: 'Työaika',
          tabBarIcon: ({ color, size }) => <Ionicons name="time" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historia',
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profiili',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
