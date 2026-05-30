import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { router } from 'expo-router';
import { ChatInputDock } from '@/src/components/chat/ChatInputDock';
import { useKeyboardState } from 'react-native-keyboard-controller';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { DisclaimerBanner } from '@/src/components/ui/DisclaimerBanner';
import { ChatBubble } from '@/src/components/chat/ChatBubble';
import { TypingIndicator } from '@/src/components/chat/TypingIndicator';
import { ChatInputBar } from '@/src/components/chat/ChatInputBar';
import { ChatHistorySheet } from '@/src/components/chat/ChatHistorySheet';
import { NewConversationBanner } from '@/src/components/chat/NewConversationBanner';
import { useApp } from '@/src/context/AppContext';
import { useToast } from '@/src/context/ToastContext';
import { useTheme } from '@/src/context/ThemeContext';
import { detectCrisisContent } from '@/src/data/mock';
import { ChatMessage } from '@/src/types';
import {
  CrisisDetectedError,
  GuidanceGenerationError,
  generateGuidance,
} from '@/src/services/guidance/generateGuidance';
import { detectOffTopicContent } from '@/src/services/guidance/detectOffTopic';
import {
  OFF_TOPIC_ASSISTANT_MESSAGE,
  OffTopicPromptError,
} from '@/src/services/guidance/offTopic';
import { isGeminiConfigured } from '@/src/services/gemini/config';
import { UpgradePrompt } from '@/src/components/subscription/UpgradePrompt';
import { useSubscription } from '@/src/context/SubscriptionContext';

function isUserMessage(item: ChatMessage) {
  return item.role === 'user';
}

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Peace to you. When you are ready, share what you are carrying — I will offer Scripture-centered reflection, prayer, and a gentle next step.',
  timestamp: 0,
};

