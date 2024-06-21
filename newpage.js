document.getElementById('returnToTimer').addEventListener('click', function() {
    chrome.runtime.sendMessage({ action: 'newresetTimer' });
});