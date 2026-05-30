import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import { AnimatedSplash } from '@/src/components/AnimatedSplash';
import { useApp } from '@/src/context/AppContext';
import { useAuth } from '@/src/context/AuthContext';
import { getDailyEncouragement } from '@/src/services/daily/getDailyEncouragement';

type Props = {
  fontsLoaded: boolean;
};

export function RootShell({ fontsLoaded }: Props) {
  const { ready, preferences } = useApp();
  const { authReady } = useAuth();

  const appReady = fontsLoaded && authReady && ready;

  useEffect(() => {
    if (!fontsLoaded || !ready) return;
    void getDailyEncouragement(preferences).catch(() => {});
  }, [fontsLoaded, ready, preferences]);

  return (
    <BottomSheetModalProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="response/[id]"
          options={{ animation: 'slide_from_bottom', presentation: 'card' }}
        />
        <Stack.Screen
          name="reflection"
          options={{ animation: 'slide_from_right', presentation: 'card' }}
        />
        <Stack.Screen
          name="crisis"
          options={{ animation: 'fade', presentation: 'fullScreenModal' }}
        />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="devotional" options={{ headerShown: false }} />
        <Stack.Screen name="journal" options={{ headerShown: false }} />
      </Stack>
      <AnimatedSplash appReady={appReady} />
    </BottomSheetModalProvider>
  );
}
