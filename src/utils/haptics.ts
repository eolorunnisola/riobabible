import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

function run(fn: () => Promise<void>): void {
  if (!enabled) return;
  void fn().catch(() => {});
}

/** Subtle tap — buttons, cards, primary actions. */
export function hapticLight(): void {
  run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

/** Pickers, toggles, tabs, list selections. */
export function hapticSelection(): void {
  run(() => Haptics.selectionAsync());
}

/** Completed saves, likes, successful flows. */
export function hapticSuccess(): void {
  run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

/** Locked or premium-gated actions. */
export function hapticWarning(): void {
  run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
}

/** Errors and destructive confirmations. */
export function hapticError(): void {
  run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
}
