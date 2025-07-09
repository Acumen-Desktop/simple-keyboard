/**
 * Kids Keyboard - TypeScript Definitions
 * 
 * Type definitions for the Kids Keyboard virtual keyboard library.
 * 
 * @version 0.9.0
 * @author Kids Keyboard Team
 * @license MIT
 * 
 * ACKNOWLEDGMENTS:
 * Inspired by simple-keyboard (https://github.com/hodgef/simple-keyboard)
 */

declare module 'kids-keyboard' {
  /**
   * Represents the current state of the keyboard
   */
  interface KidsKeyboardState {
    /** Current input text */
    input: string;
    
    /** Current caret position in the input */
    caretPosition: number;
    
    /** Whether any shift key is currently pressed */
    isShiftPressed: boolean;
    
    /** Whether the left shift key is currently pressed */
    isLeftShiftPressed: boolean;
    
    /** Whether the right shift key is currently pressed */
    isRightShiftPressed: boolean;
    
    /** Whether caps lock is currently on */
    isCapsLockOn: boolean;
  }

  /**
   * Configuration options for creating a Kids Keyboard instance
   */
  interface KidsKeyboardOptions {
    /** 
     * Container element or CSS selector where the keyboard will be rendered
     * @example '#keyboard-container' or document.getElementById('keyboard')
     */
    container: string | HTMLElement;
    
    /** 
     * Target input element or CSS selector for tutor mode
     * @example '#text-input' or document.getElementById('input')
     */
    targetInput?: string | HTMLElement;
    
    /** 
     * Tutor container element or CSS selector for mouse-based activation
     * @example '#tutor-section' or document.getElementById('tutor')
     */
    tutorContainer?: string | HTMLElement;
    
    /** Enable debug logging */
    debug?: boolean;
    
    /** 
     * Callback fired when the input text changes
     * @param input - The new input text
     */
    onChange?: (input: string) => void;
    
    /** 
     * Callback fired when a key is pressed
     * @param key - The key that was pressed
     * @param event - The original event object
     */
    onKeyPress?: (key: string, event: Event) => void;
    
    /** 
     * Callback fired when a key is released (physical keyboard only)
     * @param key - The key that was released
     * @param event - The original event object
     */
    onKeyRelease?: (key: string, event: Event) => void;
    
    /** 
     * Callback fired when the keyboard state changes
     * @param state - The new keyboard state
     */
    onStateChange?: (state: KidsKeyboardState) => void;
    
    /** 
     * Callback fired when tutor mode is activated or deactivated
     * @param isActive - Whether tutor mode is now active
     */
    onTutorModeChange?: (isActive: boolean) => void;
    
    /** 
     * Callback fired when an error occurs
     * @param error - The error that occurred
     */
    onError?: (error: Error) => void;
  }

  /**
   * The Kids Keyboard instance interface
   */
  interface KidsKeyboard {
    /**
     * Get the current input text
     * @returns The current input text
     */
    getInput(): string;
    
    /**
     * Set the input text
     * @param input - The new input text
     * @throws {Error} If input is not a string
     */
    setInput(input: string): void;
    
    /**
     * Clear the input text
     */
    clearInput(): void;
    
    /**
     * Get the current caret position
     * @returns The current caret position
     */
    getCaretPosition(): number;
    
    /**
     * Set the caret position
     * @param position - The new caret position
     */
    setCaretPosition(position: number): void;
    
    /**
     * Get the current keyboard state
     * @returns A copy of the current keyboard state
     */
    getState(): KidsKeyboardState;
    
    /**
     * Check if tutor mode is currently active
     * @returns True if tutor mode is active, false otherwise
     */
    isTutorModeActive(): boolean;
    
    /**
     * Get the target input element
     * @returns The target input element or null if not set
     */
    getTargetInput(): HTMLElement | null;
    
    /**
     * Destroy the keyboard instance and clean up resources
     */
    destroy(): void;
  }

  /**
   * Creates a new Kids Keyboard instance
   * @param options - Configuration options
   * @returns A new Kids Keyboard instance
   * @throws {Error} If container is not found or invalid
   * 
   * @example
   * ```typescript
   * import createKidsKeyboard from 'kids-keyboard';
   * 
   * const keyboard = createKidsKeyboard({
   *   container: '#keyboard-container',
   *   targetInput: '#text-input',
   *   debug: true,
   *   onChange: (input) => {
   *     console.log('Input changed:', input);
   *   },
   *   onKeyPress: (key, event) => {
   *     console.log('Key pressed:', key);
   *   },
   *   onStateChange: (state) => {
   *     console.log('State changed:', state);
   *   },
   *   onTutorModeChange: (isActive) => {
   *     console.log('Tutor mode:', isActive ? 'ON' : 'OFF');
   *   }
   * });
   * 
   * // Use the keyboard
   * keyboard.setInput('Hello World');
   * console.log(keyboard.getInput()); // 'Hello World'
   * console.log(keyboard.getCaretPosition()); // 11
   * 
   * // Clean up when done
   * keyboard.destroy();
   * ```
   */
  function createKidsKeyboard(options: KidsKeyboardOptions): KidsKeyboard;

  export default createKidsKeyboard;
  export { createKidsKeyboard, KidsKeyboardOptions, KidsKeyboardState, KidsKeyboard };
}

/**
 * Global type declarations for when used via script tag
 */
declare global {
  interface Window {
    createKidsKeyboard?: typeof createKidsKeyboard;
  }
}

/**
 * Re-export the main function for CommonJS compatibility
 */
declare function createKidsKeyboard(options: KidsKeyboardOptions): KidsKeyboard;
export = createKidsKeyboard;