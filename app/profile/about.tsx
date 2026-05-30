import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import {
  ContactButton,
  InfoBullet,
  InfoParagraph,
  InfoScreen,
  InfoSection,
} from '@/src/components/profile/InfoScreen';
import { AppLogo } from '@/src/components/ui/AppLogo';
import { ProfileText } from '@/src/components/profile/ProfileText';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';
import { APP_NAME } from '@/src/constants/app';
import { FREE_TIER_LIMITS } from '@/src/constants/subscription';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export default function AboutScreen() {
  const { colors, spacing, radius } = useProfileTheme();

  return (
    <InfoScreen title="About">
      <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
        <View
          style={[
            styles.logo,
            { backgroundColor: colors.primary + '22', borderRadius: radius.xxl },
          ]}
        >
          <AppLogo size={72} />
        </View>
        <ProfileText variant="h2" style={{ marginTop: spacing.md }}>
          {APP_NAME}
        </ProfileText>
        <ProfileText variant="bodySmall" tone="muted" style={{ marginTop: spacing.xxs }}>
          Version {APP_VERSION}
        </ProfileText>
        <ProfileText
          variant="body"
          tone="secondary"
          style={{ marginTop: spacing.sm, textAlign: 'center', lineHeight: 24 }}
        >
          Scripture-centered guidance for everyday life.
        </ProfileText>
      </View>

      <InfoSection title="Our mission">
        <InfoParagraph>
          {APP_NAME} exists to help you bring life&apos;s questions to Scripture. Whether you are
          seeking comfort, direction, or simply a moment of reflection, our goal is to point you back
          to God&apos;s Word in a way that feels personal and accessible.
        </InfoParagraph>
      </InfoSection>

      <InfoSection title="What you can do here">
        <InfoBullet>Ask about anything on your heart and receive Scripture-rooted guidance.</InfoBullet>
        <InfoBullet>Start each day with a verse, prayer, and reflection on the Daily tab.</InfoBullet>
        <InfoBullet>Keep a private journal and capture entries over time.</InfoBullet>
        <InfoBullet>Save up to {FREE_TIER_LIMITS.savedReflectionsLimit} verses, prayers, or guidance responses (Premium: unlimited).</InfoBullet>
        <InfoBullet>Follow multi-day devotional plans with Premium (anxiety, forgiveness, grief, and more).</InfoBullet>
        <InfoBullet>Personalize translation, tone, prayer style, and color theme in Settings (Premium unlocks all themes).</InfoBullet>
      </InfoSection>

      <InfoSection title="Our approach">
        <InfoParagraph>
          Guidance is generated with the help of artificial intelligence, grounded in the Bible
          translation you choose. We strive to be respectful, encouraging, and faithful to Scripture —
          while always encouraging you to read the Word for yourself and lean on your faith community.
        </InfoParagraph>
      </InfoSection>

      <InfoSection title="A gentle reminder">
        <InfoParagraph>
          {APP_NAME} is a companion for devotion and reflection, not a replacement for your church,
          pastoral care, or professional counsel. We hope it encourages you on your journey of faith.
        </InfoParagraph>
      </InfoSection>

      <InfoSection title="Get in touch">
        <InfoParagraph>
          We&apos;d love to hear how {APP_NAME} is helping you — and how we can make it better.
        </InfoParagraph>
        <ContactButton />
      </InfoSection>

      <ProfileText variant="caption" tone="muted" style={{ textAlign: 'center' }}>
        Made with care to help you grow in faith.
      </ProfileText>
    </InfoScreen>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
