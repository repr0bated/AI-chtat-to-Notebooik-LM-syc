# Configuration

## Extension settings

- `notebookId`: target NotebookLM notebook identifier.
- `notebookSessionMode`: `reuse-session` or `manual-login`.
- `syncMode`: `incremental` or `backfill`.
- `startDate`/`endDate`: date window controls.
- `includePlatforms`: booleans for ChatGPT/Claude/Gemini.
- `rateLimitPerMinute`: upload pacing.
- `lastBrowserLoginDate`: authoritative date signal for incremental filtering.
- `credentials.*`: optional login fields (prefer session reuse).

## Backfill config

See `configs/backfill.config.example.json`.

- `startDate`: defaults to `2003-01-01`
- `batchGranularity`: `month` default, supports `week`
- `platforms`: selected source filters
- `checkpointPath`: resumable state store
- `dryRun`: extraction/staging without upload
