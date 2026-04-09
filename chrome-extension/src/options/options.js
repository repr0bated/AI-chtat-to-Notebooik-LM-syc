import { getConfig, saveConfig } from '../lib/storage.js';

const $ = (id) => document.getElementById(id);

async function init() {
  const cfg = await getConfig();
  $('notebookId').value = cfg.notebookId;
  $('notebookSessionMode').value = cfg.notebookSessionMode;
  $('syncMode').value = cfg.syncMode;
  $('rateLimit').value = String(cfg.rateLimitPerMinute);
  $('startDate').value = cfg.startDate;
  $('endDate').value = cfg.endDate;
  $('lastBrowserLoginDate').value = cfg.lastBrowserLoginDate;

  $('chatgptEnabled').checked = cfg.includePlatforms.chatgpt;
  $('claudeEnabled').checked = cfg.includePlatforms.claude;
  $('geminiEnabled').checked = cfg.includePlatforms.gemini;

  $('chatgptUser').value = cfg.credentials.chatgpt.username;
  $('chatgptPass').value = cfg.credentials.chatgpt.password;
  $('claudeUser').value = cfg.credentials.claude.username;
  $('claudePass').value = cfg.credentials.claude.password;
  $('geminiUser').value = cfg.credentials.gemini.username;
  $('geminiPass').value = cfg.credentials.gemini.password;
}

$('save').addEventListener('click', async () => {
  const cfg = {
    notebookId: $('notebookId').value.trim(),
    notebookSessionMode: $('notebookSessionMode').value,
    syncMode: $('syncMode').value,
    startDate: $('startDate').value || '2003-01-01',
    endDate: $('endDate').value,
    rateLimitPerMinute: Number($('rateLimit').value || '20'),
    includePlatforms: {
      chatgpt: $('chatgptEnabled').checked,
      claude: $('claudeEnabled').checked,
      gemini: $('geminiEnabled').checked
    },
    credentials: {
      chatgpt: { username: $('chatgptUser').value, password: $('chatgptPass').value },
      claude: { username: $('claudeUser').value, password: $('claudePass').value },
      gemini: { username: $('geminiUser').value, password: $('geminiPass').value }
    },
    weekFallbackThreshold: 150,
    lastBrowserLoginDate: $('lastBrowserLoginDate').value
  };

  await saveConfig(cfg);
  $('status').textContent = 'Saved.';
});

$('diagnostics').addEventListener('click', async () => {
  const response = await chrome.runtime.sendMessage({ type: 'export-diagnostics' });
  if (response.ok) {
    $('diag').textContent = response.content;
  }
});

init();
