import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthForm } from '@/src/components/auth/AuthForm';
import { Screen } from '@/src/components/ui/Screen';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
export default function RegisterScreen() {
  const { signUp } = useAuth();
  const { colors } = useTheme();

  return (
    <Screen padded={false} edges={[]} keyboard={false} style={styles.screen}>
      <LinearGradient
        colors={[colors.background, colors.accent, colors.surface]}
        style={StyleSheet.absoluteFill}
      />
      <AuthForm
        mode="register"
        onSubmit={async ({ email, password, displayName }) => {
          await signUp(email, password, displayName);
          // Route through the index guard so the email-verification gate runs
          // before onboarding (unverified users -> /(auth)/verify-email).
          router.replace('/');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: 'transparent' },
});
