import { useCallback, useRef, type ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileAvatar } from '@/src/components/profile/ProfileAvatar';
import { ProfileStickyHeader } from '@/src/components/profile/ProfileStickyHeader';
import { ProfileText } from '@/src/components/profile/ProfileText';
import { SettingsPanel } from '@/src/components/profile/SettingsPanel';
import { StatCard } from '@/src/components/profile/StatCard';
import { ProfileThemeProvider } from '@/src/context/ProfileThemeContext';
import { useApp } from '@/src/context/AppContext';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';
import { palette } from '@/src/theme/colors';

function ProfileScreenContent() {
  const { profile, profileStats, preferences } = useApp();
  const { colors, spacing, radius, isDark } = useProfileTheme();
  const insets = useSafeAreaInsets();
  const settingsRef = useRef<BottomSheet>(null);

  const openSettings = useCallback(() => {
    settingsRef.current?.expand();
  }, []);

  const renderBackdrop = useCallback(
    (props: ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.65} />
    ),
    [],
  );

  const memberSince = new Date(profile.joinedAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ProfileStickyHeader
        name={profile.displayName}
        avatarUri={profile.avatarUri}
        onEditPress={() => router.push('/profile/edit')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          paddingBottom: insets.bottom + 120,
        }}
      >
        <View>
          <LinearGradient
            colors={[
              colors.backgroundSecondary,
              colors.accent,
              colors.background,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.hero, { borderRadius: radius.xxl, marginTop: spacing.lg }]}
          >
            <ProfileAvatar
              uri={profile.avatarUri}
              name={profile.displayName}
              size="lg"
            />
            <ProfileText variant="display" style={{ marginTop: spacing.md, fontSize: 28 }}>
              {profile.displayName}
            </ProfileText>
            <ProfileText variant="bodySmall" tone="secondary" style={{ marginTop: spacing.xs }}>
              Walking in faith since {memberSince}
            </ProfileText>
            <View style={[styles.prefPill, { backgroundColor: colors.overlay, marginTop: spacing.md }]}>
              <ProfileText variant="caption" tone="secondary">
                {preferences.translation} · {preferences.tone} tone
                {preferences.autoIncludePrayer ? ' · prayers on' : ' · prayers off'}
              </ProfileText>
            </View>
          </LinearGradient>
        </View>

        <ProfileText variant="label" tone="muted" style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
          Your journey
        </ProfileText>
        <View style={[styles.statsRow, { gap: spacing.sm }]}>
          <StatCard icon="calendar-outline" label="Days on App" value={profileStats.daysOnApp} />
          <StatCard icon="book-outline" label="Saved Scriptures" value={profileStats.savedScriptures} />
          <StatCard icon="document-text-outline" label="Journal Entries" value={profileStats.journalEntries} />
        </View>

        <View
          style={[
            styles.aboutCard,
            {
              marginTop: spacing.xl,
              backgroundColor: colors.card,
              borderRadius: radius.lg,
              padding: spacing.lg,
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <ProfileText variant="h3">About your profile</ProfileText>
          <ProfileText variant="body" tone="secondary" style={{ marginTop: spacing.sm }}>
            This space is yours — update your name and photo, and fine-tune how Scripture-centered
            guidance is delivered to you.
          </ProfileText>
        </View>
      </ScrollView>

      <Pressable
        onPress={openSettings}
        style={({ pressed }) => [
          styles.fab,
          {
            bottom: insets.bottom + 88,
            right: spacing.lg,
            backgroundColor: colors.primary,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
        accessibilityLabel="Open settings"
      >
        <Ionicons name="settings-outline" size={26} color={isDark ? '#12100E' : colors.text} />
      </Pressable>

      <BottomSheet
        ref={settingsRef}
        index={-1}
        snapPoints={['72%', '92%']}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.surfaceElevated }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
        >
          <SettingsPanel onClose={() => settingsRef.current?.close()} />
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

export default function ProfileScreen() {
  return (
    <ProfileThemeProvider>
      <ProfileScreenContent />
    </ProfileThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  prefPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statsRow: { flexDirection: 'row' },
  aboutCard: { borderWidth: StyleSheet.hairlineWidth },
  fab: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
});
