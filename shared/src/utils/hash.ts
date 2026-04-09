import { createHash } from 'node:crypto';
import type { ConversationRecord } from '../models/types.js';

export function stableConversationHash(record: Omit<ConversationRecord, 'dedupeHash'>): string {
  const normalized = {
    platform: record.platform,
    conversationId: record.conversationId ?? '',
    title: record.title,
    messages: record.messages.map((m) => ({ role: m.role, content: m.content.trim(), order: m.order })),
    monthBucket: record.monthBucket
  };
  return createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
}
