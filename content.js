(function() {
  // Function that sets the video playback speed
  function setPlaybackSpeed(rate) {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.playbackRate = rate;
    });
  }

  // 1. On page load, fetch the saved speed and apply it
  chrome.storage.sync.get(['playbackSpeed'], ({ playbackSpeed }) => {
    const speed = playbackSpeed || 2;
    setPlaybackSpeed(speed);
  });

  // 2. Listen for messages from popup.js to update speed on the fly
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'UPDATE_SPEED') {
      setPlaybackSpeed(request.speed);
    }
  });

  // 3. Use a MutationObserver
  const observer = new MutationObserver(() => {
    chrome.storage.sync.get(['playbackSpeed'], ({ playbackSpeed }) => {
      const speed = playbackSpeed || 2;
      setPlaybackSpeed(speed);
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();

