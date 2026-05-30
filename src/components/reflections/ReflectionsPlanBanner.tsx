import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/ui/Card';
import { Text } from '@/src/components/ui/Text';
import { FREE_TIER_LIMITS } from '@/src/constants/subscription';
import { countBillableReflections } from '@/src/utils/subscriptionGates';
import { useApp } from '@/src/context/AppContext';
import { useSubscription } from '@/src/context/SubscriptionContext';
import { useTheme } from '@/src/context/ThemeContext';

export function ReflectionsPlanBanner() {
  const { colors, spacing, radius } = useTheme();
  const { reflections } = useApp();
  const { isPremium } = useSubscription();

  if (isPremium) return null;

  const used = countBillableReflections(reflections);
  const limit = FREE_TIER_LIMITS.savedReflectionsLimit;
  const atLimit = used >= limit;

  return (
    <Card
      style={{
        marginBottom: spacing.md,
        borderColor: atLimit ? colors.primary : colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <View style={styles.row}>
        <Ionicons
          name={atLimit ? 'lock-closed-outline' : 'bookmark-outline'}
          size={20}
          color={atLimit ? colors.primary : colors.textMuted}
        />
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text variant="bodySmall" color="secondary" style={{ lineHeight: 22 }}>
            {atLimit
              ? `You've saved ${limit} items — the free plan limit. Upgrade to save more, unlock weekly faith reflections, and choose any color theme.`
              : `${used} of ${limit} saves used on the free plan. Weekly faith reflections require Premium.`}
          </Text>
        </View>
      </View>
      {atLimit ? (
        <Pressable
          onPress={() => router.push('/profile/paywall')}
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
          <Text variant="button" style={{ color: '#12100E', textAlign: 'center' }}>
            Upgrade to Premium
          </Text>
        </Pressable>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  cta: { paddingVertical: 12, paddingHorizontal: 16 },
});
