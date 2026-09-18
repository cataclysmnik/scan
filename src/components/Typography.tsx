import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { typography } from '../theme/typography';

interface TypographyProps extends TextProps {
  variant?: keyof typeof typography;
  color?: string; // override color
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color,
  style,
  children,
  ...props
}) => {
  const { themeColors } = useTheme();

  return (
    <Text
      style={[
        typography[variant],
        { color: color || themeColors.text },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
