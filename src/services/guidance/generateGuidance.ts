import { classifyUserIssue } from '@/src/services/gemini/classify';
import { composeGuidanceFromVerses } from '@/src/services/gemini/compose';
import { isGeminiConfigured } from '@/src/services/gemini/config';
import { GeminiError } from '@/src/services/gemini/client';
import { getReferencesForCategory, retrieveVerses } from '@/src/services/bible/lookup';
import { DEFAULT_GUIDANCE } from '@/src/data/defaultGuidance';
import { GuidanceResponse, UserPreferences } from '@/src/types';
import { reflectionTitleFromGuidance } from '@/src/utils/reflectionTitle';
import { detectOffTopicContent } from '@/src/services/guidance/detectOffTopic';
import { OffTopicPromptError } from '@/src/services/guidance/offTopic';

export class CrisisDetectedError extends Error {
  constructor() {
    super('crisis');
    this.name = 'CrisisDetectedError';
  }
}

export class GuidanceGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GuidanceGenerationError';
  }
}

/**
 * Pipeline: classify → retrieve verses from local Bible DB → Gemini explains → safety flags
 */
export async function generateGuidance(
  userMessage: string,
  preferences: UserPreferences,
): Promise<GuidanceResponse> {
  if (!isGeminiConfigured()) {
    const summary = userMessage.trim().slice(0, 160) || 'what you shared';
    const reflectionTitle = reflectionTitleFromGuidance({
      issueSummary: summary,
      category: DEFAULT_GUIDANCE.category,
      empathy: DEFAULT_GUIDANCE.empathy,
    });
    return {
      ...DEFAULT_GUIDANCE,
      id: `guidance-${Date.now()}`,
      issueSummary: summary,
      reflectionTitle,
      empathy: `Thank you for sharing this with me. I hear the weight of ${summary.length > 80 ? 'what you are carrying' : `"${summary}"`}, and you are not alone in it.`,
      biblicalPerspective: DEFAULT_GUIDANCE.biblicalPerspective,
      createdAt: Date.now(),
      disclaimer:
        'This is spiritual encouragement rooted in Scripture, not professional counseling, medical, or mental health treatment. Add EXPO_PUBLIC_GEMINI_API_KEY for personalized AI guidance.',
    };
  }

  try {
    if (detectOffTopicContent(userMessage)) {
      throw new OffTopicPromptError();
    }

    const classification = await classifyUserIssue(userMessage);

    if (classification.needsCrisisScreen) {
      throw new CrisisDetectedError();
    }

    const refs = [
      ...classification.suggestedReferences,
      ...getReferencesForCategory(classification.category),
    ];
    const uniqueRefs = [...new Set(refs)].slice(0, 4);

    const { verses } = retrieveVerses(uniqueRefs, preferences.translation);

    if (verses.length === 0) {
      throw new GuidanceGenerationError(
        'Could not load verse text. Run: npm run build:bible -- --translation=NIV',
      );
    }

    const composed = await composeGuidanceFromVerses(
      userMessage,
      classification.issueSummary,
      verses,
      preferences,
      { showDisclaimer: classification.needsDisclaimer },
    );

    const disclaimer = composed.showDisclaimer
      ? 'This is spiritual encouragement rooted in Scripture, not professional counseling, medical, or mental health treatment.'
      : undefined;

    return {
      id: `guidance-${Date.now()}`,
      issueSummary: classification.issueSummary,
      reflectionTitle: reflectionTitleFromGuidance({
        reflectionTitle: composed.reflectionTitle,
        issueSummary: classification.issueSummary,
        category: classification.category,
        empathy: composed.empathy,
      }),
      empathy: composed.empathy,
      biblicalPerspective: composed.biblicalPerspective,
      verses,
      explanation: composed.explanation,
      prayer: preferences.autoIncludePrayer ? composed.prayer : '',
      nextStep: composed.nextStep,
      journalPrompts: composed.journalPrompts ?? [],
      disclaimer,
      category: classification.category,
      createdAt: Date.now(),
    };
  } catch (err) {
    if (err instanceof CrisisDetectedError) throw err;
    if (err instanceof OffTopicPromptError) throw err;
    if (err instanceof GeminiError) {
      throw new GuidanceGenerationError(err.message);
    }
    throw err;
  }
}
