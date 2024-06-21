let intervalId;
let minutes = 20;
let seconds = 0;
let timerRunning = false; // Flag to track if timer is running

// Function to update display and send message to popup
function updateDisplay() {
    chrome.runtime.sendMessage({
        action: 'updateDisplay',
        minutes: minutes,
        seconds: seconds
    }, response => {
        if (null || chrome.runtime.lastError) {
            return;
            console.log("Error sending message: ");
        }
    });
}

// Function to start the timer
function startTimer() {
    if (!timerRunning) {
        clearInterval(intervalId);  // Clear any existing timer

        intervalId = setInterval(() => {
            if (seconds > 0) {
                seconds--;
            } else if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else {
                clearInterval(intervalId);
                timerRunning = false;
                // Optionally, handle what happens when the timer reaches zero
            }
            
            updateDisplay();
            chrome.storage.local.set({ minutes, seconds }); // Update storage with current timer values

            // Check if timer is at 0 minutes and 0 seconds to open a new page
            if (minutes === 0 && seconds === 0) {
                minutes = 20; // Reset timer to 20 minutes and 0 seconds
                seconds = 0;
                openNewPage();
                clearInterval(intervalId); // Clear interval after opening new page
                timerRunning = false;
            }
        }, 1000);

        timerRunning = true;
    }
}

// Function to reset the timer and immediately start it
function newresetTimer() {
    resetTimer();
    startTimer();
}

// Function to reset the timer
function resetTimer() {
    clearInterval(intervalId);
    minutes = 20;
    seconds = 0 ;
    timerRunning = false;
    updateDisplay();
    chrome.storage.local.set({ minutes, seconds }); // Update storage with reset timer values
}

// Function to open a new page
function openNewPage() {
    chrome.tabs.create({ url: chrome.runtime.getURL('newpage.html') }, tab => {
        if (chrome.runtime.lastError) {
            console.error("Error opening new tab: ", chrome.runtime.lastError.message);
        }
    });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startTimer') {
        startTimer();
        sendResponse({status: "Timer started"});
    } else if (message.action === 'resetTimer') {
        resetTimer();
        sendResponse({status: "Timer reset"});
    } else if (message.action === 'newresetTimer') {
        newresetTimer();
        sendResponse({status: "Timer reset and started"});
    }
    return true; // Keep the messaging channel open for sendResponse
});

// Initialize timer values from storage (if available)
chrome.storage.local.get(['minutes', 'seconds'], function(result) {
    if (result.minutes !== undefined && result.seconds !== undefined) {
        minutes = result.minutes;
        seconds = result.seconds;
        updateDisplay();
    } else {
        // If no stored values, default to 20 minutes and 0 seconds
        updateDisplay();
    }
});

