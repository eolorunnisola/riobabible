import type { ThemeColors, ThemeMode } from './colors';

export type ColorThemeId = 'sage' | 'evergreen' | 'harvest' | 'twilight' | 'bloom';

export type ColorThemeOption = {
  id: ColorThemeId;
  label: string;
  description: string;
  swatches: readonly [string, string, string, string, string];
};

/** Brand palettes from app theme options */
export const COLOR_THEME_OPTIONS: ColorThemeOption[] = [
  {
    id: 'sage',
    label: 'Sage Mist',
    description: 'Calm greens and cool sky blues',
    swatches: ['#4E5340', '#697268', '#95A3A4', '#B7D1DA', '#E2E8DD'],
  },
  {
    id: 'evergreen',
    label: 'Quiet Grove',
    description: 'Deep forest green with soft violet',
    swatches: ['#1B3022', '#395756', '#4F5D75', '#7261A3', '#A67DB8'],
  },
  {
    id: 'harvest',
    label: 'Warm Harvest',
    description: 'Earthy taupe with golden highlights',
    swatches: ['#4B4237', '#D5A021', '#EDE7D9', '#A49694', '#736B60'],
  },
  {
    id: 'twilight',
    label: 'Twilight Hymn',
    description: 'Cream and lavender over deep navy',
    swatches: ['#F1DAC4', '#A69CAC', '#474973', '#161B33', '#0D0C1D'],
  },
  {
    id: 'bloom',
    label: 'Evening Bloom',
    description: 'Midnight violet through cotton candy pink',
    swatches: ['#361134', '#B0228C', '#EA3788', '#E56B70', '#F391A0'],
  },
];

type Palette = { light: ThemeColors; dark: ThemeColors };

function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildPalette(
  light: Omit<ThemeColors, 'borderSubtle' | 'overlay' | 'tabBar' | 'shimmerBase' | 'shimmerHighlight'> & {
    borderSubtle?: string;
    overlay?: string;
    tabBar?: string;
  },
  dark: Omit<ThemeColors, 'borderSubtle' | 'overlay' | 'tabBar' | 'shimmerBase' | 'shimmerHighlight'> & {
    borderSubtle?: string;
    overlay?: string;
    tabBar?: string;
  },
): Palette {
  return {
    light: {
      ...light,
      borderSubtle: light.borderSubtle ?? withAlpha(light.text, 0.08),
      overlay: light.overlay ?? withAlpha(light.text, 0.45),
      tabBar: light.tabBar ?? withAlpha(light.background, 0.92),
      shimmerBase: light.accent,
      shimmerHighlight: light.background,
    },
    dark: {
      ...dark,
      borderSubtle: dark.borderSubtle ?? withAlpha(dark.text, 0.08),
      overlay: dark.overlay ?? 'rgba(0, 0, 0, 0.6)',
      tabBar: dark.tabBar ?? withAlpha(dark.background, 0.94),
      shimmerBase: dark.surface,
      shimmerHighlight: dark.surfaceElevated,
    },
  };
}

