import { useMemo } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList } from '@shopify/flash-list';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { ReflectionWeekFolder } from '@/src/components/reflections/ReflectionWeekFolder';
import { ReflectionsPlanBanner } from '@/src/components/reflections/ReflectionsPlanBanner';
import { useApp } from '@/src/context/AppContext';
import { useSubscription } from '@/src/context/SubscriptionContext';
import { useToast } from '@/src/context/ToastContext';
import { useTheme } from '@/src/context/ThemeContext';
import { SavedReflection } from '@/src/types';
import { groupReflectionsByWeek } from '@/src/utils/weeklyReflection';

export default function ReflectionsScreen() {
  const { reflections, removeReflection, getGuidance, getWeeklyFaithReflection } = useApp();
  const { isPremium } = useSubscription();
  const { showToast } = useToast();
  const { spacing } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();

  const weeks = useMemo(() => groupReflectionsByWeek(reflections), [reflections]);

  const openReflection = (item: SavedReflection) => {
    const guidanceId = item.guidanceId ?? (item.type === 'response' ? item.id : undefined);
    if (guidanceId && getGuidance(guidanceId)) {
      router.push({ pathname: '/response/[id]', params: { id: guidanceId } });
      return;
    }
    router.push({ pathname: '/reflection/[id]', params: { id: item.id } });
  };

  const openWeekly = (weekKey: string) => {
    if (!isPremium) {
      router.push('/profile/paywall');
      return;
    }
    router.push({ pathname: '/reflection/week/[weekKey]', params: { weekKey } });
  };

  return (
    <Screen padded={false} edges={['top']} style={styles.flex}>
      <View style={[styles.header, { padding: spacing.md }]}>
        <Text variant="h1">Saved Reflections</Text>
        <Text variant="bodySmall" color="secondary">
          Organized by week — verses, prayers, and guidance you saved.
        </Text>
      </View>
      <View style={styles.list}>
        <FlashList
          data={weeks}
          keyExtractor={(item) => item.weekKey}
          ListHeaderComponent={
            <View style={{ paddingHorizontal: spacing.md }}>
              <ReflectionsPlanBanner />
            </View>
          }
          renderItem={({ item, index }) => (
            <View style={{ paddingHorizontal: spacing.md }}>
              <ReflectionWeekFolder
                weekKey={item.weekKey}
                items={item.items}
                weeklyEntry={isPremium ? getWeeklyFaithReflection(item.weekKey) : undefined}
                showWeeklyReflection={isPremium}
                onOpenWeekly={() => openWeekly(item.weekKey)}
                onOpenItem={openReflection}
                onUnsaveItem={(id) => {
                  removeReflection(id);
                  showToast('Removed from reflections');
                }}
                defaultExpanded={index === 0}
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.xl }}>
              <Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
                When you save a verse, prayer, or guidance, it will appear here in its weekly
                folder.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: tabBarHeight + spacing.lg }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {},
  list: { flex: 1 },
});
