import { TextStyle } from 'react-native';

export const fontFamilies = {
  serif: 'CormorantGaramond_600SemiBold',
  serifRegular: 'CormorantGaramond_400Regular',
  sans: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
  sansSemiBold: 'DMSans_600SemiBold',
} as const;

export const typography = {
  display: {
    fontFamily: fontFamilies.serif,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.5,
  } satisfies TextStyle,
  h1: {
    fontFamily: fontFamilies.serif,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.3,
  } satisfies TextStyle,
  h2: {
    fontFamily: fontFamilies.sansSemiBold,
    fontSize: 22,
    lineHeight: 28,
  } satisfies TextStyle,
  h3: {
    fontFamily: fontFamilies.sansSemiBold,
    fontSize: 18,
    lineHeight: 24,
  } satisfies TextStyle,
  body: {
    fontFamily: fontFamilies.sans,
    fontSize: 16,
    lineHeight: 24,
  } satisfies TextStyle,
  bodySmall: {
    fontFamily: fontFamilies.sans,
    fontSize: 14,
    lineHeight: 20,
  } satisfies TextStyle,
  caption: {
    fontFamily: fontFamilies.sans,
    fontSize: 12,
    lineHeight: 16,
  } satisfies TextStyle,
  label: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.4,
    textTransform: 'uppercase' as const,
  } satisfies TextStyle,
  verse: {
    fontFamily: fontFamilies.serifRegular,
    fontSize: 20,
    lineHeight: 30,
    fontStyle: 'italic' as const,
  } satisfies TextStyle,
  button: {
    fontFamily: fontFamilies.sansSemiBold,
    fontSize: 16,
    lineHeight: 20,
  } satisfies TextStyle,
};
