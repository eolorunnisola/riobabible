import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { useApp } from '@/src/context/AppContext';
import { useAuth } from '@/src/context/AuthContext';
import { SPLASH_BACKGROUND } from '@/src/constants/brand';

export default function Index() {
  const { ready, preferences } = useApp();
  const { authReady, isAuthenticated, isEmailVerified, firebaseRequired } = useAuth();

  if (!authReady || !ready) {
    return <View style={{ flex: 1, backgroundColor: SPLASH_BACKGROUND }} />;
  }

  if (firebaseRequired && !isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (firebaseRequired && isAuthenticated && !isEmailVerified) {
    return <Redirect href="/(auth)/verify-email" />;
  }

  if (!preferences.onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
