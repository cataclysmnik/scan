import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';

export default function HomeScreen() {
  const { themeColors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Typography variant="h1">SCN_DRV</Typography>
        <Typography variant="body" color={themeColors.textSecondary}>System Active</Typography>
      </View>

      <View style={styles.actionContainer}>
        <Button 
          title="[ INIT_SCAN ]" 
          onPress={() => console.log('Scan')} 
          variant="primary" 
        />
      </View>

      <Card style={styles.recentCard}>
        <Typography variant="h3" style={styles.cardTitle}>Recent Documents</Typography>
        <Typography variant="body" color={themeColors.textSecondary}>No documents found.</Typography>
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
  header: {
    marginBottom: spacing.xl,
  },
  actionContainer: {
    marginBottom: spacing.xl,
  },
  recentCard: {
    flex: 1,
  },
  cardTitle: {
    marginBottom: spacing.md,
  },
});
