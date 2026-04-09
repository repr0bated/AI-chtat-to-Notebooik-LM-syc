import type { ConversationRecord } from '@sync/shared';

export interface CrawlContext {
  from: string;
  to: string;
  batchId: string;
}

export interface PlatformCrawler {
  platform: 'chatgpt' | 'claude' | 'gemini';
  crawl(ctx: CrawlContext): Promise<ConversationRecord[]>;
}
