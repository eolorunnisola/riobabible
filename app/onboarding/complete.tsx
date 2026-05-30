import { router } from 'expo-router';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useApp } from '@/src/context/AppContext';
import { useTheme } from '@/src/context/ThemeContext';

export default function OnboardingCompleteScreen() {
  const { completeOnboarding, preferences } = useApp();
  const { colors, spacing } = useTheme();

  const finish = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <Screen scroll>
      <Animated.View entering={FadeIn.duration(500)} style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primary + '33',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="checkmark-circle" size={48} color={colors.primary} />
        </View>
        <Text variant="display" style={{ marginTop: spacing.xl, textAlign: 'center' }}>
          You are all set
        </Text>
        <Text variant="body" color="secondary" style={{ marginTop: spacing.md, textAlign: 'center' }}>
          {preferences.translation} · {preferences.tone} tone · {preferences.prayerPreference.replace('-', ' ')} prayers
        </Text>
        <Button label="Enter Rioba" onPress={finish} fullWidth style={{ marginTop: spacing.xxxl }} />
      </Animated.View>
    </Screen>
  );
}
