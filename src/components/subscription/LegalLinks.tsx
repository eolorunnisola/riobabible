import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ProfileText } from '@/src/components/profile/ProfileText';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';

export function LegalLinks() {
  const { colors, spacing } = useProfileTheme();

  return (
    <View style={[styles.row, { marginTop: spacing.md, gap: spacing.sm }]}>
      <Pressable onPress={() => router.push('/profile/terms')} hitSlop={8}>
        <ProfileText variant="bodySmall" style={{ color: colors.primary, textDecorationLine: 'underline' }}>
          Terms of Use
        </ProfileText>
      </Pressable>
      <ProfileText variant="bodySmall" tone="muted">
        ·
      </ProfileText>
      <Pressable onPress={() => router.push('/profile/privacy')} hitSlop={8}>
        <ProfileText variant="bodySmall" style={{ color: colors.primary, textDecorationLine: 'underline' }}>
          Privacy Policy
        </ProfileText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
});
