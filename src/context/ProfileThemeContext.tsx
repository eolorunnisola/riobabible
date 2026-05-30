import React, { createContext, useContext, useMemo } from 'react';
import { useTheme } from '@/src/context/ThemeContext';
import type { ProfileTheme } from '@/src/theme/profileColors';

const ProfileThemeContext = createContext<ProfileTheme | null>(null);

/** Profile/settings surfaces use the same palette as the rest of the app. */
export function ProfileThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const value = useMemo<ProfileTheme>(
    () => ({
      colors: theme.colors,
      spacing: theme.spacing,
      radius: theme.radius,
      typography: theme.typography,
      shadows: theme.shadows,
      isDark: theme.isDark,
    }),
    [theme],
  );

  return (
    <ProfileThemeContext.Provider value={value}>{children}</ProfileThemeContext.Provider>
  );
}

export function useProfileTheme() {
  const ctx = useContext(ProfileThemeContext);
  if (!ctx) throw new Error('useProfileTheme must be used within ProfileThemeProvider');
  return ctx;
}
