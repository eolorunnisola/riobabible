import { Platform } from 'react-native';

/** Matches tab bar height in app/(tabs)/_layout.tsx */
export const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 64;

/** Approximate height of guidance chat input bar (input row + submit button) */
export const GUIDANCE_INPUT_BAR_HEIGHT = 168;
