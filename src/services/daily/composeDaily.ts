import { BibleVerse, UserPreferences } from '@/src/types';
import { generateGeminiText, parseJsonResponse } from '@/src/services/gemini/client';
import { isGeminiConfigured } from '@/src/services/gemini/config';

export type ComposedDaily = {
  theme: string;
  prayer: string;
  reflectionQuestion: string;
};

const SYSTEM = `You write brief daily Christian encouragement for Rioba, a Scripture app.
Rules:
- You are NOT God and not a prophet.
- Base everything ONLY on the Scripture provided (already given with full text).
- Do not quote or cite any other verses.
- Warm, concise, accessible language.
- Prayer: 2–4 sentences, addressed to God.
- Reflection: one open-ended journal question.
- Theme: 2–5 words summarizing the day's focus.`;

export async function composeDailyFromVerse(
  verse: BibleVerse,
  preferences: UserPreferences,
): Promise<ComposedDaily | null> {
  if (!isGeminiConfigured()) return null;

  const prompt = `Today's Scripture (${preferences.translation} preference noted for tone only):
[${verse.reference}]
${verse.text}

User tone preference: ${preferences.tone}
Prayer style: ${preferences.prayerPreference}

Return JSON:
{
  "theme": "2-5 words",
  "prayer": "short personal prayer based only on this verse",
  "reflectionQuestion": "one thoughtful journal question"
}`;

  try {
    const raw = await generateGeminiText(prompt, {
      systemInstruction: SYSTEM,
      json: true,
      temperature: 0.5,
    });
    return parseJsonResponse<ComposedDaily>(raw);
  } catch {
    return null;
  }
}
