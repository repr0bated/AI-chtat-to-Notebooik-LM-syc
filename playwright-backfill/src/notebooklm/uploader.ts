import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { ConversationRecord } from '@sync/shared';
import { NotebookLMBrowserAutomationAdapter } from '@sync/shared';

export async function stageBatch(stagingDir: string, batchId: string, records: ConversationRecord[]): Promise<string> {
  const path = join(stagingDir, `${batchId}.json`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(records, null, 2));
  return path;
}

export async function uploadViaAdapter(notebookId: string, records: ConversationRecord[], dryRun: boolean): Promise<number> {
  const adapter = new NotebookLMBrowserAutomationAdapter();
  const result = await adapter.uploadBatch(notebookId, records, dryRun);
  return result.uploaded;
}
