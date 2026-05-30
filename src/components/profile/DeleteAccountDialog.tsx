import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/context/ThemeContext';

type Props = {
  visible: boolean;
  /** Receives the password used to re-authenticate before deletion. */
  onConfirm: (password: string) => Promise<void>;
  onCancel: () => void;
};

export function DeleteAccountDialog({ visible, onConfirm, onCancel }: Props) {
  const { colors, spacing, radius, shadows, isDark } = useTheme();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Reset transient state whenever the dialog opens or closes.
  useEffect(() => {
    if (!visible) {
      setPassword('');
      setError(null);
      setLoading(false);
    }
  }, [visible]);

  const dismiss = () => {
    if (loading) return;
    onCancel();
  };

  const handleConfirm = async () => {
    if (loading) return;
    if (!password.trim()) {
      setError('Please enter your password to confirm.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onConfirm(password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete your account.');
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
                { backgroundColor: colors.dangerSurface, borderRadius: radius.full },
              ]}
            >
              <Ionicons name="trash-outline" size={28} color={colors.danger} />
            </View>

            <Text variant="h2" style={{ marginTop: spacing.lg, textAlign: 'center' }}>
              Delete your account?
            </Text>
            <Text
              variant="body"
              color="secondary"
              style={{ marginTop: spacing.sm, textAlign: 'center', lineHeight: 22 }}
            >
              This permanently removes your account, conversations, journal entries, and saved
              reflections. This cannot be undone.
            </Text>

            <View style={{ width: '100%', marginTop: spacing.lg }}>
              <Text variant="caption" color="muted" style={{ marginBottom: spacing.xs }}>
                Confirm your password
              </Text>
              <Input
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (error) setError(null);
                }}
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="current-password"
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleConfirm}
              />
              {error ? (
                <Text variant="caption" style={{ color: colors.danger, marginTop: spacing.xs }}>
                  {error}
                </Text>
              ) : null}
            </View>

            <View style={[styles.actions, { marginTop: spacing.xl, gap: spacing.sm }]}>
              <Button
                label="Keep my account"
                variant="secondary"
                onPress={dismiss}
                disabled={loading}
                fullWidth
              />
              <Button
                label="Delete account"
                variant="danger"
                onPress={handleConfirm}
                loading={loading}
                fullWidth
              />
            </View>
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
