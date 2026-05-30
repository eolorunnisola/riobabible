import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { DailyFeedCard, DailySlideKind } from '@/src/components/daily/DailyFeedCard';
import { useApp } from '@/src/context/AppContext';
import { getDailyEncouragement } from '@/src/services/daily/getDailyEncouragement';
import { useTheme } from '@/src/context/ThemeContext';
import { DailyEncouragement } from '@/src/types';
import { getLocalDateKey } from '@/src/utils/dateKey';

const { width } = Dimensions.get('window');

const SLIDES: { kind: DailySlideKind; label: string }[] = [
  { kind: 'verse', label: 'Verse' },
  { kind: 'prayer', label: 'Prayer' },
  { kind: 'reflection', label: 'Reflect' },
];

function formatDisplayDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function DailyScreen() {
  const { spacing, colors } = useTheme();
  const { preferences } = useApp();
  const [index, setIndex] = useState(0);
  const [daily, setDaily] = useState<DailyEncouragement | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateKey, setDateKey] = useState(getLocalDateKey());

  const loadDaily = useCallback(async () => {
    const todayKey = getLocalDateKey();
    setDateKey(todayKey);
    setLoading(true);
    try {
      const item = await getDailyEncouragement(preferences);
      setDaily(item);
    } catch {
      setDaily(null);
    } finally {
      setLoading(false);
    }
  }, [preferences]);

  useFocusEffect(
    useCallback(() => {
      void loadDaily();
    }, [loadDaily]),
  );

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(i);
  };

  const slideLabels = useMemo(() => SLIDES.map((s) => s.label), []);

  return (
    <Screen padded={false} edges={['top']} style={styles.flex}>
      <View style={[styles.header, { paddingHorizontal: spacing.md, paddingBottom: spacing.sm }]}>
        <Text variant="h1">Daily Encouragement</Text>
        <Text variant="bodySmall" color="secondary">
          {formatDisplayDate(dateKey)} — swipe for today’s verse, prayer, and reflection.
        </Text>
        <View style={[styles.dots, { marginTop: spacing.sm }]}>
          {slideLabels.map((label, i) => (
            <View key={label} style={styles.dotRow}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === index ? colors.primary : colors.border,
                    width: i === index ? 20 : 8,
                  },
                ]}
              />
            </View>
          ))}
        </View>
        <Text variant="caption" color="muted" style={{ marginTop: spacing.xs }}>
          {slideLabels[index]}
        </Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="body" color="secondary" style={{ marginTop: spacing.md }}>
            Preparing today’s encouragement…
          </Text>
        </View>
      ) : daily ? (
        <ScrollView
          style={styles.flex}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScroll}
          decelerationRate="fast"
          snapToInterval={width}
        >
          {SLIDES.map((slide) => (
            <View key={slide.kind} style={{ width, paddingHorizontal: spacing.md }}>
              <DailyFeedCard item={daily} slide={slide.kind} />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.centered}>
          <Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
            Could not load today’s encouragement. Pull away and return to try again.
          </Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {},
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dotRow: {},
  dot: { height: 8, borderRadius: 4 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
});
