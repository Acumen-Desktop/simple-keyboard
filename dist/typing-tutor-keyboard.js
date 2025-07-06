/**
 * Minimal Typing Tutor Keyboard
 * Focused implementation for young children's typing education
 * with automatic shift/caps lock synchronization
 */
class TypingTutorKeyboard {
    constructor(options) {
        this.keyElements = new Map();
        this.physicalKeyMap = new Map();
        // Basic QWERTY layout
        this.layout = {
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
        };
        this.options = Object.assign({ normalKeyColor: '#4CAF50', modifierKeyColor: '#FFC107', activeKeyColor: '#2196F3', debug: false }, options);
        this.state = {
            input: '',
            caretPosition: 0,
            isShiftPressed: false,
            isLeftShiftPressed: false,
            isRightShiftPressed: false,
            isCapsLockOn: false,
            isCtrlPressed: false,
            isAltPressed: false
        };
        this.container = typeof options.container === 'string'
            ? document.querySelector(options.container)
            : options.container;
        if (!this.container) {
            throw new Error('Container element not found');
        }
        this.initializePhysicalKeyMap();
        this.detectInitialCapsLockState();
        this.render();
        this.setupEventListeners();
    }
    detectInitialCapsLockState() {
        // Add a one-time listener to detect caps lock state on first interaction
        const detectCapsLock = (e) => {
            if (e.getModifierState) {
                const capsLockState = e.getModifierState('CapsLock');
                if (capsLockState !== this.state.isCapsLockOn) {
                    this.state.isCapsLockOn = capsLockState;
                    if (this.options.debug) {
                        console.log('Initial Caps Lock state detected:', this.state.isCapsLockOn);
                    }
                    this.updateKeyStates();
                    this.notifyStateChange();
                }
            }
            document.removeEventListener('keydown', detectCapsLock);
            document.removeEventListener('keyup', detectCapsLock);
        };
        // Listen for any key event to detect initial state
        document.addEventListener('keydown', detectCapsLock, { once: true });
        document.addEventListener('keyup', detectCapsLock, { once: true });
    }
    initializePhysicalKeyMap() {
        // Map physical keyboard codes to our key names
        const keyMap = {
            'Backquote': '`',
            'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4', 'Digit5': '5',
            'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9', 'Digit0': '0',
            'Minus': '-', 'Equal': '=', 'Backspace': 'Backspace',
            'Tab': 'Tab',
            'KeyQ': 'q', 'KeyW': 'w', 'KeyE': 'e', 'KeyR': 'r', 'KeyT': 't',
            'KeyY': 'y', 'KeyU': 'u', 'KeyI': 'i', 'KeyO': 'o', 'KeyP': 'p',
            'BracketLeft': '[', 'BracketRight': ']', 'Backslash': '\\',
            'CapsLock': 'CapsLock',
            'KeyA': 'a', 'KeyS': 's', 'KeyD': 'd', 'KeyF': 'f', 'KeyG': 'g',
            'KeyH': 'h', 'KeyJ': 'j', 'KeyK': 'k', 'KeyL': 'l',
            'Semicolon': ';', 'Quote': "'", 'Enter': 'Enter',
            'ShiftLeft': 'ShiftLeft', 'ShiftRight': 'ShiftRight',
            'KeyZ': 'z', 'KeyX': 'x', 'KeyC': 'c', 'KeyV': 'v', 'KeyB': 'b',
            'KeyN': 'n', 'KeyM': 'm', 'Comma': ',', 'Period': '.', 'Slash': '/',
            'Space': 'Space'
        };
        for (const [physicalKey, virtualKey] of Object.entries(keyMap)) {
            this.physicalKeyMap.set(physicalKey, virtualKey);
        }
    }
    render() {
        this.container.innerHTML = '';
        this.container.className = 'typing-tutor-keyboard';
        this.keyElements.clear();
        const currentLayout = this.getCurrentLayout();
        currentLayout.forEach((row) => {
            const rowElement = document.createElement('div');
            rowElement.className = 'keyboard-row';
            row.forEach(key => {
                const keyElement = this.createKeyElement(key);
                rowElement.appendChild(keyElement);
                // Use the exact key name for modifier keys to preserve case
                const keyMapName = (key === 'ShiftLeft' || key === 'ShiftRight' || key === 'CapsLock') ? key : key.toLowerCase();
                this.keyElements.set(keyMapName, keyElement);
            });
            this.container.appendChild(rowElement);
        });
        this.updateKeyStates();
    }
    getCurrentLayout() {
        const shouldUseShift = this.state.isShiftPressed !== this.state.isCapsLockOn;
        return shouldUseShift ? this.layout.shift : this.layout.default;
    }
    createKeyElement(key) {
        const element = document.createElement('button');
        element.className = 'keyboard-key';
        element.textContent = key;
        element.dataset.key = key.toLowerCase();
        // Add special classes for different key types
        if (this.isModifierKey(key)) {
            element.classList.add('modifier-key');
        }
        else if (key === 'Space') {
            element.classList.add('space-key');
        }
        else if (key === 'Tab') {
            element.classList.add('normal-key'); // Tab is treated as normal key for typing tutors
        }
        else if (key.length > 1) {
            element.classList.add('function-key');
        }
        else {
            element.classList.add('normal-key');
        }
        // Add click handler
        element.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleKeyPress(key, e);
        });
        return element;
    }
    isModifierKey(key) {
        return ['ShiftLeft', 'ShiftRight', 'CapsLock', 'Ctrl', 'Alt'].includes(key);
    }
    setupEventListeners() {
        // Physical keyboard listeners
        document.addEventListener('keydown', this.handlePhysicalKeyDown.bind(this));
        document.addEventListener('keyup', this.handlePhysicalKeyUp.bind(this));
    }
    handlePhysicalKeyDown(event) {
        const virtualKey = this.physicalKeyMap.get(event.code);
        if (!virtualKey)
            return;
        // Update modifier states first
        this.updateModifierStates(event);
        // Highlight the corresponding virtual key
        this.highlightKey(virtualKey, true);
        // For character keys, prevent default and handle through our system
        if (virtualKey.length === 1 || ['Backspace', 'Enter', 'Space', 'Tab'].includes(virtualKey)) {
            event.preventDefault();
            this.handleKeyPress(virtualKey, event);
        }
        else if (virtualKey === 'CapsLock') {
            // For Caps Lock, prevent default and handle the toggle
            event.preventDefault();
            this.handleKeyPress(virtualKey, event);
        }
        else {
            // For other modifier keys, just handle the key press without preventing default
            this.handleKeyPress(virtualKey, event);
        }
        if (this.options.debug) {
            console.log('Physical key down:', event.code, '->', virtualKey);
        }
    }
    handlePhysicalKeyUp(event) {
        const virtualKey = this.physicalKeyMap.get(event.code);
        if (!virtualKey)
            return;
        // Update modifier states
        this.updateModifierStates(event);
        // Remove highlight from the virtual key (except for Caps Lock which stays highlighted when on)
        if (virtualKey !== 'CapsLock' || !this.state.isCapsLockOn) {
            this.highlightKey(virtualKey, false);
        }
        if (this.options.onKeyRelease) {
            this.options.onKeyRelease(virtualKey, event);
        }
        if (this.options.debug) {
            console.log('Physical key up:', event.code, '->', virtualKey);
        }
    }
    updateModifierStates(event) {
        const prevShift = this.state.isShiftPressed;
        const prevCaps = this.state.isCapsLockOn;
        // Update general shift state
        this.state.isShiftPressed = event.shiftKey;
        // Update specific shift key states
        if (event.type === 'keydown') {
            if (event.code === 'ShiftLeft') {
                this.state.isLeftShiftPressed = true;
            }
            else if (event.code === 'ShiftRight') {
                this.state.isRightShiftPressed = true;
            }
        }
        else if (event.type === 'keyup') {
            if (event.code === 'ShiftLeft') {
                this.state.isLeftShiftPressed = false;
            }
            else if (event.code === 'ShiftRight') {
                this.state.isRightShiftPressed = false;
            }
        }
        this.state.isCtrlPressed = event.ctrlKey;
        this.state.isAltPressed = event.altKey;
        // Handle caps lock state detection
        if (event.getModifierState) {
            const capsLockState = event.getModifierState('CapsLock');
            if (capsLockState !== this.state.isCapsLockOn) {
                this.state.isCapsLockOn = capsLockState;
                if (this.options.debug) {
                    console.log('Caps Lock state changed to:', this.state.isCapsLockOn);
                }
            }
        }
        // Re-render if shift or caps lock state changed
        if (prevShift !== this.state.isShiftPressed || prevCaps !== this.state.isCapsLockOn) {
            this.render();
        }
        // Notify about state changes
        if (prevShift !== this.state.isShiftPressed ||
            prevCaps !== this.state.isCapsLockOn ||
            this.state.isLeftShiftPressed !== (event.code === 'ShiftLeft' && event.type === 'keydown') ||
            this.state.isRightShiftPressed !== (event.code === 'ShiftRight' && event.type === 'keydown')) {
            this.notifyStateChange();
        }
    }
    highlightKey(key, highlight) {
        // Use the exact key name for modifier keys to preserve case
        const keyMapName = (key === 'ShiftLeft' || key === 'ShiftRight' || key === 'CapsLock') ? key : key.toLowerCase();
        const element = this.keyElements.get(keyMapName);
        if (!element)
            return;
        if (highlight) {
            const color = this.isModifierKey(key)
                ? this.options.modifierKeyColor
                : this.options.normalKeyColor;
            element.style.backgroundColor = color || '#4CAF50';
            element.classList.add('highlighted');
        }
        else {
            element.style.backgroundColor = '';
            element.classList.remove('highlighted');
        }
    }
    handleKeyPress(key, event) {
        if (this.options.onKeyPress) {
            this.options.onKeyPress(key, event);
        }
        // Handle special keys
        switch (key) {
            case 'Backspace':
                this.handleBackspace();
                break;
            case 'Enter':
                this.handleEnter();
                break;
            case 'Space':
                this.handleSpace();
                break;
            case 'Tab':
                this.handleTab();
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
            case 'CapsLock':
                // These are handled in updateModifierStates
                break;
            default:
                if (key.length === 1) {
                    this.handleCharacterInput(key);
                }
                break;
        }
        this.updateKeyStates();
    }
    handleBackspace() {
        if (this.state.input.length > 0 && this.state.caretPosition > 0) {
            const before = this.state.input.substring(0, this.state.caretPosition - 1);
            const after = this.state.input.substring(this.state.caretPosition);
            this.state.input = before + after;
            this.state.caretPosition--;
            this.notifyChange();
        }
    }
    handleEnter() {
        this.state.input += '\n';
        this.state.caretPosition++;
        this.notifyChange();
    }
    handleSpace() {
        this.state.input += ' ';
        this.state.caretPosition++;
        this.notifyChange();
    }
    handleTab() {
        this.state.input += '\t';
        this.state.caretPosition++;
        this.notifyChange();
    }
    handleCharacterInput(char) {
        // Transform character based on current shift/caps state
        const transformedChar = this.transformCharacter(char);
        const before = this.state.input.substring(0, this.state.caretPosition);
        const after = this.state.input.substring(this.state.caretPosition);
        this.state.input = before + transformedChar + after;
        this.state.caretPosition++;
        this.notifyChange();
    }
    transformCharacter(char) {
        const shouldUseShift = this.state.isShiftPressed !== this.state.isCapsLockOn;
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
    }
    updateKeyStates() {
        // Update visual state of modifier keys
        this.keyElements.forEach((element, key) => {
            element.classList.remove('active-modifier');
            if (key === 'ShiftLeft' && this.state.isLeftShiftPressed) {
                element.classList.add('active-modifier');
            }
            else if (key === 'ShiftRight' && this.state.isRightShiftPressed) {
                element.classList.add('active-modifier');
            }
            else if (key === 'CapsLock' && this.state.isCapsLockOn) {
                element.classList.add('active-modifier');
                // Also ensure it's highlighted when caps lock is on
                element.style.backgroundColor = this.options.modifierKeyColor || '#FFC107';
                element.classList.add('highlighted');
            }
            else if (key === 'CapsLock' && !this.state.isCapsLockOn) {
                // Ensure caps lock is not highlighted when off
                element.style.backgroundColor = '';
                element.classList.remove('highlighted');
            }
        });
    }
    notifyChange() {
        if (this.options.onChange) {
            this.options.onChange(this.state.input);
        }
    }
    notifyStateChange() {
        if (this.options.onStateChange) {
            this.options.onStateChange(Object.assign({}, this.state));
        }
    }
    // Public API methods
    getInput() {
        return this.state.input;
    }
    setInput(input) {
        this.state.input = input;
        this.state.caretPosition = input.length;
        this.notifyChange();
    }
    clearInput() {
        this.state.input = '';
        this.state.caretPosition = 0;
        this.notifyChange();
    }
    getState() {
        return Object.assign({}, this.state);
    }
    destroy() {
        document.removeEventListener('keydown', this.handlePhysicalKeyDown.bind(this));
        document.removeEventListener('keyup', this.handlePhysicalKeyUp.bind(this));
        this.container.innerHTML = '';
        this.keyElements.clear();
    }
}
export default TypingTutorKeyboard;
