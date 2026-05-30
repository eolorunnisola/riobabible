import { Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/context/ThemeContext';
import { DailyEncouragement } from '@/src/types';

const { height } = Dimensions.get('window');

export type DailySlideKind = 'verse' | 'prayer' | 'reflection';

type Props = {
  item: DailyEncouragement;
  slide: DailySlideKind;
};

export function DailyFeedCard({ item, slide }: Props) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View style={[styles.slide, { height: height * 0.78 }]}>
      <LinearGradient
        colors={[colors.background, colors.accent, colors.surface]}
        style={[styles.gradient, { borderRadius: radius.xxl, padding: spacing.xl }]}
      >
        <Text variant="label" color="muted">
          {item.theme}
        </Text>

        {slide === 'verse' ? (
          <>
            <Text variant="label" color="muted" style={{ marginTop: spacing.md }}>
              Today’s verse
            </Text>
            <Text variant="verse" style={{ marginTop: spacing.lg, color: colors.text }}>
              “{item.verse.text}”
            </Text>
            <Text variant="caption" color="secondary" style={{ marginTop: spacing.sm }}>
              — {item.verse.reference}
            </Text>
          </>
        ) : null}

        {slide === 'prayer' ? (
          <>
            <Text variant="h2" style={{ marginTop: spacing.lg }}>
              Prayer
            </Text>
            <Text variant="body" color="secondary" style={{ marginTop: spacing.md, lineHeight: 26 }}>
              {item.prayer}
            </Text>
          </>
        ) : null}

        {slide === 'reflection' ? (
          <View
            style={[
              styles.promptBox,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                marginTop: spacing.lg,
                padding: spacing.lg,
                flex: 1,
                justifyContent: 'center',
              },
            ]}
          >
            <Text variant="label" color="muted">
              Reflect
            </Text>
            <Text variant="h3" style={{ marginTop: spacing.md }}>
              {item.reflectionQuestion}
            </Text>
            <Text variant="bodySmall" color="secondary" style={{ marginTop: spacing.lg }}>
              Take a quiet moment to journal or pray through your answer.
            </Text>
          </View>
        ) : null}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { width: '100%', justifyContent: 'center' },
  gradient: { flex: 1, justifyContent: 'center' },
  promptBox: {},
});
