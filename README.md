# AI Chat to Google Drive History Sync

This project syncs conversations from **ChatGPT**, **Claude**, and **Gemini** into **append-only history files**.

## What changed (important)

- ✅ NotebookLM has been removed from the flow.
- ✅ Data now targets Google Drive history files.
- ✅ History is appended (never replaced) to build a full timeline.
- ✅ Separate file per platform:
  - `chatgpt-history.jsonl`
  - `claude-history.jsonl`
  - `gemini-history.jsonl`

## Project layout

- `chrome-extension/` — Manifest V3 extension for ongoing incremental sync capture.
- `playwright-backfill/` — initial historical backfill (from `2003-01-01`) with checkpoint/resume.
- `shared/` — typed models, dedupe, batching, retry/rate-limit primitives.
- `docs/` — runbook, architecture, limits, and configuration docs.

## Google Drive + ADC

Backfill can append directly into Google Drive using **Application Default Credentials (ADC)**.

1. Install Google Cloud CLI.
2. Authenticate ADC:
   - `gcloud auth application-default login`
3. Set `driveFolderId` in `configs/backfill.config.example.json`.
4. Run backfill.

## Quick start

1. Install dependencies:
   - `npm install`
2. Build:
   - `npm run build`
3. Load extension:
   - Chrome → Extensions → Developer mode → Load unpacked → `chrome-extension/`
4. Configure extension options:
   - `driveFolderId`
   - platform toggles
   - date controls / login-date filter
5. Run initial backfill:
   - `npm run -w playwright-backfill backfill -- configs/backfill.config.example.json`

## Output behavior

- Per-batch snapshot file is written to staging (`<batch-id>.json`).
- Append-only platform files are maintained in staging and Drive:
  - `chatgpt-history.jsonl`
  - `claude-history.jsonl`
  - `gemini-history.jsonl`

## Notes

- Incremental sync filters by last browser login date when configured.
- Mobile-profile records are excluded where detected.
- If Drive/ADC is unavailable, staged files still provide a safe manual upload path.

For operational steps, see: `docs/RUNBOOK.md`.
