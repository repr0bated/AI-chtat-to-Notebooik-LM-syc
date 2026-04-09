import { readFileSync } from 'node:fs';
import { z } from 'zod';

const schema = z.object({
  notebookId: z.string().min(1),
  startDate: z.string().default('2003-01-01'),
  endDate: z.string().default(new Date().toISOString().slice(0, 10)),
  batchGranularity: z.enum(['month', 'week']).default('month'),
  platforms: z.array(z.enum(['chatgpt', 'claude', 'gemini'])).default(['chatgpt', 'claude', 'gemini']),
  headless: z.boolean().default(true),
  dryRun: z.boolean().default(false),
  storageStatePath: z.string().default('./playwright/.auth/state.json'),
  checkpointPath: z.string().default('./playwright-backfill.checkpoint.json')
});

export type BackfillConfig = z.infer<typeof schema>;

export function loadConfig(path: string): BackfillConfig {
  const raw = JSON.parse(readFileSync(path, 'utf8')) as unknown;
  return schema.parse(raw);
}
