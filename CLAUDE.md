# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

The project uses webpack for building and provides several build variants:

- `npm run build` - Builds all versions: ES5 UMD, modern, modern ESM, and TypeScript declarations
- `npm run build-modern` - Builds modern ES2015+ version for newer browsers
- `npm run build-modern-esm` - Builds modern ESM version for module bundlers
- `npm start` - Starts development server with demo on localhost:3000
- `npm run test` - Runs Jest tests with silent output
- `npm run coverage` - Runs tests with coverage report
- `npm run prepare` - Runs full build (executed on install)

## Development Commands

- `npm install` - Install dependencies
- `npm start` - Start development server with hot reload on port 3000
- `npm test` - Run test suite
- `npm run coverage` - Run tests with coverage

## Project Architecture

Simple Keyboard is a vanilla JavaScript virtual keyboard library with the following architecture:

### Core Components

- **SimpleKeyboard** (`src/lib/components/Keyboard.ts`) - Main keyboard class containing all functionality
- **CandidateBox** (`src/lib/components/CandidateBox.ts`) - Handles input method editor candidate suggestions
- **KeyboardLayout** (`src/lib/services/KeyboardLayout.ts`) - Provides default QWERTY layout configuration
- **PhysicalKeyboard** (`src/lib/services/PhysicalKeyboard.ts`) - Handles physical keyboard interaction and highlighting
- **Utilities** (`src/lib/services/Utilities.ts`) - Common utility functions and input handling

### Key Architecture Patterns

- **Multiple Instance Support**: The library manages multiple keyboard instances through a global `SimpleKeyboardInstances` object on the window
- **Layout System**: Keyboards use string-based layout definitions where each row is a space-separated string of buttons
- **Input Management**: Uses internal input state tracking independent of DOM elements for maximum flexibility
- **Event System**: Comprehensive event handling for mouse, touch, and pointer events with fallback support
- **Modular Design**: Core functionality is extensible through a module system

### Build System

- **Multiple Builds**: Creates ES5 UMD, modern browser, and ESM versions
- **TypeScript**: Primary source in TypeScript with declaration file generation
- **Webpack**: Main build tool with multiple configurations
- **CSS Processing**: Extracts and processes CSS with PostCSS and autoprefixer
- **Demo Integration**: Includes development server for testing

### Key Features

- **Layout Candidates**: Input method editor with candidate suggestions
- **Physical Keyboard Integration**: Highlights virtual keys when physical keys are pressed
- **Responsive Design**: Touch and mouse event handling with automatic device detection
- **Button Theming**: Flexible CSS class and attribute system for button customization
- **Multi-Input Support**: Single keyboard instance can handle multiple input fields

### File Structure

- `src/lib/` - Core library source code
- `src/demo/` - Demo implementations and test cases
- `build/` - Generated build outputs
- `webpack.config.js` - Main webpack configuration
- `webpack.config.demo.js` - Demo-specific webpack configuration
- `tsconfig.json` - TypeScript configuration for declaration files

### Testing

The project uses Jest for testing with jsdom environment for DOM testing. Test files are located alongside source files with `.test.js` extension.

### Entry Points

- `src/lib/index.ts` - Main library entry point
- `src/lib/index.modern.ts` - Modern browser build entry point
- Both export the SimpleKeyboard class and interfaces