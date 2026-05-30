import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/context/ThemeContext';
import { JournalEntry } from '@/src/types';
import { formatJournalDate } from '@/src/utils/journalTitle';

type Props = {
  entry: JournalEntry;
  onPress: () => void;
  onDelete?: () => void;
};

export function JournalEntryCard({ entry, onPress, onDelete }: Props) {
  const { colors, radius, spacing } = useTheme();
  const preview = entry.body.trim().split(/\n/)[0] ?? entry.body;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          borderColor: colors.borderSubtle,
          padding: spacing.md,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: colors.accent + '99', borderRadius: radius.md }]}>
          <Ionicons name="journal-outline" size={20} color={colors.primary} />
        </View>
        <View style={styles.main}>
          <Text variant="h3" numberOfLines={1}>
            {entry.title}
          </Text>
          <Text variant="bodySmall" color="secondary" numberOfLines={2} style={{ marginTop: spacing.xs }}>
            {preview}
          </Text>
          <Text variant="caption" color="muted" style={{ marginTop: spacing.xs }}>
            {formatJournalDate(entry.updatedAt)}
          </Text>
        </View>
        {onDelete ? (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            hitSlop={10}
            accessibilityLabel="Delete journal entry"
            style={{ padding: spacing.xs }}
          >
            <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: StyleSheet.hairlineWidth, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: { flex: 1, minWidth: 0 },
});
