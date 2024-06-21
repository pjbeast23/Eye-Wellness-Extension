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
                // Optionally, handle what happens when the timer reaches zero
            }
            
            updateDisplay();
            chrome.storage.local.set({ minutes, seconds }); // Update storage with current timer values

            // Check if timer is at 19 minutes and 50 seconds to open a new page
            if (minutes === 19 && seconds === 50) {
                openNewPage();
            }
        }, 1000);

        timerRunning = true;
    }
}
function newresetTimer() {
    resetTimer();
    startTimer();
}
// Function to reset the timer
function resetTimer() {
    clearInterval(intervalId);
    minutes = 20;
    seconds = 0;
    timerRunning = false;
    updateDisplay();
    chrome.storage.local.set({ minutes, seconds }); // Update storage with reset timer values
}

// Function to open a new page
function openNewPage() {
    chrome.tabs.create({ url: chrome.runtime.getURL('newpage.html') });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    if (message.action === 'startTimer') {
        console.log("hello1");
        startTimer();
    } else if (message.action === 'resetTimer') {
        resetTimer();
    }else if(message.action === 'newresetTimer'){
        newresetTimer();
}});

// Initialize timer values from storage (if available)
chrome.storage.local.get(['minutes', 'seconds'], function(result) {
    if (result.minutes !== undefined && result.seconds !== undefined) {
        minutes = result.minutes;
        seconds = result.seconds;
        updateDisplay();
        console.log("hello2");
    } else {
        // If no stored values, default to 20 minutes and 0 seconds
        updateDisplay(minutes, seconds); // Ensure display is updated with current values
    }
});
