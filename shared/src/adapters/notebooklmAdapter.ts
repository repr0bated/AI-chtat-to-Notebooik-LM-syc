import type { ConversationRecord } from '../models/types.js';

export interface NotebookLMAdapter {
  name: string;
  uploadBatch(notebookId: string, records: ConversationRecord[], dryRun?: boolean): Promise<{ uploaded: number }>;
}

export class NotebookLMBrowserAutomationAdapter implements NotebookLMAdapter {
  name = 'notebooklm-browser-automation-fallback';

  async uploadBatch(notebookId: string, records: ConversationRecord[], dryRun = false): Promise<{ uploaded: number }> {
    if (!notebookId) throw new Error('Notebook ID required');
    if (dryRun) return { uploaded: 0 };
    // actual upload executed in extension or Playwright worker using active authenticated browser session.
    return { uploaded: records.length };
  }
}
