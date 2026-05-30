import {
  ContactButton,
  InfoBullet,
  InfoParagraph,
  InfoScreen,
  InfoSection,
  SUPPORT_EMAIL,
} from '@/src/components/profile/InfoScreen';
import { APP_NAME } from '@/src/constants/app';
import { FREE_TIER_LIMITS } from '@/src/constants/subscription';

export default function PrivacyPolicyScreen() {
  return (
    <InfoScreen
      title="Privacy Policy"
      subtitle={`Your reflections are personal. This policy explains what ${APP_NAME} collects, why, and the control you have over your information.`}
      lastUpdated="May 2026"
    >
      <InfoSection title="Information we collect">
        <InfoParagraph>
          We aim to collect only what is needed to give you a meaningful, personalized experience:
        </InfoParagraph>
        <InfoBullet>
          Account details you provide when you register — your email address and optional display
          name.
        </InfoBullet>
        <InfoBullet>
          Your preferences, such as Bible translation, guidance tone, prayer style, and app color
          theme.
        </InfoBullet>
        <InfoBullet>
          Content you create in the app, including guidance questions and responses, saved verses and
          prayers, journal entries, reflections, weekly faith reflections, and devotional plan
          progress.
        </InfoBullet>
        <InfoBullet>
          Subscription status (free, trial, or Premium) and usage counts used to enforce plan limits
          (for example, daily chat caps and saved-item limits).
        </InfoBullet>
        <InfoBullet>
          Basic technical information (device type and app version) used to keep the app stable.
        </InfoBullet>
      </InfoSection>

      <InfoSection title="How we use your information">
        <InfoBullet>To generate Scripture-centered guidance tailored to your preferences.</InfoBullet>
        <InfoBullet>To provide the daily encouragement feed (verse, prayer, and reflection).</InfoBullet>
        <InfoBullet>To save your journal, reflections, chats, and settings across your devices.</InfoBullet>
        <InfoBullet>To sync multi-day devotional plan progress when you use Premium.</InfoBullet>
        <InfoBullet>To verify your account, process subscriptions, and keep the service secure.</InfoBullet>
        <InfoBullet>To diagnose problems and improve the app over time.</InfoBullet>
      </InfoSection>

      <InfoSection title="AI processing">
        <InfoParagraph>
          To create guidance and some daily content, the questions and context you submit are sent to
          our AI provider (Google&apos;s Gemini service) for processing. We send only what is needed to
          answer your request. Please avoid including sensitive personal details you would not want
          processed by a third-party service.
        </InfoParagraph>
      </InfoSection>

      <InfoSection title="Subscriptions & payments">
        <InfoParagraph>
          Premium subscriptions are sold through Apple In-App Purchase and Google Play Billing. We do
          not collect or store your full payment card details — those are handled by Apple or Google.
          We may receive subscription status and related identifiers needed to unlock Premium features.
        </InfoParagraph>
      </InfoSection>

      <InfoSection title="Storage & security">
        <InfoParagraph>
          When you sign in, your account and synced content are stored using Google Firebase. Data is
          encrypted in transit. Local copies may also be kept on your device for offline access. While
          we take reasonable measures to protect your information, no method of transmission or storage
          is ever completely secure.
        </InfoParagraph>
      </InfoSection>

      <InfoSection title="How we share information">
        <InfoParagraph>
          We do not sell your personal information. We share data only with the service providers that
          make the app work — such as Firebase (authentication and cloud storage), Google Gemini (AI
          guidance), and Apple/Google (subscription billing) — and only as needed to provide the
          service or when required by law.
        </InfoParagraph>
      </InfoSection>

      <InfoSection title="Your choices & rights">
        <InfoBullet>You can review and edit your profile and preferences at any time in Settings.</InfoBullet>
        <InfoBullet>You can sign out or delete your account from Settings when signed in.</InfoBullet>
        <InfoBullet>
          You can manage or cancel a Premium subscription in your device&apos;s App Store or Google Play
          subscription settings.
        </InfoBullet>
        <InfoBullet>
          You can request access to, correction of, or deletion of your account data by contacting us.
        </InfoBullet>
      </InfoSection>

      <InfoSection title="Children's privacy">
        <InfoParagraph>
          {APP_NAME} is not directed to children under 13, and we do not knowingly collect personal
          information from them. If you believe a child has provided us information, please contact us
          so we can remove it.
        </InfoParagraph>
      </InfoSection>

      <InfoSection title="Changes to this policy">
        <InfoParagraph>
          We may update this policy as the app evolves. When we make material changes, we&apos;ll
          update the date above and, where appropriate, notify you in the app.
        </InfoParagraph>
      </InfoSection>

      <InfoSection title="Contact us">
        <InfoParagraph>
          Questions about your privacy? Reach out at {SUPPORT_EMAIL}.
        </InfoParagraph>
        <ContactButton />
      </InfoSection>
    </InfoScreen>
  );
}
