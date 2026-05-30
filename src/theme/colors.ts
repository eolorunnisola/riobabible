import { ColorThemeId, getThemeColors } from './colorThemes';

export type { ColorThemeId } from './colorThemes';

/** Faith-based palette from brand guidelines */
export const palette = {
  stoneBrown: '#5F5449',
  smokyRose: '#9B6A6C',
  rosyTaupe: '#B09398',
  azureMist: '#CEDFD9',
  azureMistLight: '#EBFCFB',
} as const;

export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryMuted: string;
  accent: string;
  border: string;
  borderSubtle: string;
  success: string;
  warning: string;
  danger: string;
  dangerSurface: string;
  overlay: string;
  tabBar: string;
  inputBackground: string;
  shimmerBase: string;
  shimmerHighlight: string;
  userBubble: string;
  assistantBubble: string;
};

export const lightColors: ThemeColors = {
  background: palette.azureMistLight,
  backgroundSecondary: palette.azureMist,
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  text: palette.stoneBrown,
  textSecondary: '#7A6E63',
  textMuted: palette.rosyTaupe,
  primary: palette.smokyRose,
  primaryMuted: '#C49A9C',
  accent: palette.azureMist,
  border: palette.azureMist,
  borderSubtle: 'rgba(95, 84, 73, 0.08)',
  success: '#6B8F71',
  warning: '#C4A574',
  danger: '#B85450',
  dangerSurface: '#FDF0EF',
  overlay: 'rgba(95, 84, 73, 0.45)',
  tabBar: 'rgba(235, 252, 251, 0.92)',
  inputBackground: '#FFFFFF',
  shimmerBase: palette.azureMist,
  shimmerHighlight: palette.azureMistLight,
  userBubble: palette.smokyRose,
  assistantBubble: '#FFFFFF',
};

export const darkColors: ThemeColors = {
  background: '#1E1B18',
  backgroundSecondary: '#2A2622',
  surface: '#322E2A',
  surfaceElevated: '#3D3833',
  card: '#3A3530',
  text: palette.azureMistLight,
  textSecondary: palette.azureMist,
  textMuted: palette.rosyTaupe,
  primary: '#C4898B',
  primaryMuted: palette.smokyRose,
  accent: '#4A5F58',
  border: '#4A4540',
  borderSubtle: 'rgba(235, 252, 251, 0.06)',
  success: '#8FB396',
  warning: '#D4B88A',
  danger: '#E07A75',
  dangerSurface: '#3D2826',
  overlay: 'rgba(0, 0, 0, 0.6)',
  tabBar: 'rgba(30, 27, 24, 0.94)',
  inputBackground: '#322E2A',
  shimmerBase: '#3A3530',
  shimmerHighlight: '#4A4540',
  userBubble: palette.smokyRose,
  assistantBubble: '#3A3530',
};

export function getColors(mode: ThemeMode, colorTheme: ColorThemeId = 'sage'): ThemeColors {
  return getThemeColors(mode, colorTheme);
}

/** @deprecated Use getColors(mode, colorTheme) — kept for legacy imports */
export function getLegacyColors(mode: ThemeMode): ThemeColors {
  return mode === 'dark' ? darkColors : lightColors;
}
