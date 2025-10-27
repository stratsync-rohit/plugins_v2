console.log('Content script injected')

// Example: change background color on message
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'CHANGE_BG') {
    document.body.style.background = msg.color || 'pink'
    sendResponse({ ok: true })
  }
})
