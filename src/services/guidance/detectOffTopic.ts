/** Fast local checks before / alongside model classification. */
const OFF_TOPIC_PATTERNS: RegExp[] = [
  /\bhomework\b/i,
  /\bassignment\b/i,
  /\b(?:write|do|finish|complete)\s+(?:my|this|the)\s+(?:essay|paper|report|thesis)\b/i,
  /\bhelp\s+(?:me\s+)?with\s+(?:my\s+)?(?:math|algebra|calculus|geometry|chemistry|biology|physics|history|english|class|course|project)\b/i,
  /\bsolve\s+(?:this|the|my)\s+(?:problem|equation|question)\b/i,
  /\b(?:test|quiz|exam)\s+(?:answers?|help)\b/i,
  /\b(?:chat\s*gpt|write\s+code|debug\s+my|python|javascript|typescript)\b/i,
  /\b(?:recipe|weather|sports?\s+score|stock\s+price|crypto)\b/i,
  /\b(?:buy|sell|product\s+review|best\s+laptop)\b/i,
  /\b(?:trivia|random\s+fact)\b/i,
];

export function detectOffTopicContent(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;

  if (OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return true;
  }

  return false;
}
