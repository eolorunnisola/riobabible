import { Pressable, StyleSheet, View, ViewProps } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { hapticLight } from '@/src/utils/haptics';

type Props = ViewProps & {
  onPress?: () => void;
  elevated?: boolean;
};

export function Card({ children, style, onPress, elevated = true, ...props }: Props) {
  const { colors, radius, shadows, spacing } = useTheme();
  const inner = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          borderColor: colors.borderSubtle,
          padding: spacing.md,
        },
        elevated && shadows.card,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={() => {
          hapticLight();
          onPress();
        }}
        style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
      >
        {inner}
      </Pressable>
    );
  }
  return inner;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});
