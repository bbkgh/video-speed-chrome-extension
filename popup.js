document.addEventListener('DOMContentLoaded', () => {
  const speedInput = document.getElementById('speedInput');
  const btn1x = document.getElementById('btn1x');
  const btn1_5x = document.getElementById('btn1_5x');
  const btn2x = document.getElementById('btn2x');

  // Load previously saved speed from storage
  chrome.storage.sync.get(['playbackSpeed'], ({ playbackSpeed }) => {
    speedInput.value = playbackSpeed || 2;
  });

  // When user changes speed via numeric input
  speedInput.addEventListener('change', () => {
    const newSpeed = parseFloat(speedInput.value) || 2;
    setSpeed(newSpeed);
  });

  // Button event listeners
  btn1x.addEventListener('click', () => {
    setSpeed(1);
    speedInput.value = 1;
  });
  
  btn1_5x.addEventListener('click', () => {
    setSpeed(1.5);
    speedInput.value = 1.5;
  });
  
  btn2x.addEventListener('click', () => {
    setSpeed(2);
    speedInput.value = 2;
  });

  // Helper function to update speed in storage and content script
  function setSpeed(speedValue) {
    chrome.storage.sync.set({ playbackSpeed: speedValue }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'UPDATE_SPEED',
            speed: speedValue
          });
        }
      });
    });
  }
});
