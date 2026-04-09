import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import type { BatchCheckpoint } from '@sync/shared';

export interface CheckpointStore {
  batches: Record<string, BatchCheckpoint>;
}

export function loadCheckpoint(path: string): CheckpointStore {
  if (!existsSync(path)) return { batches: {} };
  return JSON.parse(readFileSync(path, 'utf8')) as CheckpointStore;
}

export function saveCheckpoint(path: string, store: CheckpointStore): void {
  writeFileSync(path, JSON.stringify(store, null, 2));
}
