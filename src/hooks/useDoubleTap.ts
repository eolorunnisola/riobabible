import { useCallback, useRef } from 'react';
import { hapticSuccess } from '@/src/utils/haptics';

const DOUBLE_TAP_DELAY = 300;

export function useDoubleTap(onDoubleTap: () => void) {
  const lastTap = useRef(0);

  const onPress = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      hapticSuccess();
      onDoubleTap();
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  }, [onDoubleTap]);

  return onPress;
}
