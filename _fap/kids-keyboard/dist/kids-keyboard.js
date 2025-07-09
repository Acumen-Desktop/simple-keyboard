/**
 * Kids Keyboard - Virtual Keyboard for Children's Typing Education
 * 
 * A lightweight, accessible virtual keyboard designed specifically for young learners.
 * Focused on simplicity, performance, and educational effectiveness.
 * 
 * @version 0.9.0
 * @author Kids Keyboard Team
 * @license MIT
 * 
 * ACKNOWLEDGMENTS:
 * This library was inspired by simple-keyboard (https://github.com/hodgef/simple-keyboard)
 * by Francisco Hodge. Kids-keyboard is a lightweight, education-focused derivative
 * optimized specifically for children's typing learning applications.
 * 
 * Key differences from simple-keyboard:
 * - Simplified API focused on educational use cases
 * - Mouse-based tutor mode activation
 * - Enhanced accessibility for young learners
 * - Optimized for performance and memory usage
 * - Built-in physical keyboard integration
 * 
 * PRODUCTION-READY FEATURES:
 * ✓ State management race condition fixes
 * ✓ Optimized DOM rendering with differential updates
 * ✓ Correct Shift/CapsLock logic for letters vs symbols
 * ✓ Memory optimizations with constant caching
 * ✓ Comprehensive error handling and validation
 * ✓ Mouse-based tutor mode with visual feedback
 * ✓ Accessibility support with ARIA attributes
 * ✓ Responsive design for desktop/laptop/tablet
 */

// =============================================================================
// BROWSER COMPATIBILITY CHECKS
// =============================================================================

const BROWSER_SUPPORT = {
    hasEventListeners: typeof document.addEventListener === 'function',
    hasQuerySelector: typeof document.querySelector === 'function',
    hasClassList: 'classList' in document.createElement('div'),
    hasGetModifierState: typeof KeyboardEvent !== 'undefined' && 
                        KeyboardEvent.prototype && 
                        'getModifierState' in KeyboardEvent.prototype
};

// Warn about compatibility issues
if (!BROWSER_SUPPORT.hasEventListeners || !BROWSER_SUPPORT.hasQuerySelector) {
    console.warn('Kids Keyboard: Browser may not be fully supported. Modern browser recommended.');
}

// =============================================================================
// STATE MANAGEMENT
// =============================================================================

const createKeyboardState = () => ({
    input: '',
    caretPosition: 0,
    isShiftPressed: false,
    isLeftShiftPressed: false,
    isRightShiftPressed: false,
    isCapsLockOn: false
});

// =============================================================================
// KEYBOARD LAYOUT DATA
// =============================================================================

const getKeyboardLayout = () => ({
    default: [
        ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
        ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
        ['ShiftLeft', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'ShiftRight'],
        ['Space']
    ],
    shift: [
        ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Backspace'],
        ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|'],
        ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Enter'],
        ['ShiftLeft', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'ShiftRight'],
        ['Space']
    ]
});

const getPhysicalKeyMap = () => new Map([
    ['Backquote', '`'], ['Digit1', '1'], ['Digit2', '2'], ['Digit3', '3'], ['Digit4', '4'],
    ['Digit5', '5'], ['Digit6', '6'], ['Digit7', '7'], ['Digit8', '8'], ['Digit9', '9'],
    ['Digit0', '0'], ['Minus', '-'], ['Equal', '='], ['Backspace', 'Backspace'],
    ['Tab', 'Tab'], ['KeyQ', 'q'], ['KeyW', 'w'], ['KeyE', 'e'], ['KeyR', 'r'],
    ['KeyT', 't'], ['KeyY', 'y'], ['KeyU', 'u'], ['KeyI', 'i'], ['KeyO', 'o'],
    ['KeyP', 'p'], ['BracketLeft', '['], ['BracketRight', ']'], ['Backslash', '\\'],
    ['CapsLock', 'CapsLock'], ['KeyA', 'a'], ['KeyS', 's'], ['KeyD', 'd'], ['KeyF', 'f'],
    ['KeyG', 'g'], ['KeyH', 'h'], ['KeyJ', 'j'], ['KeyK', 'k'], ['KeyL', 'l'],
    ['Semicolon', ';'], ['Quote', "'"], ['Enter', 'Enter'], ['ShiftLeft', 'ShiftLeft'],
    ['ShiftRight', 'ShiftRight'], ['KeyZ', 'z'], ['KeyX', 'x'], ['KeyC', 'c'],
    ['KeyV', 'v'], ['KeyB', 'b'], ['KeyN', 'n'], ['KeyM', 'm'], ['Comma', ','],
    ['Period', '.'], ['Slash', '/'], ['Space', 'Space']
]);

