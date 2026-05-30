import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SPLASH_BACKGROUND } from '@/src/constants/brand';

const inAppLogoSource = require('../../assets/images/in-app-logo.png');

const EXIT_MS = 520;
const LOGO_SCALE_END = 1.06;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SPLASH_LOGO_SIZE = Math.round(SCREEN_WIDTH * 0.52);

type Props = {
  appReady: boolean;
};

async function hideNativeSplashOnce(didHide: { current: boolean }) {
  if (didHide.current) return;
  didHide.current = true;
  try {
    await SplashScreen.hideAsync();
  } catch {
    // Native splash may already be hidden
  }
}

export function AnimatedSplash({ appReady }: Props) {
  const [hidden, setHidden] = useState(false);
  const nativeHidden = useRef(false);
  const exitStarted = useRef(false);

  const overlayOpacity = useSharedValue(1);
  const logoOpacity = useSharedValue(1);
  const logoScale = useSharedValue(1);

  const finishExit = useCallback(() => {
    setHidden(true);
  }, []);

  const startExit = useCallback(() => {
    if (exitStarted.current) return;
    exitStarted.current = true;

    const easing = Easing.out(Easing.cubic);

    logoScale.value = withTiming(LOGO_SCALE_END, { duration: EXIT_MS, easing });
    logoOpacity.value = withTiming(0, { duration: EXIT_MS, easing });
    overlayOpacity.value = withTiming(0, { duration: EXIT_MS + 80, easing }, (finished) => {
      if (finished) runOnJS(finishExit)();
    });
  }, [finishExit, logoOpacity, logoScale, overlayOpacity]);

  useEffect(() => {
    if (appReady) startExit();
  }, [appReady, startExit]);

  const onLayout = useCallback(() => {
    void hideNativeSplashOnce(nativeHidden);
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  if (hidden) return null;

  return (
    <Animated.View
      pointerEvents={appReady ? 'none' : 'auto'}
      style={[styles.overlay, { backgroundColor: SPLASH_BACKGROUND }, overlayStyle]}
      onLayout={onLayout}
    >
      <View style={styles.center}>
        <Animated.View style={logoStyle}>
          <Image
            source={inAppLogoSource}
            style={{ width: SPLASH_LOGO_SIZE, height: SPLASH_LOGO_SIZE }}
            resizeMode="contain"
            accessibilityLabel="Rioba"
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
