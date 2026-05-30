import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { InfoScreen, InfoParagraph, InfoSection } from '@/src/components/profile/InfoScreen';
import { ProfileText } from '@/src/components/profile/ProfileText';
import { DevotionalPremiumGate } from '@/src/components/devotional/DevotionalPremiumGate';
import { useApp } from '@/src/context/AppContext';
import { useSubscription } from '@/src/context/SubscriptionContext';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';
import { useToast } from '@/src/context/ToastContext';
import { getDevotionalPlan } from '@/src/data/devotionalPlans';
import { retrieveVerses } from '@/src/services/bible/lookup';
import type { BibleVerse } from '@/src/types';

function VerseBlock({ verses, references }: { verses: BibleVerse[]; references: string[] }) {
  const { colors, spacing, radius } = useProfileTheme();

  if (verses.length === 0) {
    return (
      <View
        style={[
          styles.verseCard,
          {
            padding: spacing.md,
            borderRadius: radius.md,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      >
        {references.map((ref) => (
          <ProfileText key={ref} variant="body" style={{ fontStyle: 'italic' }}>
            {ref}
          </ProfileText>
        ))}
      </View>
    );
  }

  return (
    <View style={{ gap: spacing.md }}>
      {verses.map((verse) => (
        <View
          key={verse.reference}
          style={[
            styles.verseCard,
            {
              padding: spacing.md,
              borderRadius: radius.md,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <ProfileText variant="label" tone="muted">
            {verse.reference}
          </ProfileText>
          <ProfileText variant="body" style={{ marginTop: spacing.sm, lineHeight: 26, fontStyle: 'italic' }}>
            {verse.text}
          </ProfileText>
        </View>
      ))}
    </View>
  );
}

export default function DevotionalDayReaderScreen() {
  const { planId, day: dayParam } = useLocalSearchParams<{ planId: string; day: string }>();
  const { isPremium } = useSubscription();
  const { preferences, getPlanProgress, toggleDayComplete } = useApp();
  const { showToast } = useToast();
  const { colors, spacing, radius } = useProfileTheme();

  const plan = planId ? getDevotionalPlan(planId) : undefined;
  const dayNum = dayParam ? parseInt(dayParam, 10) : NaN;
  const dayContent = plan?.days.find((d) => d.day === dayNum);
  const progress = plan ? getPlanProgress(plan.id) : undefined;
  const isDayComplete = progress?.completedDays.includes(dayNum) ?? false;

  const { verses } = useMemo(() => {
    if (!dayContent) return { verses: [] as BibleVerse[] };
    return retrieveVerses(dayContent.verseReferences, preferences.translation);
  }, [dayContent, preferences.translation]);

  if (!plan || !dayContent || Number.isNaN(dayNum)) {
    return (
      <InfoScreen title="Day not found">
        <ProfileText variant="body" tone="secondary">
          This reading could not be found.
        </ProfileText>
      </InfoScreen>
    );
  }

  if (!isPremium) {
    return (
      <InfoScreen title={`Day ${dayNum}`}>
        <DevotionalPremiumGate />
      </InfoScreen>
    );
  }

  const totalDays = plan.days.length;
  const hasPrev = dayNum > 1;
  const hasNext = dayNum < totalDays;
  const reflectionParagraphs = dayContent.reflection.split('\n\n');

  const handleToggleComplete = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    toggleDayComplete(plan.id, dayNum, totalDays);
    showToast(isDayComplete ? 'Day marked incomplete' : 'Day marked complete');
  };

  return (
    <InfoScreen title={`Day ${dayNum}`} subtitle={dayContent.title}>
      <InfoSection title="Scripture">
        <VerseBlock verses={verses} references={dayContent.verseReferences} />
      </InfoSection>

      <InfoSection title="Reflection">
        {reflectionParagraphs.map((paragraph, index) => (
          <InfoParagraph key={index}>{paragraph}</InfoParagraph>
        ))}
      </InfoSection>

      <InfoSection title="Prayer">
        <InfoParagraph>{dayContent.prayer}</InfoParagraph>
      </InfoSection>

      {dayContent.practice ? (
        <InfoSection title="Practice">
          <InfoParagraph>{dayContent.practice}</InfoParagraph>
        </InfoSection>
      ) : null}

      <Pressable
        onPress={handleToggleComplete}
        style={({ pressed }) => [
          styles.primaryBtn,
          {
            marginTop: spacing.md,
            backgroundColor: isDayComplete ? colors.surface : colors.primary,
            borderRadius: radius.md,
            borderWidth: isDayComplete ? StyleSheet.hairlineWidth : 0,
            borderColor: colors.border,
            opacity: pressed ? 0.88 : 1,
          },
        ]}
      >
        <ProfileText
          variant="button"
          style={{ color: isDayComplete ? colors.text : '#FFFFFF', textAlign: 'center' }}
        >
          {isDayComplete ? 'Completed ✓' : 'Mark today complete'}
        </ProfileText>
      </Pressable>

      <View style={[styles.navRow, { marginTop: spacing.lg, gap: spacing.sm }]}>
        <Pressable
          disabled={!hasPrev}
          onPress={() => {
            if (!hasPrev) return;
            void Haptics.selectionAsync();
            router.replace({
              pathname: '/devotional/[planId]/day/[day]',
              params: { planId: plan.id, day: String(dayNum - 1) },
            });
          }}
          style={({ pressed }) => [
            styles.navBtn,
            {
              flex: 1,
              borderRadius: radius.md,
              borderColor: colors.border,
              backgroundColor: colors.surface,
              opacity: !hasPrev ? 0.4 : pressed ? 0.88 : 1,
            },
          ]}
        >
          <ProfileText variant="body" style={{ textAlign: 'center' }}>
            Previous
          </ProfileText>
        </Pressable>
        <Pressable
          disabled={!hasNext}
          onPress={() => {
            if (!hasNext) return;
            void Haptics.selectionAsync();
            router.replace({
              pathname: '/devotional/[planId]/day/[day]',
              params: { planId: plan.id, day: String(dayNum + 1) },
            });
          }}
          style={({ pressed }) => [
            styles.navBtn,
            {
              flex: 1,
              borderRadius: radius.md,
              borderColor: colors.border,
              backgroundColor: colors.surface,
              opacity: !hasNext ? 0.4 : pressed ? 0.88 : 1,
            },
          ]}
        >
          <ProfileText variant="body" style={{ textAlign: 'center' }}>
            Next day
          </ProfileText>
        </Pressable>
      </View>
    </InfoScreen>
  );
}

const styles = StyleSheet.create({
  verseCard: { borderWidth: StyleSheet.hairlineWidth },
  primaryBtn: { paddingVertical: 14, paddingHorizontal: 16 },
  navRow: { flexDirection: 'row' },
  navBtn: {
    paddingVertical: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
