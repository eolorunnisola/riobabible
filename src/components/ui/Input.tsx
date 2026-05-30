import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { typography } from '@/src/theme/typography';

type Props = TextInputProps & {
  containerStyle?: ViewStyle;
};

export function Input({ style, containerStyle, placeholderTextColor, ...props }: Props) {
  const { colors, radius, spacing, shadows } = useTheme();

  return (
    <View style={[shadows.soft, { borderRadius: radius.lg }, containerStyle]}>
      <TextInput
        placeholderTextColor={placeholderTextColor ?? colors.textMuted}
        style={[
          typography.body,
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.border,
            borderRadius: radius.lg,
            color: colors.text,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm + 2,
          },
          style,
        ]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 48,
  },
});
