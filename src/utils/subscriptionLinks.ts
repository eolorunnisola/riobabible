import { Linking, Platform } from 'react-native';

export const SUBSCRIPTION_PRICE_LABEL = '$6.99/month';

/**
 * Opens the OS subscription-management page. Resolves to `true` if the URL was
 * opened, `false` otherwise (e.g. the iOS Simulator has no App Store app, so the
 * deep link can't be handled). Never throws — failure is swallowed so the caller
 * doesn't surface an uncaught promise rejection.
 */
export async function openManageSubscriptions(): Promise<boolean> {
  const url =
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/account/subscriptions'
      : 'https://play.google.com/store/account/subscriptions';
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    // No handler for the URL (commonly the iOS Simulator). Real devices and
    // production builds open the store's Manage Subscriptions page normally.
    return false;
  }
}
