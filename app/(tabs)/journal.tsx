import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog';
import { JournalEntryCard } from '@/src/components/journal/JournalEntryCard';
import { JournalLockedBanner } from '@/src/components/journal/JournalLockedBanner';
import { useApp } from '@/src/context/AppContext';
import { useSubscription } from '@/src/context/SubscriptionContext';
import { useToast } from '@/src/context/ToastContext';
import { useTheme } from '@/src/context/ThemeContext';
import { FREE_TIER_LIMITS } from '@/src/constants/subscription';
import { JournalEntry } from '@/src/types';
import { useMemo, useState } from 'react';

export default function JournalScreen() {
  const { journalEntries, deleteJournalEntry } = useApp();
  const { isPremium } = useSubscription();
  const { showToast } = useToast();
  const { spacing, colors, shadows } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const [pendingDelete, setPendingDelete] = useState<JournalEntry | null>(null);

  const { visibleEntries, lockedCount } = useMemo(() => {
    const sorted = [...journalEntries].sort((a, b) => b.updatedAt - a.updatedAt);
    if (isPremium) {
      return { visibleEntries: sorted, lockedCount: 0 };
    }
    const cutoff = Date.now() - FREE_TIER_LIMITS.journalHistoryDays * 86_400_000;
    const visible = sorted.filter((e) => e.updatedAt >= cutoff);
    return { visibleEntries: visible, lockedCount: sorted.length - visible.length };
  }, [journalEntries, isPremium]);

  return (
    <Screen padded={false} edges={['top']} style={styles.flex}>
      <ConfirmDialog
        visible={pendingDelete !== null}
        title="Delete this entry?"
        message="This journal entry will be permanently removed."
        highlight={pendingDelete?.title}
        confirmLabel="Delete entry"
        cancelLabel="Keep entry"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteJournalEntry(pendingDelete.id);
          setPendingDelete(null);
          showToast('Journal entry deleted');
        }}
      />
      <View style={[styles.header, { padding: spacing.md }]}>
        <Text variant="h1">Journal</Text>
        <Text variant="bodySmall" color="secondary">
          Write or speak what's on your heart.
        </Text>
        {!isPremium ? (
          <Text variant="caption" color="muted" style={{ marginTop: spacing.xs }}>
            Free plan includes the last {FREE_TIER_LIMITS.journalHistoryDays} days of entries.
          </Text>
        ) : null}
      </View>

      <View style={styles.list}>
        {visibleEntries.length === 0 && lockedCount === 0 ? (
          <View style={[styles.empty, { padding: spacing.xl }]}>
            <Ionicons name="journal-outline" size={48} color={colors.textMuted} />
            <Text variant="h3" style={{ marginTop: spacing.md, textAlign: 'center' }}>
              Start your first entry
            </Text>
            <Text variant="body" color="secondary" style={{ marginTop: spacing.sm, textAlign: 'center' }}>
              Tap the button below to start writing.
            </Text>
          </View>
        ) : (
          <FlashList
            data={visibleEntries}
            keyExtractor={(item) => item.id}
            ListFooterComponent={
              <View style={{ paddingHorizontal: spacing.md }}>
                <JournalLockedBanner lockedCount={lockedCount} />
              </View>
            }
            renderItem={({ item }) => (
              <View style={{ paddingHorizontal: spacing.md }}>
                <JournalEntryCard
                  entry={item}
                  onPress={() => router.push({ pathname: '/journal/[id]', params: { id: item.id } })}
                  onDelete={() => setPendingDelete(item)}
                />
              </View>
            )}
            contentContainerStyle={{ paddingBottom: tabBarHeight + spacing.xxxl }}
          />
        )}
      </View>

      <Pressable
        onPress={() => router.push('/journal/new')}
        accessibilityLabel="New journal entry"
        style={({ pressed }) => [
          styles.fab,
          {
            bottom: tabBarHeight + spacing.md,
            right: spacing.lg,
            backgroundColor: colors.primary,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
          shadows.soft,
        ]}
      >
        <Ionicons name="add" size={30} color="#12100E" />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {},
  list: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
