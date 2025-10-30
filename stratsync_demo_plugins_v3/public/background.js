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
