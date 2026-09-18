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
  let textColor = themeColors.background;
  let borderColor = themeColors.primary;

  if (variant === 'secondary') {
    backgroundColor = themeColors.surface;
    textColor = themeColors.text;
    borderColor = themeColors.surface;
  } else if (variant === 'outline') {
    backgroundColor = 'transparent';
    textColor = themeColors.text;
    borderColor = themeColors.border;
  } else if (variant === 'ghost') {
    backgroundColor = 'transparent';
    textColor = themeColors.text;
    borderColor = 'transparent';
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
          borderWidth: layout.borderWidth,
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
    borderRadius: layout.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
