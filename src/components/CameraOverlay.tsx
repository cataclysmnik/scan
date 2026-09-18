import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export const CameraOverlay: React.FC = () => {
  const { themeColors } = useTheme();

  return (
    <View style={styles.overlayContainer} pointerEvents="none">
      <View style={[styles.frame, { borderColor: themeColors.primary }]} />
      {/* Corner accents for the Nothing aesthetic */}
      <View style={[styles.corner, styles.topLeft, { borderColor: themeColors.primary }]} />
      <View style={[styles.corner, styles.topRight, { borderColor: themeColors.primary }]} />
      <View style={[styles.corner, styles.bottomLeft, { borderColor: themeColors.primary }]} />
      <View style={[styles.corner, styles.bottomRight, { borderColor: themeColors.primary }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  frame: {
    width: '100%',
    height: '70%',
    borderWidth: 1.5,
    borderRadius: 24,
    borderStyle: 'dashed',
    opacity: 0.3,
  },
  corner: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 24,
  },
  topLeft: {
    top: '15%',
    left: 24,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: '15%',
    right: 24,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: '15%',
    left: 24,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: '15%',
    right: 24,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
});
