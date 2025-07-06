/**
 * Demo Application for Typing Tutor Keyboard
 * Shows how to use the TypingTutorKeyboard package
 */

let keyboard;
let debugMode = false;

// Initialize the keyboard
function initKeyboard() {
    keyboard = new TypingTutorKeyboard({
        container: '#keyboard-container',
        debug: debugMode,
        onChange: (input) => {
            const textInput = document.getElementById('textInput');
            textInput.value = input;
            updateStats();
            if (debugMode) {
                logDebug(`Input changed: "${input}"`);
            }
        },
        onKeyPress: (key, event) => {
            if (debugMode) {
                logDebug(`Key pressed: ${key} (${event ? event.type : 'virtual'})`);
            }
        },
        onKeyRelease: (key, event) => {
            if (debugMode) {
                logDebug(`Key released: ${key}`);
            }
        },
        onStateChange: (state) => {
            // Update modifier states when keyboard state changes
            document.getElementById('shiftState').textContent = state.isShiftPressed ? 'Pressed' : 'Normal';
            document.getElementById('capsState').textContent = state.isCapsLockOn ? 'On' : 'Off';
            
            if (debugMode) {
                logDebug(`State changed: Shift=${state.isShiftPressed}, Caps=${state.isCapsLockOn}`);
            }
        }
    });
}

// Demo functions
window.insertSampleText = function() {
    const sampleText = 'The quick brown fox jumps over the lazy dog. HELLO WORLD! 123456789';
    keyboard.setInput(sampleText);
    updateStats();
};

window.clearText = function() {
    keyboard.clearInput();
    updateStats();
};

window.toggleDebug = function() {
    debugMode = !debugMode;
    const debugInfo = document.getElementById('debugInfo');
    debugInfo.style.display = debugMode ? 'block' : 'none';
    
    if (debugMode) {
        logDebug('Debug mode enabled');
    }
};

function updateStats() {
    const text = keyboard ? keyboard.getInput() : '';
    
    document.getElementById('charCount').textContent = text.length;
    document.getElementById('wordCount').textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
}

function logDebug(message) {
    if (!debugMode) return;
    
    const debugContent = document.getElementById('debugContent');
    const timestamp = new Date().toLocaleTimeString();
    debugContent.innerHTML += `<div>[${timestamp}] ${message}</div>`;
    debugContent.scrollTop = debugContent.scrollHeight;
}

// Sync text input with keyboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize keyboard
    initKeyboard();
    updateStats();
    
    // Sync text input with keyboard
    document.getElementById('textInput').addEventListener('input', function(e) {
        if (keyboard) {
            keyboard.setInput(e.target.value);
        }
        updateStats();
    });
});
