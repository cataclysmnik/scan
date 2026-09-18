import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../../components/Typography';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';

export default function DocumentsScreen() {
  const { themeColors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Typography variant="h1" style={styles.title}>DOC_REPO</Typography>
      <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
      <Typography variant="body" color={themeColors.textSecondary}>Directory empty.</Typography>
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
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: spacing.lg,
  },
});
