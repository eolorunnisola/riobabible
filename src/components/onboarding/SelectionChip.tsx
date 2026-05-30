import { Pressable, StyleSheet } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/context/ThemeContext';

type Props = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
};

export function SelectionChip({ label, description, selected, onPress }: Props) {
  const { colors, radius, spacing, shadows } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primary + '22' : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
          borderRadius: radius.lg,
          padding: spacing.md,
          marginBottom: spacing.sm,
          opacity: pressed ? 0.9 : 1,
        },
        shadows.soft,
      ]}
    >
      <Text variant="h3" style={{ color: selected ? colors.primary : colors.text }}>
        {label}
      </Text>
      {description ? (
        <Text variant="bodySmall" color="secondary" style={{ marginTop: spacing.xxs }}>
          {description}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { borderWidth: 1.5 },
});
