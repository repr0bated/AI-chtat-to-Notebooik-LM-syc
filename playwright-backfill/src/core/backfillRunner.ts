import { chromium } from '@playwright/test';
import { monthlyBatches, weeklyBatches, type ConversationRecord } from '@sync/shared';
import { makeCrawler } from '../platforms/browserCrawlers.js';
import type { BackfillConfig } from '../utils/config.js';
import { loadCheckpoint, saveCheckpoint } from '../utils/checkpoint.js';
import { stageBatch, uploadViaAdapter } from '../notebooklm/uploader.js';

export async function runBackfill(config: BackfillConfig): Promise<void> {
  const checkpoint = loadCheckpoint(config.checkpointPath);
  const browser = await chromium.launch({ headless: config.headless });
  const context = await browser.newContext({ storageState: config.storageStatePath });
  const page = await context.newPage();
  const batches = config.batchGranularity === 'month' ? monthlyBatches(config.startDate, config.endDate) : weeklyBatches(config.startDate, config.endDate);

  for (const batch of batches) {
    const existing = checkpoint.batches[batch.id];
    if (existing?.status === 'completed') continue;
    checkpoint.batches[batch.id] = { id: batch.id, from: batch.from, to: batch.to, status: 'running', updatedAt: new Date().toISOString() };
    saveCheckpoint(config.checkpointPath, checkpoint);

    try {
      const allRecords: ConversationRecord[] = [];
      for (const platform of config.platforms) {
        const crawler = makeCrawler(platform, page);
        const records = await crawler.crawl({ ...batch, batchId: batch.id });
        allRecords.push(...records.filter((r) => r.browserProfile !== 'mobile-excluded'));
      }
      await stageBatch('./staging', batch.id, allRecords);
      await uploadViaAdapter(config.notebookId, allRecords, config.dryRun);
      checkpoint.batches[batch.id] = { ...checkpoint.batches[batch.id], status: 'completed', updatedAt: new Date().toISOString() };
      saveCheckpoint(config.checkpointPath, checkpoint);
    } catch (error) {
      checkpoint.batches[batch.id] = {
        ...checkpoint.batches[batch.id],
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
        updatedAt: new Date().toISOString()
      };
      saveCheckpoint(config.checkpointPath, checkpoint);
    }
  }

  await browser.close();
}
