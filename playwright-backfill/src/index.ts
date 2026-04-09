import { loadConfig } from './utils/config.js';
import { runBackfill } from './core/backfillRunner.js';

const configPath = process.argv[2] ?? 'configs/backfill.config.example.json';
const config = loadConfig(configPath);

runBackfill(config)
  .then(() => {
    console.log('Backfill run completed.');
  })
  .catch((err) => {
    console.error('Backfill run failed:', err);
    process.exitCode = 1;
  });
