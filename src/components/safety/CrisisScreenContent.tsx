import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useTheme } from '@/src/context/ThemeContext';

const RESOURCES = [
  { label: 'Call or text 988 (US Suicide & Crisis Lifeline)', action: 'tel:988' },
  { label: 'Text HOME to 741741 (Crisis Text Line)', action: 'sms:741741&body=HOME' },
  { label: 'Call emergency services: 911', action: 'tel:911' },
];

type Props = {
  onDismiss?: () => void;
};

export function CrisisScreenContent({ onDismiss }: Props) {
  const { colors, spacing, radius } = useTheme();

  return (
    <Screen scroll padded>
      <View style={[styles.hero, { backgroundColor: colors.dangerSurface, borderRadius: radius.xl, padding: spacing.xl }]}>
        <Ionicons name="shield-checkmark" size={48} color={colors.danger} />
        <Text variant="h1" style={{ marginTop: spacing.md, color: colors.danger }}>
          You deserve immediate help
        </Text>
        <Text variant="body" color="secondary" style={{ marginTop: spacing.sm }}>
          What you shared suggests you may be in serious danger. This app cannot provide emergency
          care. Please reach out to trained crisis support right now.
        </Text>
      </View>

      <Text variant="h3" style={{ marginTop: spacing.xl }}>
        Crisis resources
      </Text>
      {RESOURCES.map((r) => (
        <Pressable
          key={r.action}
          onPress={() => void Linking.openURL(r.action)}
          style={[
            styles.resource,
            {
              borderColor: colors.danger,
              borderRadius: radius.lg,
              padding: spacing.md,
              marginTop: spacing.sm,
            },
          ]}
        >
          <Ionicons name="call" size={20} color={colors.danger} />
          <Text variant="body" style={{ flex: 1, marginLeft: spacing.sm, color: colors.danger }}>
            {r.label}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.danger} />
        </Pressable>
      ))}

      <Text variant="caption" color="muted" style={{ marginTop: spacing.xl }}>
        If you are outside the US, contact your local emergency number or a trusted pastor,
        counselor, or hospital.
      </Text>

      {onDismiss ? (
        <Button
          label="Return to app"
          variant="secondary"
          onPress={onDismiss}
          fullWidth
          style={{ marginTop: spacing.xl }}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center' },
  resource: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
  },
});
