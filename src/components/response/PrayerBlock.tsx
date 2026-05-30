import { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Text } from '@/src/components/ui/Text';
import { HeartBurst } from '@/src/components/ui/HeartBurst';
import { useReflectionSave } from '@/src/hooks/useReflectionSave';
import { useToast } from '@/src/context/ToastContext';
import { useTheme } from '@/src/context/ThemeContext';
import { useDoubleTap } from '@/src/hooks/useDoubleTap';
import { prayerReflectionId } from '@/src/utils/reflectionTitle';

type Props = {
  prayer: string;
  guidanceId: string;
  issueSummary?: string;
};

export function PrayerBlock({ prayer, guidanceId, issueSummary }: Props) {
  const { colors, spacing } = useTheme();
  const { trySaveReflection, removeReflection, isReflectionSaved } = useReflectionSave();
  const { showToast } = useToast();
  const reflectionId = prayerReflectionId(guidanceId);
  const saved = isReflectionSaved(reflectionId);
  const [showHeart, setShowHeart] = useState(false);

  const handleToggleSave = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (saved) {
      removeReflection(reflectionId);
      showToast('Prayer removed from reflections');
      return;
    }
    setShowHeart(true);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (!trySaveReflection({
      id: reflectionId,
      guidanceId,
      title: issueSummary ? `Prayer — ${issueSummary.slice(0, 40)}` : 'Saved prayer',
      preview: prayer,
      body: prayer,
      type: 'prayer',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      liked: true,
    })) {
      return;
    }
    showToast('Prayer saved to reflections');
    setTimeout(() => setShowHeart(false), 700);
  }, [
    saved,
    reflectionId,
    prayer,
    guidanceId,
    issueSummary,
    trySaveReflection,
    removeReflection,
    showToast,
  ]);

  const onDoubleTap = useDoubleTap(handleToggleSave);

  return (
    <View>
      <HeartBurst visible={showHeart} />
      <Pressable onPress={onDoubleTap}>
        <Text variant="body" style={{ fontStyle: 'italic' }}>
          {prayer}
        </Text>
        <Pressable
          onPress={handleToggleSave}
          hitSlop={8}
          accessibilityLabel={saved ? 'Unsave prayer' : 'Save prayer'}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.sm,
            gap: spacing.xs,
          }}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={16}
            color={colors.primary}
          />
          <Text variant="caption" color="muted">
            {saved ? 'Saved to reflections · tap to unsave' : 'Double-tap or tap heart to save'}
          </Text>
        </Pressable>
      </Pressable>
    </View>
  );
}
