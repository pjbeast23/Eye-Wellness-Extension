document.addEventListener('DOMContentLoaded', function() {
    const v2 = document.querySelector('.min');
    const v3 = document.querySelector('.sec');
    function updateDisplay(minutes, seconds) {
        v2.innerHTML = minutes.toString().padStart(2, '0');
        v3.innerHTML = seconds.toString().padStart(2, '0');
    }

    // Set up message listener to update display
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.action === 'updateDisplay') {
            updateDisplay(message.minutes, message.seconds);
        }
    });

    // Start timer button
  // Ensure the DOM is fully loaded before executing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Attach click event listener to the 'start' button
    document.getElementById('start').addEventListener('click', function() {
        // Send message to background script to start the timer
        chrome.runtime.sendMessage({ action: 'startTimer' });
    });
});


    // Reset timer button
    document.getElementById('reset').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: 'resetTimer' });
    });

    // Load initial display values from storage
    chrome.storage.local.get(['minutes', 'seconds'], function(result) {
        if (result.minutes !== undefined && result.seconds !== undefined) {
            updateDisplay(result.minutes, result.seconds);
        } else {
            updateDisplay(20, 0); // Default initial values
        }
    });
});
