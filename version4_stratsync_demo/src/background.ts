// background.ts - simple service worker for runtime messaging (Vite will compile to background.js)
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// optional: listen for messages from popup/content
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === 'PING') {
    sendResponse({ pong: true });
  }
});
