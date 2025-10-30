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
  button.style.backgroundColor = '#ffffffff';
  button.style.color = 'black';
  button.style.border = 'none';
  button.style.borderRadius = '8px';
  button.style.cursor = 'pointer';
  button.style.zIndex = '9999';
  button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  button.style.fontSize = '24px';
  button.style.fontWeight = 'bold';


 
  document.body.appendChild(button);

  button.addEventListener('click', () => {
    
    try {
      chrome.runtime.sendMessage({ action: 'open_popup', url: 'https://google.com' }, (resp) => {
        if (chrome.runtime.lastError) {
          
          window.open('https://google.com', '_blank', 'width=500,height=600');
        }
      });
    } catch (e) {
      
      window.open('https://google.com', 'width=500,height=600');
    }
  });
}