const THEME_PALETTES: Record<ColorThemeId, Palette> = {
  sage: buildPalette(
    {
      background: '#E2E8DD',
      backgroundSecondary: '#B7D1DA',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      card: '#FFFFFF',
      text: '#4E5340',
      textSecondary: '#697268',
      textMuted: '#95A3A4',
      primary: '#697268',
      primaryMuted: '#95A3A4',
      accent: '#B7D1DA',
      border: '#B7D1DA',
      success: '#6B8F71',
      warning: '#C4A574',
      danger: '#B85450',
      dangerSurface: '#FDF0EF',
      inputBackground: '#FFFFFF',
      userBubble: '#697268',
      assistantBubble: '#FFFFFF',
    },
    {
      background: '#2C3028',
      backgroundSecondary: '#3A4036',
      surface: '#42483E',
      surfaceElevated: '#4E5340',
      card: '#4A5044',
      text: '#E2E8DD',
      textSecondary: '#B7D1DA',
      textMuted: '#95A3A4',
      primary: '#B7D1DA',
      primaryMuted: '#95A3A4',
      accent: '#4E5340',
      border: '#5C6354',
      success: '#8FB396',
      warning: '#D4B88A',
      danger: '#E07A75',
      dangerSurface: '#3D2826',
      inputBackground: '#42483E',
      userBubble: '#697268',
      assistantBubble: '#4A5044',
    },
  ),
  evergreen: buildPalette(
    {
      background: '#EEF0F4',
      backgroundSecondary: '#C5CCD6',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      card: '#FFFFFF',
      text: '#1B3022',
      textSecondary: '#395756',
      textMuted: '#4F5D75',
      primary: '#7261A3',
      primaryMuted: '#A67DB8',
      accent: '#C5CCD6',
      border: '#C5CCD6',
      success: '#5E8A6E',
      warning: '#C4A574',
      danger: '#B85450',
      dangerSurface: '#FDF0EF',
      inputBackground: '#FFFFFF',
      userBubble: '#4F5D75',
      assistantBubble: '#FFFFFF',
    },
    {
      background: '#121C18',
      backgroundSecondary: '#1B3022',
      surface: '#243029',
      surfaceElevated: '#2E3D34',
      card: '#2A3830',
      text: '#E8ECF0',
      textSecondary: '#A67DB8',
      textMuted: '#4F5D75',
      primary: '#A67DB8',
      primaryMuted: '#7261A3',
      accent: '#395756',
      border: '#395756',
      success: '#8FB396',
      warning: '#D4B88A',
      danger: '#E07A75',
      dangerSurface: '#3D2826',
      inputBackground: '#243029',
      userBubble: '#4F5D75',
      assistantBubble: '#2A3830',
    },
  ),
  harvest: buildPalette(
    {
      background: '#EDE7D9',
      backgroundSecondary: '#D5CFC4',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      card: '#FFFFFF',
      text: '#4B4237',
      textSecondary: '#736B60',
      textMuted: '#A49694',
      primary: '#D5A021',
      primaryMuted: '#C4921E',
      accent: '#A49694',
      border: '#D5CFC4',
      success: '#6B8F71',
      warning: '#D5A021',
      danger: '#B85450',
      dangerSurface: '#FDF0EF',
      inputBackground: '#FFFFFF',
      userBubble: '#A49694',
      assistantBubble: '#FFFFFF',
    },
    {
      background: '#1E1B17',
      backgroundSecondary: '#2C2722',
      surface: '#3A342E',
      surfaceElevated: '#4B4237',
      card: '#443D36',
      text: '#EDE7D9',
      textSecondary: '#A49694',
      textMuted: '#736B60',
      primary: '#D5A021',
      primaryMuted: '#A49694',
      accent: '#736B60',
      border: '#5A5248',
      success: '#8FB396',
      warning: '#E0C060',
      danger: '#E07A75',
      dangerSurface: '#3D2826',
      inputBackground: '#3A342E',
      userBubble: '#A49694',
      assistantBubble: '#443D36',
    },
  ),
  twilight: buildPalette(
    {
      background: '#F1DAC4',
      backgroundSecondary: '#D8C8E0',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      card: '#FFFFFF',
      text: '#161B33',
      textSecondary: '#474973',
      textMuted: '#A69CAC',
      primary: '#474973',
      primaryMuted: '#7261A3',
      accent: '#A69CAC',
      border: '#D8C8E0',
      success: '#6B8F71',
      warning: '#C4A574',
      danger: '#B85450',
      dangerSurface: '#FDF0EF',
      inputBackground: '#FFFFFF',
      userBubble: '#474973',
      assistantBubble: '#FFFFFF',
    },
    {
      background: '#0D0C1D',
      backgroundSecondary: '#161B33',
      surface: '#222640',
      surfaceElevated: '#2E3450',
      card: '#282D48',
      text: '#F1DAC4',
      textSecondary: '#A69CAC',
      textMuted: '#6E6588',
      primary: '#A69CAC',
      primaryMuted: '#7261A3',
      accent: '#474973',
      border: '#353B5C',
      success: '#8FB396',
      warning: '#D4B88A',
      danger: '#E07A75',
      dangerSurface: '#3D2826',
      inputBackground: '#222640',
      userBubble: '#474973',
      assistantBubble: '#282D48',
    },
  ),
  bloom: buildPalette(
    {
      background: '#FDE8EC',
      backgroundSecondary: '#F9C5CF',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      card: '#FFFFFF',
      text: '#361134',
      textSecondary: '#6B2458',
      textMuted: '#B0228C',
      primary: '#B0228C',
      primaryMuted: '#EA3788',
      accent: '#F391A0',
      border: '#F9C5CF',
      success: '#6B8F71',
      warning: '#C4A574',
      danger: '#C94A52',
      dangerSurface: '#FDF0EF',
      inputBackground: '#FFFFFF',
      userBubble: '#B0228C',
      assistantBubble: '#FFFFFF',
    },
    {
      background: '#361134',
      backgroundSecondary: '#4A1848',
      surface: '#52204F',
      surfaceElevated: '#5E285C',
      card: '#562454',
      text: '#FDE8EC',
      textSecondary: '#F391A0',
      textMuted: '#E56B70',
      primary: '#EA3788',
      primaryMuted: '#B0228C',
      accent: '#6B2458',
      border: '#5E285C',
      success: '#8FB396',
      warning: '#D4B88A',
      danger: '#E56B70',
      dangerSurface: '#4A1830',
      inputBackground: '#52204F',
      userBubble: '#B0228C',
      assistantBubble: '#562454',
    },
  ),
};

export function isColorThemeId(value: string): value is ColorThemeId {
  return COLOR_THEME_OPTIONS.some((option) => option.id === value);
}

export function getThemeColors(mode: ThemeMode, colorTheme: ColorThemeId): ThemeColors {
  const palette = THEME_PALETTES[colorTheme] ?? THEME_PALETTES.sage;
  return mode === 'dark' ? palette.dark : palette.light;
}

export function getThemeGradientStops(colorTheme: ColorThemeId): [string, string, string] {
  const { light } = THEME_PALETTES[colorTheme] ?? THEME_PALETTES.sage;
  return [light.background, light.accent, light.backgroundSecondary];
}