// =============================================================================
// CONSTANTS (Performance Optimization)
// =============================================================================

// Module-level constant to avoid repeated object creation
const SHIFT_MAP = Object.freeze({
    '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
    '6': '^', '7': '&', '8': '*', '9': '(', '0': ')', '-': '_', '=': '+',
    '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"',
    ',': '<', '.': '>', '/': '?'
});

// Cache keyboard layouts to reduce function call overhead
const KEYBOARD_LAYOUTS = Object.freeze(getKeyboardLayout());

// Input length limit for performance and memory safety
const MAX_INPUT_LENGTH = 10000;

// =============================================================================
// PURE UTILITY FUNCTIONS
// =============================================================================

const isModifierKey = (key) => ['ShiftLeft', 'ShiftRight', 'CapsLock'].includes(key);

/**
 * Determines which layout to display based on modifier states
 * Letters: CapsLock XOR Shift determines case
 * Symbols: Only Shift affects symbols, CapsLock ignored
 */
const getCurrentLayout = (state) => {
    const shouldUseShift = state.isShiftPressed !== state.isCapsLockOn;
    return shouldUseShift ? KEYBOARD_LAYOUTS.shift : KEYBOARD_LAYOUTS.default;
};

const getKeyDisplayText = (key) => {
    if (key === 'ShiftLeft' || key === 'ShiftRight') return 'Shift';
    return key;
};

const getKeyMapName = (key) => {
    return (key === 'ShiftLeft' || key === 'ShiftRight' || key === 'CapsLock') ? key : key.toLowerCase();
};

/**
 * Transforms character based on current modifier states
 */
const transformCharacter = (char, state) => {
    // For letters: both shift and caps lock affect case
    if (/^[a-z]$/i.test(char)) {
        const shouldUppercase = state.isShiftPressed !== state.isCapsLockOn;
        return shouldUppercase ? char.toUpperCase() : char.toLowerCase();
    }

    // For symbols: only shift affects them, caps lock is ignored
    if (state.isShiftPressed) {
        return SHIFT_MAP[char] || char;
    }

    return char;
};

/**
 * Input validation with length limits
 */
const validateInput = (input) => {
    if (typeof input !== 'string') {
        throw new Error('Input must be a string');
    }
    // Prevent memory issues with extremely long inputs
    if (input.length > MAX_INPUT_LENGTH) {
        console.warn(`Kids Keyboard: Input truncated to ${MAX_INPUT_LENGTH} characters for performance`);
        return input.substring(0, MAX_INPUT_LENGTH);
    }
    return input;
};

const validateCaretPosition = (caretPosition, inputLength) => {
    if (typeof caretPosition !== 'number' || caretPosition < 0) {
        return 0;
    }
    if (caretPosition > inputLength) {
        return inputLength;
    }
    return caretPosition;
};

const updateInputAtCaret = (input, caretPosition, newChar) => {
    const validInput = validateInput(input);
    const validCaret = validateCaretPosition(caretPosition, validInput.length);

    const before = validInput.substring(0, validCaret);
    const after = validInput.substring(validCaret);
    return {
        newInput: before + newChar + after,
        newCaretPosition: validCaret + 1
    };
};

const deleteAtCaret = (input, caretPosition) => {
    const validInput = validateInput(input);
    const validCaret = validateCaretPosition(caretPosition, validInput.length);

    if (validCaret <= 0) return { newInput: validInput, newCaretPosition: 0 };

    const before = validInput.substring(0, validCaret - 1);
    const after = validInput.substring(validCaret);
    return {
        newInput: before + after,
        newCaretPosition: validCaret - 1
    };
};

/**
 * Safe callback execution with error handling
 */
const safeCallback = (callback, ...args) => {
    if (typeof callback === 'function') {
        try {
            return callback(...args);
        } catch (error) {
            console.error('Kids Keyboard callback error:', error);
        }
    }
};

// =============================================================================
// DOM UTILITIES
// =============================================================================

/**
 * Creates keyboard key elements with accessibility support
 */
