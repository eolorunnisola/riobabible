import { generateGeminiText, parseJsonResponse } from './client';
import topicReferences from '@/src/data/bible/topicReferences.json';

export type ClassificationResult = {
  category: string;
  issueSummary: string;
  suggestedReferences: string[];
  needsCrisisScreen: boolean;
  needsDisclaimer: boolean;
  isOnTopic: boolean;
};

const CATEGORIES = Object.keys(topicReferences);

const SYSTEM = `You are a strict triage assistant for a Christian reflection app (not therapy, not tutoring, not homework help, not speaking for God).
Classify the user's struggle and select 2-4 Scripture references ONLY from the allowed list format: BOOK_ID chapter:verse (e.g. MAT 11:28, PHP 4:6-7).
Never invent verse text. Only output reference codes.
Categories: ${CATEGORIES.join(', ')}.
Set needsCrisisScreen true for suicide, self-harm, abuse, or immediate danger.
Set needsDisclaimer true when grief, trauma, mental health, or medical topics appear.

isOnTopic rules (default false — only set true when clearly in scope):
- TRUE: feelings, grief, anxiety, relationships, purpose, sin/guilt, faith questions, prayer requests, seeking Scripture for a personal struggle — even if brief.
- FALSE: homework, essays, exams, assignments, tutoring, solving school/work problems, coding help, recipes, trivia, shopping, sports scores, politics debates, random gibberish with no heartfelt spiritual question, or asking you to perform tasks unrelated to faith-based reflection.
- FALSE: academic stress ONLY when the user wants answers/help completing schoolwork — but TRUE if they only share emotional stress about school without asking for academic solutions.
When unsure, set isOnTopic false.`;

export async function classifyUserIssue(userMessage: string): Promise<ClassificationResult> {
  const prompt = `User message:\n"""${userMessage}"""\n\nRespond as JSON:
{
  "category": "one category id from the list",
  "issueSummary": "1-2 sentence neutral summary of what they shared",
  "suggestedReferences": ["REF1", "REF2"],
  "needsCrisisScreen": false,
  "needsDisclaimer": false,
  "isOnTopic": false
}`;

  const raw = await generateGeminiText(prompt, {
    systemInstruction: SYSTEM,
    json: true,
    temperature: 0.2,
  });

  const parsed = parseJsonResponse<ClassificationResult>(raw);

  return {
    category: parsed.category ?? 'general',
    issueSummary: parsed.issueSummary ?? userMessage.slice(0, 200),
    suggestedReferences: (parsed.suggestedReferences ?? []).slice(0, 4),
    needsCrisisScreen: Boolean(parsed.needsCrisisScreen),
    needsDisclaimer: Boolean(parsed.needsDisclaimer),
    isOnTopic: parsed.isOnTopic === true,
  };
}
