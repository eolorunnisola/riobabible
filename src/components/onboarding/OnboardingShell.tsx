import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useTheme } from '@/src/context/ThemeContext';

type Props = {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext: () => void;
  nextLabel?: string;
  canContinue?: boolean;
};

export function OnboardingShell({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onNext,
  nextLabel = 'Continue',
  canContinue = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius } = useTheme();
  const progress = step / totalSteps;
  const horizontalPad = spacing.xl;

  return (
    <Screen
      scroll
      keyboard
      edges={['top', 'bottom']}
      style={{
        paddingLeft: insets.left + horizontalPad,
        paddingRight: insets.right + horizontalPad,
        flexGrow: 1,
      }}
    >
      <View style={[styles.progressTrack, { backgroundColor: colors.border, borderRadius: radius.full }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: colors.primary,
              borderRadius: radius.full,
            },
          ]}
        />
      </View>
      <Text variant="caption" color="muted" style={{ marginTop: spacing.sm }}>
        Step {step} of {totalSteps}
      </Text>
      <Animated.View entering={FadeInRight.duration(350)} exiting={FadeOutLeft.duration(250)}>
        <Text variant="h1" style={{ marginTop: spacing.lg }}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="body" color="secondary" style={{ marginTop: spacing.sm }}>
            {subtitle}
          </Text>
        ) : null}
        <View style={{ marginTop: spacing.xl }}>{children}</View>
      </Animated.View>
      <View style={{ marginTop: 'auto', paddingTop: spacing.xxl, paddingBottom: spacing.md }}>
        <Button label={nextLabel} onPress={onNext} disabled={!canContinue} fullWidth />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressTrack: { height: 4, width: '100%', overflow: 'hidden' },
  progressFill: { height: '100%' },
});
