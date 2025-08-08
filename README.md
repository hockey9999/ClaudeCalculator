# Claude Calculator 🧮

A modern, interactive calculator with themes, sounds, and animations built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

- **Basic Operations**: Addition, subtraction, multiplication, division
- **Advanced Functions**: Percentage (%), square root (√), square (x²), reciprocal (1/x), sign toggle (+/-)
- **Three Themes**: Dark (default), Light, and Neon modes with smooth transitions
- **Sound Effects**: Different tones for numbers, operators, and special functions
- **Visual Animations**: Button press effects, particle explosions, error shaking
- **Mobile Optimized**: Responsive design with touch-friendly controls
- **Keyboard Support**: Full keyboard input with shortcuts

## 🎨 Themes

- **Dark Mode**: Original purple gradient with orange accents
- **Light Mode**: Clean blue and white professional theme  
- **Neon Mode**: Cyberpunk-style with cyan and magenta colors

## 🎵 Sound Effects

- Numbers play ascending musical tones
- Operators have distinct sound signatures
- Equals button triggers celebration sound with particle explosion
- Error calculations produce warning tones
- Sound can be toggled on/off with the speaker button

## ⌨️ Keyboard Shortcuts

- `0-9`, `.`: Number input
- `+`, `-`, `*`, `/`: Basic operations
- `Enter` or `=`: Calculate result
- `Escape` or `C`: Clear display
- `Backspace`: Delete last character
- `%`: Percentage
- `S`: Square root
- `Q`: Square (x²)
- `R`: Reciprocal (1/x)
- `N`: Toggle sign (+/-)

## 🚀 Live Demo

Visit: [https://hockey9999.github.io/ClaudeCalculator](https://hockey9999.github.io/ClaudeCalculator)

## 📁 Project Structure

```
ClaudeCalculator/
├── index.html              # Main HTML file
├── src/
│   ├── css/
│   │   └── calculator.css   # Styles and animations
│   └── js/
│       └── calculator.js    # Calculator logic and interactions
├── docs/                   # Documentation
├── assets/                 # Images and other assets
└── README.md              # This file
```

## 🛠️ Development

1. Clone or download the repository
2. Open `index.html` in a web browser
3. For development, use a local web server:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```

## 📱 Mobile Features

- Prevents accidental zoom on button taps
- Touch-optimized button sizes (minimum 44px for accessibility)
- Responsive layout for different screen sizes
- Optimized animations for smooth mobile performance
- Landscape mode support

## 🎯 Browser Support

- Modern browsers with ES6+ support
- Web Audio API for sound effects
- CSS Grid and Flexbox
- Touch events and responsive design

## 🤖 Generated with Claude Code

This calculator was built as a fun project using [Claude Code](https://claude.ai/code), demonstrating modern web development techniques with vanilla JavaScript.

---

*Feel free to customize, extend, or use this calculator in your own projects!*