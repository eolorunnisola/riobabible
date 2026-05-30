import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/context/ThemeContext';
import { ChatMessage } from '@/src/types';

type Props = {
  message: ChatMessage;
  onOpenGuidance?: (guidanceId: string) => void;
  highlighted?: boolean;
};

export function ChatBubble({ message, onOpenGuidance, highlighted }: Props) {
  const { colors, radius, spacing } = useTheme();
  const isUser = message.role === 'user';
  const canOpen =
    !isUser &&
    Boolean(message.guidanceId) &&
    Boolean(message.content) &&
    !message.loading;

  const bubble = (
    <View
      style={[
        styles.bubble,
        {
          backgroundColor: isUser ? colors.userBubble : colors.assistantBubble,
          borderRadius: radius.lg,
          borderBottomRightRadius: isUser ? radius.sm : radius.lg,
          borderBottomLeftRadius: isUser ? radius.lg : radius.sm,
          maxWidth: '85%',
          padding: spacing.md,
        },
        !isUser && {
          borderWidth: highlighted ? 2 : StyleSheet.hairlineWidth,
          borderColor: highlighted ? colors.primary : colors.borderSubtle,
        },
        highlighted && !isUser && {
          backgroundColor: colors.accent + 'CC',
        },
      ]}
    >
      <Text variant="body" style={{ color: isUser ? '#FFFFFF' : colors.text }}>
        {message.content}
      </Text>
      {canOpen ? (
        <View style={[styles.openRow, { marginTop: spacing.sm, gap: spacing.xs }]}>
          <Text variant="caption" style={{ color: colors.primary }}>
            View full guidance
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </View>
      ) : null}
    </View>
  );

  return (
    <View
      style={[
        styles.row,
        { marginBottom: spacing.sm, alignItems: isUser ? 'flex-end' : 'flex-start' },
      ]}
    >
      {canOpen ? (
        <Pressable
          onPress={() => onOpenGuidance?.(message.guidanceId!)}
          accessibilityRole="button"
          accessibilityLabel="View full guidance response"
          style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}
        >
          {bubble}
        </Pressable>
      ) : (
        bubble
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { width: '100%' },
  bubble: {},
  openRow: { flexDirection: 'row', alignItems: 'center' },
});
