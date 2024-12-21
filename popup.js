document.addEventListener('DOMContentLoaded', () => {
  const speedInput = document.getElementById('speedInput');
  const btn1x = document.getElementById('btn1x');
  const btn2x = document.getElementById('btn2x');
  const btn4x = document.getElementById('btn4x');

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
  
  btn2x.addEventListener('click', () => {
    setSpeed(2);
    speedInput.value = 2;
  });
  
  btn4x.addEventListener('click', () => {
    setSpeed(4);
    speedInput.value = 4;
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