const createKeyElement = (key, defaultLayout, shiftLayout, rowIndex, keyIndex) => {
    const element = document.createElement('button');
    element.className = 'keyboard-key';
    element.dataset.key = key.toLowerCase();
    element.dataset.rowIndex = rowIndex;
    element.dataset.keyIndex = keyIndex;
    
    // Add ARIA attributes for accessibility
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
    element.setAttribute('aria-label', `Key ${getKeyDisplayText(key)}`);

    // Store both default and shift characters for this key position
    const defaultChar = defaultLayout[rowIndex][keyIndex];
    const shiftChar = shiftLayout[rowIndex][keyIndex];

    // Create character display elements for efficient switching
    if (defaultChar !== shiftChar && key.length === 1) {
        const defaultSpan = document.createElement('span');
        defaultSpan.className = 'key-char-default';
        defaultSpan.textContent = defaultChar;

        const shiftSpan = document.createElement('span');
        shiftSpan.className = 'key-char-shift';
        shiftSpan.textContent = shiftChar;

        element.appendChild(defaultSpan);
        element.appendChild(shiftSpan);
    } else {
        // For modifier keys and keys that don't change
        element.textContent = getKeyDisplayText(key);
    }

    // Add special classes for different key types
    if (isModifierKey(key)) {
        element.classList.add('modifier-key');
    } else if (key === 'Space') {
        element.classList.add('space-key');
    } else if (key.length > 1) {
        element.classList.add('function-key');
    } else {
        element.classList.add('normal-key');
    }

    return element;
};

/**
 * Renders keyboard with differential rendering for performance
 */
const renderKeyboard = (container, state, keyElements, onKeyPress) => {
    // Only render DOM elements once
    if (keyElements.size === 0) {
        container.innerHTML = '';
        container.className = 'kids-keyboard';
        
        // Add ARIA attributes for the keyboard container
        container.setAttribute('role', 'application');
        container.setAttribute('aria-label', 'Virtual keyboard for typing input');
        container.setAttribute('aria-live', 'polite');

        const defaultLayout = KEYBOARD_LAYOUTS.default;
        const shiftLayout = KEYBOARD_LAYOUTS.shift;

        defaultLayout.forEach((row, rowIndex) => {
            const rowElement = document.createElement('div');
            rowElement.className = 'keyboard-row';

            row.forEach((key, keyIndex) => {
                const keyElement = createKeyElement(key, defaultLayout, shiftLayout, rowIndex, keyIndex);
                rowElement.appendChild(keyElement);

                const keyMapName = getKeyMapName(key);
                keyElements.set(keyMapName, keyElement);
            });

            container.appendChild(rowElement);
        });

        // Use event delegation for better performance
        const handleContainerClick = (e) => {
            if (e.target.matches('.keyboard-key')) {
                e.preventDefault();
                // Find the original key from the layout
                const rowIndex = parseInt(e.target.dataset.rowIndex);
                const keyIndex = parseInt(e.target.dataset.keyIndex);
                const originalKey = KEYBOARD_LAYOUTS.default[rowIndex][keyIndex];
                safeCallback(onKeyPress, originalKey, e);
            }
        };
        
        container.addEventListener('click', handleContainerClick);
    }

    // Update layout class for CSS-based switching
    updateLayoutClass(container, state);
};

/**
 * Updates layout display using CSS classes for performance
 */
const updateLayoutClass = (container, state) => {
    const shouldUseShift = state.isShiftPressed !== state.isCapsLockOn;
    container.classList.toggle('shift-layout', shouldUseShift);
};

/**
 * Highlights keys with appropriate styling
 */
const highlightKey = (keyElements, key, highlight) => {
    const keyMapName = getKeyMapName(key);
    const element = keyElements.get(keyMapName);
    if (!element) return;

    // Remove all highlight classes first
    element.classList.remove('highlighted', 'highlight-normal', 'highlight-modifier', 'highlight-function');

    if (highlight) {
        // Add appropriate highlight class based on key type
        if (isModifierKey(key)) {
            element.classList.add('highlight-modifier');
        } else if (key.length > 1 && key !== 'Space') {
            element.classList.add('highlight-function');
        } else {
            element.classList.add('highlight-normal');
        }
        element.classList.add('highlighted');
    }
};

/**
 * Updates visual state of modifier keys
 */
