import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';

type Props = {
  visible: boolean;
  /** Pre-fills the field with whatever the user already typed at sign in. */
  initialEmail?: string;
  onClose: () => void;
};

export function ForgotPasswordDialog({ visible, initialEmail = '', onClose }: Props) {
  const { resetPassword } = useAuth();
  const { colors, spacing, radius, shadows, isDark } = useTheme();
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (visible) {
      setEmail(initialEmail);
      setError(null);
      setLoading(false);
      setSent(false);
    }
  }, [visible, initialEmail]);

  const dismiss = () => {
    if (loading) return;
    onClose();
  };

  const handleSend = async () => {
    if (loading) return;
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={dismiss}
    >
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} accessibilityLabel="Dismiss">
          <BlurView
            intensity={isDark ? 48 : 32}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]} />
        </Pressable>

        <View style={[styles.cardWrap, { paddingHorizontal: spacing.lg }]}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surfaceElevated,
                borderRadius: radius.xxl,
                padding: spacing.xl,
                borderColor: colors.borderSubtle,
              },
              shadows.modal,
            ]}
          >
            <View
              style={[
                styles.iconRing,
                {
                  backgroundColor: sent ? colors.primary + '22' : colors.accent + '55',
                  borderRadius: radius.full,
                },
              ]}
            >
              <Ionicons
                name={sent ? 'mail-open-outline' : 'lock-closed-outline'}
                size={28}
                color={colors.primary}
              />
            </View>

            {sent ? (
              <>
                <Text variant="h2" style={{ marginTop: spacing.lg, textAlign: 'center' }}>
                  Check your email
                </Text>
                <Text
                  variant="body"
                  color="secondary"
                  style={{ marginTop: spacing.sm, textAlign: 'center', lineHeight: 22 }}
                >
                  If an account exists for {email.trim()}, we&apos;ve sent a link to reset your
                  password. Be sure to check your spam folder.
                </Text>
                <View style={{ width: '100%', marginTop: spacing.xl }}>
                  <Button label="Done" onPress={onClose} fullWidth />
                </View>
              </>
            ) : (
              <>
                <Text variant="h2" style={{ marginTop: spacing.lg, textAlign: 'center' }}>
                  Reset your password
                </Text>
                <Text
                  variant="body"
                  color="secondary"
                  style={{ marginTop: spacing.sm, textAlign: 'center', lineHeight: 22 }}
                >
                  Enter your email and we&apos;ll send you a link to set a new password.
                </Text>

                <View style={{ width: '100%', marginTop: spacing.lg }}>
                  <Input
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t);
                      if (error) setError(null);
                    }}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!loading}
                    returnKeyType="send"
                    onSubmitEditing={handleSend}
                  />
                  {error ? (
                    <Text
                      variant="caption"
                      style={{ color: colors.danger, marginTop: spacing.xs }}
                    >
                      {error}
                    </Text>
                  ) : null}
                </View>

                <View style={[styles.actions, { marginTop: spacing.xl, gap: spacing.sm }]}>
                  <Button
                    label="Cancel"
                    variant="secondary"
                    onPress={dismiss}
                    disabled={loading}
                    fullWidth
                  />
                  <Button
                    label="Send reset link"
                    onPress={handleSend}
                    loading={loading}
                    fullWidth
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center' },
  cardWrap: { width: '100%', maxWidth: 400, alignSelf: 'center' },
  card: { alignItems: 'center', borderWidth: StyleSheet.hairlineWidth },
  iconRing: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  actions: { width: '100%' },
});
