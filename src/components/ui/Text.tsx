import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { typography } from '@/src/theme/typography';

type Variant = keyof typeof typography;

type Props = RNTextProps & {
  variant?: Variant;
  color?: 'primary' | 'secondary' | 'muted' | 'inverse' | 'danger';
};

export function Text({ variant = 'body', color, style, ...props }: Props) {
  const { colors } = useTheme();
  const colorMap = {
    primary: colors.text,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    inverse: colors.background,
    danger: colors.danger,
  };

  return (
    <RNText
      style={[
        typography[variant],
        color ? { color: colorMap[color] } : { color: colors.text },
        style,
      ]}
      {...props}
    />
  );
}
