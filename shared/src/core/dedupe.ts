import type { ConversationRecord } from '../models/types.js';

export class Deduper {
  private seenConversation = new Set<string>();
  private seenMessage = new Set<string>();

  accept(record: ConversationRecord): boolean {
    if (this.seenConversation.has(record.dedupeHash)) return false;
    const uniqueMessages = record.messages.filter((m) => {
      const key = `${record.platform}:${record.conversationId ?? record.title}:${m.order}:${m.role}:${m.content}`;
      if (this.seenMessage.has(key)) return false;
      this.seenMessage.add(key);
      return true;
    });
    if (uniqueMessages.length === 0) return false;
    record.messages = uniqueMessages;
    this.seenConversation.add(record.dedupeHash);
    return true;
  }
}
