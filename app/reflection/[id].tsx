import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { useApp } from '@/src/context/AppContext';
import { useTheme } from '@/src/context/ThemeContext';

export default function ReflectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing } = useTheme();
  const { getReflection } = useApp();
  const item = id ? getReflection(id) : undefined;

  if (!item) {
    return (
      <Screen>
        <Text variant="body" color="secondary" style={{ marginTop: spacing.xl }}>
          Reflection not found.
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: spacing.md }}>
          <Text variant="body" style={{ color: colors.primary }}>
            Go back
          </Text>
        </Pressable>
      </Screen>
    );
  }

  const fullText = item.body ?? item.preview;

  return (
    <Screen padded={false} edges={['top', 'bottom']}>
      <View style={[styles.topBar, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </Pressable>
        <Text variant="h3" style={{ flex: 1, textAlign: 'center' }}>
          Saved reflection
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="caption" color="muted">
          {item.date}
        </Text>
        <Text variant="h2" style={{ marginTop: spacing.sm }}>
          {item.title}
        </Text>
        {item.verseReference ? (
          <Text variant="caption" color="secondary" style={{ marginTop: spacing.xs }}>
            {item.verseReference}
          </Text>
        ) : null}
        <Text variant="body" style={{ marginTop: spacing.lg, lineHeight: 26 }}>
          {fullText}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center' },
});
