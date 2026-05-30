import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { useApp } from '@/src/context/AppContext';
import { useSubscription } from '@/src/context/SubscriptionContext';
import { useToast } from '@/src/context/ToastContext';
import { useTheme } from '@/src/context/ThemeContext';
import { buildWeeklyReflectionTemplate, groupReflectionsByWeek } from '@/src/utils/weeklyReflection';
import { formatWeekFolderLabel } from '@/src/utils/weekKey';

export default function WeeklyFaithReflectionScreen() {
  const { weekKey: weekKeyParam } = useLocalSearchParams<{ weekKey: string }>();
  const weekKey = typeof weekKeyParam === 'string' ? weekKeyParam : '';
  const { colors, spacing } = useTheme();
  const { showToast } = useToast();
  const { isPremium } = useSubscription();
  const { reflections, getWeeklyFaithReflection, updateWeeklyFaithReflection } = useApp();

  const weekItems =
    groupReflectionsByWeek(reflections).find((w) => w.weekKey === weekKey)?.items ?? [];

  const existing = weekKey ? getWeeklyFaithReflection(weekKey) : undefined;

  const [body, setBody] = useState('');

  useEffect(() => {
    if (!isPremium) {
      router.replace('/profile/paywall');
    }
  }, [isPremium]);

  useEffect(() => {
    if (!weekKey) return;
    if (existing) {
      setBody(existing.body);
      return;
    }
    setBody(buildWeeklyReflectionTemplate(weekKey, weekItems));
  }, [weekKey, existing, weekItems]);

  if (!isPremium) {
    return (
      <Screen>
        <Text variant="body" color="secondary">
          Weekly faith reflections are available with Premium.
        </Text>
      </Screen>
    );
  }

  if (!weekKey) {
    return (
      <Screen>
        <Text variant="body" color="secondary">
          Invalid week.
        </Text>
      </Screen>
    );
  }

  const handleSave = () => {
    const trimmed = body.trim();
    if (!trimmed) {
      showToast('Write something before saving');
      return;
    }
    updateWeeklyFaithReflection(weekKey, trimmed);
    showToast('Weekly reflection saved');
    router.back();
  };

  return (
    <Screen padded={false} edges={['top', 'bottom']}>
      <View style={[styles.topBar, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </Pressable>
        <Text variant="h3" style={{ flex: 1, textAlign: 'center' }}>
          Weekly faith reflection
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xxxl }}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="caption" color="muted">
          {formatWeekFolderLabel(weekKey)}
        </Text>
        <Text variant="bodySmall" color="secondary" style={{ marginTop: spacing.xs }}>
          This note is created automatically for each week. Edit it as you reflect on what you
          saved.
        </Text>
        <Input
          value={body}
          onChangeText={setBody}
          multiline
          scrollEnabled
          textAlignVertical="top"
          placeholder="Write your weekly reflection…"
          style={[styles.editor, { marginTop: spacing.md, minHeight: 320 }]}
        />
        <Button label="Save reflection" onPress={handleSave} fullWidth style={{ marginTop: spacing.lg }} />
      </KeyboardAwareScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center' },
  editor: { width: '100%' },
});
