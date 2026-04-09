import { describe, expect, it } from 'vitest';
import { monthlyBatches, stableConversationHash, Deduper } from '../src/index.js';

describe('batching', () => {
  it('creates monthly batches', () => {
    const batches = monthlyBatches('2026-01-01', '2026-03-14');
    expect(batches.length).toBe(3);
    expect(batches[2].to).toBe('2026-03-14');
  });
});

describe('hash + dedupe', () => {
  it('deduplicates exact conversation', () => {
    const base = {
      platform: 'chatgpt' as const,
      title: 'a',
      participants: ['u', 'a'],
      messages: [{ role: 'user', content: 'hello', order: 0 }],
      syncTimestamp: new Date().toISOString(),
      monthBucket: '2026-01',
      conversationId: 'id1'
    };
    const h = stableConversationHash(base);
    const record = { ...base, dedupeHash: h };
    const deduper = new Deduper();
    expect(deduper.accept(record)).toBe(true);
    expect(deduper.accept({ ...record })).toBe(false);
  });
});
