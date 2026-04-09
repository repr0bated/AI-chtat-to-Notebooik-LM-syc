import { getConfig, getState, saveState, appendLog, exportDiagnostics } from '../lib/storage.js';
import { RateLimiter } from '../lib/rateLimiter.js';
import { RetryQueue } from '../lib/queue.js';
import { sha256 } from '../lib/hash.js';
import { uploadToNotebookLM } from '../lib/notebooklmAdapter.js';

const queue = new RetryQueue();
let limiter = new RateLimiter(20);

chrome.runtime.onInstalled.addListener(async () => {
  chrome.alarms.create('incremental-sync', { periodInMinutes: 5 });
  await appendLog({ level: 'info', event: 'extension.installed' });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'incremental-sync') await runIncrementalSync();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'platform-conversation') {
    void ingestConversation(message.payload).then(() => sendResponse({ ok: true })).catch((e) => sendResponse({ ok: false, error: String(e) }));
    return true;
  }
  if (message.type === 'export-diagnostics') {
    void exportDiagnostics().then((content) => sendResponse({ ok: true, content }));
    return true;
  }
  return false;
});

async function ingestConversation(payload) {
  const config = await getConfig();
  limiter.maxPerMinute = config.rateLimitPerMinute || 20;
  const state = await getState();

  if (!config.includePlatforms[payload.platform]) return;
  if (payload.browserProfile === 'mobile') return;
  if (config.lastBrowserLoginDate && payload.lastBrowserLoginDate && payload.lastBrowserLoginDate < config.lastBrowserLoginDate) return;

  const hash = await sha256(JSON.stringify({ p: payload.platform, id: payload.conversationId, title: payload.title, messages: payload.messages }));
  if (state.uploadedHashes?.[hash]) return;

  await limiter.wait();
  await queue.enqueue(async () => {
    const batch = [{ ...payload, dedupeHash: hash, syncTimestamp: new Date().toISOString(), monthBucket: payload.date?.slice(0, 7) || new Date().toISOString().slice(0, 7) }];
    const res = await uploadToNotebookLM(config, batch, false);
    state.uploadedHashes = state.uploadedHashes || {};
    state.uploadedHashes[hash] = true;
    state.lastSyncAt = new Date().toISOString();
    await saveState(state);
    await appendLog({ level: 'info', event: 'sync.uploaded', platform: payload.platform, uploaded: res.uploaded });
  });
}

async function runIncrementalSync() {
  await appendLog({ level: 'debug', event: 'sync.tick' });
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.id || !tab.url) continue;
    if (tab.url.includes('chatgpt.com') || tab.url.includes('claude.ai') || tab.url.includes('gemini.google.com')) {
      try {
        await chrome.tabs.sendMessage(tab.id, { type: 'collect-conversation' });
      } catch {
        // content script may not be ready
      }
    }
  }
}
