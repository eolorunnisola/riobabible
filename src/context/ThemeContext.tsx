import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useApp } from '@/src/context/AppContext';
import { useSubscription } from '@/src/context/SubscriptionContext';
import { ThemeColors, ThemeMode, getColors } from '@/src/theme/colors';
import { ColorThemeId, isColorThemeId } from '@/src/theme/colorThemes';
import { effectiveColorTheme } from '@/src/utils/subscriptionGates';
import { cardShadow, modalShadow, softShadow } from '@/src/theme/shadows';
import { radius, spacing } from '@/src/theme';
import { typography } from '@/src/theme/typography';

type ThemeContextValue = {
  mode: ThemeMode;
  colorTheme: ColorThemeId;
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

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveColorTheme(value: unknown): ColorThemeId {
  return typeof value === 'string' && isColorThemeId(value) ? value : 'sage';
}

/** Reads color theme from app preferences — must render inside AppProvider. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { preferences } = useApp();
  const { isPremium } = useSubscription();
  const systemScheme = useSystemColorScheme();
  const mode: ThemeMode = systemScheme === 'dark' ? 'dark' : 'light';
  const storedTheme = resolveColorTheme(preferences.colorTheme);
  const colorTheme = effectiveColorTheme(storedTheme, isPremium);
  const colors = getColors(mode, colorTheme);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colorTheme,
      colors,
      spacing,
      radius,
      typography,
      shadows: {
        card: cardShadow(mode),
        soft: softShadow(mode),
        modal: modalShadow(mode),
      },
      isDark: mode === 'dark',
    }),
    [mode, colorTheme, colors],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
