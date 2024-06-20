let intervalId;
let minutes = 20;
let seconds = 0;

function updateDisplay() {
    chrome.runtime.sendMessage({
        action: 'updateDisplay',
        minutes: minutes,
        seconds: seconds
    });
}

function startTimer() {
    clearInterval(intervalId);  // Ensure any existing timer is cleared before starting a new one
    intervalId = setInterval(() => {
        if (seconds > 0) {
            seconds--;
        } else if (minutes > 0) {
            minutes--;
            seconds = 59;
        } else {
            clearInterval(intervalId);
            // Optionally, handle what happens when the timer reaches zero
        }
        
        updateDisplay();
        chrome.storage.local.set({ minutes, seconds }); // Update storage with current timer values

        // Check if timer is at 19 minutes and 50 seconds
        if (minutes ===-1) {
            openNewPage();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(intervalId);
    minutes = 20;
    seconds = 0;
    updateDisplay();
    chrome.storage.local.set({ minutes, seconds }); // Update storage with reset timer values
    startTimer();
}

function openNewPage() {
    // Replace 'https://example.com' with the URL you want to open
    chrome.tabs.create({ url: chrome.runtime.getURL('newpage.html') });

}

// Initialize timer values from storage (if available)
chrome.storage.local.get(['minutes', 'seconds'], function(result) {
    if (result.minutes !== undefined && result.seconds !== undefined) {
        minutes = result.minutes;
        seconds = result.seconds;
        updateDisplay();
    } else {
        updateDisplay(); // Ensure display is updated with default values if nothing is in storage
    }
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'startTimer') {
        startTimer();
    } else if (message.action === 'resetTimer') {
        resetTimer();
    } else if (message.action === 'returnToTimer') {
        resetTimer();
    }
});
