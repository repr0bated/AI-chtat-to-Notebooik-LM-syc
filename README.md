# AI Chat to NotebookLM Sync

Production-oriented implementation with:

- `chrome-extension/`: Manifest V3 extension for incremental sync.
- `playwright-backfill/`: robust initial historical backfill runner.
- `shared/`: typed sync core, dedupe, batching, retry queue, rate limiting.
- `docs/`: architecture, config, security, runbook.

## NotebookLM integration constraint

As of 2026-04-08, this project intentionally **does not assume a stable public NotebookLM ingestion API**. Integration is isolated behind `NotebookLMAdapter` and currently uses a browser-session fallback adapter design for authenticated upload automation in extension/backfill flows.

## Quick start

1. `npm install`
2. Build shared + backfill: `npm run build`
3. Load extension from `chrome-extension/` in Chrome Developer Mode.
4. Configure extension via Options page.
5. Run first backfill:
   - `npm run -w playwright-backfill backfill -- configs/backfill.config.example.json`

Detailed steps: `docs/RUNBOOK.md`.
