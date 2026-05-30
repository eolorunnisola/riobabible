import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  InfoParagraph,
  InfoScreen,
  InfoSection,
} from '@/src/components/profile/InfoScreen';
import { LegalLinks } from '@/src/components/subscription/LegalLinks';
import { ProfileText } from '@/src/components/profile/ProfileText';
import { useSubscription } from '@/src/context/SubscriptionContext';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';
import { useToast } from '@/src/context/ToastContext';
import { openManageSubscriptions } from '@/src/utils/subscriptionLinks';

export default function ManagePlanScreen() {
  const { colors, spacing, radius } = useProfileTheme();
  const { showToast } = useToast();
  const {
    isPremium,
    trialActive,
    daysLeftInTrial,
    restore,
    realEntitlement,
  } = useSubscription();
  const [restoring, setRestoring] = useState(false);

  const planLabel = trialActive
    ? `Premium trial · ${daysLeftInTrial} day${daysLeftInTrial === 1 ? '' : 's'} left`
    : isPremium
      ? 'Premium'
      : 'Free';

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
      <InfoSection title="Current plan">
        <View
          style={[
            styles.planCard,
            {
              padding: spacing.md,
              borderRadius: radius.lg,
              backgroundColor: colors.surface,
              borderColor: isPremium ? colors.primary : colors.border,
            },
          ]}
        >
          <ProfileText variant="h2">{planLabel}</ProfileText>
          {!isPremium ? (
            <ProfileText variant="bodySmall" tone="secondary" style={{ marginTop: spacing.xs }}>
              3 guidance chats per day · 7 days of journal history
            </ProfileText>
          ) : realEntitlement.productId ? (
            <ProfileText variant="caption" tone="muted" style={{ marginTop: spacing.xs }}>
              {realEntitlement.productId}
            </ProfileText>
          ) : null}
        </View>
      </InfoSection>

      {!isPremium ? (
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
      ) : null}

      {isPremium ? (
        <InfoSection title="Subscription">
          <InfoParagraph>
            Change or cancel your plan in your Apple ID or Google Play subscription settings.
          </InfoParagraph>
          <Pressable
            onPress={openManageSubscriptions}
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
      ) : null}

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
  planCard: { borderWidth: 1.5 },
  primaryBtn: { paddingVertical: 14, alignItems: 'center' },
  secondaryBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
  },
});
