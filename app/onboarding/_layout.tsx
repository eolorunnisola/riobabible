import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="translation" />
      <Stack.Screen name="tone" />
      <Stack.Screen name="prayer" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
