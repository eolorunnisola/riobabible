import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card } from '@/src/components/ui/Card';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/context/ThemeContext';
import { SavedReflection } from '@/src/types';

type Props = {
  item: SavedReflection;
  onPress?: () => void;
  onUnsave: () => void;
};

const typeIcon = {
  journal: 'book-outline' as const,
  response: 'chatbubble-ellipses-outline' as const,
  verse: 'bookmark-outline' as const,
  prayer: 'heart-outline' as const,
};

export function ReflectionCard({ item, onPress, onUnsave }: Props) {
  const { colors, spacing } = useTheme();

  const handleUnsave = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onUnsave();
  };

  return (
    <Card onPress={onPress} style={{ marginBottom: spacing.md }}>
      <View style={styles.header}>
        <Ionicons name={typeIcon[item.type]} size={20} color={colors.primary} />
        <Text variant="caption" color="muted" style={{ marginLeft: spacing.xs }}>
          {item.date}
        </Text>
        <Pressable
          onPress={handleUnsave}
          hitSlop={12}
          style={{ marginLeft: 'auto' }}
          accessibilityLabel="Remove from reflections"
        >
          <Ionicons name="bookmark" size={22} color={colors.primary} />
        </Pressable>
      </View>
      <Text variant="h3" style={{ marginTop: spacing.sm }}>
        {item.title}
      </Text>
      <Text variant="bodySmall" color="secondary" style={{ marginTop: spacing.xs, lineHeight: 22 }}>
        {item.preview}
      </Text>
      <Text variant="caption" color="primary" style={{ marginTop: spacing.sm }}>
        Tap to read full text
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center' },
});
