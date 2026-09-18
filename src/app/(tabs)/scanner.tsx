import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../../components/Typography';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';

export default function ScannerScreen() {
  const { themeColors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.viewfinder}>
        <Typography variant="h2" color={themeColors.textSecondary}>[ CAMERA_VIEW ]</Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinder: {
    width: '100%',
    height: '70%',
    borderWidth: 2,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
