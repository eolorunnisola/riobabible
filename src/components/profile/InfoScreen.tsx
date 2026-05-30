import { ReactNode } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';
import { SUPPORT_EMAIL } from '@/src/constants/app';
import { ProfileText } from './ProfileText';

export { SUPPORT_EMAIL };

type InfoScreenProps = {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  children: ReactNode;
};

export function InfoScreen({ title, subtitle, lastUpdated, children }: InfoScreenProps) {
  const { colors, spacing } = useProfileTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={[styles.topBar, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </Pressable>
        <ProfileText variant="h3" numberOfLines={1} style={{ flex: 1, textAlign: 'center' }}>
          {title}
        </ProfileText>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: insets.bottom + spacing.xxl,
        }}
      >
        {subtitle ? (
          <ProfileText variant="body" tone="secondary" style={{ lineHeight: 24 }}>
            {subtitle}
          </ProfileText>
        ) : null}
        {lastUpdated ? (
          <ProfileText variant="caption" tone="muted" style={{ marginTop: spacing.sm }}>
            Last updated {lastUpdated}
          </ProfileText>
        ) : null}
        <View style={{ marginTop: spacing.lg }}>{children}</View>
      </ScrollView>
    </View>
  );
}

type SectionProps = {
  title?: string;
  children: ReactNode;
};

export function InfoSection({ title, children }: SectionProps) {
  const { spacing } = useProfileTheme();
  return (
    <View style={{ marginBottom: spacing.xl }}>
      {title ? (
        <ProfileText variant="h3" style={{ marginBottom: spacing.sm }}>
          {title}
        </ProfileText>
      ) : null}
      {children}
    </View>
  );
}

export function InfoParagraph({ children }: { children: ReactNode }) {
  const { spacing } = useProfileTheme();
  return (
    <ProfileText
      variant="body"
      tone="secondary"
      style={{ lineHeight: 24, marginBottom: spacing.sm }}
    >
      {children}
    </ProfileText>
  );
}

export function InfoBullet({ children }: { children: ReactNode }) {
  const { colors, spacing } = useProfileTheme();
  return (
    <View style={[styles.bulletRow, { marginBottom: spacing.xs }]}>
      <View
        style={[styles.bulletDot, { backgroundColor: colors.primary, marginTop: 9 }]}
      />
      <ProfileText
        variant="body"
        tone="secondary"
        style={{ flex: 1, lineHeight: 24, marginLeft: spacing.sm }}
      >
        {children}
      </ProfileText>
    </View>
  );
}

/** Tappable row that opens the placeholder support email. */
export function ContactButton({ label = 'Email our support team' }: { label?: string }) {
  const { colors, spacing, radius } = useProfileTheme();
  return (
    <Pressable
      onPress={() => void Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
      style={({ pressed }) => [
        styles.contactBtn,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: spacing.md,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Ionicons name="mail-outline" size={20} color={colors.primary} />
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <ProfileText variant="button">{label}</ProfileText>
        <ProfileText variant="caption" tone="muted" style={{ marginTop: 2 }}>
          {SUPPORT_EMAIL}
        </ProfileText>
      </View>
      <Ionicons name="open-outline" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center' },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start' },
  bulletDot: { width: 5, height: 5, borderRadius: 2.5 },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
