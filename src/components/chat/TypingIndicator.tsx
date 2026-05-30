import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/src/context/ThemeContext';

const DOT_SIZE = 8;

function Dot({ delayMs, color }: { delayMs: number; color: string }) {
  const opacity = useSharedValue(0.35);
  const translateY = useSharedValue(0);

  useEffect(() => {
    const pulse = withRepeat(
      withSequence(
        withTiming(1, { duration: 380 }),
        withTiming(0.35, { duration: 380 }),
      ),
      -1,
      false,
    );
    const bounce = withRepeat(
      withSequence(
        withTiming(-5, { duration: 380 }),
        withTiming(0, { duration: 380 }),
      ),
      -1,
      false,
    );
    opacity.value = withDelay(delayMs, pulse);
    translateY.value = withDelay(delayMs, bounce);
  }, [delayMs, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        { width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2, backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
}

export function TypingIndicator() {
  const { colors, radius, spacing, isDark } = useTheme();
  const dotColor = isDark ? '#FFFFFF' : colors.text;

  return (
    <View
      style={[styles.row, { marginBottom: spacing.sm }]}
      accessibilityRole="progressbar"
      accessibilityLabel="Preparing your guidance"
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: colors.assistantBubble,
            borderRadius: radius.lg,
            borderBottomLeftRadius: radius.sm,
            borderColor: colors.borderSubtle,
            paddingHorizontal: spacing.md + 2,
            paddingVertical: spacing.md,
          },
        ]}
      >
        <View style={[styles.dots, { gap: spacing.xs + 2 }]}>
          <Dot delayMs={0} color={dotColor} />
          <Dot delayMs={160} color={dotColor} />
          <Dot delayMs={320} color={dotColor} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { width: '100%', alignItems: 'flex-start' },
  bubble: {
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: '85%',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: DOT_SIZE + 6,
  },
});
