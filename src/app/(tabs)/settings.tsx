import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';

export default function SettingsScreen() {
  const { themeColors, theme, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Typography variant="h1" style={styles.title}>SYS_CFG</Typography>
      
      <Card style={styles.settingCard}>
        <Typography variant="h3">Theme Override</Typography>
        <View style={styles.row}>
          <Typography variant="body">Dark Mode (Manual)</Typography>
          <Switch 
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: themeColors.border, true: themeColors.primary }}
            thumbColor={themeColors.background}
          />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    paddingTop: spacing.xxl,
  },
  title: {
    marginBottom: spacing.lg,
  },
  settingCard: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
});
