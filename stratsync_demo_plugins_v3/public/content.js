// Debug log to confirm script ran
console.log('StratSync content script running — attempting to inject button');

// Prevent injecting the button multiple times
if (!document.getElementById('stratsync-bottom-button')) {
  // Create button
  const button = document.createElement('button');
  button.id = 'stratsync-bottom-button';
  button.innerText = 'Button Name';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.padding = '10px 15px';
  button.style.backgroundColor = '#007bff';
  button.style.color = '#fff';
  button.style.border = 'none';
  button.style.borderRadius = '8px';
  button.style.cursor = 'pointer';
  button.style.zIndex = '9999';
  button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  button.style.fontSize = '14px';
  button.style.fontWeight = 'bold';

  // Add button to page
  document.body.appendChild(button);

  // On click: open Google in a popup window
  button.addEventListener('click', () => {
    chrome.windows.create({
      url: "https://google.com",
      type: "popup",
      width: 500,
      height: 600
    });
  });
}
