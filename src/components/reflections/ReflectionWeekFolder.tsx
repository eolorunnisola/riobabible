import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReflectionCard } from './ReflectionCard';
import { WeeklyReflectionCard } from './WeeklyReflectionCard';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/context/ThemeContext';
import { SavedReflection, WeeklyFaithReflection } from '@/src/types';
import { formatWeekFolderLabel } from '@/src/utils/weekKey';

type Props = {
  weekKey: string;
  items: SavedReflection[];
  weeklyEntry?: WeeklyFaithReflection;
  onOpenWeekly: () => void;
  onOpenItem: (item: SavedReflection) => void;
  onUnsaveItem: (id: string) => void;
  defaultExpanded?: boolean;
  showWeeklyReflection?: boolean;
};

export function ReflectionWeekFolder({
  weekKey,
  items,
  weeklyEntry,
  onOpenWeekly,
  onOpenItem,
  onUnsaveItem,
  defaultExpanded = true,
  showWeeklyReflection = true,
}: Props) {
  const { colors, spacing } = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        style={({ pressed }) => [
          styles.folderHeader,
          {
            paddingVertical: spacing.sm,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
      >
        <Ionicons
          name={expanded ? 'chevron-down' : 'chevron-forward'}
          size={18}
          color={colors.textSecondary}
        />
        <Text variant="h3" style={{ flex: 1, marginLeft: spacing.xs }}>
          {formatWeekFolderLabel(weekKey)}
        </Text>
        <Text variant="caption" color="muted">
          {items.length} saved
        </Text>
      </Pressable>

      {expanded ? (
        <View style={{ paddingTop: spacing.xs }}>
          {showWeeklyReflection && weeklyEntry ? (
            <WeeklyReflectionCard entry={weeklyEntry} onPress={onOpenWeekly} />
          ) : null}
          {items.map((item) => (
            <ReflectionCard
              key={item.id}
              item={item}
              onPress={() => onOpenItem(item)}
              onUnsave={() => onUnsaveItem(item.id)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  folderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