export default function ChatScreen() {
  const { colors, spacing } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const keyboardHeight = useKeyboardState((state) => state.height);
  const {
    messages,
    activeConversationId,
    addMessage,
    updateMessage,
    preferences,
    saveGuidance,
    createNewChat,
    canStartNewChat,
  } = useApp();
  const [loading, setLoading] = useState(false);
  const [showNewChatBanner, setShowNewChatBanner] = useState(false);
  const listRef = useRef<FlashListRef<ChatMessage>>(null);
  const historySheetRef = useRef<BottomSheet>(null);
  const { showToast } = useToast();
  const { chatLimitReached, recordChatUsed, isPremium, remainingChats } = useSubscription();

  const data = messages.length ? messages : [WELCOME];
  const isFreshThread = messages.length === 0;

  const indicateNewConversation = useCallback(() => {
    if (!createNewChat()) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      showToast('Send a message in this chat before starting a new one');
      return false;
    }
    setShowNewChatBanner(true);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast('New conversation started');
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
    return true;
  }, [createNewChat, showToast]);

  useEffect(() => {
    if (!showNewChatBanner) return;
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [showNewChatBanner, activeConversationId]);

  const listFooterHeight =
    keyboardHeight > 0 ? keyboardHeight + spacing.xl : spacing.lg;

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages, listFooterHeight]);

  const openGuidance = useCallback((guidanceId: string) => {
    router.push({ pathname: '/response/[id]', params: { id: guidanceId } });
  }, []);

  const openHistory = useCallback(() => {
    historySheetRef.current?.expand();
  }, []);

  const handleSubmit = useCallback(
    async (text: string) => {
      if (detectCrisisContent(text)) {
        router.push('/crisis');
        return;
      }

      if (detectOffTopicContent(text)) {
        addMessage({ role: 'user', content: text });
        addMessage({ role: 'assistant', content: OFF_TOPIC_ASSISTANT_MESSAGE });
        requestAnimationFrame(() => {
          listRef.current?.scrollToEnd({ animated: true });
        });
        return;
      }

      if (chatLimitReached) {
        router.push('/profile/paywall');
        return;
      }

      addMessage({ role: 'user', content: text });
      const skeletonId = addMessage({
        role: 'assistant',
        content: '',
        loading: true,
      });
      setLoading(true);

      try {
        const guidance = await generateGuidance(text, preferences);
        saveGuidance(guidance);
        recordChatUsed();

        updateMessage(skeletonId, {
          content: guidance.empathy,
          loading: false,
          guidanceId: guidance.id,
        });

        requestAnimationFrame(() => {
          router.push({ pathname: '/response/[id]', params: { id: guidance.id } });
        });
      } catch (err) {
        if (err instanceof CrisisDetectedError) {
          updateMessage(skeletonId, { content: '', loading: false });
          router.push('/crisis');
          return;
        }

        if (err instanceof OffTopicPromptError) {
          updateMessage(skeletonId, {
            content: err.userMessage,
            loading: false,
          });
          return;
        }

        const message =
          err instanceof GuidanceGenerationError
            ? err.message
            : 'Something went wrong preparing your guidance. Please try again.';

        updateMessage(skeletonId, {
          content: message,
          loading: false,
        });

        if (!isGeminiConfigured()) {
          Alert.alert(
            'Gemini API key needed',
            'Add EXPO_PUBLIC_GEMINI_API_KEY to a .env file in the project root, then restart Expo with: npx expo start --clear',
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [addMessage, updateMessage, preferences, saveGuidance, chatLimitReached, recordChatUsed],
  );

  return (
    <Screen padded={false} edges={['top']} keyboard={false}>
        <View style={styles.flex}>
          <View
            style={[
              styles.header,
              { paddingHorizontal: spacing.md, paddingTop: spacing.sm, zIndex: 50 },
            ]}
          >
            <View style={styles.titleRow}>
              <View style={styles.titleMain}>
                <DisclaimerBanner
                  compact
                  headerSlot={<Text variant="h2">Guidance</Text>}
                />
              </View>
              <View style={[styles.headerActions, { gap: spacing.xs }]}>
                <Pressable
                  onPress={openHistory}
                  hitSlop={10}
                  accessibilityLabel="Past conversations"
                  style={({ pressed }) => [
                    styles.iconBtn,
                    { backgroundColor: colors.accent + '99', opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <Ionicons name="time-outline" size={22} color={colors.textSecondary} />
                </Pressable>
                <Pressable
                  onPress={indicateNewConversation}
                  hitSlop={10}
                  accessibilityLabel="New conversation"
                  accessibilityHint={
                    canStartNewChat
                      ? undefined
                      : 'Send a message in this chat before starting a new one'
                  }
                  style={({ pressed }) => [
                    styles.iconBtn,
                    showNewChatBanner && styles.iconBtnActive,
                    {
                      backgroundColor: showNewChatBanner ? colors.primary : colors.accent + '99',
                      opacity: !canStartNewChat ? 0.55 : pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <Ionicons
                    name="create-outline"
                    size={22}
                    color={showNewChatBanner ? '#FFFFFF' : colors.primary}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          <NewConversationBanner
            visible={showNewChatBanner}
            onDismiss={() => setShowNewChatBanner(false)}
          />

          <View style={styles.listWrap}>
            <FlashList
              style={styles.list}
              key={activeConversationId}
              ref={listRef}
              data={data}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              extraData={`${activeConversationId}-${showNewChatBanner}-${chatLimitReached}`}
              ListHeaderComponent={
                <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.sm }}>
                  {chatLimitReached ? <UpgradePrompt /> : null}
                  {!chatLimitReached && !isPremium && remainingChats <= 1 ? (
                    <Text variant="caption" color="muted" style={{ textAlign: 'center', marginBottom: spacing.xs }}>
                      {remainingChats} free chat{remainingChats === 1 ? '' : 's'} left today
                    </Text>
                  ) : null}
                  {isFreshThread && !showNewChatBanner ? (
                    <Text variant="caption" color="muted" style={{ textAlign: 'center' }}>
                      Fresh thread — your messages will appear here
                    </Text>
                  ) : null}
                </View>
              }
              renderItem={({ item }) => (
                <View style={{ paddingHorizontal: spacing.md }}>
                  {item.loading ? (
                    <TypingIndicator />
                  ) : (
                    <ChatBubble
                      message={item}
                      onOpenGuidance={openGuidance}
                      highlighted={
                        showNewChatBanner &&
                        !isUserMessage(item) &&
                        (item.id === 'welcome' || (isFreshThread && item.role === 'assistant'))
                      }
                    />
                  )}
                </View>
              )}
              contentContainerStyle={{ paddingTop: spacing.xs }}
              ListFooterComponent={<View style={{ height: listFooterHeight }} />}
              onContentSizeChange={() => {
                if (showNewChatBanner) {
                  listRef.current?.scrollToOffset({ offset: 0, animated: false });
                  return;
                }
                listRef.current?.scrollToEnd({ animated: true });
              }}
            />
          </View>

          <ChatInputDock
            tabBarHeight={tabBarHeight}
            style={[
              styles.inputDock,
              {
                backgroundColor: colors.background,
                borderTopColor: colors.borderSubtle,
              },
            ]}
          >
            <ChatInputBar onSubmit={handleSubmit} loading={loading} />
          </ChatInputDock>
        </View>

      <ChatHistorySheet
        sheetRef={historySheetRef}
        onClose={() => historySheetRef.current?.close()}
        onNewChatStarted={indicateNewConversation}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { gap: 8, overflow: 'visible' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  titleMain: { flex: 1, minWidth: 0 },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 2,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    shadowColor: '#9B6A6C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 4,
  },
  listWrap: { flex: 1, minHeight: 0 },
  list: { flex: 1 },
  inputDock: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
