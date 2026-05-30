import { ChatSession } from '@/src/types';

export function sessionHasUserMessage(session: ChatSession): boolean {
  return session.messages.some((m) => m.role === 'user' && m.content.trim().length > 0);
}
