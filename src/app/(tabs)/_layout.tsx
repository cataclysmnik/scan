import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../theme/ThemeProvider';

export default function TabLayout() {
  const { themeColors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.surface,
        },
        headerTintColor: themeColors.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Scan',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="home"
        options={{
          title: 'Recent Scans',
        }}
      />
    </Stack>
  );
}
