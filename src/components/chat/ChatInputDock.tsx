import { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';

type Props = {
  tabBarHeight: number;
  onLayout?: (height: number) => void;
  style?: ViewStyle | ViewStyle[];
  children: ReactNode;
};

/**
 * Input dock that tracks the keyboard in one motion: keyboard height and tab-bar
 * inset are combined in a single translateY driven by keyboard progress (no
 * binary padding toggles that cause two-stage jumps).
 */
export function ChatInputDock({ tabBarHeight, style, children }: Props) {
  const { height, progress } = useReanimatedKeyboardAnimation();

  const animatedStyle = useAnimatedStyle(() => {
    const tabInset = interpolate(
      progress.value,
      [0, 1],
      [tabBarHeight, 0],
      Extrapolation.CLAMP,
    );

    // Tab inset uses padding so the list layout reserves space; only keyboard uses translate.
    return {
      transform: [{ translateY: height.value }],
      paddingBottom: tabInset,
    };
  });

  return (
    <Reanimated.View style={[styles.dock, style, animatedStyle]}>{children}</Reanimated.View>
  );
}

const styles = StyleSheet.create({
  dock: {
    width: '100%',
  },
});
