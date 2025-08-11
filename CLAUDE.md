# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
# Start local development server
python -m http.server 8000
# or
npx serve .
```
Then open `http://localhost:8000` in a web browser.

### Testing
Open `index.html` directly in a web browser or use the local server method above. No build process or package manager is required.

## Code Architecture

### Project Structure
- **index.html**: Single-page application entry point with inline event handlers
- **src/js/calculator.js**: Core application logic and state management
- **src/css/calculator.css**: Complete styling with CSS custom properties for theming

### Key Architectural Patterns

#### Theme System
- Uses CSS custom properties (CSS variables) defined in `:root` and `[data-theme]` selectors
- Three themes: `dark` (default), `light`, `neon`
- Theme state managed in `calculator.js` with localStorage persistence
- Theme switching via `applyTheme()` function that sets `data-theme` attribute

#### Sound System
- Web Audio API implementation with `AudioContext`
- Different sound frequencies/patterns for button types: `number`, `operator`, `equals`, `clear`, `advanced`
- Sound state managed with localStorage persistence
- Mobile audio context requires user interaction to start

#### State Management
- Global variables in `calculator.js`: `currentInput`, `shouldResetDisplay`, `currentThemeIndex`, `soundEnabled`
- Display state managed through DOM manipulation of `#display` input element
- No framework dependencies - vanilla JavaScript with direct DOM manipulation

#### Event Handling
- Inline event handlers in HTML (`onclick` attributes)
- Additional event listeners for keyboard input and mobile touch optimization
- Keyboard shortcuts mapped in `keydown` event listener

#### Mobile Optimizations
- Touch-specific CSS media queries: `@media (hover: none)` and `@media (hover: hover)`
- Performance optimizations: reduced particle count on mobile, shorter animation durations
- Touch event handling with passive listeners
- CSS touch-action and user-select properties for better mobile UX

#### Animation System
- CSS-based button animations with transform effects
- Particle explosion system using DOM manipulation and Web Animations API
- Error state animations (shake effect) and success celebrations
- Performance-conscious: animations are simplified on mobile devices

### Critical Implementation Details

#### Calculator Logic
- Uses `eval()` for expression evaluation (input is sanitized by replacing × with *)
- Error handling with try/catch blocks that display "Error" and play warning sounds
- Mathematical functions (sqrt, square, reciprocal) implemented as separate functions
- State reset logic controlled by `shouldResetDisplay` flag

#### CSS Variable System
All colors and visual properties are defined as CSS custom properties, making theme switching efficient and maintainable.

#### Mobile-First Considerations
- All touch events use `{ passive: true }` for better scroll performance
- Minimum touch target sizes (44px) for accessibility
- Responsive breakpoints at 480px, 360px, and landscape orientation
- Context menu prevention and zoom disabled on mobile