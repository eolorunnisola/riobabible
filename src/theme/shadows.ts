import { Platform, ViewStyle } from 'react-native';
import { ThemeMode } from './colors';

export function cardShadow(mode: ThemeMode): ViewStyle {
  if (Platform.OS === 'android') {
    return { elevation: mode === 'light' ? 4 : 6 };
  }
  return {
    shadowColor: mode === 'light' ? '#5F5449' : '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: mode === 'light' ? 0.08 : 0.25,
    shadowRadius: 12,
  };
}

export function softShadow(mode: ThemeMode): ViewStyle {
  if (Platform.OS === 'android') {
    return { elevation: 2 };
  }
  return {
    shadowColor: mode === 'light' ? '#5F5449' : '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: mode === 'light' ? 0.06 : 0.2,
    shadowRadius: 8,
  };
}

export function modalShadow(mode: ThemeMode): ViewStyle {
  if (Platform.OS === 'android') {
    return { elevation: 8 };
  }
  return {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: mode === 'light' ? 0.12 : 0.35,
    shadowRadius: 20,
  };
}
