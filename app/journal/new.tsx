import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { JournalEditor } from '@/src/components/journal/JournalEditor';
import { Text } from '@/src/components/ui/Text';
import { useApp } from '@/src/context/AppContext';
import { useTheme } from '@/src/context/ThemeContext';
import { useToast } from '@/src/context/ToastContext';

export default function NewJournalScreen() {
  const { saveJournalEntry } = useApp();
  const { showToast } = useToast();
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar style="auto" />
      <View style={[styles.topBar, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={28} color={colors.text} />
        </Pressable>
        <Text variant="h3" style={{ flex: 1, textAlign: 'center' }}>
          New journal entry
        </Text>
        <View style={{ width: 28 }} />
      </View>
      <JournalEditor
        submitLabel="Save entry"
        onSave={({ title, body }) => {
          const id = saveJournalEntry(body, title);
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          showToast('Journal entry saved');
          router.replace({ pathname: '/journal/[id]', params: { id } });
        }}
        onCancel={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center' },
});
