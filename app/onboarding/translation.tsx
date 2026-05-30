import { router } from 'expo-router';
import { OnboardingShell } from '@/src/components/onboarding/OnboardingShell';
import { SelectionChip } from '@/src/components/onboarding/SelectionChip';
import { useApp } from '@/src/context/AppContext';
import { BibleTranslation } from '@/src/types';

const OPTIONS: { value: BibleTranslation; label: string; description: string }[] = [
  { value: 'NIV', label: 'NIV', description: 'New International Version — clear and widely used' },
  { value: 'ESV', label: 'ESV', description: 'English Standard Version — literal and readable' },
  { value: 'KJV', label: 'KJV', description: 'King James Version — traditional language' },
  { value: 'NLT', label: 'NLT', description: 'New Living Translation — conversational' },
];

export default function TranslationScreen() {
  const { preferences, updatePreferences } = useApp();

  return (
    <OnboardingShell
      step={1}
      totalSteps={4}
      title="Choose your Bible translation"
      subtitle="Verses and references will use the translation you select."
      onNext={() => router.push('/onboarding/tone')}
    >
      {OPTIONS.map((opt) => (
        <SelectionChip
          key={opt.value}
          label={opt.label}
          description={opt.description}
          selected={preferences.translation === opt.value}
          onPress={() => updatePreferences({ translation: opt.value })}
        />
      ))}
    </OnboardingShell>
  );
}
