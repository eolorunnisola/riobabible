import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/ui/Card';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/context/ThemeContext';
import { WeeklyFaithReflection } from '@/src/types';
import { formatWeekFolderLabel } from '@/src/utils/weekKey';

type Props = {
  entry: WeeklyFaithReflection;
  onPress: () => void;
};

export function WeeklyReflectionCard({ entry, onPress }: Props) {
  const { colors, spacing } = useTheme();
  const preview = entry.body.trim().split('\n').find((line) => line.trim().length > 0) ?? '';

  return (
    <Card onPress={onPress} style={{ marginBottom: spacing.sm, borderColor: colors.primary }}>
      <View style={styles.header}>
        <Ionicons name="document-text-outline" size={20} color={colors.primary} />
        <Text variant="caption" color="primary" style={{ marginLeft: spacing.xs }}>
          Weekly faith reflection
        </Text>
      </View>
      <Text variant="h3" style={{ marginTop: spacing.sm }}>
        {formatWeekFolderLabel(entry.weekKey)}
      </Text>
      <Text
        variant="bodySmall"
        color="secondary"
        numberOfLines={2}
        style={{ marginTop: spacing.xs, lineHeight: 22 }}
      >
        {preview}
      </Text>
      <View style={[styles.footer, { marginTop: spacing.sm }]}>
        <Text variant="caption" color="primary">
          Tap to read and edit
        </Text>
        <Ionicons name="chevron-forward" size={14} color={colors.primary} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
