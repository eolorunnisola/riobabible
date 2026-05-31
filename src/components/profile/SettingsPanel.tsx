import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AnimatedSwitch } from './AnimatedSwitch';
import { ThemeColorPicker } from './ThemeColorPicker';
import { ProfileText } from './ProfileText';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { PlanDetailsSection } from './PlanDetailsSection';
import { APP_NAME } from '@/src/constants/app';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog';
import { useApp } from '@/src/context/AppContext';
import { useAuth } from '@/src/context/AuthContext';
import { useSubscription } from '@/src/context/SubscriptionContext';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';
import { useToast } from '@/src/context/ToastContext';
import { effectiveColorTheme } from '@/src/utils/subscriptionGates';
import {
  BibleTranslation,
  GuidanceTone,
  PrayerPreference,
} from '@/src/types';

const TRANSLATIONS: BibleTranslation[] = ['NIV', 'ESV', 'KJV', 'NLT'];
const TONES: { value: GuidanceTone; label: string }[] = [
  { value: 'gentle', label: 'Gentle' },
  { value: 'direct', label: 'Direct' },
  { value: 'encouraging', label: 'Encouraging' },
  { value: 'contemplative', label: 'Contemplative' },
];
const PRAYERS: { value: PrayerPreference; label: string }[] = [
  { value: 'short', label: 'Short' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'scripture-focused', label: 'Scripture' },
  { value: 'minimal', label: 'Minimal' },
];

const INFO_LINKS: { label: string; icon: keyof typeof Ionicons.glyphMap; route: Href }[] = [
  { label: 'Help Center', icon: 'help-circle-outline', route: '/profile/help' },
  { label: `About ${APP_NAME}`, icon: 'information-circle-outline', route: '/profile/about' },
  { label: 'Privacy Policy', icon: 'shield-checkmark-outline', route: '/profile/privacy' },
  { label: 'Terms of Service', icon: 'document-text-outline', route: '/profile/terms' },
];

type Props = {
  onClose: () => void;
};

