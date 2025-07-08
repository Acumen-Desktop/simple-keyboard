/**
 * Functional Typing Tutor Keyboard
 * Minimal functional implementation for young children's typing education
 */

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
// PURE UTILITY FUNCTIONS
// =============================================================================

const isModifierKey = (key) => ['ShiftLeft', 'ShiftRight', 'CapsLock'].includes(key);

const getCurrentLayout = (state) => {
    const shouldUseShift = state.isShiftPressed !== state.isCapsLockOn;
    const layout = getKeyboardLayout();
    return shouldUseShift ? layout.shift : layout.default;
};

const getKeyDisplayText = (key) => {
    if (key === 'ShiftLeft' || key === 'ShiftRight') return 'Shift';
    return key;
};

const getKeyMapName = (key) => {
    return (key === 'ShiftLeft' || key === 'ShiftRight' || key === 'CapsLock') ? key : key.toLowerCase();
};

const transformCharacter = (char, state) => {
    const shouldUseShift = state.isShiftPressed !== state.isCapsLockOn;

    if (!shouldUseShift) {
        return char.toLowerCase();
    }

    // Character transformation map for shift
    const shiftMap = {
        '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
        '6': '^', '7': '&', '8': '*', '9': '(', '0': ')', '-': '_', '=': '+',
        '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"',
        ',': '<', '.': '>', '/': '?'
    };

    // If it's a letter, just uppercase it
    if (/^[a-z]$/i.test(char)) {
        return char.toUpperCase();
    }

    // If it's a symbol that has a shift variant, use it
    return shiftMap[char] || char;
};

const updateInputAtCaret = (input, caretPosition, newChar) => {
    const before = input.substring(0, caretPosition);
    const after = input.substring(caretPosition);
    return {
        newInput: before + newChar + after,
        newCaretPosition: caretPosition + 1
    };
};

const deleteAtCaret = (input, caretPosition) => {
    if (caretPosition <= 0) return { newInput: input, newCaretPosition: caretPosition };
    
    const before = input.substring(0, caretPosition - 1);
    const after = input.substring(caretPosition);
    return {
        newInput: before + after,
        newCaretPosition: caretPosition - 1
    };
};

// =============================================================================
// DOM UTILITIES
// =============================================================================

const createKeyElement = (key, onKeyPress) => {
    const element = document.createElement('button');
    element.className = 'keyboard-key';
    element.textContent = getKeyDisplayText(key);
    element.dataset.key = key.toLowerCase();

    // Add special classes for different key types
    if (isModifierKey(key)) {
        element.classList.add('modifier-key');
    } else if (key === 'Space') {
        element.classList.add('space-key');
    } else if (key === 'Tab') {
        element.classList.add('normal-key');
    } else if (key.length > 1) {
        element.classList.add('function-key');
    } else {
        element.classList.add('normal-key');
    }

    element.addEventListener('click', (e) => {
        e.preventDefault();
        onKeyPress(key, e);
    });

    return element;
};

const renderKeyboard = (container, state, keyElements, onKeyPress) => {
    container.innerHTML = '';
    container.className = 'typing-tutor-keyboard';
    keyElements.clear();

    const currentLayout = getCurrentLayout(state);

    currentLayout.forEach((row) => {
        const rowElement = document.createElement('div');
        rowElement.className = 'keyboard-row';

        row.forEach(key => {
            const keyElement = createKeyElement(key, onKeyPress);
            rowElement.appendChild(keyElement);
            
            const keyMapName = getKeyMapName(key);
            keyElements.set(keyMapName, keyElement);
        });

        container.appendChild(rowElement);
    });
};

const highlightKey = (keyElements, options, key, highlight) => {
    const keyMapName = getKeyMapName(key);
    const element = keyElements.get(keyMapName);
    if (!element) return;

    if (highlight) {
        const color = isModifierKey(key) 
            ? options.modifierKeyColor 
            : options.normalKeyColor;
        
        element.style.backgroundColor = color || '#4CAF50';
        element.classList.add('highlighted');
    } else {
        element.style.backgroundColor = '';
        element.classList.remove('highlighted');
    }
};

const updateKeyStates = (keyElements, state, options) => {
    keyElements.forEach((element, key) => {
        element.classList.remove('active-modifier');

        if (key === 'ShiftLeft' && state.isLeftShiftPressed) {
            element.classList.add('active-modifier');
        } else if (key === 'ShiftRight' && state.isRightShiftPressed) {
            element.classList.add('active-modifier');
        } else if (key === 'CapsLock' && state.isCapsLockOn) {
            element.classList.add('active-modifier');
            element.style.backgroundColor = options.modifierKeyColor || '#FFC107';
            element.classList.add('highlighted');
        } else if (key === 'CapsLock' && !state.isCapsLockOn) {
            element.style.backgroundColor = '';
            element.classList.remove('highlighted');
        }
    });
};

// =============================================================================
// EVENT HANDLING
// =============================================================================

