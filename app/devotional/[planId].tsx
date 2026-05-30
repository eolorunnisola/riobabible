import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { InfoScreen } from '@/src/components/profile/InfoScreen';
import { ProfileText } from '@/src/components/profile/ProfileText';
import { DevotionalPremiumGate } from '@/src/components/devotional/DevotionalPremiumGate';
import { useApp } from '@/src/context/AppContext';
import { useSubscription } from '@/src/context/SubscriptionContext';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';
import { getDevotionalPlan } from '@/src/data/devotionalPlans';

export default function DevotionalPlanOverviewScreen() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { isPremium } = useSubscription();
  const { getPlanProgress } = useApp();
  const { colors, spacing, radius } = useProfileTheme();

  const plan = planId ? getDevotionalPlan(planId) : undefined;
  const progress = plan ? getPlanProgress(plan.id) : undefined;
  const completedDays = progress?.completedDays ?? [];

  const progressSummary = useMemo(() => {
    if (!plan) return '';
    const done = completedDays.length;
    if (done >= plan.days.length) return 'Plan complete';
    if (done === 0) return 'Not started';
    return `${done} of ${plan.days.length} days complete`;
  }, [plan, completedDays.length]);

  if (!plan) {
    return (
      <InfoScreen title="Plan not found">
        <ProfileText variant="body" tone="secondary">
          This devotional plan could not be found.
        </ProfileText>
      </InfoScreen>
    );
  }

  if (!isPremium) {
    return (
      <InfoScreen title={plan.title} subtitle={plan.subtitle}>
        <DevotionalPremiumGate />
      </InfoScreen>
    );
  }

  return (
    <InfoScreen title={plan.title} subtitle={plan.subtitle}>
      <ProfileText variant="caption" tone="muted" style={{ marginBottom: spacing.md }}>
        {progressSummary}
      </ProfileText>

      <View style={{ gap: spacing.xs }}>
        {plan.days.map((day) => {
          const done = completedDays.includes(day.day);
          return (
            <Pressable
              key={day.day}
              onPress={() => {
                void Haptics.selectionAsync();
                router.push({
                  pathname: '/devotional/[planId]/day/[day]',
                  params: { planId: plan.id, day: String(day.day) },
                });
              }}
              style={({ pressed }) => [
                styles.dayRow,
                {
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.sm,
                  borderRadius: radius.md,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
            >
              <View style={styles.dayRowInner}>
                <View
                  style={[
                    styles.dayBadge,
                    {
                      backgroundColor: done ? colors.primary + '33' : colors.borderSubtle,
                      borderRadius: radius.sm,
                    },
                  ]}
                >
                  <ProfileText variant="label" style={{ color: done ? colors.primary : colors.textMuted }}>
                    {day.day}
                  </ProfileText>
                </View>
                <ProfileText variant="body" style={{ flex: 1, marginLeft: spacing.md }}>
                  {day.title}
                </ProfileText>
                <Ionicons
                  name={done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={done ? colors.primary : colors.textMuted}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </InfoScreen>
  );
}

const styles = StyleSheet.create({
  dayRow: { borderWidth: StyleSheet.hairlineWidth },
  dayRowInner: { flexDirection: 'row', alignItems: 'center' },
  dayBadge: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
