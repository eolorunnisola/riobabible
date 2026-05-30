import { router } from 'expo-router';
import { CrisisScreenContent } from '@/src/components/safety/CrisisScreenContent';

export default function CrisisScreen() {
  return <CrisisScreenContent onDismiss={() => router.back()} />;
}
