import { useCallback, useMemo, useRef, type ComponentProps } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { DisclaimerBanner } from '@/src/components/ui/DisclaimerBanner';
import { ResponseSection } from '@/src/components/response/ResponseSection';
import { PrayerBlock } from '@/src/components/response/PrayerBlock';
import { ScriptureVerse } from '@/src/components/response/ScriptureVerse';
import { useReflectionSave } from '@/src/hooks/useReflectionSave';
import { useApp } from '@/src/context/AppContext';
import { useToast } from '@/src/context/ToastContext';
import { useTheme } from '@/src/context/ThemeContext';
import { MOCK_GUIDANCE } from '@/src/data/mock';
import { reflectionTitleFromGuidance } from '@/src/utils/reflectionTitle';

export default function ResponseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing } = useTheme();
  const { trySaveReflection, removeReflection, isReflectionSaved } = useReflectionSave();
  const { getGuidance, preferences } = useApp();
  const { showToast } = useToast();
  const prayerSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['45%', '70%'], []);

  const guidance = (id ? getGuidance(id) : undefined) ?? MOCK_GUIDANCE;
  const reflectionSaved = isReflectionSaved(guidance.id);

  const renderBackdrop = useCallback(
    (props: ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  if (id && !getGuidance(id)) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} style={{ marginTop: 48 }} />
        <Text variant="body" color="secondary" style={{ textAlign: 'center', marginTop: spacing.md }}>
          Loading your guidance…
        </Text>
      </Screen>
    );
  }

  return (
    <Screen padded={false} edges={['top', 'bottom']}>
      <View style={[styles.topBar, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </Pressable>
        <Text variant="h3" style={{ flex: 1, textAlign: 'center' }}>
          Your guidance
        </Text>
        <Pressable
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (reflectionSaved) {
              removeReflection(guidance.id);
              showToast('Removed from reflections');
              return;
            }
            if (!trySaveReflection({
              id: guidance.id,
              guidanceId: guidance.id,
              title: reflectionTitleFromGuidance(guidance),
              preview: guidance.empathy,
              body: [
                guidance.empathy,
                guidance.biblicalPerspective,
                guidance.explanation,
                guidance.nextStep,
                guidance.prayer,
              ]
                .filter(Boolean)
                .join('\n\n'),
              type: 'response',
              date: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              liked: true,
            })) {
              return;
            }
            showToast('Saved to reflections');
          }}
          hitSlop={12}
          accessibilityLabel={
            reflectionSaved ? 'Remove from reflections' : 'Save to reflections'
          }
        >
          <Ionicons
            name={reflectionSaved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={colors.primary}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        <DisclaimerBanner compact />

        <ResponseSection icon="heart-outline" title="Understanding" accent>
          <Text variant="body">{guidance.empathy}</Text>
        </ResponseSection>

        <ResponseSection icon="compass-outline" title="Biblical perspective">
          <Text variant="body" color="secondary">
            {guidance.biblicalPerspective ?? guidance.explanation}
          </Text>
        </ResponseSection>

        <ResponseSection icon="book-outline" title="Scripture">
          {guidance.verses.map((v, index) => (
            <ScriptureVerse key={`${v.reference}-${index}`} verse={v} guidanceId={guidance.id} />
          ))}
        </ResponseSection>

        <ResponseSection icon="bulb-outline" title="Explanation">
          <Text variant="body" color="secondary">
            {guidance.explanation}
          </Text>
        </ResponseSection>

        {preferences.autoIncludePrayer && guidance.prayer ? (
          <ResponseSection icon="hand-left-outline" title="Prayer">
            <PrayerBlock
              prayer={guidance.prayer}
              guidanceId={guidance.id}
              issueSummary={guidance.issueSummary}
            />
          </ResponseSection>
        ) : null}

        <ResponseSection icon="footsteps-outline" title="Practical next step">
          <Text variant="body">{guidance.nextStep}</Text>
        </ResponseSection>

        {guidance.disclaimer ? (
          <View
            style={[
              styles.disclaimerBox,
              {
                marginTop: spacing.md,
                padding: spacing.md,
                backgroundColor: colors.dangerSurface,
                borderRadius: 12,
              },
            ]}
          >
            <Text variant="caption" color="danger">
              {guidance.disclaimer}
            </Text>
          </View>
        ) : null}

        {preferences.autoIncludePrayer ? (
          <View style={[styles.actions, { gap: spacing.sm, marginTop: spacing.md }]}>
            <Button
              label="Generate a new prayer"
              variant="ghost"
              onPress={() => prayerSheetRef.current?.expand()}
              fullWidth
            />
          </View>
        ) : null}
      </ScrollView>

      <BottomSheet
        ref={prayerSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ padding: spacing.lg }}>
          <Text variant="h2">A fresh prayer</Text>
          <Text variant="body" color="secondary" style={{ marginTop: spacing.md }}>
            {guidance.prayer ||
              'Lord, meet me in this moment with Your peace. Shape my heart to receive Your Word and walk in the next faithful step You set before me. Amen.'}
          </Text>
          <Button
            label="Close"
            variant="secondary"
            onPress={() => prayerSheetRef.current?.close()}
            fullWidth
            style={{ marginTop: spacing.lg }}
          />
        </BottomSheetView>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center' },
  actions: {},
  disclaimerBox: {},
});
