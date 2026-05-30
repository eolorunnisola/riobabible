import { GEMINI_MODEL, getGeminiApiKey } from './config';

type GenerateOptions = {
  systemInstruction?: string;
  temperature?: number;
  json?: boolean;
};

export class GeminiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

export async function generateGeminiText(
  userPrompt: string,
  options: GenerateOptions = {},
): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new GeminiError(
      'Missing EXPO_PUBLIC_GEMINI_API_KEY. Add it to a .env file and restart Expo.',
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: options.temperature ?? 0.35,
      ...(options.json ? { responseMimeType: 'application/json' } : {}),
    },
  };

  if (options.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = await response.json();

  if (!response.ok) {
    const msg =
      payload?.error?.message ?? `Gemini request failed (${response.status})`;
    throw new GeminiError(msg, response.status);
  }

  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new GeminiError('Gemini returned an empty response.');
  }

  return text.trim();
}

export function parseJsonResponse<T>(raw: string): T {
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned) as T;
}
