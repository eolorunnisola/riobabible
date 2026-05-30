import { ThemeColors } from './colors';
import { palette } from './colors';
import { cardShadow, modalShadow, softShadow } from './shadows';
import { radius, spacing } from './spacing';
import { typography } from './typography';

/** High-contrast dark palette for profile & settings */
export const profileDarkColors: ThemeColors = {
  background: '#12100E',
  backgroundSecondary: '#1A1714',
  surface: '#242019',
  surfaceElevated: '#2E2A25',
  card: '#2A2622',
  text: '#F5FAFA',
  textSecondary: '#CEDFD9',
  textMuted: '#B09398',
  primary: '#D4A0A2',
  primaryMuted: palette.smokyRose,
  accent: '#3D524C',
  border: '#3F3A35',
  borderSubtle: 'rgba(245, 250, 250, 0.08)',
  success: '#9BC4A3',
  warning: '#D4B88A',
  danger: '#E8928D',
  dangerSurface: '#3A2826',
  overlay: 'rgba(0, 0, 0, 0.72)',
  tabBar: 'rgba(18, 16, 14, 0.96)',
  inputBackground: '#2E2A25',
  shimmerBase: '#2A2622',
  shimmerHighlight: '#3A3530',
  userBubble: palette.smokyRose,
  assistantBubble: '#2A2622',
};

export const profileTheme = {
  colors: profileDarkColors,
  spacing,
  radius,
  typography,
  shadows: {
    card: cardShadow('dark'),
    soft: softShadow('dark'),
    modal: cardShadow('dark'),
  },
  isDark: true,
};

export type ProfileTheme = {
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadows: {
    card: ReturnType<typeof cardShadow>;
    soft: ReturnType<typeof softShadow>;
    modal: ReturnType<typeof modalShadow>;
  };
  isDark: boolean;
};
