import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/src/components/ui/Button';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { useToast } from '@/src/context/ToastContext';

const RESEND_COOLDOWN = 30; // seconds

export default function VerifyEmailScreen() {
  const { user, refreshUser, resendVerification, signOut } = useAuth();
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();

  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startCooldown = useCallback(() => {
    setCooldown(RESEND_COOLDOWN);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }, []);

  const handleCheck = useCallback(async () => {
    setChecking(true);
    try {
      const verified = await refreshUser();
      if (verified) {
        showToast('Email verified');
        router.replace('/');
      } else {
        showToast('Not verified yet — tap the link in your email.');
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not check status.');
    } finally {
      setChecking(false);
    }
  }, [refreshUser, showToast]);

  const handleResend = useCallback(async () => {
    setResending(true);
    try {
      await resendVerification();
      showToast('Verification email sent');
      startCooldown();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not send email.');
    } finally {
      setResending(false);
    }
  }, [resendVerification, showToast, startCooldown]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not sign out.');
    }
  }, [showToast, signOut]);

  return (
    <Screen padded={false} edges={[]} keyboard={false} style={styles.screen}>
      <LinearGradient
        colors={[colors.background, colors.accent, colors.surface]}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + spacing.xl,
            paddingBottom: insets.bottom + spacing.xl,
            paddingHorizontal: spacing.lg,
          },
        ]}
      >
        <View
          style={[
            styles.iconRing,
            { backgroundColor: colors.primary + '22', borderRadius: radius.full },
          ]}
        >
          <Ionicons name="mail-unread-outline" size={34} color={colors.primary} />
        </View>

        <Text variant="h1" style={{ marginTop: spacing.lg, textAlign: 'center' }}>
          Verify your email
        </Text>
        <Text
          variant="body"
          color="secondary"
          style={{ marginTop: spacing.sm, textAlign: 'center', lineHeight: 22 }}
        >
          We sent a verification link to{'\n'}
          <Text variant="body" style={{ fontWeight: '700', color: colors.primary }}>
            {user?.email ?? 'your email'}
          </Text>
          .{'\n'}Tap it, then come back and continue.
        </Text>

        <Button
          label="I've verified — continue"
          onPress={handleCheck}
          loading={checking}
          fullWidth
          style={{ marginTop: spacing.xl }}
        />

        <Pressable
          onPress={cooldown > 0 ? undefined : handleResend}
          disabled={cooldown > 0 || resending}
          hitSlop={8}
          style={{ marginTop: spacing.lg, opacity: cooldown > 0 ? 0.5 : 1 }}
        >
          <Text variant="bodySmall" style={{ color: colors.primary, fontWeight: '600' }}>
            {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend verification email'}
          </Text>
        </Pressable>

        <Pressable onPress={handleSignOut} hitSlop={8} style={{ marginTop: spacing.md }}>
          <Text variant="bodySmall" color="muted">
            Use a different account
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: 'transparent' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRing: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
