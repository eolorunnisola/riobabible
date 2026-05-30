import { Stack } from 'expo-router';
import { ProfileThemeProvider } from '@/src/context/ProfileThemeContext';

export default function ProfileStackLayout() {
  return (
    <ProfileThemeProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#12100E' } }}>
        <Stack.Screen
          name="edit"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="help" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="privacy" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="terms" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen
          name="paywall"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="subscription" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </ProfileThemeProvider>
  );
}
