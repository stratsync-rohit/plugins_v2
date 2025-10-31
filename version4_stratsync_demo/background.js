// background.js - compiled from src/background.ts for local extension loading
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// optional: listen for messages from popup/content
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'PING') {
    sendResponse({ pong: true });
  }
  // return false to indicate synchronous response; return true if you plan to send async
  return false;
});
