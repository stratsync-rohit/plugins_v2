// background service worker (MV3)
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
})

chrome.runtime.onMessage.addListener((msg: any, sender: chrome.runtime.MessageSender, sendResponse?: (response?: any) => void) => {
  // mark sender as used to satisfy strict/noUnusedParameters checks
  void sender
  if (msg?.type === 'PING') {
    sendResponse?.({ pong: true })
  }
  // return true if async response
})
