import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileText } from './ProfileText';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number | string;
};

export function StatCard({ icon, label, value }: Props) {
  const { colors, radius, spacing, shadows } = useProfileTheme();

  return (
    <View
      style={[
        styles.card,
        shadows.card,
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          borderColor: colors.borderSubtle,
          padding: spacing.md,
          flex: 1,
        },
      ]}
    >
      <Ionicons name={icon} size={22} color={colors.primary} />
      <ProfileText variant="h2" style={{ marginTop: spacing.sm }}>
        {value}
      </ProfileText>
      <ProfileText variant="caption" tone="secondary" style={{ marginTop: spacing.xxs }}>
        {label}
      </ProfileText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: 100,
  },
});
