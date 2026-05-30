import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog';
import { JournalEditor } from '@/src/components/journal/JournalEditor';
import { Text } from '@/src/components/ui/Text';
import { useApp } from '@/src/context/AppContext';
import { useTheme } from '@/src/context/ThemeContext';
import { useToast } from '@/src/context/ToastContext';
import { formatJournalDate } from '@/src/utils/journalTitle';

export default function JournalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getJournalEntry, updateJournalEntry, deleteJournalEntry } = useApp();
  const { showToast } = useToast();
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const entry = id ? getJournalEntry(id) : undefined;
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const sortedMeta = useMemo(() => {
    if (!entry) return null;
    return formatJournalDate(entry.updatedAt);
  }, [entry]);

  if (!entry) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <Text variant="body" color="secondary" style={{ padding: spacing.md }}>
          Journal entry not found.
        </Text>
        <Pressable onPress={() => router.back()} style={{ padding: spacing.md }}>
          <Text variant="body" style={{ color: colors.primary }}>
            Go back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar style="auto" />
      <ConfirmDialog
        visible={confirmDelete}
        title="Delete this entry?"
        message="This journal entry will be permanently removed."
        highlight={entry.title}
        confirmLabel="Delete entry"
        cancelLabel="Keep entry"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteJournalEntry(entry.id);
          setConfirmDelete(false);
          showToast('Journal entry deleted');
          router.back();
        }}
      />
      <View style={[styles.topBar, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </Pressable>
        <Text variant="h3" style={{ flex: 1, textAlign: 'center' }} numberOfLines={1}>
          {editing ? 'Edit entry' : 'Journal'}
        </Text>
        <Pressable
          onPress={() => (editing ? setEditing(false) : setEditing(true))}
          hitSlop={12}
          accessibilityLabel={editing ? 'Cancel editing' : 'Edit entry'}
        >
          <Ionicons name={editing ? 'close' : 'pencil-outline'} size={24} color={colors.primary} />
        </Pressable>
      </View>

      {editing ? (
        <JournalEditor
          initialTitle={entry.title}
          initialBody={entry.body}
          submitLabel="Update entry"
          onSave={({ title, body }) => {
            updateJournalEntry(entry.id, { title, body });
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            showToast('Journal updated');
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xxxl }}
          showsVerticalScrollIndicator={false}
        >
          <Text variant="caption" color="muted">
            {sortedMeta}
          </Text>
          <Text variant="h1" style={{ marginTop: spacing.sm }}>
            {entry.title}
          </Text>
          <Text variant="body" style={{ marginTop: spacing.lg, lineHeight: 26 }}>
            {entry.body}
          </Text>
          <Pressable
            onPress={() => setConfirmDelete(true)}
            style={({ pressed }) => [
              styles.deleteBtn,
              {
                marginTop: spacing.xxl,
                borderColor: colors.danger + '88',
                backgroundColor: colors.dangerSurface,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
            <Text variant="button" style={{ color: colors.danger, marginLeft: spacing.sm }}>
              Delete entry
            </Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
});
