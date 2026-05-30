import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/context/ThemeContext';

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

const AUTO_DISMISS_MS = 4500;

export function NewConversationBanner({ visible, onDismiss }: Props) {
  const { colors, radius, spacing, shadows } = useTheme();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!visible) return;
    pulse.value = withRepeat(
      withSequence(withTiming(1.02, { duration: 600 }), withTiming(1, { duration: 600 })),
      3,
      false,
    );
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [visible, onDismiss, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(18)}
      exiting={FadeOutUp.duration(220)}
      style={[styles.wrap, { paddingHorizontal: spacing.md, marginBottom: spacing.sm }]}
    >
      <Animated.View
        style={[
          pulseStyle,
          styles.banner,
          {
            backgroundColor: colors.primary + '22',
            borderColor: colors.primary,
            borderRadius: radius.lg,
            padding: spacing.md,
          },
          shadows.soft,
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: colors.primary }]}>
          <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.textCol}>
          <Text variant="button" style={{ color: colors.primary }}>
            New conversation started
          </Text>
          <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
            Share what is on your heart when you are ready.
          </Text>
        </View>
        <Pressable onPress={onDismiss} hitSlop={10} accessibilityLabel="Dismiss">
          <Ionicons name="close" size={20} color={colors.textMuted} />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { zIndex: 40 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1, minWidth: 0 },
});
