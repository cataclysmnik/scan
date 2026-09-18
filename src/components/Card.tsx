import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, layout } from '../theme/spacing';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  const { themeColors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: themeColors.surface,
          borderRadius: layout.borderRadius,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
  },
});
