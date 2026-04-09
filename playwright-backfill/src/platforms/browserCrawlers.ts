import type { Page } from '@playwright/test';
import { stableConversationHash, type ConversationRecord } from '@sync/shared';
import type { CrawlContext, PlatformCrawler } from './types.js';

async function toRecord(platform: 'chatgpt' | 'claude' | 'gemini', ctx: CrawlContext, page: Page, title: string, url: string, text: string): Promise<ConversationRecord> {
  const messages = text.split('\n').filter(Boolean).slice(0, 200).map((line, i) => ({ role: i % 2 === 0 ? 'user' : 'assistant', content: line, order: i }));
  const base = {
    platform,
    title,
    url,
    conversationId: url.split('/').pop(),
    participants: ['user', 'assistant'],
    messages,
    syncTimestamp: new Date().toISOString(),
    monthBucket: ctx.from.slice(0, 7),
    batchId: ctx.batchId,
    sourceAccount: 'session-user',
    browserProfile: await awaitProfile(page),
    lastBrowserLoginDate: new Date().toISOString().slice(0, 10)
  };
  return { ...base, dedupeHash: stableConversationHash(base) };
}

async function awaitProfile(page: Page): Promise<string> {
  const ua = await page.evaluate(() => navigator.userAgent);
  return ua.includes('Mobile') ? 'mobile-excluded' : 'desktop';
}

export function makeCrawler(platform: 'chatgpt' | 'claude' | 'gemini', page: Page): PlatformCrawler {
  return {
    platform,
    async crawl(ctx: CrawlContext): Promise<ConversationRecord[]> {
      const url =
        platform === 'chatgpt' ? 'https://chatgpt.com/' : platform === 'claude' ? 'https://claude.ai/chats' : 'https://gemini.google.com/app';
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);
      const text = await page.locator('body').innerText();
      const title = `${platform} conversation ${ctx.from}`;
      return [await toRecord(platform, ctx, page, title, page.url(), text)];
    }
  };
}
