console.log('Content script injected')

// Example: change background color on message
chrome.runtime.onMessage.addListener((msg: any, sender: chrome.runtime.MessageSender, sendResponse?: (response?: any) => void) => {
  void sender
  if (msg?.type === 'CHANGE_BG') {
    document.body.style.background = msg.color || 'pink'
    sendResponse?.({ ok: true })
  }
})
