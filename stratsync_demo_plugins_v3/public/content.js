
console.log('StratSync content script running...');

if (!document.getElementById('stratsync-button')) {
 
  const button = document.createElement('button');
  button.id = 'stratsync-button';

  // 2️⃣ Style set kar
  button.style.position = 'fixed';
  button.style.bottom = '34px';
  button.style.right = '36px';
  button.style.width = '90px';
  button.style.height = '90px';
  button.style.padding = '10px';
  button.style.backgroundColor = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '50%';
  button.style.cursor = 'pointer';
  button.style.zIndex = '9999';
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';


  const img = document.createElement('img');
  img.src = chrome.runtime.getURL('logo_.png'); 
  img.alt = 'StratSync';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  img.style.borderRadius = '0%';
  img.draggable = false;

  button.appendChild(img);

 console.log('logo url:', img.src);
  img.addEventListener('load', () => console.log('logo loaded'));
  img.addEventListener('error', (e) => {
    console.error('logo failed to load:', img.src, e);
  });
  document.body.appendChild(button);

  
  button.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'open_app_popup' });
  });
}
