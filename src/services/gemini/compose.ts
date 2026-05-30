import { BibleVerse, GuidanceTone, PrayerPreference, UserPreferences } from '@/src/types';
import { generateGeminiText, parseJsonResponse } from './client';

export type ComposedGuidance = {
  empathy: string;
  biblicalPerspective: string;
  explanation: string;
  nextStep: string;
  prayer: string;
  journalPrompts: string[];
  showDisclaimer: boolean;
  /** 2–4 words for saved reflection list */
  reflectionTitle?: string;
};

const SYSTEM = `You write faith-based spiritual encouragement for Rioba, a Scripture app.
Rules:
- You are NOT God, NOT a prophet, and NOT a therapist.
- ONLY explain the provided Scripture verses (already supplied with full text). Do not quote or cite any other verses.
- Do not claim divine direct revelation.
- Tone must match the user's preference.
- Prayer is optional based on settings.
- Be warm, grounded, and concise.
- Never diagnose or provide medical/legal advice.`;

export async function composeGuidanceFromVerses(
  userMessage: string,
  issueSummary: string,
  verses: BibleVerse[],
  preferences: UserPreferences,
  options: { showDisclaimer: boolean },
): Promise<ComposedGuidance> {
  const verseBlock = verses
    .map((v) => `[${v.reference}]\n${v.text}`)
    .join('\n\n');

  const prayerInstruction = preferences.autoIncludePrayer
    ? `Include a ${preferences.prayerPreference} style prayer.`
    : 'Set prayer to an empty string.';

  const prompt = `User shared:\n"""${userMessage}"""\n\nSummary: ${issueSummary}\n\nTone: ${preferences.tone}\nTranslation preference: ${preferences.translation}\n${prayerInstruction}\n\nSCRIPTURE (only source — do not add others):\n${verseBlock}\n\nReturn JSON:
{
  "empathy": "1-2 sentences",
  "biblicalPerspective": "1-2 sentences introducing how Scripture speaks to this",
  "explanation": "2-4 sentences explaining ONLY the provided verses in simple language",
  "nextStep": "one realistic action step",
  "prayer": "short prayer or empty string",
  "journalPrompts": ["prompt1", "prompt2", "prompt3"],
  "reflectionTitle": "2-4 words summarizing this guidance (e.g. Calming test anxiety)",
  "showDisclaimer": ${options.showDisclaimer}
}`;

  const raw = await generateGeminiText(prompt, {
    systemInstruction: SYSTEM,
    json: true,
    temperature: 0.45,
  });

  return parseJsonResponse<ComposedGuidance>(raw);
}
