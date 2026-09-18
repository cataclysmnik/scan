import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, layout } from '../theme/spacing';
import { Typography } from './Typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}) => {
  const { themeColors } = useTheme();

  let backgroundColor = themeColors.primary;
  // @ts-ignore - Adding custom property not in default type but available in our colors
  let textColor = themeColors.onPrimaryContainer || themeColors.background;
  let borderColor = 'transparent';

  if (variant === 'secondary') {
    // @ts-ignore
    backgroundColor = themeColors.primaryContainer || themeColors.surface;
    // @ts-ignore
    textColor = themeColors.onPrimaryContainer || themeColors.text;
  } else if (variant === 'outline') {
    backgroundColor = 'transparent';
    textColor = themeColors.primary;
    borderColor = themeColors.border;
  } else if (variant === 'ghost') {
    backgroundColor = 'transparent';
    textColor = themeColors.primary;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? themeColors.border : backgroundColor,
          borderColor: disabled ? themeColors.border : borderColor,
          borderWidth: variant === 'outline' ? 1 : layout.borderWidth,
          borderRadius: layout.pillRadius,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Typography variant="button" color={textColor}>
          {title}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
