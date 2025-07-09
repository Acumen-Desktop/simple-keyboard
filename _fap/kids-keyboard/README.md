# Kids Keyboard 🎯

A lightweight, accessible virtual keyboard designed specifically for children's typing education.

[![npm version](https://badge.fury.io/js/kids-keyboard.svg)](https://badge.fury.io/js/kids-keyboard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 **Education-Focused**: Designed specifically for children learning to type
- 🖱️ **Mouse-Based Tutor Mode**: Intuitive hover activation for guided learning
- ♿ **Accessibility First**: Full ARIA support and keyboard navigation
- 📱 **Responsive Design**: Works on desktop, laptop, and tablet devices
- ⚡ **High Performance**: Optimized rendering with minimal memory usage
- 🎨 **Visual Feedback**: Clear indicators for physical keyboard synchronization
- 🔧 **Easy Integration**: Simple API with comprehensive TypeScript support

## Quick Start

### Installation

```bash
npm install kids-keyboard
```

### Basic Usage

```javascript
import createKidsKeyboard from 'kids-keyboard';
import 'kids-keyboard/dist/kids-keyboard.css';

const keyboard = createKidsKeyboard({
  container: '#keyboard-container',
  targetInput: '#text-input',
  onChange: (input) => {
    console.log('Input changed:', input);
  }
});
```

### HTML Structure

```html
<div id="tutor-section">
  <textarea id="text-input" placeholder="Start typing..."></textarea>
  <div id="keyboard-container"></div>
</div>
```

## API Reference

### Constructor Options

```typescript
interface KidsKeyboardOptions {
  container: string | HTMLElement;          // Required: Where to render the keyboard
  targetInput?: string | HTMLElement;       // Optional: Input element for tutor mode
  tutorContainer?: string | HTMLElement;    // Optional: Container for mouse activation
  debug?: boolean;                          // Optional: Enable debug logging
  onChange?: (input: string) => void;       // Optional: Input change callback
  onKeyPress?: (key: string, event: Event) => void;  // Optional: Key press callback
  onStateChange?: (state: KidsKeyboardState) => void; // Optional: State change callback
  onTutorModeChange?: (isActive: boolean) => void;    // Optional: Tutor mode callback
}
```

### Methods

```typescript
// Input Management
keyboard.getInput(): string
keyboard.setInput(input: string): void
keyboard.clearInput(): void

// Caret Management
keyboard.getCaretPosition(): number
keyboard.setCaretPosition(position: number): void

// State Management
keyboard.getState(): KidsKeyboardState
keyboard.isTutorModeActive(): boolean
keyboard.getTargetInput(): HTMLElement | null

// Lifecycle
keyboard.destroy(): void
```

## Tutor Mode

Kids Keyboard features a unique **mouse-based tutor mode** that activates when users hover over the designated tutor area. This creates a clear distinction between normal typing and guided learning.

### How It Works

1. **Normal Mode**: Users can type normally in any input field
2. **Tutor Mode**: When hovering over the tutor container, the virtual keyboard captures all physical keyboard input
3. **Visual Feedback**: Clear indicators show when tutor mode is active

### Configuration

```javascript
const keyboard = createKidsKeyboard({
  container: '#keyboard-container',
  targetInput: '#lesson-input',        // Input that receives tutor mode typing
  tutorContainer: '#lesson-section',   // Container that triggers tutor mode
  onTutorModeChange: (isActive) => {
    console.log('Tutor mode:', isActive ? 'ON' : 'OFF');
  }
});
```

## Styling

### CSS Classes

The keyboard uses semantic CSS classes for easy customization:

```css
.kids-keyboard              /* Main keyboard container */
.keyboard-row               /* Individual keyboard rows */
.keyboard-key               /* Individual keys */
.keyboard-key.normal-key    /* Letter and number keys */
.keyboard-key.function-key  /* Function keys (Enter, Backspace, etc.) */
.keyboard-key.modifier-key  /* Modifier keys (Shift, Caps Lock) */
.keyboard-key.space-key     /* Space bar */
.keyboard-key.highlighted   /* Keys highlighted by physical keyboard */
```

### Tutor Mode Styling

```css
.kids-keyboard-tutor                    /* Tutor container */
.kids-keyboard-tutor.tutor-mode-active  /* Active tutor mode */
```

### Responsive Design

The keyboard automatically adapts to different screen sizes:

- **Desktop (>1024px)**: Full-size keyboard
- **Tablet (768-1024px)**: Compact layout
- **Small Tablet (≤768px)**: Minimized spacing

## Examples

### Basic Typing Interface

```javascript
const keyboard = createKidsKeyboard({
  container: '#keyboard',
  onChange: (input) => {
    document.getElementById('output').value = input;
  }
});
```

### Educational Application

```javascript
const keyboard = createKidsKeyboard({
  container: '#keyboard',
  targetInput: '#lesson-input',
  tutorContainer: '#lesson-area',
  
  onChange: (input) => {
    updateProgress(input);
  },
  
  onKeyPress: (key) => {
    trackKeystroke(key);
  },
  
  onTutorModeChange: (isActive) => {
    toggleTutorUI(isActive);
  }
});

function updateProgress(input) {
  const accuracy = calculateAccuracy(input, targetText);
  const wpm = calculateWPM(input, startTime);
  
  updateUI({ accuracy, wpm });
}
```

### Multi-Input Support

```javascript
// Create keyboard that works with multiple inputs
const keyboard = createKidsKeyboard({
  container: '#keyboard',
  
  onChange: (input) => {
    // Update whichever input is currently focused
    if (document.activeElement.matches('input, textarea')) {
      document.activeElement.value = input;
    }
  }
});
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## TypeScript Support

Kids Keyboard includes comprehensive TypeScript definitions:

```typescript
import createKidsKeyboard, { KidsKeyboardOptions, KidsKeyboardState } from 'kids-keyboard';

const options: KidsKeyboardOptions = {
  container: '#keyboard',
  debug: true,
  onChange: (input: string) => {
    console.log('Input:', input);
  }
};

const keyboard = createKidsKeyboard(options);
const state: KidsKeyboardState = keyboard.getState();
```

## Performance

Kids Keyboard is optimized for educational environments:

- **Differential Rendering**: Only updates changed elements
- **CSS-Based Layout Switching**: Avoids expensive DOM operations
- **Memory Management**: Proper cleanup prevents memory leaks
- **Event Delegation**: Efficient event handling for all keys

## Accessibility

- **ARIA Support**: Full screen reader compatibility
- **Keyboard Navigation**: Tab through virtual keys
- **High Contrast**: Supports system high contrast mode
- **Reduced Motion**: Respects `prefers-reduced-motion`

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

This library was inspired by [simple-keyboard](https://github.com/hodgef/simple-keyboard) by Francisco Hodge. Kids Keyboard is a lightweight, education-focused derivative optimized specifically for children's typing learning applications.

### Key Differences from simple-keyboard:

- **Simplified API** focused on educational use cases
- **Mouse-based tutor mode** activation
- **Enhanced accessibility** for young learners
- **Optimized performance** and memory usage
- **Built-in physical keyboard** integration

## Changelog

### 0.9.0 (Current)
- Initial release
- Mouse-based tutor mode
- Comprehensive TypeScript support
- Responsive design
- Accessibility features
- Performance optimizations

## Support

- 📖 [Documentation](https://github.com/your-org/kids-keyboard/wiki)
- 🐛 [Bug Reports](https://github.com/your-org/kids-keyboard/issues)
- 💬 [Discussions](https://github.com/your-org/kids-keyboard/discussions)

---

Made with ❤️ for young learners everywhere.