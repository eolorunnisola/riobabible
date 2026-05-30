import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Text } from '@/src/components/ui/Text';
import { ForgotPasswordDialog } from '@/src/components/auth/ForgotPasswordDialog';
import { useTheme } from '@/src/context/ThemeContext';

type Mode = 'login' | 'register';

type Props = {
  mode: Mode;
  onSubmit: (values: {
    email: string;
    password: string;
    displayName?: string;
  }) => Promise<void>;
};

export function AuthForm({ mode, onSubmit }: Props) {
  const { spacing, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotVisible, setForgotVisible] = useState(false);

  const isRegister = mode === 'register';

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        email: email.trim(),
        password,
        displayName: isRegister ? displayName.trim() : undefined,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.flex}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        padding: spacing.lg,
        paddingTop: insets.top + spacing.xl,
        paddingBottom: insets.bottom + spacing.xxl,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Text variant="h1">{isRegister ? 'Create account' : 'Welcome back'}</Text>
      <Text variant="body" color="secondary" style={{ marginTop: spacing.sm }}>
        {isRegister
          ? 'Sign up to save your conversations and sync across devices.'
          : 'Sign in to continue your journey with Rioba.'}
      </Text>

      {isRegister ? (
        <View style={{ marginTop: spacing.lg }}>
          <Text variant="label" color="muted" style={{ marginBottom: spacing.xs }}>
            Name (optional)
          </Text>
          <Input
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="How we should greet you"
            autoCapitalize="words"
            autoComplete="name"
          />
        </View>
      ) : null}

      <View style={{ marginTop: spacing.lg }}>
        <Text variant="label" color="muted" style={{ marginBottom: spacing.xs }}>
          Email
        </Text>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>

      <View style={{ marginTop: spacing.md }}>
        <Text variant="label" color="muted" style={{ marginBottom: spacing.xs }}>
          Password
        </Text>
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          secureTextEntry
          autoComplete={isRegister ? 'new-password' : 'password'}
        />
      </View>

      {!isRegister ? (
        <Pressable
          onPress={() => setForgotVisible(true)}
          hitSlop={8}
          style={{ alignSelf: 'flex-end', marginTop: spacing.sm }}
        >
          <Text variant="bodySmall" style={{ color: colors.primary, fontWeight: '600' }}>
            Forgot password?
          </Text>
        </Pressable>
      ) : null}

      {isRegister ? (
        <View style={{ marginTop: spacing.md }}>
          <Text variant="label" color="muted" style={{ marginBottom: spacing.xs }}>
            Confirm password
          </Text>
          <Input
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter password"
            secureTextEntry
            autoComplete="new-password"
          />
        </View>
      ) : null}

      {error ? (
        <Text variant="bodySmall" color="danger" style={{ marginTop: spacing.md }}>
          {error}
        </Text>
      ) : null}

      <Button
        label={isRegister ? 'Create account' : 'Sign in'}
        onPress={handleSubmit}
        loading={loading}
        fullWidth
        style={{ marginTop: spacing.xl }}
      />

      <View style={[styles.footer, { marginTop: spacing.lg }]}>
        <Text variant="bodySmall" color="secondary">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
        </Text>
        <Link href={isRegister ? '/(auth)/login' : '/(auth)/register'} asChild>
          <Pressable hitSlop={8}>
            <Text variant="bodySmall" style={{ color: colors.primary, fontWeight: '600' }}>
              {isRegister ? 'Sign in' : 'Create one'}
            </Text>
          </Pressable>
        </Link>
      </View>

      {!isRegister ? (
        <ForgotPasswordDialog
          visible={forgotVisible}
          initialEmail={email.trim()}
          onClose={() => setForgotVisible(false)}
        />
      ) : null}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});
