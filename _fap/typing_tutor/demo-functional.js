/**
 * Demo Application for Functional Typing Tutor Keyboard
 * Demonstrates the functional approach with performance testing
 */

// =============================================================================
// DEMO STATE AND CONFIGURATION
// =============================================================================

let keyboard;
let performanceMetrics = {
    initTime: 0,
    renderTime: 0,
    keyPressCount: 0,
    totalKeyPressTime: 0
};

// =============================================================================
// KEYBOARD INITIALIZATION
// =============================================================================

function initKeyboard() {
    const startTime = performance.now();
    
    keyboard = createTypingTutorKeyboard({
        container: '#keyboard-container',
        debug: false,
        onChange: handleInputChange,
        onKeyPress: handleKeyPress,
        onKeyRelease: handleKeyRelease,
        onStateChange: handleStateChange
    });
    
    performanceMetrics.initTime = performance.now() - startTime;
    
    if (window.performance && window.performance.memory) {
        performanceMetrics.memoryUsed = (window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
    }
}

// =============================================================================
// EVENT HANDLERS
// =============================================================================

function handleInputChange(input) {
    const textInput = document.getElementById('textInput');
    textInput.value = input;
    updateStats();
}

function handleKeyPress(key, event) {
    const keyPressStart = performance.now();
    
    // Track performance metrics
    performanceMetrics.keyPressCount++;
    performanceMetrics.totalKeyPressTime += performance.now() - keyPressStart;
}

function handleKeyRelease(key, event) {
    // Could add key release metrics here if needed
}

function handleStateChange(state) {
    // Update modifier states efficiently
    updateDemoModifierStates(state);
}

// =============================================================================
// UI UPDATE FUNCTIONS
// =============================================================================

function updateStats() {
    const text = keyboard ? keyboard.getInput() : '';
    
    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
        document.getElementById('charCount').textContent = text.length;
        document.getElementById('wordCount').textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
    });
}

function updateDemoModifierStates(state) {
    requestAnimationFrame(() => {
        document.getElementById('shiftState').textContent = state.isShiftPressed ? 'Pressed' : 'Normal';
        document.getElementById('capsState').textContent = state.isCapsLockOn ? 'On' : 'Off';
    });
}

// =============================================================================
// DEMO FUNCTIONS
// =============================================================================

window.insertSampleText = function() {
    const sampleTexts = [
        'The quick brown fox jumps over the lazy dog.',
        'Pack my box with five dozen liquor jugs.',
        'How vexingly quick daft zebras jump!',
        'HELLO WORLD! Welcome to functional programming.',
        'Testing 123... Special characters: @#$%^&*()'
    ];
    
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    keyboard.setInput(randomText);
    updateStats();
};

window.clearText = function() {
    keyboard.clearInput();
    updateStats();
};

window.measurePerformance = function() {
    const performanceInfo = document.getElementById('performanceInfo');
    const performanceContent = document.getElementById('performanceContent');
    
    // Run a performance test
    const testStartTime = performance.now();
    const testText = 'Performance test: The quick brown fox jumps over the lazy dog! 1234567890';
    
    // Simulate rapid typing
    keyboard.clearInput();
    for (let i = 0; i < testText.length; i++) {
        keyboard.setInput(testText.substring(0, i + 1));
    }
    
    const testEndTime = performance.now();
    const testDuration = testEndTime - testStartTime;
    
    // Calculate averages
    const avgKeyPressTime = performanceMetrics.keyPressCount > 0 
        ? (performanceMetrics.totalKeyPressTime / performanceMetrics.keyPressCount).toFixed(3)
        : '0';
    
    // Display results
    performanceContent.innerHTML = `
        <span class="performance-metric">
            <strong>Initialization:</strong> ${performanceMetrics.initTime.toFixed(2)}ms
        </span>
        <span class="performance-metric">
            <strong>Test Duration:</strong> ${testDuration.toFixed(2)}ms
        </span>
        <span class="performance-metric">
            <strong>Key Presses:</strong> ${performanceMetrics.keyPressCount}
        </span>
        <span class="performance-metric">
            <strong>Avg Key Press:</strong> ${avgKeyPressTime}ms
        </span>
        ${performanceMetrics.memoryUsed ? `
        <span class="performance-metric">
            <strong>Memory Used:</strong> ${performanceMetrics.memoryUsed}MB
        </span>
        ` : ''}
        <br><br>
        <small>⚡ Functional implementation shows improved performance with pure functions and optimized state management.</small>
    `;
    
    performanceInfo.style.display = 'block';
    
    // Scroll to results
    performanceInfo.scrollIntoView({ behavior: 'smooth' });
};

// =============================================================================
// INITIALIZATION AND EVENT BINDING
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize keyboard with performance tracking
    initKeyboard();
    updateStats();
    
    // Sync text input with keyboard state
    const textInput = document.getElementById('textInput');
    textInput.addEventListener('input', function(e) {
        if (keyboard) {
            keyboard.setInput(e.target.value);
        }
        updateStats();
    });
    
    // Add some demo instructions
    console.log('🚀 Functional Typing Tutor Keyboard Demo loaded!');
    console.log('📊 Performance metrics:', performanceMetrics);
    console.log('🎯 Try the performance test to see optimization benefits');
});

// =============================================================================
// PERFORMANCE MONITORING (Development helper)
// =============================================================================

if (typeof window !== 'undefined' && window.performance) {
    // Monitor memory usage if available
    if (window.performance.memory) {
        setInterval(() => {
            const memory = window.performance.memory;
            if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB threshold
                console.warn('High memory usage detected:', 
                    (memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB');
            }
        }, 10000); // Check every 10 seconds
    }
    
    // Performance observer for long tasks
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (entry.duration > 50) { // Tasks longer than 50ms
                        console.warn('Long task detected:', entry.duration.toFixed(2) + 'ms');
                    }
                });
            });
            observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            // PerformanceObserver not supported in this browser
        }
    }
}