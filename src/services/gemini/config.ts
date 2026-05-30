import Constants from 'expo-constants';

export function getGeminiApiKey(): string | undefined {
  return (
    process.env.EXPO_PUBLIC_GEMINI_API_KEY ??
    Constants.expoConfig?.extra?.geminiApiKey
  );
}

export const GEMINI_MODEL = 'gemini-3.1-flash-lite';

export function isGeminiConfigured(): boolean {
  return Boolean(getGeminiApiKey());
}
