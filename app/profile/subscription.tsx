import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  InfoParagraph,
  InfoScreen,
  InfoSection,
} from '@/src/components/profile/InfoScreen';
import { LegalLinks } from '@/src/components/subscription/LegalLinks';
import { PlanTierCard } from '@/src/components/subscription/PlanTierCard';
import { ProfileText } from '@/src/components/profile/ProfileText';
import { FREE_TIER_LIMITS } from '@/src/constants/subscription';
import { useSubscription } from '@/src/context/SubscriptionContext';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';
import { useToast } from '@/src/context/ToastContext';
import { openManageSubscriptions, SUBSCRIPTION_PRICE_LABEL } from '@/src/utils/subscriptionLinks';

export default function ManagePlanScreen() {
  const { colors, spacing, radius } = useProfileTheme();
  const { showToast } = useToast();
  const {
    isPremium,
    trialActive,
    daysLeftInTrial,
    restore,
    realEntitlement,
    monthlyPackage,
    trialDays,
  } = useSubscription();
  const [restoring, setRestoring] = useState(false);

  const priceLabel = monthlyPackage?.priceString ?? SUBSCRIPTION_PRICE_LABEL;
  const onFreePlan = !isPremium;

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const ok = await restore();
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast(ok ? 'Purchases restored' : 'No active subscription found');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Restore failed');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <InfoScreen title="Your plan" subtitle="Manage your Rioba subscription.">
      <InfoSection title="Compare plans">
        <PlanTierCard
          title="Free"
          subtitle="Always available — no credit card required"
          active={onFreePlan}
          badge={onFreePlan ? 'Current plan' : undefined}
        >
          <ProfileText variant="bodySmall" tone="secondary" style={{ marginTop: spacing.sm, lineHeight: 22 }}>
            {FREE_TIER_LIMITS.dailyChatLimit} guidance chats per day ·{' '}
            {FREE_TIER_LIMITS.journalHistoryDays} days of journal history · save up to{' '}
            {FREE_TIER_LIMITS.savedReflectionsLimit} reflections
          </ProfileText>
        </PlanTierCard>

        <PlanTierCard
          title="Premium"
          subtitle={`${priceLabel} after ${trialDays}-day free trial`}
          active={!onFreePlan}
          recommended={onFreePlan}
          badge={
            trialActive
              ? `Trial · ${daysLeftInTrial}d left`
              : !onFreePlan
                ? 'Current plan'
                : undefined
          }
        >
          <ProfileText variant="bodySmall" tone="secondary" style={{ marginTop: spacing.sm, lineHeight: 22 }}>
            Unlimited guidance · full journal history · devotional plans · weekly reflections ·
            all color themes
          </ProfileText>
        </PlanTierCard>
      </InfoSection>

      {onFreePlan ? (
        <>
          <Pressable
            onPress={() => router.push('/profile/paywall')}
            style={({ pressed }) => [
              styles.primaryBtn,
              {
                backgroundColor: colors.primary,
                borderRadius: radius.lg,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
          >
            <ProfileText variant="button" style={{ color: '#12100E', textAlign: 'center' }}>
              Upgrade to Premium
            </ProfileText>
          </Pressable>
          <ProfileText
            variant="caption"
            tone="muted"
            style={{ marginTop: spacing.sm, textAlign: 'center' }}
          >
            {priceLabel} after {trialDays}-day free trial · auto-renews monthly
          </ProfileText>
        </>
      ) : (
        <InfoSection title="Subscription">
          <InfoParagraph>
            Change or cancel your plan in your Apple ID or Google Play subscription settings.
          </InfoParagraph>
          {realEntitlement.productId ? (
            <ProfileText variant="caption" tone="muted" style={{ marginBottom: spacing.sm }}>
              Product: {realEntitlement.productId}
            </ProfileText>
          ) : null}
          <Pressable
            onPress={async () => {
              const opened = await openManageSubscriptions();
              if (!opened) {
                showToast('Open the App Store on your device to manage your subscription.');
              }
            }}
            style={({ pressed }) => [
              styles.secondaryBtn,
              {
                borderColor: colors.border,
                borderRadius: radius.lg,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <ProfileText variant="button" style={{ color: colors.primary, textAlign: 'center' }}>
              Manage Subscription
            </ProfileText>
          </Pressable>
        </InfoSection>
      )}

      <Pressable
        onPress={handleRestore}
        disabled={restoring}
        style={({ pressed }) => [
          styles.secondaryBtn,
          {
            marginTop: spacing.lg,
            borderColor: colors.border,
            borderRadius: radius.lg,
            opacity: restoring ? 0.6 : pressed ? 0.85 : 1,
          },
        ]}
      >
        {restoring ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <ProfileText variant="button" style={{ color: colors.primary, textAlign: 'center' }}>
            Restore Purchases
          </ProfileText>
        )}
      </Pressable>

      <LegalLinks />
    </InfoScreen>
  );
}

const styles = StyleSheet.create({
  primaryBtn: { paddingVertical: 14, alignItems: 'center' },
  secondaryBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
  },
});
