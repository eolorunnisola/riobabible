import { router } from 'expo-router';
import { OnboardingShell } from '@/src/components/onboarding/OnboardingShell';
import { SelectionChip } from '@/src/components/onboarding/SelectionChip';
import { useApp } from '@/src/context/AppContext';
import { GuidanceTone } from '@/src/types';

const OPTIONS: { value: GuidanceTone; label: string; description: string }[] = [
  { value: 'gentle', label: 'Gentle', description: 'Soft, patient, and reassuring' },
  { value: 'direct', label: 'Direct', description: 'Clear and honest, with compassion' },
  { value: 'encouraging', label: 'Encouraging', description: 'Hope-forward and uplifting' },
  { value: 'contemplative', label: 'Contemplative', description: 'Reflective and unhurried' },
];

export default function ToneScreen() {
  const { preferences, updatePreferences } = useApp();

  return (
    <OnboardingShell
      step={2}
      totalSteps={4}
      title="How should guidance sound?"
      subtitle="This shapes the tone of reflections — not the truth of Scripture."
      onNext={() => router.push('/onboarding/prayer')}
    >
      {OPTIONS.map((opt) => (
        <SelectionChip
          key={opt.value}
          label={opt.label}
          description={opt.description}
          selected={preferences.tone === opt.value}
          onPress={() => updatePreferences({ tone: opt.value })}
        />
      ))}
    </OnboardingShell>
  );
}