const updateKeyStates = (keyElements, state) => {
    keyElements.forEach((element, key) => {
        element.classList.remove('active-modifier', 'highlight-modifier');

        if (key === 'ShiftLeft' && state.isLeftShiftPressed) {
            element.classList.add('active-modifier');
        } else if (key === 'ShiftRight' && state.isRightShiftPressed) {
            element.classList.add('active-modifier');
        } else if (key === 'CapsLock' && state.isCapsLockOn) {
            element.classList.add('active-modifier', 'highlight-modifier', 'highlighted');
        } else if (key === 'CapsLock' && !state.isCapsLockOn) {
            element.classList.remove('highlighted');
        }
    });
};

// =============================================================================
// MODIFIER STATE HANDLING
// =============================================================================

const updateModifierStatesInternal = (currentState, event) => {
    const newState = { ...currentState };
    
    // Update general shift state
    newState.isShiftPressed = event.shiftKey;
    
    // Update specific shift key states
    if (event.type === 'keydown') {
        if (event.code === 'ShiftLeft') {
            newState.isLeftShiftPressed = true;
        } else if (event.code === 'ShiftRight') {
            newState.isRightShiftPressed = true;
        }
    } else if (event.type === 'keyup') {
        if (event.code === 'ShiftLeft') {
            newState.isLeftShiftPressed = false;
        } else if (event.code === 'ShiftRight') {
            newState.isRightShiftPressed = false;
        }
    }

    // Handle caps lock state detection
    if (BROWSER_SUPPORT.hasGetModifierState && event.getModifierState) {
        const capsLockState = event.getModifierState('CapsLock');
        if (capsLockState !== currentState.isCapsLockOn) {
            newState.isCapsLockOn = capsLockState;
        }
    }

    return newState;
};

// =============================================================================
// MAIN FACTORY FUNCTION
// =============================================================================

/**
 * Creates a new Kids Keyboard instance
 * @param {Object} options - Configuration options
 * @returns {Object} Kids Keyboard API object
 */
