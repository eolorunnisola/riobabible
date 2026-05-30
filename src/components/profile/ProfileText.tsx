import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';

type Variant = keyof ReturnType<typeof useProfileTheme>['typography'];

type Props = RNTextProps & {
  variant?: Variant;
  tone?: 'primary' | 'secondary' | 'muted';
};

export function ProfileText({ variant = 'body', tone = 'primary', style, ...props }: Props) {
  const { colors, typography } = useProfileTheme();
  const toneColor =
    tone === 'secondary' ? colors.textSecondary : tone === 'muted' ? colors.textMuted : colors.text;

  return (
    <RNText style={[typography[variant], { color: toneColor }, style]} {...props} />
  );
}
