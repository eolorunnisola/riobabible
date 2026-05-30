import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthForm } from '@/src/components/auth/AuthForm';
import { Screen } from '@/src/components/ui/Screen';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
export default function LoginScreen() {
  const { signIn } = useAuth();
  const { colors } = useTheme();

  return (
    <Screen padded={false} edges={[]} keyboard={false} style={styles.screen}>
      <LinearGradient
        colors={[colors.background, colors.accent, colors.surface]}
        style={StyleSheet.absoluteFill}
      />
      <AuthForm
        mode="login"
        onSubmit={async ({ email, password }) => {
          await signIn(email, password);
          router.replace('/');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: 'transparent' },
});
