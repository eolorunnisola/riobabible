import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/context/ThemeContext';
import { ChatSession } from '@/src/types';
import { formatChatDate } from '@/src/utils/chatTitle';

type Props = {
  session: ChatSession;
  active: boolean;
  onPress: () => void;
  onDelete?: () => void;
};

export function ChatSessionRow({ session, active, onPress, onDelete }: Props) {
  const { colors, radius, spacing } = useTheme();

  const preview =
    [...session.messages]
      .reverse()
      .find((m) => m.role === 'user' && m.content.trim())?.content ??
    [...session.messages]
      .reverse()
      .find((m) => m.role === 'assistant' && m.content.trim())?.content ??
    'No messages yet';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: active ? colors.accent + '55' : colors.card,
          borderRadius: radius.lg,
          borderColor: active ? colors.primary : colors.borderSubtle,
          padding: spacing.md,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.main}>
        <Text variant="h3" numberOfLines={1}>
          {session.title}
        </Text>
        <Text variant="bodySmall" color="secondary" numberOfLines={2} style={{ marginTop: spacing.xs }}>
          {preview}
        </Text>
        <Text variant="caption" color="muted" style={{ marginTop: spacing.xs }}>
          {formatChatDate(session.updatedAt)}
        </Text>
      </View>
      {onDelete ? (
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          hitSlop={10}
          accessibilityLabel="Delete conversation"
          style={{ padding: spacing.xs }}
        >
          <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  main: { flex: 1, minWidth: 0 },
});
