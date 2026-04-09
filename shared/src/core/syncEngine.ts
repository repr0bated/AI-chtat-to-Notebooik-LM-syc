import { Deduper } from './dedupe.js';
import { RetryQueue } from './queue.js';
import { RateLimiter } from './rateLimiter.js';
import type { NotebookLMAdapter } from '../adapters/notebooklmAdapter.js';
import type { ConversationRecord, SyncConfig, SyncState } from '../models/types.js';

export class SyncEngine {
  private readonly deduper = new Deduper();
  private readonly queue = new RetryQueue();
  private readonly limiter: RateLimiter;

  constructor(private readonly adapter: NotebookLMAdapter, private readonly config: SyncConfig, private readonly state: SyncState) {
    this.limiter = new RateLimiter(config.rateLimitPerMinute);
  }

  async syncBatch(batchId: string, records: ConversationRecord[]): Promise<{ accepted: number; uploaded: number }> {
    const accepted = records.filter((r) => this.deduper.accept(r));
    await this.limiter.waitTurn();
    const result = await this.queue.enqueue(() => this.adapter.uploadBatch(this.config.notebookId, accepted, this.config.dryRun));
    if (accepted.length > 0) {
      this.state.checkpoints[batchId] = {
        id: batchId,
        from: accepted[0]?.monthBucket ?? this.config.startDate,
        to: accepted[accepted.length - 1]?.monthBucket ?? this.config.endDate ?? this.config.startDate,
        status: 'completed',
        updatedAt: new Date().toISOString()
      };
    }
    this.state.lastSyncAt = new Date().toISOString();
    return { accepted: accepted.length, uploaded: result.uploaded };
  }
}
