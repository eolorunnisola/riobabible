import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { AppLogo } from '@/src/components/ui/AppLogo';
import { DisclaimerBanner } from '@/src/components/ui/DisclaimerBanner';
import { useTheme } from '@/src/context/ThemeContext';
export default function WelcomeScreen() {
  const { spacing, colors } = useTheme();

  return (
    <Screen padded={false} edges={['top', 'bottom']}>
      <LinearGradient
        colors={[colors.background, colors.accent, colors.surface]}
        style={styles.gradient}
      >
        <View style={[styles.content, { padding: spacing.xl }]}>
          <Animated.View entering={FadeInDown.duration(600)}>
            <AppLogo size={88} style={{ alignSelf: 'center', marginBottom: spacing.md }} />
            <Text variant="label" color="muted" style={{ textAlign: 'center' }}>
              Rioba
            </Text>
            <Text variant="display" style={{ marginTop: spacing.md }}>
              Gentle guidance rooted in Scripture
            </Text>
            <Text variant="body" color="secondary" style={{ marginTop: spacing.md }}>
              Share what you are facing. Receive empathetic, Bible-centered reflection, prayer, and
              practical next steps — for spiritual encouragement, not professional counseling.
            </Text>
          </Animated.View>
          <View style={{ marginTop: spacing.xl }}>
            <DisclaimerBanner />
          </View>
          <View style={styles.footer}>
            <Button label="Begin your journey" onPress={() => router.push('/onboarding/translation')} fullWidth />
            <Text variant="caption" color="muted" style={{ textAlign: 'center', marginTop: spacing.md }}>
              Swipe through a few preferences to personalize your experience.
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  content: { flex: 1, justifyContent: 'space-between', paddingBottom: 24 },
  footer: { marginTop: 'auto' },
});
