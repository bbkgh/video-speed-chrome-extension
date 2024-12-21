document.addEventListener('DOMContentLoaded', () => {
  const speedInput = document.getElementById('speedInput');

  // Load previously saved speed from storage, default to 2.
  chrome.storage.sync.get(['playbackSpeed'], ({ playbackSpeed }) => {
    speedInput.value = playbackSpeed || 2;
  });

  // When user changes speed, save it to storage and notify the content script
  speedInput.addEventListener('change', () => {
    const newSpeed = parseFloat(speedInput.value) || 2;

    // Store the chosen speed in Chrome storage
    chrome.storage.sync.set({ playbackSpeed: newSpeed }, () => {
      // Send a message to the current tab to update the speed
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'UPDATE_SPEED',
            speed: newSpeed
          });
        }
      });
    });
  });
});

