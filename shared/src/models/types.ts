export type Platform = 'chatgpt' | 'claude' | 'gemini';

export interface ConversationMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system' | 'tool' | string;
  content: string;
  timestamp?: string;
  order: number;
}

export interface ConversationRecord {
  platform: Platform;
  title: string;
  url?: string;
  conversationId?: string;
  participants: string[];
  messages: ConversationMessage[];
  createdAt?: string;
  updatedAt?: string;
  syncTimestamp: string;
  sourceAccount?: string;
  browserProfile?: string;
  dedupeHash: string;
  monthBucket: string;
  batchId?: string;
  lastBrowserLoginDate?: string;
}

export interface SyncState {
  lastSyncAt?: string;
  lastBrowserLoginDate?: string;
  checkpoints: Record<string, BatchCheckpoint>;
}

export interface BatchCheckpoint {
  id: string;
  from: string;
  to: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string;
  updatedAt: string;
}

export interface SyncConfig {
  notebookId: string;
  platforms: Platform[];
  mode: 'incremental' | 'backfill';
  startDate: string;
  endDate?: string;
  batchGranularity: 'month' | 'week';
  rateLimitPerMinute: number;
  dryRun?: boolean;
}
