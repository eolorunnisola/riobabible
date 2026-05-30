import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  ContactButton,
  InfoParagraph,
  InfoScreen,
  InfoSection,
} from '@/src/components/profile/InfoScreen';
import { ProfileText } from '@/src/components/profile/ProfileText';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';
import { APP_NAME } from '@/src/constants/app';
import { FREE_TIER_LIMITS, PREMIUM_TRIAL_DAYS } from '@/src/constants/subscription';

const FAQS: { q: string; a: string }[] = [
  {
    q: `How does ${APP_NAME} work?`,
    a: `Share what is on your heart on the Guidance tab, and ${APP_NAME} responds with Scripture-centered encouragement, relevant verses, and an optional prayer. Each response follows the translation, tone, and prayer style you choose in Settings. The Daily tab offers a verse, prayer, and reflection for each day.`,
  },
  {
    q: 'What is included in the free plan?',
    a: `Free accounts include daily encouragement, up to ${FREE_TIER_LIMITS.dailyChatLimit} guidance chats per day, journaling (last ${FREE_TIER_LIMITS.journalHistoryDays} days of history), up to ${FREE_TIER_LIMITS.savedReflectionsLimit} saved verses/prayers/guidance items, and the Sage Mist color theme. See Settings → What's included for the full list.`,
  },
  {
    q: 'What does Premium include?',
    a: `Premium unlocks unlimited guidance chats, full journal history, unlimited saves, weekly faith reflections, multi-day devotional plans, and all color themes. Start a ${PREMIUM_TRIAL_DAYS}-day free trial from Settings or the paywall.`,
  },
  {
    q: 'How do I change my Bible translation?',
    a: 'Open your Profile, tap the settings button, and pick a translation under "Bible translation." Your choice is used for verses in guidance, daily content, and devotional plans.',
  },
  {
    q: 'Can I adjust the tone and prayers?',
    a: 'Yes. In Settings you can set a guidance tone (gentle, direct, encouraging, or contemplative), choose a prayer style, and toggle automatic prayers in responses. Free accounts use the Sage Mist color theme; Premium unlocks all palettes.',
  },
  {
    q: 'What are devotional plans?',
    a: 'Premium multi-day Scripture journeys (for example, topics like anxiety, forgiveness, or grief). Each day includes verses, reflection, prayer, and optional practice. Progress syncs when you are signed in. Open Profile → Settings → Devotional plans.',
  },
  {
    q: 'What are weekly faith reflections?',
    a: 'Premium only. Each week you save items, Rioba can generate an editable weekly note summarizing your saved verses and prayers. Free users can still browse saved items by week, but not open or edit the weekly reflection.',
  },
  {
    q: 'Where are my journal entries and reflections saved?',
    a: 'Journal entries live under the Journal tab. Saved verses, prayers, and guidance summaries appear under Reflections, organized by week. When you are signed in, your data syncs securely to your account.',
  },
  {
    q: 'How do I verify my email?',
    a: 'After registering, we send a verification link to your email. Tap the link, then return to the app and select "I\'ve verified — continue." You can resend the email from the verification screen if needed — remember to check your spam folder.',
  },
  {
    q: 'How do I cancel Premium?',
    a: 'Subscriptions are managed by Apple or Google, not inside the app. On iPhone: Settings → your name → Subscriptions. On Android: Google Play → Payments & subscriptions → Subscriptions. You can also open Manage subscription from Settings → Plan in the app.',
  },
  {
    q: 'Is my information private?',
    a: 'We collect only what we need and never sell your data. Guidance text is processed by our AI provider to generate responses. See the Privacy Policy in Settings for full details.',
  },
  {
    q: `Is ${APP_NAME} a replacement for my church or a counselor?`,
    a: `No. ${APP_NAME} is a devotional tool. It is not a substitute for pastoral care, professional counseling, or medical and mental-health support. Please lean on your community and qualified professionals when you need them.`,
  },
];

function FaqRow({ item, isOpen, onToggle }: { item: { q: string; a: string }; isOpen: boolean; onToggle: () => void }) {
  const { colors, spacing, radius } = useProfileTheme();
  return (
    <View
      style={[
        styles.faqCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
          marginBottom: spacing.sm,
        },
      ]}
    >
      <Pressable
        onPress={onToggle}
        style={[styles.faqHeader, { padding: spacing.md }]}
        accessibilityRole="button"
      >
        <ProfileText variant="button" style={{ flex: 1, paddingRight: spacing.sm }}>
          {item.q}
        </ProfileText>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textMuted}
        />
      </Pressable>
      {isOpen ? (
        <Animated.View
          entering={FadeIn.duration(160)}
          style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.md }}
        >
          <ProfileText variant="body" tone="secondary" style={{ lineHeight: 24 }}>
            {item.a}
          </ProfileText>
        </Animated.View>
      ) : null}
    </View>
  );
}

export default function HelpScreen() {
  const { colors, spacing, radius } = useProfileTheme();
  const [open, setOpen] = useState<number | null>(0);

  const toggle = (i: number) => {
    void Haptics.selectionAsync();
    setOpen((cur) => (cur === i ? null : i));
  };

  return (
    <InfoScreen
      title="Help Center"
      subtitle="Answers to common questions, plus a direct line to our team."
    >
      <InfoSection title="Frequently asked questions">
        {FAQS.map((item, i) => (
          <FaqRow key={item.q} item={item} isOpen={open === i} onToggle={() => toggle(i)} />
        ))}
      </InfoSection>

      <InfoSection title="Need immediate support?">
        <InfoParagraph>
          If you are in crisis or thinking about harming yourself, you are not alone. Open the crisis
          support screen for resources, or contact your local emergency services right away.
        </InfoParagraph>
        <Pressable
          onPress={() => router.push('/crisis')}
          style={({ pressed }) => [
            styles.crisisBtn,
            {
              backgroundColor: colors.dangerSurface,
              borderColor: colors.danger,
              borderRadius: radius.lg,
              padding: spacing.md,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Ionicons name="heart-outline" size={20} color={colors.danger} />
          <ProfileText
            variant="button"
            style={{ color: colors.danger, marginLeft: spacing.sm }}
          >
            Open crisis support
          </ProfileText>
        </Pressable>
      </InfoSection>

      <InfoSection title="Still need help?">
        <InfoParagraph>
          Can&apos;t find what you&apos;re looking for? Send us a message and we&apos;ll be glad to
          help.
        </InfoParagraph>
        <ContactButton />
      </InfoSection>
    </InfoScreen>
  );
}

const styles = StyleSheet.create({
  faqCard: { borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  faqHeader: { flexDirection: 'row', alignItems: 'center' },
  crisisBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
