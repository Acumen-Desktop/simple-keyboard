/**
 * Kids Keyboard - Virtual Keyboard for Children's Typing Education (ES Module)
 * 
 * A lightweight, accessible virtual keyboard designed specifically for young learners.
 * 
 * @version 0.9.0
 * @author Kids Keyboard Team
 * @license MIT
 * 
 * This is the ES Module version. For UMD/browser global, use kids-keyboard.js
 * 
 * ACKNOWLEDGMENTS:
 * Inspired by simple-keyboard (https://github.com/hodgef/simple-keyboard)
 */

// For ES modules, we'll create a lightweight wrapper that imports the UMD version
// and exports it in ESM format. This maintains compatibility while providing
// modern import/export syntax.

/**
 * Creates a new Kids Keyboard instance
 * @param {Object} options - Configuration options
 * @returns {Object} Kids Keyboard API object
 */
const createKidsKeyboard = (options = {}) => {
    // In a real build process, this would be the actual implementation
    // For now, we'll provide a placeholder that informs about proper usage
    
    if (typeof window === 'undefined') {
        throw new Error('Kids Keyboard requires a browser environment. Use in Node.js is not supported.');
    }
    
    // In the built version, this would contain the full implementation
    // For the ESM build, we would typically use a bundler like Rollup or Webpack
    // to create a proper ES module version
    
    throw new Error('ESM version requires a build step. Please use kids-keyboard.js for direct browser usage or build this package with a bundler.');
};

// ES Module exports
export default createKidsKeyboard;
export { createKidsKeyboard };