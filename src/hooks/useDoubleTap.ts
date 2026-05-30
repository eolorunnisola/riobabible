import { useCallback, useRef } from 'react';
import * as Haptics from 'expo-haptics';

const DOUBLE_TAP_DELAY = 300;

export function useDoubleTap(onDoubleTap: () => void) {
  const lastTap = useRef(0);

  const onPress = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onDoubleTap();
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  }, [onDoubleTap]);

  return onPress;
}
