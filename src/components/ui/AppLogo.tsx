import { Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';

const inAppLogoSource = require('../../../assets/images/in-app-logo.png');

type Props = {
  size?: number;
  style?: StyleProp<ImageStyle>;
};

/** In-app brand mark (book + sprout) — use on screens, not the home-screen icon asset. */
export function AppLogo({ size = 120, style }: Props) {
  return (
    <Image
      source={inAppLogoSource}
      style={[styles.logo, { width: size, height: size }, style]}
      resizeMode="contain"
      accessibilityLabel="Rioba logo"
    />
  );
}

const styles = StyleSheet.create({
  logo: {},
});
