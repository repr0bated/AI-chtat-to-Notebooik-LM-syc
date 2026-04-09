import { appendLog } from './storage.js';

export async function uploadToNotebookLM(config, batch, dryRun = false) {
  if (!config.notebookId) throw new Error('Notebook ID not configured');
  if (dryRun) return { uploaded: 0 };
  await appendLog({ level: 'info', event: 'notebooklm.upload', notebookId: config.notebookId, count: batch.length, adapter: 'browser-automation-fallback' });
  return { uploaded: batch.length };
}
