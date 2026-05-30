import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/ui/Card';
import { Text } from '@/src/components/ui/Text';
import { FREE_TIER_LIMITS } from '@/src/constants/subscription';
import { useTheme } from '@/src/context/ThemeContext';

type Props = {
  lockedCount: number;
};

export function JournalLockedBanner({ lockedCount }: Props) {
  const { colors, spacing, radius } = useTheme();

  if (lockedCount <= 0) return null;

  return (
    <Card
      style={{
        marginTop: spacing.md,
        marginBottom: spacing.md,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <View style={styles.row}>
        <Ionicons name="lock-closed-outline" size={22} color={colors.textMuted} />
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text variant="h3">Older entries</Text>
          <Text variant="bodySmall" color="secondary" style={{ marginTop: spacing.xxs }}>
            {lockedCount} entr{lockedCount === 1 ? 'y' : 'ies'} from before the last{' '}
            {FREE_TIER_LIMITS.journalHistoryDays} days are available with Premium.
          </Text>
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
        <Text variant="button" style={{ color: '#FFFFFF', textAlign: 'center' }}>
          Unlock full journal history
        </Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  cta: { paddingVertical: 12, paddingHorizontal: 16 },
});
