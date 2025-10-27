// background service worker (MV3)
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
})

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'PING') {
    sendResponse({ pong: true })
  }
  // return true if async response
})
