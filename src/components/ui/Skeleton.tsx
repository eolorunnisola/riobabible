import { StyleSheet, View } from 'react-native';
import { Shimmer } from './Shimmer';
import { useTheme } from '@/src/context/ThemeContext';

export function ChatSkeleton() {
  const { spacing } = useTheme();
  return (
    <View style={[styles.wrap, { gap: spacing.md }]}>
      <Shimmer width="72%" height={56} borderRadius={16} />
      <Shimmer width="85%" height={88} borderRadius={16} />
      <Shimmer width="60%" height={48} borderRadius={16} />
    </View>
  );
}

export function ResponseSkeleton() {
  const { spacing } = useTheme();
  return (
    <View style={[styles.wrap, { gap: spacing.lg, padding: spacing.md }]}>
      <Shimmer width="100%" height={72} borderRadius={16} />
      <Shimmer width="100%" height={120} borderRadius={16} />
      <Shimmer width="100%" height={96} borderRadius={16} />
      <Shimmer width="80%" height={64} borderRadius={16} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
});
