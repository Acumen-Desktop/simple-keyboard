# Typing Tutor Keyboard

A minimal, focused virtual keyboard implementation for young children's typing education with automatic shift/caps lock synchronization.

## Features

- ✅ **Automatic modifier sync** - Physical keyboard modifiers automatically update virtual keyboard
- ✅ **Color-coded feedback** - Green for normal keys, yellow for modifiers, blue for function keys
- ✅ **Separate shift tracking** - Left and right shift keys tracked independently
- ✅ **Educational focus** - Designed specifically for typing tutors
- ✅ **Minimal size** - ~7.5KB total (much smaller than alternatives)
- ✅ **Simple integration** - Just include JS and CSS files

## Files

- `typing-tutor-keyboard.js` - Main package (generic, reusable)
- `typing-tutor-keyboard.css` - Package styles
- `demo.js` - Demo application code
- `demo.html` - Demo page

## Usage

```html
<!-- Include the CSS and JS -->
<link rel="stylesheet" href="typing-tutor-keyboard.css">
<script src="typing-tutor-keyboard.js"></script>

<!-- Create a container -->
<div id="keyboard-container"></div>

<script>
// Initialize the keyboard
const keyboard = new TypingTutorKeyboard({
    container: '#keyboard-container',
    onChange: (input) => {
        console.log('Input:', input);
    },
    onKeyPress: (key, event) => {
        console.log('Key pressed:', key);
    },
    onStateChange: (state) => {
        console.log('Shift:', state.isShiftPressed);
        console.log('Caps Lock:', state.isCapsLockOn);
    }
});
</script>
```

## Options

```javascript
{
    container: '#keyboard-container',    // Required: CSS selector or DOM element
    onChange: (input) => {},            // Called when input changes
    onKeyPress: (key, event) => {},     // Called when key is pressed
    onKeyRelease: (key, event) => {},   // Called when key is released
    onStateChange: (state) => {},       // Called when modifier states change
    normalKeyColor: '#4CAF50',          // Green for normal keys
    modifierKeyColor: '#FFC107',        // Yellow for modifier keys
    activeKeyColor: '#2196F3',          // Blue for active keys
    debug: false                        // Enable debug logging
}
```

## API Methods

- `getInput()` - Get current input text
- `setInput(text)` - Set input text
- `clearInput()` - Clear input text
- `getState()` - Get current keyboard state
- `destroy()` - Clean up event listeners

## Key Color Coding

- 🟢 **Green** - Normal character keys (a-z, 0-9, symbols, Tab)
- 🟡 **Yellow** - Modifier keys (Shift, Caps Lock, Ctrl, Alt)
- 🔵 **Blue** - Function keys (Backspace, Enter, Space)

## Browser Support

Works in all modern browsers that support:
- ES6 classes
- Map/Set
- KeyboardEvent.getModifierState()

## License

Custom implementation for typing tutor applications.
