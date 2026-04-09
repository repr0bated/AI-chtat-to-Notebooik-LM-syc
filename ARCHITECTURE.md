# Architecture Summary

## 1) Components

- **Chrome Extension (MV3)**
  - background service worker orchestrates periodic incremental sync (`alarms`), queueing, rate limiting, dedupe state, diagnostics export.
  - content adapters for ChatGPT/Claude/Gemini extract conversation content from live DOM safely.
  - options UI stores persistent configuration in `chrome.storage.local`.
- **Playwright Backfill**
  - month-by-month (or week-by-week) historical loading starting at `2003-01-01`.
  - checkpoint file per batch status for resumability.
  - staging output to JSON files before upload.
  - dry-run mode and storage state reuse.
- **Shared Core**
  - typed models, hashing, batching, deduper, retry queue, rate limiter, sync engine.
  - `NotebookLMAdapter` boundary isolates NotebookLM integration strategy.

## 2) Data flow

1. Platform adapter extracts conversation.
2. Background worker validates config and source signals (desktop profile, browser login date window).
3. Dedup hash computed at conversation/message boundary.
4. Upload task enters retry-safe queue with rate limiting.
5. NotebookLM adapter receives normalized records.
6. Sync state + structured logs persisted locally.

## 3) NotebookLM API strategy

No stable official ingestion API is assumed; therefore browser-authenticated adapter boundary is used as realistic fallback without inventing unsupported private endpoints.

## 4) Resilience

- retry queue for transient failures
- explicit rate limiting
- resumable checkpoints
- failure marking without losing progress
- exportable diagnostics