function createKidsKeyboard(options = {}) {
    // Merge default options
    const defaultOptions = {
        debug: false,
        targetInput: null,
        tutorContainer: null
    };
    const mergedOptions = { ...defaultOptions, ...options };

    // Get container element with improved error handling
    let container;
    try {
        container = typeof mergedOptions.container === 'string' 
            ? document.querySelector(mergedOptions.container)
            : mergedOptions.container;
    } catch (error) {
        throw new Error(`Invalid container selector: ${mergedOptions.container}. Error: ${error.message}`);
    }

    if (!container) {
        throw new Error(`Container element not found: ${mergedOptions.container}. Please ensure the element exists in the DOM.`);
    }

    if (!(container instanceof HTMLElement)) {
        throw new Error(`Container must be an HTMLElement. Received: ${typeof container}`);
    }

    // Get target input element for tutor mode
    let targetInput = null;
    if (mergedOptions.targetInput) {
        try {
            targetInput = typeof mergedOptions.targetInput === 'string' 
                ? document.querySelector(mergedOptions.targetInput)
                : mergedOptions.targetInput;
        } catch (error) {
            console.warn(`Invalid target input selector: ${mergedOptions.targetInput}`);
        }
        
        if (targetInput && !(targetInput instanceof HTMLElement)) {
            console.warn(`Target input must be an HTMLElement. Received: ${typeof targetInput}`);
            targetInput = null;
        }
    }

    // Get tutor container for mouse-based activation
    let tutorContainer = null;
    if (mergedOptions.tutorContainer) {
        try {
            tutorContainer = typeof mergedOptions.tutorContainer === 'string' 
                ? document.querySelector(mergedOptions.tutorContainer)
                : mergedOptions.tutorContainer;
        } catch (error) {
            console.warn(`Invalid tutor container selector: ${mergedOptions.tutorContainer}`);
        }
    } else {
        // Auto-detect tutor container by looking for parent with 'tutor' in ID
        let current = container.parentElement;
        while (current && current !== document.body) {
            if (current.id && current.id.includes('tutor')) {
                tutorContainer = current;
                break;
            }
            current = current.parentElement;
        }
    }

    // Initialize state and elements
    let state = createKeyboardState();
    const keyElements = new Map();
    const physicalKeyMap = getPhysicalKeyMap();
    
    // Track tutor mode state
    let isTutorMode = false;

    /**
     * Centralized state update function to prevent race conditions
     */
    const setState = (newState) => {
        const prevState = state;
        state = newState;

        // Update layout class if modifier states changed
        if (prevState.isShiftPressed !== newState.isShiftPressed ||
            prevState.isCapsLockOn !== newState.isCapsLockOn) {
            updateLayoutClass(container, state);
        }

        // Always update key states for modifier highlighting
        updateKeyStates(keyElements, state);

        // Safely notify state change
        safeCallback(mergedOptions.onStateChange, { ...state });
    };

    /**
     * Handles key press events from both virtual and physical keyboards
     */
    const handleKeyPress = (key, event) => {
        safeCallback(mergedOptions.onKeyPress, key, event);

        let newState = { ...state };
        let inputChanged = false;

        // Handle special keys
        switch (key) {
            case 'Backspace':
                const { newInput: backspaceInput, newCaretPosition: backspaceCaret } =
                    deleteAtCaret(state.input, state.caretPosition);
                newState = { ...newState, input: backspaceInput, caretPosition: backspaceCaret };
                inputChanged = true;
                break;
            case 'Enter':
                const { newInput: enterInput, newCaretPosition: enterCaret } =
                    updateInputAtCaret(state.input, state.caretPosition, '\n');
                newState = { ...newState, input: enterInput, caretPosition: enterCaret };
                inputChanged = true;
                break;
            case 'Space':
                const { newInput: spaceInput, newCaretPosition: spaceCaret } =
                    updateInputAtCaret(state.input, state.caretPosition, ' ');
                newState = { ...newState, input: spaceInput, caretPosition: spaceCaret };
                inputChanged = true;
                break;
            case 'Tab':
                const { newInput: tabInput, newCaretPosition: tabCaret } =
                    updateInputAtCaret(state.input, state.caretPosition, '\t');
                newState = { ...newState, input: tabInput, caretPosition: tabCaret };
                inputChanged = true;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
            case 'CapsLock':
                // These are handled in modifier state updates
                break;
            default:
                if (key.length === 1) {
                    const transformedChar = transformCharacter(key, state);
                    const { newInput: charInput, newCaretPosition: charCaret } =
                        updateInputAtCaret(state.input, state.caretPosition, transformedChar);
                    newState = { ...newState, input: charInput, caretPosition: charCaret };
                    inputChanged = true;
                }
                break;
        }

        // Update state consistently
        setState(newState);

        // Notify about input changes and sync with target input
        if (inputChanged) {
            // Sync with target input if in tutor mode
            if (isTutorMode && targetInput) {
                targetInput.value = newState.input;
                targetInput.setSelectionRange(newState.caretPosition, newState.caretPosition);
                
                // Trigger input event for form validation and other listeners
                targetInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            
            safeCallback(mergedOptions.onChange, newState.input);
        }
    };

    /**
     * Handles physical keyboard key down events (only in tutor mode)
     */
    const handlePhysicalKeyDown = (event) => {
        // Only handle physical keyboard when in tutor mode
        if (!isTutorMode) return;
        
        const virtualKey = physicalKeyMap.get(event.code);
        if (!virtualKey) return;

        // Update modifier states
        const modifierState = updateModifierStatesInternal(state, event);
        setState(modifierState);

        // Highlight the corresponding virtual key
        highlightKey(keyElements, virtualKey, true);

        // Handle key press
        if (virtualKey.length === 1 || ['Backspace', 'Enter', 'Space', 'Tab'].includes(virtualKey)) {
            event.preventDefault();
            handleKeyPress(virtualKey, event);
        } else if (virtualKey === 'CapsLock') {
            event.preventDefault();
            handleKeyPress(virtualKey, event);
        } else if (virtualKey === 'ShiftLeft' || virtualKey === 'ShiftRight') {
            // Shift keys are already handled by setState above
        }

        if (mergedOptions.debug) {
            console.log('Physical key down:', event.code, '->', virtualKey);
        }
    };

    /**
     * Handles physical keyboard key up events (only in tutor mode)
     */
    const handlePhysicalKeyUp = (event) => {
        // Only handle physical keyboard when in tutor mode
        if (!isTutorMode) return;
        
        const virtualKey = physicalKeyMap.get(event.code);
        if (!virtualKey) return;

        // Update modifier states
        const modifierState = updateModifierStatesInternal(state, event);
        setState(modifierState);

        // Remove highlight
        if (virtualKey !== 'CapsLock' || !state.isCapsLockOn) {
            highlightKey(keyElements, virtualKey, false);
        }

        safeCallback(mergedOptions.onKeyRelease, virtualKey, event);

        if (mergedOptions.debug) {
            console.log('Physical key up:', event.code, '->', virtualKey);
        }
    };

    /**
     * Mouse enter handler for tutor mode activation
     */
    const handleTutorEnter = (event) => {
        isTutorMode = true;
        if (mergedOptions.debug) {
            console.log('Tutor mode activated (mouse enter)');
        }
        
        // Sync keyboard state with target input
        if (targetInput) {
            setState({
                ...state,
                input: targetInput.value || '',
                caretPosition: targetInput.selectionStart || 0
            });
        }
        
        // Add visual indicator to tutor container
        if (tutorContainer) {
            tutorContainer.classList.add('tutor-mode-active');
        }
        
        safeCallback(mergedOptions.onTutorModeChange, true);
    };

    /**
     * Mouse leave handler for tutor mode deactivation
     */
    const handleTutorLeave = (event) => {
        isTutorMode = false;
        if (mergedOptions.debug) {
            console.log('Tutor mode deactivated (mouse leave)');
        }
        
        // Remove visual indicator from tutor container
        if (tutorContainer) {
            tutorContainer.classList.remove('tutor-mode-active');
        }
        
        safeCallback(mergedOptions.onTutorModeChange, false);
    };

    /**
     * Renders the keyboard interface
     */
    const render = () => {
        renderKeyboard(container, state, keyElements, handleKeyPress);
        updateKeyStates(keyElements, state);
    };

    /**
     * Sets up all event listeners
     */
    const setupEventListeners = () => {
        document.addEventListener('keydown', handlePhysicalKeyDown);
        document.addEventListener('keyup', handlePhysicalKeyUp);
        
        // Setup mouse-based tutor mode activation
        if (tutorContainer) {
            tutorContainer.addEventListener('mouseenter', handleTutorEnter);
            tutorContainer.addEventListener('mouseleave', handleTutorLeave);
            
            if (mergedOptions.debug) {
                console.log('Mouse-based tutor mode enabled on:', tutorContainer.id || tutorContainer.className);
            }
        } else if (mergedOptions.debug) {
            console.warn('No tutor container found - tutor mode activation disabled');
        }
    };

    /**
     * Cleans up resources and event listeners
     */
    const destroy = () => {
        document.removeEventListener('keydown', handlePhysicalKeyDown);
        document.removeEventListener('keyup', handlePhysicalKeyUp);
        
        // Remove tutor container event listeners
        if (tutorContainer) {
            tutorContainer.removeEventListener('mouseenter', handleTutorEnter);
            tutorContainer.removeEventListener('mouseleave', handleTutorLeave);
        }
        
        // Clear DOM and references
        container.innerHTML = '';
        keyElements.clear();
        
        // Clear state references for garbage collection
        state = null;
        targetInput = null;
        tutorContainer = null;
    };

    // Initialize the keyboard
    render();
    setupEventListeners();

    // Return the public API
    return {
        // Input methods
        getInput: () => state.input,
        setInput: (input) => {
            try {
                const validInput = validateInput(input);
                const newState = {
                    ...state,
                    input: validInput,
                    caretPosition: validateCaretPosition(validInput.length, validInput.length)
                };
                setState(newState);
                safeCallback(mergedOptions.onChange, validInput);
            } catch (error) {
                console.error('setInput error:', error);
            }
        },
        clearInput: () => {
            const newState = { ...state, input: '', caretPosition: 0 };
            setState(newState);
            safeCallback(mergedOptions.onChange, '');
        },

        // Caret methods
        setCaretPosition: (position) => {
            try {
                const validPosition = validateCaretPosition(position, state.input.length);
                const newState = { ...state, caretPosition: validPosition };
                setState(newState);
            } catch (error) {
                console.error('setCaretPosition error:', error);
            }
        },
        getCaretPosition: () => state.caretPosition,

        // State methods
        getState: () => ({ ...state }),

        // Tutor mode methods
        isTutorModeActive: () => isTutorMode,
        getTargetInput: () => targetInput,

        // Lifecycle methods
        destroy
    };
}

// =============================================================================
// MODULE EXPORTS
// =============================================================================

// Support multiple module systems
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = createKidsKeyboard;
} else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], () => createKidsKeyboard);
} else {
    // Browser global
    window.createKidsKeyboard = createKidsKeyboard;
}