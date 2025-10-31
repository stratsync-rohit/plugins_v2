
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.action) return;

  if (message.action === 'open_popup' && message.url) {
   
    chrome.windows.create(
      {
        url: message.url,
        type: 'popup',
        width: 500,
        height: 600
      },
      (win) => {
       
        sendResponse({ success: !!win });
      }
    );

    return true;
  }
});
