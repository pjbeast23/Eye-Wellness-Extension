document.getElementById('returnToTimer').addEventListener('click', function() {
    document.getElementById('returnToTimer').innerHTML="Restarted";
    chrome.runtime.sendMessage({ action: 'newresetTimer' });
});