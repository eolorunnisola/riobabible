import { Linking, Platform } from 'react-native';

export const SUBSCRIPTION_PRICE_LABEL = '$4.99/month';

export function openManageSubscriptions(): void {
  const url =
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/account/subscriptions'
      : 'https://play.google.com/store/account/subscriptions';
  void Linking.openURL(url);
}
