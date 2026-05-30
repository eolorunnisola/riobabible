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
import { BibleVerse } from '@/src/types';
import { verseReflectionId } from '@/src/utils/reflectionTitle';

type Props = {
  verse: BibleVerse;
  guidanceId: string;
};

export function ScriptureVerse({ verse, guidanceId }: Props) {
  const { colors, spacing } = useTheme();
  const { trySaveReflection, removeReflection, isReflectionSaved } = useReflectionSave();
  const { showToast } = useToast();
  const reflectionId = verseReflectionId(guidanceId, verse.reference);
  const saved = isReflectionSaved(reflectionId);
  const [showHeart, setShowHeart] = useState(false);

  const handleToggleSave = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (saved) {
      removeReflection(reflectionId);
      showToast('Verse removed from reflections');
      return;
    }
    setShowHeart(true);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (!trySaveReflection({
      id: reflectionId,
      title: verse.reference,
      preview: verse.text,
      body: verse.text,
      type: 'verse',
      verseReference: verse.reference,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      liked: true,
    })) {
      return;
    }
    showToast('Verse saved');
    setTimeout(() => setShowHeart(false), 700);
  }, [saved, reflectionId, verse, trySaveReflection, removeReflection, showToast]);

  const onDoubleTap = useDoubleTap(handleToggleSave);

  return (
    <View style={{ marginBottom: spacing.md }}>
      <HeartBurst visible={showHeart} />
      <Pressable onPress={onDoubleTap}>
        <Text variant="verse">"{verse.text}"</Text>
        <Text variant="caption" color="secondary" style={{ marginTop: spacing.xs }}>
          {verse.reference}
        </Text>
        <Pressable
          onPress={handleToggleSave}
          hitSlop={8}
          accessibilityLabel={saved ? 'Unsave verse' : 'Save verse'}
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, gap: spacing.xs }}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={16}
            color={colors.primary}
          />
          <Text variant="caption" color="muted">
            {saved ? 'Tap to unsave' : 'Double-tap or tap heart to save'}
          </Text>
        </Pressable>
      </Pressable>
    </View>
  );
}
