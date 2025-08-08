let display = document.getElementById('display');
let currentInput = '';
let shouldResetDisplay = false;

const themes = ['dark', 'light', 'neon'];
let currentThemeIndex = 0;
let soundEnabled = true;

// Web Audio API for sound generation
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency = 440, duration = 100, type = 'number') {
    if (!soundEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different sounds for different button types
    switch(type) {
        case 'number':
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            break;
        case 'operator':
            oscillator.frequency.setValueAtTime(frequency * 1.2, audioContext.currentTime);
            break;
        case 'equals':
            oscillator.frequency.setValueAtTime(frequency * 2, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(frequency, audioContext.currentTime + duration/1000);
            break;
        case 'clear':
            oscillator.frequency.setValueAtTime(frequency * 0.5, audioContext.currentTime);
            break;
        case 'advanced':
            oscillator.frequency.setValueAtTime(frequency * 1.5, audioContext.currentTime);
            break;
    }
    
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration/1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration/1000);
}

function addButtonAnimation(button) {
    // Use CSS animation instead of setTimeout to avoid blocking
    button.style.transform = 'scale(0.95)';
    // Let CSS transition handle the return to normal scale
    requestAnimationFrame(() => {
        button.style.transform = '';
    });
}

function createParticles() {
    // Reduce particle count on mobile for better performance
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 5 : 10;
    const calculator = document.querySelector('.calculator');
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.backgroundColor = 'var(--operator-bg)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        const rect = calculator.getBoundingClientRect();
        particle.style.left = (rect.left + rect.width / 2) + 'px';
        particle.style.top = (rect.top + rect.height / 2) + 'px';
        
        document.body.appendChild(particle);
        particles.push(particle);
        
        // Animate particle with shorter duration on mobile
        const angle = (i / particleCount) * Math.PI * 2;
        const velocity = isMobile ? 30 + Math.random() * 30 : 50 + Math.random() * 50;
        const lifetime = isMobile ? 400 + Math.random() * 200 : 800 + Math.random() * 400;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { 
                transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: lifetime,
            easing: 'ease-out'
        }).onfinish = () => {
            if (document.body.contains(particle)) {
                document.body.removeChild(particle);
            }
        };
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundBtn = document.getElementById('sound-toggle');
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    localStorage.setItem('calculatorSoundEnabled', soundEnabled.toString());
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('calculatorTheme');
    if (savedTheme && themes.includes(savedTheme)) {
        currentThemeIndex = themes.indexOf(savedTheme);
    }
    applyTheme(themes[currentThemeIndex]);
    
    // Initialize sound preference
    const savedSound = localStorage.getItem('calculatorSoundEnabled');
    if (savedSound !== null) {
        soundEnabled = savedSound === 'true';
    }
    
    // Update sound button when page loads
    setTimeout(() => {
        const soundBtn = document.getElementById('sound-toggle');
        if (soundBtn) {
            soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
        }
    }, 100);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('calculatorTheme', theme);
}

function cycleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(themes[currentThemeIndex]);
    playSound(800, 150, 'operator');
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    
    // Handle audio context on mobile (requires user interaction)
    document.addEventListener('touchstart', function() {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }, { once: true });
    
    // Add click animations to all buttons - simplified approach
    document.querySelectorAll('.btn').forEach(button => {
        // Use a single click event that works for both mouse and touch
        button.addEventListener('click', function(e) {
            // Ensure the event isn't prevented
            e.stopPropagation();
            addButtonAnimation(this);
        });
        
        // Only add visual feedback, don't interfere with click events
        button.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        button.addEventListener('touchend', function(e) {
            // Remove transform immediately, don't wait
            this.style.transform = '';
        }, { passive: true });
        
        button.addEventListener('touchcancel', function(e) {
            // Reset transform if touch is cancelled
            this.style.transform = '';
        }, { passive: true });
    });
    
    // Add click animation to control buttons
    document.querySelectorAll('#theme-toggle, #sound-toggle').forEach(button => {
        button.addEventListener('click', function() {
            addButtonAnimation(this);
        });
    });
    
    // Prevent context menu on long press
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
});

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    currentInput += value;
    display.value = currentInput;
    
    // Play different sounds for numbers vs operators
    if (/[0-9.]/.test(value)) {
        playSound(440 + (parseInt(value) || 0) * 50, 100, 'number');
    } else {
        playSound(600, 120, 'operator');
    }
}

function clearDisplay() {
    currentInput = '';
    display.value = '';
    playSound(300, 150, 'clear');
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
    playSound(350, 80, 'clear');
}

function percentage() {
    try {
        if (currentInput === '') return;
        
        let result = parseFloat(currentInput) / 100;
        display.value = result;
        currentInput = result.toString();
        shouldResetDisplay = true;
        playSound(700, 120, 'advanced');
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
        playSound(200, 300, 'clear');
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
    playSound(500, 100, 'advanced');
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
        playSound(800, 150, 'advanced');
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
        playSound(200, 300, 'clear');
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
        playSound(750, 120, 'advanced');
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
        playSound(200, 300, 'clear');
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
        playSound(650, 130, 'advanced');
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
        playSound(200, 300, 'clear');
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
        
        // Special celebration sound for equals!
        playSound(880, 200, 'equals');
        
        // Add a fun display flash
        display.style.boxShadow = '0 0 20px var(--operator-bg)';
        setTimeout(() => {
            display.style.boxShadow = 'none';
        }, 300);
        
        // Create particle explosion!
        createParticles();
        
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
        playSound(200, 300, 'clear');
        
        // Error shake animation
        display.style.animation = 'shake 0.5s';
        setTimeout(() => {
            display.style.animation = '';
        }, 500);
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