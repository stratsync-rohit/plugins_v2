console.log('StratSync content script running...');

if (!document.getElementById('stratsync-button')) {
  const button = document.createElement('button');
  button.id = 'stratsync-button';


  Object.assign(button.style, {
    position: 'fixed',
    bottom: '34px',
    right: '36px',
    width: '60px',
    height: '60px',
    padding: '10px',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: '9999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  });

 const img = document.createElement('img');


img.src = chrome.runtime.getURL('logo.jpeg'); 
img.alt = 'logo';

Object.assign(img.style, {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '0%',
});

img.draggable = false;

  const tooltip = document.createElement('div');
  tooltip.textContent = 'StratSync Chatbot Demo';
  Object.assign(tooltip.style, {
    position: 'fixed',
    bottom: '135px', 
    right: '40px',
    backgroundColor: 'black',
    color: 'white',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '13px',
    opacity: '0',
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
    zIndex: '10000',
  });

  document.body.appendChild(tooltip);
  button.appendChild(img);
  document.body.appendChild(button);


  img.addEventListener('mouseenter', () => {
    tooltip.style.opacity = '1';
  });

  img.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
  });


  img.addEventListener('click', (event) => {
    event.stopPropagation();
    alert('hello click');
  });

event
  button.addEventListener('click', () => {
    alert('Button clicked!');
  });

  console.log('Button, image, and tooltip added successfully.');
}
