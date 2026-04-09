export const DEFAULT_CONFIG = {
  notebookId: '',
  notebookSessionMode: 'reuse-session',
  syncMode: 'incremental',
  startDate: '2003-01-01',
  endDate: '',
  includePlatforms: { chatgpt: true, claude: true, gemini: true },
  credentials: {
    chatgpt: { username: '', password: '' },
    claude: { username: '', password: '' },
    gemini: { username: '', password: '' }
  },
  rateLimitPerMinute: 20,
  weekFallbackThreshold: 150,
  lastBrowserLoginDate: ''
};
