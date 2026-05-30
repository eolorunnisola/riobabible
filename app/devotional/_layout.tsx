import { Stack } from 'expo-router';
import { ProfileThemeProvider } from '@/src/context/ProfileThemeContext';

export default function DevotionalStackLayout() {
  return (
    <ProfileThemeProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#12100E' } }}>
        <Stack.Screen name="index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="[planId]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="[planId]/day/[day]" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </ProfileThemeProvider>
  );
}
