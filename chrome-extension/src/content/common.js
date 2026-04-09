function detectBrowserProfile() {
  return /Mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
}

export function wireCollector(platform, extractor) {
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type !== 'collect-conversation') return;
    const payload = extractor();
    payload.platform = platform;
    payload.browserProfile = detectBrowserProfile();
    chrome.runtime.sendMessage({ type: 'platform-conversation', payload });
  });

  const observer = new MutationObserver(() => {
    const payload = extractor();
    payload.platform = platform;
    payload.browserProfile = detectBrowserProfile();
    chrome.runtime.sendMessage({ type: 'platform-conversation', payload });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

export function extractBasicConversation() {
  const title = document.title;
  const messages = [...document.querySelectorAll('main,article,[role="main"] p,div')]
    .map((el) => el.textContent?.trim())
    .filter(Boolean)
    .slice(0, 150)
    .map((content, i) => ({ role: i % 2 === 0 ? 'user' : 'assistant', content, order: i }));

  return {
    title,
    conversationId: location.pathname.split('/').filter(Boolean).pop(),
    url: location.href,
    date: new Date().toISOString().slice(0, 10),
    lastBrowserLoginDate: new Date().toISOString().slice(0, 10),
    participants: ['user', 'assistant'],
    messages
  };
}
