import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';

type Props = {
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
};

const TRACK_W = 52;
const TRACK_H = 30;
const THUMB = 24;

export function AnimatedSwitch({ value, onValueChange, disabled }: Props) {
  const { colors } = useProfileTheme();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, { damping: 18, stiffness: 220 });
  }, [value, progress]);

  const toggle = () => {
    if (disabled) return;
    const next = !value;
    progress.value = withSpring(next ? 1 : 0, { damping: 18, stiffness: 220 });
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(next);
  };

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.border, colors.primary],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * (TRACK_W - THUMB - 6) }],
  }));

  return (
    <Pressable onPress={toggle} disabled={disabled} accessibilityRole="switch">
      <Animated.View style={[styles.track, trackStyle, disabled && styles.disabled]}>
        <Animated.View
          style={[
            styles.thumb,
            { backgroundColor: colors.text },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    padding: 3,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
  },
  disabled: { opacity: 0.45 },
});
