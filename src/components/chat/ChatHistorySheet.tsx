import { useCallback, useMemo, useState, type ComponentProps, type RefObject } from 'react';
import { View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import type { default as BottomSheetType } from '@gorhom/bottom-sheet';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog';
import { ChatSessionRow } from './ChatSessionRow';
import { useApp } from '@/src/context/AppContext';
import { useTheme } from '@/src/context/ThemeContext';
import { ChatSession } from '@/src/types';

type Props = {
  sheetRef: RefObject<BottomSheetType | null>;
  onClose: () => void;
  onNewChatStarted?: () => boolean;
};

export function ChatHistorySheet({ sheetRef, onClose, onNewChatStarted }: Props) {
  const { colors, spacing } = useTheme();
  const {
    conversations,
    activeConversationId,
    selectConversation,
    deleteConversation,
    canStartNewChat,
  } = useApp();
  const [pendingDelete, setPendingDelete] = useState<ChatSession | null>(null);
  const snapPoints = useMemo(() => ['55%', '85%'], []);

  const sorted = useMemo(
    () => [...conversations].sort((a, b) => b.updatedAt - a.updatedAt),
    [conversations],
  );

  const renderBackdrop = useCallback(
    (props: ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.55} />
    ),
    [],
  );

  const handleSelect = (session: ChatSession) => {
    selectConversation(session.id);
    onClose();
  };

  const handleNew = () => {
    const started = onNewChatStarted?.() ?? false;
    if (started) onClose();
  };

  const handleConfirmDelete = useCallback(() => {
    if (!pendingDelete) return;
    deleteConversation(pendingDelete.id);
    setPendingDelete(null);
  }, [pendingDelete, deleteConversation]);

  return (
    <>
    <ConfirmDialog
      visible={pendingDelete !== null}
      title="Delete this conversation?"
      message="All messages in this thread will be removed permanently. This cannot be undone."
      highlight={pendingDelete?.title}
      confirmLabel="Delete conversation"
      cancelLabel="Keep conversation"
      onCancel={() => setPendingDelete(null)}
      onConfirm={handleConfirmDelete}
    />
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
    >
      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.sm }}>
        <Text variant="h2">Past conversations</Text>
        <Text variant="bodySmall" color="secondary" style={{ marginTop: spacing.xs }}>
          Pick up where you left off or start fresh.
        </Text>
        <Button
          label="New conversation"
          onPress={handleNew}
          disabled={!canStartNewChat}
          fullWidth
          style={{ marginTop: spacing.md }}
        />
        {!canStartNewChat ? (
          <Text variant="caption" color="muted" style={{ marginTop: spacing.xs, textAlign: 'center' }}>
            Send a message in your current chat before starting another.
          </Text>
        ) : null}
      </View>
      <BottomSheetFlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}
        ListEmptyComponent={
          <Text variant="body" color="secondary" style={{ textAlign: 'center', marginTop: spacing.xl }}>
            No conversations yet. Tap “New conversation” to begin.
          </Text>
        }
        renderItem={({ item }) => (
          <ChatSessionRow
            session={item}
            active={item.id === activeConversationId}
            onPress={() => handleSelect(item)}
            onDelete={() => setPendingDelete(item)}
          />
        )}
      />
    </BottomSheet>
    </>
  );
}
