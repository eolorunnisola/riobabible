import { KeyboardAvoidingView, Platform, StyleSheet, View, ViewProps } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/src/context/ThemeContext';

type Props = ViewProps & {
  scroll?: boolean;
  padded?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  keyboard?: boolean;
};

export function Screen({
  children,
  style,
  scroll = false,
  padded = true,
  edges = ['top', 'bottom'],
  keyboard = true,
  ...props
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors, spacing } = useTheme();

  const paddingStyle = {
    paddingTop: edges.includes('top') ? insets.top + (padded ? spacing.md : 0) : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom + (padded ? spacing.md : 0) : 0,
    paddingLeft: edges.includes('left') ? insets.left + (padded ? spacing.md : 0) : 0,
    paddingRight: edges.includes('right') ? insets.right + (padded ? spacing.md : 0) : 0,
  };

  const content = (
    <View
      style={[styles.flex, { backgroundColor: colors.background }, paddingStyle, style]}
      {...props}
    >
      {children}
    </View>
  );

  if (!scroll) {
    if (!keyboard) return content;
    return (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={[styles.flex, { backgroundColor: colors.background }]}
      contentContainerStyle={[paddingStyle, style]}
      keyboardShouldPersistTaps="handled"
      bottomOffset={insets.bottom + spacing.lg}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