const createEventHandlers = (state, setState, keyElements, options, physicalKeyMap) => {
    
    const handlePhysicalKeyDown = (event) => {
        const virtualKey = physicalKeyMap.get(event.code);
        if (!virtualKey) return;

        // Update modifier states first
        const newState = updateModifierStates(state, event);
        setState(newState);

        // Highlight the corresponding virtual key
        highlightKey(keyElements, options, virtualKey, true);

        // Handle key press
        if (virtualKey.length === 1 || ['Backspace', 'Enter', 'Space', 'Tab'].includes(virtualKey)) {
            event.preventDefault();
            handleKeyPress(virtualKey, event);
        } else if (virtualKey === 'CapsLock') {
            event.preventDefault();
            handleKeyPress(virtualKey, event);
        } else {
            handleKeyPress(virtualKey, event);
        }

        if (options.debug) {
            console.log('Physical key down:', event.code, '->', virtualKey);
        }
    };

    const handlePhysicalKeyUp = (event) => {
        const virtualKey = physicalKeyMap.get(event.code);
        if (!virtualKey) return;

        // Update modifier states
        const newState = updateModifierStates(state, event);
        setState(newState);

        // Remove highlight
        if (virtualKey !== 'CapsLock' || !state.isCapsLockOn) {
            highlightKey(keyElements, options, virtualKey, false);
        }

        if (options.onKeyRelease) {
            options.onKeyRelease(virtualKey, event);
        }

        if (options.debug) {
            console.log('Physical key up:', event.code, '->', virtualKey);
        }
    };

    const handleKeyPress = (key, event) => {
        if (options.onKeyPress) {
            options.onKeyPress(key, event);
        }

        let newState = { ...state };

        // Handle special keys
        switch (key) {
            case 'Backspace':
                const { newInput: backspaceInput, newCaretPosition: backspaceCaret } = 
                    deleteAtCaret(state.input, state.caretPosition);
                newState = { ...newState, input: backspaceInput, caretPosition: backspaceCaret };
                break;
            case 'Enter':
                const { newInput: enterInput, newCaretPosition: enterCaret } = 
                    updateInputAtCaret(state.input, state.caretPosition, '\n');
                newState = { ...newState, input: enterInput, caretPosition: enterCaret };
                break;
            case 'Space':
                const { newInput: spaceInput, newCaretPosition: spaceCaret } = 
                    updateInputAtCaret(state.input, state.caretPosition, ' ');
                newState = { ...newState, input: spaceInput, caretPosition: spaceCaret };
                break;
            case 'Tab':
                const { newInput: tabInput, newCaretPosition: tabCaret } = 
                    updateInputAtCaret(state.input, state.caretPosition, '\t');
                newState = { ...newState, input: tabInput, caretPosition: tabCaret };
                break;
            default:
                if (key.length === 1) {
                    const transformedChar = transformCharacter(key, state);
                    const { newInput: charInput, newCaretPosition: charCaret } = 
                        updateInputAtCaret(state.input, state.caretPosition, transformedChar);
                    newState = { ...newState, input: charInput, caretPosition: charCaret };
                }
                break;
        }

        setState(newState);
        
        if (options.onChange && newState.input !== state.input) {
            options.onChange(newState.input);
        }
    };

    return { handlePhysicalKeyDown, handlePhysicalKeyUp, handleKeyPress };
};

const updateModifierStates = (currentState, event) => {
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
    if (event.getModifierState) {
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

function createTypingTutorKeyboard(options = {}) {
    // Merge default options
    const defaultOptions = {
        normalKeyColor: '#4CAF50',
        modifierKeyColor: '#FFC107',
        activeKeyColor: '#2196F3',
        debug: false
    };
    const mergedOptions = { ...defaultOptions, ...options };

    // Get container element
    const container = typeof mergedOptions.container === 'string' 
        ? document.querySelector(mergedOptions.container)
        : mergedOptions.container;

    if (!container) {
        throw new Error('Container element not found');
    }

    // Initialize state and elements
    let state = createKeyboardState();
    const keyElements = new Map();
    const physicalKeyMap = getPhysicalKeyMap();

    // State update function
    const setState = (newState) => {
        const prevState = state;
        state = newState;
        
        // Re-render if layout should change
        if (prevState.isShiftPressed !== newState.isShiftPressed || 
            prevState.isCapsLockOn !== newState.isCapsLockOn) {
            render();
        } else {
            updateKeyStates(keyElements, state, mergedOptions);
        }

        // Notify state change
        if (mergedOptions.onStateChange) {
            mergedOptions.onStateChange({ ...state });
        }
    };

    // Create event handlers
    const { handlePhysicalKeyDown, handlePhysicalKeyUp, handleKeyPress } = 
        createEventHandlers(state, setState, keyElements, mergedOptions, physicalKeyMap);

    // Render function
    const render = () => {
        renderKeyboard(container, state, keyElements, handleKeyPress);
        updateKeyStates(keyElements, state, mergedOptions);
    };

    // Setup event listeners
    const setupEventListeners = () => {
        document.addEventListener('keydown', handlePhysicalKeyDown);
        document.addEventListener('keyup', handlePhysicalKeyUp);
    };

    // Cleanup function
    const destroy = () => {
        document.removeEventListener('keydown', handlePhysicalKeyDown);
        document.removeEventListener('keyup', handlePhysicalKeyUp);
        container.innerHTML = '';
        keyElements.clear();
    };

    // Initialize
    render();
    setupEventListeners();

    // Public API
    return {
        // Input methods
        getInput: () => state.input,
        setInput: (input) => {
            setState({ ...state, input, caretPosition: input.length });
            if (mergedOptions.onChange) {
                mergedOptions.onChange(input);
            }
        },
        clearInput: () => {
            setState({ ...state, input: '', caretPosition: 0 });
            if (mergedOptions.onChange) {
                mergedOptions.onChange('');
            }
        },
        
        // State methods
        getState: () => ({ ...state }),
        
        // Lifecycle methods
        destroy
    };
}

// Make it available globally for backward compatibility
window.TypingTutorKeyboard = createTypingTutorKeyboard;