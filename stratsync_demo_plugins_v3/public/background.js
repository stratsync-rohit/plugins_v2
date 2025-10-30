chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id) return;

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ['public/content.js']
    },
    (results) => {
      if (chrome.runtime.lastError)
        console.error(chrome.runtime.lastError.message);
     
    }
  );
});


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
