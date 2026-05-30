import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/ui/Card';
import { Text } from '@/src/components/ui/Text';
import { FREE_TIER_LIMITS } from '@/src/constants/subscription';
import { useTheme } from '@/src/context/ThemeContext';

type Props = {
  message?: string;
};

export function UpgradePrompt({
  message = `You've used your ${FREE_TIER_LIMITS.dailyChatLimit} free chats today`,
}: Props) {
  const { colors, spacing, radius } = useTheme();

  return (
    <Card
      style={{
        marginBottom: spacing.sm,
        borderColor: colors.primary,
        backgroundColor: colors.primary + '14',
      }}
    >
      <View style={styles.row}>
        <Ionicons name="star-outline" size={22} color={colors.primary} />
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text variant="h3">{message}</Text>
          <Text variant="bodySmall" color="secondary" style={{ marginTop: spacing.xxs }}>
            Upgrade for unlimited Scripture-centered guidance.
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
          Start free trial
        </Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  cta: { paddingVertical: 12, paddingHorizontal: 16 },
});
