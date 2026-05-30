import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProfileText } from '@/src/components/profile/ProfileText';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';

export function DevotionalPremiumGate() {
  const { colors, spacing, radius } = useProfileTheme();

  return (
    <View
      style={[
        styles.card,
        {
          marginTop: spacing.lg,
          padding: spacing.lg,
          borderRadius: radius.lg,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
      ]}
    >
      <View style={styles.row}>
        <Ionicons name="lock-closed-outline" size={24} color={colors.textMuted} />
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <ProfileText variant="h3">Devotional plans are Premium</ProfileText>
          <ProfileText variant="bodySmall" tone="secondary" style={{ marginTop: spacing.xxs, lineHeight: 22 }}>
            Multi-day Scripture journeys for anxiety, forgiveness, grief, and more. Start your free
            trial to unlock the full library.
          </ProfileText>
        </View>
      </View>
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
        <ProfileText variant="button" style={{ color: '#FFFFFF', textAlign: 'center' }}>
          Start free trial
        </ProfileText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  card: { borderWidth: StyleSheet.hairlineWidth },
  cta: { paddingVertical: 14, paddingHorizontal: 16 },
});
