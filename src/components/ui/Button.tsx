import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '@/src/context/ThemeContext';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  fullWidth,
}: Props) {
  const { colors, radius, spacing, shadows } = useTheme();

  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
        ? colors.accent
        : variant === 'danger'
          ? colors.danger
          : 'transparent';

  const textColor =
    variant === 'ghost' ? colors.primary : variant === 'secondary' ? colors.text : '#FFFFFF';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg,
          borderRadius: radius.lg,
          paddingVertical: spacing.sm + 2,
          paddingHorizontal: spacing.lg,
          opacity: disabled ? 0.5 : pressed ? 0.88 : 1,
          width: fullWidth ? '100%' : undefined,
          borderWidth: variant === 'ghost' ? 1.5 : 0,
          borderColor: colors.primary,
        },
        variant === 'primary' && shadows.soft,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text variant="button" style={{ color: textColor, textAlign: 'center' }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
});
