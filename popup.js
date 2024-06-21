document.addEventListener('DOMContentLoaded', function() {
    const v2 = document.querySelector('.min');
    const v3 = document.querySelector('.sec');

    function updateDisplay(minutes, seconds) {
        v2.textContent = minutes.toString().padStart(2, '0');
        v3.textContent = seconds.toString().padStart(2, '0');
    }

    function startTimer() {
        chrome.runtime.sendMessage({ action: 'startTimer' });
    }

    function resetTimer() {
        chrome.runtime.sendMessage({ action: 'resetTimer' });
    }

    function newResetTimer() {
        chrome.runtime.sendMessage({ action: 'newResetTimer' });
    }

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'updateDisplay') {
            console.log("hello3");
            updateDisplay(message.minutes, message.seconds);
        }
    });

    // Ensure the 'start' button exists before adding event listener
    const startButton = document.getElementById('start');
    if (startButton) {
        startButton.addEventListener('click', startTimer);
    } else {
        console.error("Element with id 'start' not found.");
    }

    // Ensure the 'reset' button exists before adding event listener
    const resetButton = document.getElementById('reset');
    if (resetButton) {
        resetButton.addEventListener('click', resetTimer);
    } else {
        console.error("Element with id 'reset' not found.");
    }

    // Ensure the 'resetAndStart' button exists before adding event listener
  
    // Initialize display with default values
    updateDisplay(20, 0);
});