export function SettingsPanel({ onClose }: Props) {
  const { preferences, updatePreferences } = useApp();
  const { user, firebaseRequired, signOut, deleteAccount, changePassword } = useAuth();
  const { isPremium, trialActive, daysLeftInTrial } = useSubscription();

  const planSummary = trialActive
    ? `Trial · ${daysLeftInTrial} day${daysLeftInTrial === 1 ? '' : 's'} left`
    : isPremium
      ? 'Premium'
      : 'Free';
  const { showToast } = useToast();
  const { colors, spacing, radius } = useProfileTheme();

  const [draft, setDraft] = useState(preferences);
  const [signOutVisible, setSignOutVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [changePwVisible, setChangePwVisible] = useState(false);

  useEffect(() => {
    setDraft(preferences);
  }, [preferences]);

  const isDirty = useMemo(
    () =>
      draft.translation !== preferences.translation ||
      draft.tone !== preferences.tone ||
      draft.prayerPreference !== preferences.prayerPreference ||
      draft.autoIncludePrayer !== preferences.autoIncludePrayer ||
      draft.colorTheme !== preferences.colorTheme,
    [draft, preferences],
  );

  const save = useCallback(() => {
    const nextPrefs = {
      ...draft,
      colorTheme: effectiveColorTheme(draft.colorTheme, isPremium),
    };
    updatePreferences(nextPrefs);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast('Preferences Updated');
    onClose();
  }, [draft, isPremium, onClose, showToast, updatePreferences]);

  const handleSignOut = useCallback(async () => {
    setSignOutVisible(false);
    try {
      await signOut();
      onClose();
      router.replace('/(auth)/login');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not sign out.');
    }
  }, [onClose, showToast, signOut]);

  const handleChangePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      // Errors surface inside the dialog; only close on success.
      await changePassword(currentPassword, newPassword);
      setChangePwVisible(false);
      showToast('Password updated');
    },
    [changePassword, showToast],
  );

  const handleDeleteAccount = useCallback(
    async (password: string) => {
      // Errors are surfaced inside the dialog; only close on success.
      await deleteAccount(password);
      setDeleteVisible(false);
      onClose();
      showToast('Your account has been deleted');
      router.replace('/(auth)/login');
    },
    [deleteAccount, onClose, showToast],
  );

  return (
    <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}>
      <View style={styles.handleRow}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
      </View>
      <ProfileText variant="h2">Settings</ProfileText>
      <ProfileText variant="bodySmall" tone="secondary" style={{ marginTop: spacing.xs }}>
        Adjust guidance style and prayer preferences.
      </ProfileText>

      <Animated.View entering={FadeInDown.delay(60)} style={{ marginTop: spacing.lg }}>
        <ProfileText variant="label" tone="muted">
          App color theme
        </ProfileText>
        <View style={{ marginTop: spacing.sm }}>
          <ThemeColorPicker
            value={draft.colorTheme}
            onChange={(colorTheme) => setDraft((d) => ({ ...d, colorTheme }))}
            isPremium={isPremium}
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80)} style={{ marginTop: spacing.lg }}>
        <ProfileText variant="label" tone="muted">
          Bible translation
        </ProfileText>
        <View style={[styles.chipRow, { marginTop: spacing.sm, gap: spacing.xs }]}>
          {TRANSLATIONS.map((t) => {
            const selected = draft.translation === t;
            return (
              <Pressable
                key={t}
                onPress={() => {
                  void Haptics.selectionAsync();
                  setDraft((d) => ({ ...d, translation: t }));
                }}
                style={[
                  styles.chip,
                  {
                    borderRadius: radius.md,
                    borderColor: selected ? colors.primary : colors.border,
                    backgroundColor: selected ? colors.primary + '28' : colors.surface,
                  },
                ]}
              >
                <ProfileText
                  variant="bodySmall"
                  style={{ color: selected ? colors.primary : colors.textSecondary }}
                >
                  {t}
                </ProfileText>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(140)} style={{ marginTop: spacing.lg }}>
        <ProfileText variant="label" tone="muted">
          Guidance tone
        </ProfileText>
        <View style={[styles.chipRow, { marginTop: spacing.sm, gap: spacing.xs }]}>
          {TONES.map(({ value, label }) => {
            const selected = draft.tone === value;
            return (
              <Pressable
                key={value}
                onPress={() => {
                  void Haptics.selectionAsync();
                  setDraft((d) => ({ ...d, tone: value }));
                }}
                style={[
                  styles.chip,
                  {
                    borderRadius: radius.md,
                    borderColor: selected ? colors.primary : colors.border,
                    backgroundColor: selected ? colors.primary + '28' : colors.surface,
                  },
                ]}
              >
                <ProfileText
                  variant="bodySmall"
                  style={{ color: selected ? colors.primary : colors.textSecondary }}
                >
                  {label}
                </ProfileText>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)} style={{ marginTop: spacing.lg }}>
        <ProfileText variant="label" tone="muted">
          Prayer style
        </ProfileText>
        <View style={[styles.chipRow, { marginTop: spacing.sm, gap: spacing.xs }]}>
          {PRAYERS.map(({ value, label }) => {
            const selected = draft.prayerPreference === value;
            return (
              <Pressable
                key={value}
                onPress={() => {
                  void Haptics.selectionAsync();
                  setDraft((d) => ({ ...d, prayerPreference: value }));
                }}
                style={[
                  styles.chip,
                  {
                    borderRadius: radius.md,
                    borderColor: selected ? colors.primary : colors.border,
                    backgroundColor: selected ? colors.primary + '28' : colors.surface,
                  },
                ]}
              >
                <ProfileText
                  variant="bodySmall"
                  style={{ color: selected ? colors.primary : colors.textSecondary }}
                >
                  {label}
                </ProfileText>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(260)}
        style={[
          styles.row,
          {
            marginTop: spacing.xl,
            paddingVertical: spacing.md,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.borderSubtle,
          },
        ]}
      >
        <View style={{ flex: 1, paddingRight: spacing.md }}>
          <ProfileText variant="h3">Include prayer automatically</ProfileText>
          <ProfileText variant="caption" tone="secondary" style={{ marginTop: spacing.xxs }}>
            Add a suggested prayer to each guidance response.
          </ProfileText>
        </View>
        <AnimatedSwitch
          value={draft.autoIncludePrayer}
          onValueChange={(autoIncludePrayer) => setDraft((d) => ({ ...d, autoIncludePrayer }))}
        />
      </Animated.View>

      <Pressable
        onPress={save}
        disabled={!isDirty}
        style={({ pressed }) => [
          styles.saveBtn,
          {
            marginTop: spacing.xl,
            backgroundColor: isDirty ? colors.primary : colors.surface,
            borderRadius: radius.lg,
            opacity: !isDirty ? 0.6 : pressed ? 0.88 : 1,
          },
        ]}
      >
        <ProfileText
          variant="button"
          style={{
            color: isDirty ? '#12100E' : colors.textMuted,
            textAlign: 'center',
          }}
        >
          Save preferences
        </ProfileText>
      </Pressable>

      <Pressable onPress={onClose} style={{ marginTop: spacing.md, alignItems: 'center' }}>
        <ProfileText variant="bodySmall" tone="muted">
          Cancel
        </ProfileText>
      </Pressable>

      <Animated.View
        entering={FadeInDown.delay(290)}
        style={{
          marginTop: spacing.xl,
          paddingTop: spacing.lg,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.borderSubtle,
        }}
      >
        <PlanDetailsSection />

        <ProfileText variant="label" tone="muted" style={{ marginTop: spacing.xl }}>
          Plan & support
        </ProfileText>
        <View style={{ marginTop: spacing.sm }}>
          <Pressable
            onPress={() => {
              void Haptics.selectionAsync();
              onClose();
              router.push('/devotional');
            }}
            style={({ pressed }) => [
              styles.linkRow,
              {
                paddingVertical: spacing.md,
                opacity: pressed ? 0.6 : 1,
              },
            ]}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <ProfileText variant="body">Devotional plans</ProfileText>
              <ProfileText variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                Multi-day Scripture journeys
              </ProfileText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
          <Pressable
            onPress={() => {
              void Haptics.selectionAsync();
              onClose();
              router.push('/profile/subscription');
            }}
            style={({ pressed }) => [
              styles.linkRow,
              {
                paddingVertical: spacing.md,
                opacity: pressed ? 0.6 : 1,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: colors.borderSubtle,
              },
            ]}
          >
            <Ionicons name="star-outline" size={20} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <ProfileText variant="body">Plan</ProfileText>
              <ProfileText variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                {planSummary}
              </ProfileText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
          {INFO_LINKS.map(({ label, icon, route }, index) => (
            <Pressable
              key={label}
              onPress={() => {
                void Haptics.selectionAsync();
                router.push(route);
              }}
              style={({ pressed }) => [
                styles.linkRow,
                {
                  paddingVertical: spacing.md,
                  opacity: pressed ? 0.6 : 1,
                  borderTopWidth: index === 0 ? 0 : StyleSheet.hairlineWidth,
                  borderTopColor: colors.borderSubtle,
                },
              ]}
            >
              <Ionicons name={icon} size={20} color={colors.textSecondary} />
              <ProfileText variant="body" style={{ flex: 1, marginLeft: spacing.md }}>
                {label}
              </ProfileText>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {firebaseRequired && user ? (
        <Animated.View
          entering={FadeInDown.delay(320)}
          style={[
            styles.accountSection,
            {
              marginTop: spacing.xl,
              paddingTop: spacing.lg,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: colors.borderSubtle,
            },
          ]}
        >
          <ProfileText variant="label" tone="muted">
            Account
          </ProfileText>
          <ProfileText
            variant="bodySmall"
            tone="secondary"
            style={{ marginTop: spacing.xs }}
            numberOfLines={1}
          >
            {user.displayName ? `${user.displayName} · ${user.email}` : user.email}
          </ProfileText>

          <Pressable
            onPress={() => {
              void Haptics.selectionAsync();
              setChangePwVisible(true);
            }}
            style={({ pressed }) => [
              styles.linkRow,
              { paddingVertical: spacing.md, marginTop: spacing.xs, opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Ionicons name="key-outline" size={20} color={colors.textSecondary} />
            <ProfileText variant="body" style={{ flex: 1, marginLeft: spacing.md }}>
              Change password
            </ProfileText>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>

          <Pressable
            onPress={() => {
              void Haptics.selectionAsync();
              setSignOutVisible(true);
            }}
            style={({ pressed }) => [
              styles.signOutBtn,
              {
                marginTop: spacing.md,
                gap: spacing.xs,
                borderRadius: radius.lg,
                borderColor: colors.danger,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <ProfileText variant="button" style={{ color: colors.danger }}>
              Sign out
            </ProfileText>
          </Pressable>

          <Pressable
            onPress={() => {
              void Haptics.selectionAsync();
              setDeleteVisible(true);
            }}
            style={({ pressed }) => [
              styles.deleteRow,
              { marginTop: spacing.md, opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <ProfileText variant="bodySmall" style={{ color: colors.danger }}>
              Delete account
            </ProfileText>
            <ProfileText variant="caption" tone="muted" style={{ marginTop: spacing.xxs }}>
              Permanently remove your account and all data.
            </ProfileText>
          </Pressable>
        </Animated.View>
      ) : null}

      <ConfirmDialog
        visible={signOutVisible}
        title="Sign out?"
        message="You'll need to sign in again to reach your synced conversations."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        icon="log-out-outline"
        onConfirm={handleSignOut}
        onCancel={() => setSignOutVisible(false)}
      />

      <ChangePasswordDialog
        visible={changePwVisible}
        onConfirm={handleChangePassword}
        onCancel={() => setChangePwVisible(false)}
      />

      <DeleteAccountDialog
        visible={deleteVisible}
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  handleRow: { alignItems: 'center', paddingVertical: 12 },
  handle: { width: 40, height: 4, borderRadius: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  linkRow: { flexDirection: 'row', alignItems: 'center' },
  saveBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  accountSection: {},
  deleteRow: { alignItems: 'center' },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1.5,
  },
});
