# Runbook

## First install

1. `npm install`
2. `npm run build`
3. Chrome > Extensions > Developer mode > Load unpacked > `chrome-extension/`.
4. Open extension Options and set Notebook ID, platform includes, date controls.

## First backfill

1. Update `configs/backfill.config.example.json`.
2. Ensure Playwright auth storage exists for logged-in sessions.
3. Run:
   `npm run -w playwright-backfill backfill -- configs/backfill.config.example.json`
4. Observe `playwright-backfill.checkpoint.json` and `staging/` outputs.

## Switch target notebook

1. Open extension options.
2. Change Notebook ID.
3. Save.
4. (Optional) run dry-run batch to verify extraction behavior.

## Resume interrupted sync

- Backfill: rerun same command; completed checkpoints are skipped.
- Extension: service worker resumes from `sync_state_v1` state after restart.

## Troubleshooting

- **No uploads:** check Notebook ID + active session.
- **Repeated items:** inspect dedupe hash state in diagnostics export.
- **Batch failures:** inspect checkpoint `error` field; rerun safely.
- **Dynamic UI extraction misses:** refresh source tab and keep the conversation open until next alarm tick.
