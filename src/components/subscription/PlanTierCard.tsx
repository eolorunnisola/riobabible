import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileText } from '@/src/components/profile/ProfileText';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';

type Props = {
  title: string;
  subtitle?: string;
  active: boolean;
  badge?: string;
  /** Upsell hint — shown on Premium when the user is on the free plan. */
  recommended?: boolean;
  children?: ReactNode;
  style?: { marginBottom?: number };
};

/** Single plan tier — active state uses primary accent; inactive is muted. */
export function PlanTierCard({ title, subtitle, active, badge, recommended, children, style }: Props) {
  const { colors, spacing, radius } = useProfileTheme();
  const upsell = recommended && !active;

  return (
    <View
      style={[
        styles.card,
        {
          padding: spacing.md,
          borderRadius: radius.lg,
          borderColor: active ? colors.primary : upsell ? colors.warning : colors.borderSubtle,
          backgroundColor: active
            ? colors.primary + '1A'
            : upsell
              ? colors.warning + '14'
              : colors.surface + '88',
          borderWidth: active || upsell ? 2 : StyleSheet.hairlineWidth,
          opacity: active ? 1 : upsell ? 0.92 : 0.72,
          marginBottom: style?.marginBottom ?? spacing.sm,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <ProfileText
            variant="h3"
            style={{ color: active ? colors.primary : upsell ? colors.text : colors.textSecondary }}
          >
            {title}
          </ProfileText>
          {subtitle ? (
            <ProfileText
              variant="caption"
              tone={active ? 'secondary' : 'muted'}
              style={{ marginTop: spacing.xxs, lineHeight: 18 }}
            >
              {subtitle}
            </ProfileText>
          ) : null}
        </View>
        <View style={styles.badges}>
          {upsell ? (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: colors.warning + '33',
                  borderRadius: radius.full,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 3,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                },
              ]}
            >
              <Ionicons name="star" size={12} color={colors.warning} />
              <ProfileText variant="caption" style={{ color: colors.warning, fontWeight: '700' }}>
                Recommended
              </ProfileText>
            </View>
          ) : null}
          {badge ? (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: active ? colors.primary + '33' : colors.borderSubtle,
                  borderRadius: radius.full,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 3,
                },
              ]}
            >
              <ProfileText
                variant="caption"
                style={{
                  color: active ? colors.primary : colors.textMuted,
                  fontWeight: '600',
                }}
              >
                {badge}
              </ProfileText>
            </View>
          ) : null}
        </View>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {},
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  badges: { alignItems: 'flex-end', gap: 6 },
  badge: {},
});
