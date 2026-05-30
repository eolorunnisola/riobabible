import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  x?: number;
  y?: number;
};

export function HeartBurst({ visible, x = 0, y = 0 }: Props) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;
    scale.value = withSequence(
      withSpring(1.2, { damping: 8 }),
      withTiming(0, { duration: 400 }),
    );
    opacity.value = withSequence(withTiming(1, { duration: 100 }), withTiming(0, { duration: 500 }));
  }, [visible, scale, opacity]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: x }, { translateY: y }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.burst, style]} pointerEvents="none">
      <Ionicons name="heart" size={32} color="#9B6A6C" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  burst: {
    position: 'absolute',
    zIndex: 100,
  },
});
