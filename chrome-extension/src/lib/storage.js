import { DEFAULT_CONFIG } from '../types/config.js';

const CONFIG_KEY = 'sync_config_v1';
const STATE_KEY = 'sync_state_v1';
const LOG_KEY = 'sync_logs_v1';

export async function getConfig() {
  const data = await chrome.storage.local.get(CONFIG_KEY);
  return { ...DEFAULT_CONFIG, ...(data[CONFIG_KEY] || {}) };
}

export async function saveConfig(config) {
  await chrome.storage.local.set({ [CONFIG_KEY]: config });
}

export async function getState() {
  const data = await chrome.storage.local.get(STATE_KEY);
  return data[STATE_KEY] || { lastSyncAt: '', checkpoints: {}, uploadedHashes: {} };
}

export async function saveState(state) {
  await chrome.storage.local.set({ [STATE_KEY]: state });
}

export async function appendLog(entry) {
  const data = await chrome.storage.local.get(LOG_KEY);
  const logs = data[LOG_KEY] || [];
  logs.push({ ...entry, ts: new Date().toISOString() });
  const trimmed = logs.slice(-3000);
  await chrome.storage.local.set({ [LOG_KEY]: trimmed });
}

export async function exportDiagnostics() {
  const [cfg, st, logs] = await Promise.all([chrome.storage.local.get(CONFIG_KEY), chrome.storage.local.get(STATE_KEY), chrome.storage.local.get(LOG_KEY)]);
  return JSON.stringify({ config: cfg[CONFIG_KEY], state: st[STATE_KEY], logs: redact(logs[LOG_KEY] || []) }, null, 2);
}

function redact(logs) {
  return logs.map((l) => JSON.parse(JSON.stringify(l).replaceAll(/"password":"[^"]*"/g, '"password":"***"')));
}
