export const OFF_TOPIC_ASSISTANT_MESSAGE =
  'I am here for Scripture-centered reflection on what you are carrying — worry, grief, relationships, purpose, faith, or prayer. I cannot help with homework, assignments, trivia, or other tasks outside that. When you are ready, share what is on your heart in that spirit and I will offer Bible-based encouragement.';

export class OffTopicPromptError extends Error {
  readonly userMessage = OFF_TOPIC_ASSISTANT_MESSAGE;

  constructor() {
    super('off-topic');
    this.name = 'OffTopicPromptError';
  }
}
