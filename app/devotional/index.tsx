import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { InfoScreen } from '@/src/components/profile/InfoScreen';
import { ProfileText } from '@/src/components/profile/ProfileText';
import { DevotionalPremiumGate } from '@/src/components/devotional/DevotionalPremiumGate';
import { useApp } from '@/src/context/AppContext';
import { useSubscription } from '@/src/context/SubscriptionContext';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';
import { DEVOTIONAL_PLANS } from '@/src/data/devotionalPlans';
import type { DevotionalPlan } from '@/src/types';

function progressLabel(plan: DevotionalPlan, completedCount: number): string {
  if (completedCount >= plan.days.length) return 'Complete';
  if (completedCount === 0) return `${plan.days.length} days`;
  return `${completedCount} / ${plan.days.length} days`;
}

export default function DevotionalLibraryScreen() {
  const { isPremium } = useSubscription();
  const { getPlanProgress } = useApp();
  const { colors, spacing, radius } = useProfileTheme();

  return (
    <InfoScreen
      title="Devotional plans"
      subtitle="Multi-day Scripture journeys for seasons of growth, struggle, and healing."
    >
      {!isPremium ? (
        <DevotionalPremiumGate />
      ) : (
        <View style={{ gap: spacing.md }}>
          {DEVOTIONAL_PLANS.map((plan) => {
            const progress = getPlanProgress(plan.id);
            const completedCount = progress?.completedDays.length ?? 0;
            const iconName = plan.icon as keyof typeof Ionicons.glyphMap;

            return (
              <Pressable
                key={plan.id}
                onPress={() => {
                  void Haptics.selectionAsync();
                  router.push({
                    pathname: '/devotional/[planId]',
                    params: { planId: plan.id },
                  });
                }}
                style={({ pressed }) => [
                  styles.card,
                  {
                    padding: spacing.md,
                    borderRadius: radius.lg,
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    opacity: pressed ? 0.88 : 1,
                  },
                ]}
              >
                <View style={styles.cardRow}>
                  <View
                    style={[
                      styles.iconWrap,
                      {
                        backgroundColor: colors.primary + '22',
                        borderRadius: radius.md,
                      },
                    ]}
                  >
                    <Ionicons name={iconName} size={24} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <ProfileText variant="h3">{plan.title}</ProfileText>
                    <ProfileText variant="bodySmall" tone="secondary" style={{ marginTop: 4 }}>
                      {plan.subtitle}
                    </ProfileText>
                    <ProfileText variant="caption" tone="muted" style={{ marginTop: spacing.xs }}>
                      {plan.theme}
                    </ProfileText>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </View>
                <View
                  style={[
                    styles.pill,
                    {
                      marginTop: spacing.sm,
                      alignSelf: 'flex-start',
                      backgroundColor: colors.primary + '18',
                      borderRadius: radius.full,
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 4,
                    },
                  ]}
                >
                  <ProfileText variant="caption" style={{ color: colors.primary }}>
                    {progressLabel(plan, completedCount)}
                  </ProfileText>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </InfoScreen>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: StyleSheet.hairlineWidth },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {},
});
