import { router } from 'expo-router';
import { OnboardingShell } from '@/src/components/onboarding/OnboardingShell';
import { SelectionChip } from '@/src/components/onboarding/SelectionChip';
import { useApp } from '@/src/context/AppContext';
import { PrayerPreference } from '@/src/types';

const OPTIONS: { value: PrayerPreference; label: string; description: string }[] = [
  { value: 'short', label: 'Short prayers', description: 'Brief words you can pray quickly' },
  { value: 'detailed', label: 'Detailed prayers', description: 'Richer language and imagery' },
  {
    value: 'scripture-focused',
    label: 'Scripture-focused',
    description: 'Prayers woven with verse language',
  },
  { value: 'minimal', label: 'Minimal', description: 'Simple prompts; you fill in the words' },
];

export default function PrayerScreen() {
  const { preferences, updatePreferences } = useApp();

  return (
    <OnboardingShell
      step={3}
      totalSteps={4}
      title="Prayer preferences"
      subtitle="We will tailor suggested prayers to your style."
      onNext={() => router.push('/onboarding/complete')}
    >
      {OPTIONS.map((opt) => (
        <SelectionChip
          key={opt.value}
          label={opt.label}
          description={opt.description}
          selected={preferences.prayerPreference === opt.value}
          onPress={() => updatePreferences({ prayerPreference: opt.value })}
        />
      ))}
    </OnboardingShell>
  );
}
