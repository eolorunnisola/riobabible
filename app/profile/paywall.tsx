import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  InfoBullet,
  InfoParagraph,
  InfoScreen,
  InfoSection,
} from '@/src/components/profile/InfoScreen';
import { LegalLinks } from '@/src/components/subscription/LegalLinks';
import { ProfileText } from '@/src/components/profile/ProfileText';
import { PREMIUM_FEATURES, PREMIUM_TRIAL_DAYS, useSubscription } from '@/src/context/SubscriptionContext';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';
import { useToast } from '@/src/context/ToastContext';
import { SUBSCRIPTION_PRICE_LABEL } from '@/src/utils/subscriptionLinks';

export default function PaywallScreen() {
  const { colors, spacing, radius } = useProfileTheme();
  const { showToast } = useToast();
  const { monthlyPackage, purchasePremium, restore, isPremium } = useSubscription();
  const [loading, setLoading] = useState<'purchase' | 'restore' | null>(null);

  const priceLabel = monthlyPackage?.priceString ?? SUBSCRIPTION_PRICE_LABEL;

  const handlePurchase = async () => {
    setLoading('purchase');
    try {
      const ok = await purchasePremium();
      if (ok) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showToast('Premium activated');
        router.back();
      } else {
        showToast('Purchase could not be completed');
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Purchase failed');
    } finally {
      setLoading(null);
    }
  };

  const handleRestore = async () => {
    setLoading('restore');
    try {
      const ok = await restore();
      showToast(ok ? 'Purchases restored' : 'No active subscription found');
      if (ok) router.back();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Restore failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <InfoScreen
      title="Rioba Premium"
      subtitle="Scripture-centered guidance without limits."
    >
      <InfoSection>
        {PREMIUM_FEATURES.map((feature) => (
          <View
            key={feature.title}
            style={[styles.featureRow, { marginBottom: spacing.md, gap: spacing.sm }]}
          >
            <Ionicons name={feature.icon as keyof typeof Ionicons.glyphMap} size={22} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <ProfileText variant="h3">{feature.title}</ProfileText>
              <ProfileText variant="bodySmall" tone="secondary" style={{ marginTop: 2 }}>
                {feature.description}
              </ProfileText>
            </View>
          </View>
        ))}
      </InfoSection>

      <InfoSection title={`${PREMIUM_TRIAL_DAYS}-day free trial`}>
        <InfoParagraph>
          Try Premium free for {PREMIUM_TRIAL_DAYS} days, then {priceLabel}. Payment is charged to your
          Apple ID or Google Play account. Your subscription automatically renews unless you cancel at
          least 24 hours before the end of the current period.
        </InfoParagraph>
        <InfoBullet>
          Cancel anytime in your device subscription settings (Settings → Apple ID → Subscriptions on
          iOS, or Play Store → Payments & subscriptions on Android).
        </InfoBullet>
      </InfoSection>

      <View
        style={[
          styles.priceBox,
          {
            padding: spacing.md,
            borderRadius: radius.lg,
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <ProfileText variant="h2" style={{ textAlign: 'center' }}>
          {priceLabel}
        </ProfileText>
        <ProfileText variant="caption" tone="muted" style={{ textAlign: 'center', marginTop: spacing.xs }}>
          after {PREMIUM_TRIAL_DAYS}-day free trial · auto-renews monthly
        </ProfileText>
      </View>

      <Pressable
        onPress={handlePurchase}
        disabled={loading !== null || isPremium}
        style={({ pressed }) => [
          styles.primaryBtn,
          {
            marginTop: spacing.lg,
            backgroundColor: colors.primary,
            borderRadius: radius.lg,
            opacity: loading || isPremium ? 0.6 : pressed ? 0.88 : 1,
          },
        ]}
      >
        {loading === 'purchase' ? (
          <ActivityIndicator color="#12100E" />
        ) : (
          <ProfileText variant="button" style={{ color: '#12100E', textAlign: 'center' }}>
            {isPremium ? 'You have Premium' : 'Start free trial'}
          </ProfileText>
        )}
      </Pressable>

      <ProfileText variant="caption" tone="muted" style={{ marginTop: spacing.sm, textAlign: 'center' }}>
        {priceLabel} after trial · renews automatically unless cancelled
      </ProfileText>

      <LegalLinks />

      <Pressable
        onPress={handleRestore}
        disabled={loading !== null}
        style={({ pressed }) => [
          styles.secondaryBtn,
          {
            marginTop: spacing.lg,
            borderColor: colors.border,
            borderRadius: radius.lg,
            opacity: loading ? 0.6 : pressed ? 0.85 : 1,
          },
        ]}
      >
        {loading === 'restore' ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <ProfileText variant="button" style={{ color: colors.primary, textAlign: 'center' }}>
            Restore Purchases
          </ProfileText>
        )}
      </Pressable>
    </InfoScreen>
  );
}

const styles = StyleSheet.create({
  featureRow: { flexDirection: 'row', alignItems: 'flex-start' },
  priceBox: { borderWidth: StyleSheet.hairlineWidth },
  primaryBtn: { paddingVertical: 14, alignItems: 'center' },
  secondaryBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
  },
});
