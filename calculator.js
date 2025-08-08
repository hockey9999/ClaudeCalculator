let display = document.getElementById('display');
let currentInput = '';
let shouldResetDisplay = false;

const themes = ['dark', 'light', 'neon'];
let currentThemeIndex = 0;

function initializeTheme() {
    const savedTheme = localStorage.getItem('calculatorTheme');
    if (savedTheme && themes.includes(savedTheme)) {
        currentThemeIndex = themes.indexOf(savedTheme);
    }
    applyTheme(themes[currentThemeIndex]);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('calculatorTheme', theme);
}

function cycleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(themes[currentThemeIndex]);
}

document.addEventListener('DOMContentLoaded', initializeTheme);

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    currentInput += value;
    display.value = currentInput;
}

function clearDisplay() {
    currentInput = '';
    display.value = '';
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
}

function percentage() {
    try {
        if (currentInput === '') return;
        
        let result = parseFloat(currentInput) / 100;
        display.value = result;
        currentInput = result.toString();
        shouldResetDisplay = true;
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
    }
}

function toggleSign() {
    if (currentInput === '' || currentInput === '0') return;
    
    if (currentInput.startsWith('-')) {
        currentInput = currentInput.substring(1);
    } else {
        currentInput = '-' + currentInput;
    }
    display.value = currentInput;
}

function squareRoot() {
    try {
        if (currentInput === '') return;
        
        let value = parseFloat(currentInput);
        if (value < 0) {
            throw new Error('Cannot take square root of negative number');
        }
        
        let result = Math.sqrt(value);
        display.value = result;
        currentInput = result.toString();
        shouldResetDisplay = true;
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
    }
}

function square() {
    try {
        if (currentInput === '') return;
        
        let value = parseFloat(currentInput);
        let result = value * value;
        
        display.value = result;
        currentInput = result.toString();
        shouldResetDisplay = true;
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
    }
}

function reciprocal() {
    try {
        if (currentInput === '' || currentInput === '0') {
            throw new Error('Cannot divide by zero');
        }
        
        let value = parseFloat(currentInput);
        let result = 1 / value;
        
        display.value = result;
        currentInput = result.toString();
        shouldResetDisplay = true;
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
    }
}

function calculate() {
    try {
        if (currentInput === '') return;
        
        let expression = currentInput.replace(/×/g, '*');
        let result = eval(expression);
        
        if (!isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        
        display.value = result;
        currentInput = result.toString();
        shouldResetDisplay = true;
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-') {
        appendToDisplay(key);
    } else if (key === '*') {
        appendToDisplay('*');
    } else if (key === '/') {
        event.preventDefault();
        appendToDisplay('/');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === '%') {
        event.preventDefault();
        percentage();
    } else if (key === 's' || key === 'S') {
        squareRoot();
    } else if (key === 'q' || key === 'Q') {
        square();
    } else if (key === 'r' || key === 'R') {
        reciprocal();
    } else if (key === 'n' || key === 'N') {
        toggleSign();
    }
});