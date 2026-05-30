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
  /** Receives (currentPassword, newPassword); should reject on failure. */
  onConfirm: (currentPassword: string, newPassword: string) => Promise<void>;
  onCancel: () => void;
};

export function ChangePasswordDialog({ visible, onConfirm, onCancel }: Props) {
  const { colors, spacing, radius, shadows, isDark } = useTheme();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      setCurrent('');
      setNext('');
      setConfirm('');
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
    if (!current) {
      setError('Please enter your current password.');
      return;
    }
    if (next.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (next !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    if (next === current) {
      setError('Choose a password different from your current one.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onConfirm(current, next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not change your password.');
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
                { backgroundColor: colors.accent + '55', borderRadius: radius.full },
              ]}
            >
              <Ionicons name="key-outline" size={28} color={colors.primary} />
            </View>

            <Text variant="h2" style={{ marginTop: spacing.lg, textAlign: 'center' }}>
              Change password
            </Text>
            <Text
              variant="body"
              color="secondary"
              style={{ marginTop: spacing.sm, textAlign: 'center', lineHeight: 22 }}
            >
              Enter your current password, then choose a new one.
            </Text>

            <View style={{ width: '100%', marginTop: spacing.lg, gap: spacing.sm }}>
              <Input
                value={current}
                onChangeText={(t) => {
                  setCurrent(t);
                  if (error) setError(null);
                }}
                placeholder="Current password"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="current-password"
                editable={!loading}
              />
              <Input
                value={next}
                onChangeText={(t) => {
                  setNext(t);
                  if (error) setError(null);
                }}
                placeholder="New password (at least 6 characters)"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                editable={!loading}
              />
              <Input
                value={confirm}
                onChangeText={(t) => {
                  setConfirm(t);
                  if (error) setError(null);
                }}
                placeholder="Confirm new password"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleConfirm}
              />
              {error ? (
                <Text variant="caption" style={{ color: colors.danger }}>
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
                label="Update password"
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
