import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

export default function TabsLayout() {

  const handleLogout = () => {
    // Tähän myöhemmin kirjautuminen ulos
    router.replace('/indexe'); // Menee kirjautumissivulle, tarviiko jotain erityistä?
  };

  return (
    <Tabs
      screenOptions={{ headerShown: true,
      headerRight: () => (
        <Pressable
        onPress={handleLogout}
        style={{marginRight: 16}}
        >
          <Ionicons name="log-out-outline" size={32} color="red" />
        </Pressable>
      )
       }}
    >
      <Tabs.Screen
        name="index"
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
