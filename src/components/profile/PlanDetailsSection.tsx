import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ProfileText } from './ProfileText';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';
import { useSubscription } from '@/src/context/SubscriptionContext';
import { APP_NAME } from '@/src/constants/app';
import { FREE_TIER_LIMITS, PREMIUM_TRIAL_DAYS } from '@/src/constants/subscription';
import { PREMIUM_FEATURES } from '@/src/context/SubscriptionContext';
import { COLOR_THEME_OPTIONS } from '@/src/theme/colorThemes';

const FREE_INCLUDES = [
  `Daily encouragement (verse, prayer, and reflection)`,
  `${FREE_TIER_LIMITS.dailyChatLimit} Scripture-centered guidance chats per day`,
  `Journal — create entries anytime; browse the last ${FREE_TIER_LIMITS.journalHistoryDays} days`,
  `Save up to ${FREE_TIER_LIMITS.savedReflectionsLimit} verses, prayers, or guidance responses total`,
  `${COLOR_THEME_OPTIONS.find((t) => t.id === FREE_TIER_LIMITS.freeColorTheme)?.label ?? 'Sage Mist'} app color theme only`,
  'Crisis support resources',
] as const;

export function PlanDetailsSection() {
  const { colors, spacing, radius } = useProfileTheme();
  const { isPremium, trialActive } = useSubscription();

  return (
    <View style={{ marginTop: spacing.lg }}>
      <ProfileText variant="label" tone="muted">
        What&apos;s included
      </ProfileText>
      <ProfileText variant="caption" tone="secondary" style={{ marginTop: spacing.xxs, lineHeight: 20 }}>
        {APP_NAME} is free to use with optional Premium. Subscriptions are billed through the App Store
        or Google Play.
      </ProfileText>

      <View
        style={[
          styles.card,
          {
            marginTop: spacing.md,
            padding: spacing.md,
            borderRadius: radius.lg,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <ProfileText variant="h3">Free</ProfileText>
        <ProfileText variant="caption" tone="muted" style={{ marginTop: spacing.xxs }}>
          Always available — no credit card required
        </ProfileText>
        {FREE_INCLUDES.map((line) => (
          <PlanBullet key={line} text={line} />
        ))}
      </View>

      <View
        style={[
          styles.card,
          {
            marginTop: spacing.sm,
            padding: spacing.md,
            borderRadius: radius.lg,
            borderColor: isPremium || trialActive ? colors.primary : colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <View style={styles.premiumHeader}>
          <ProfileText variant="h3">Premium</ProfileText>
          {(isPremium || trialActive) && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: colors.primary + '22',
                  borderRadius: radius.full,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 2,
                },
              ]}
            >
              <ProfileText variant="caption" style={{ color: colors.primary }}>
                {trialActive ? 'Trial active' : 'Your plan'}
              </ProfileText>
            </View>
          )}
        </View>
        <ProfileText variant="caption" tone="muted" style={{ marginTop: spacing.xxs }}>
          {PREMIUM_TRIAL_DAYS}-day free trial, then monthly subscription · cancel anytime in your device
          settings
        </ProfileText>
        {PREMIUM_FEATURES.map((feature) => (
          <PlanBullet key={feature.title} text={`${feature.title} — ${feature.description}`} />
        ))}
        <PlanBullet text="Unlimited saved verses, prayers, and guidance" />
        <PlanBullet text="Everything in the Free plan" />
      </View>

      {!isPremium && !trialActive ? (
        <Pressable
          onPress={() => {
            void Haptics.selectionAsync();
            router.push('/profile/paywall');
          }}
          style={({ pressed }) => [
            styles.cta,
            {
              marginTop: spacing.md,
              backgroundColor: colors.primary,
              borderRadius: radius.md,
              opacity: pressed ? 0.88 : 1,
            },
          ]}
        >
          <ProfileText variant="button" style={{ color: '#12100E', textAlign: 'center' }}>
            Start {PREMIUM_TRIAL_DAYS}-day free trial
          </ProfileText>
        </Pressable>
      ) : null}
    </View>
  );
}

function PlanBullet({ text }: { text: string }) {
  const { colors, spacing } = useProfileTheme();
  return (
    <View style={[styles.bulletRow, { marginTop: spacing.sm }]}>
      <Ionicons name="checkmark-circle" size={16} color={colors.primary} style={{ marginTop: 2 }} />
      <ProfileText variant="bodySmall" tone="secondary" style={{ flex: 1, marginLeft: spacing.sm, lineHeight: 22 }}>
        {text}
      </ProfileText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: StyleSheet.hairlineWidth },
  premiumHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  badge: {},
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start' },
  cta: { paddingVertical: 14, paddingHorizontal: 16 },
});
