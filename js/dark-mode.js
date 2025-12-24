// ============================================
// DARK-MODE.JS - Dark Mode Toggle Functionality
// ============================================

// Constants
const DARK_MODE_KEY = 'darkMode';
const DARK_MODE_CLASS = 'dark-mode';

// Initialize dark mode on page load
(function initDarkMode() {
    // Check if user has a saved preference
    const savedDarkMode = localStorage.getItem(DARK_MODE_KEY);
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply dark mode if saved or system prefers dark
    if (savedDarkMode === 'true' || (savedDarkMode === null && prefersDark)) {
        enableDarkMode();
    }
    
    // Setup toggle button when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupDarkModeToggle);
    } else {
        setupDarkModeToggle();
    }
})();

// Setup dark mode toggle button
function setupDarkModeToggle() {
    const toggleButtons = document.querySelectorAll('.theme-toggle');
    
    toggleButtons.forEach(button => {
        // Update button icon based on current mode
        updateToggleButton(button);
        
        // Add click event
        button.addEventListener('click', toggleDarkMode);
    });
    
    console.log('🌓 Dark mode initialized');
}

// Toggle dark mode
function toggleDarkMode() {
    if (document.body.classList.contains(DARK_MODE_CLASS)) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

// Enable dark mode
function enableDarkMode() {
    document.body.classList.add(DARK_MODE_CLASS);
    localStorage.setItem(DARK_MODE_KEY, 'true');
    updateAllToggleButtons();
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('darkModeChanged', { 
        detail: { isDark: true } 
    }));
}

// Disable dark mode
function disableDarkMode() {
    document.body.classList.remove(DARK_MODE_CLASS);
    localStorage.setItem(DARK_MODE_KEY, 'false');
    updateAllToggleButtons();
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('darkModeChanged', { 
        detail: { isDark: false } 
    }));
}

// Update all toggle buttons
function updateAllToggleButtons() {
    const toggleButtons = document.querySelectorAll('.theme-toggle');
    toggleButtons.forEach(updateToggleButton);
}

// Update single toggle button
function updateToggleButton(button) {
    const isDark = document.body.classList.contains(DARK_MODE_CLASS);
    
    // Update aria-label for accessibility
    button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    
    // Update button content if it uses icons
    if (button.querySelector('.icon-sun') || button.querySelector('.icon-moon')) {
        button.innerHTML = isDark ? '☀️' : '🌙';
    } else {
        button.textContent = isDark ? '☀️' : '🌙';
    }
}

// Listen for system color scheme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a preference
    const savedDarkMode = localStorage.getItem(DARK_MODE_KEY);
    
    if (savedDarkMode === null) {
        if (e.matches) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }
});

// Check if dark mode is currently enabled
function isDarkModeEnabled() {
    return document.body.classList.contains(DARK_MODE_CLASS);
}

// Get dark mode preference
function getDarkModePreference() {
    const saved = localStorage.getItem(DARK_MODE_KEY);
    if (saved !== null) {
        return saved === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Reset dark mode preference (use system default)
function resetDarkModePreference() {
    localStorage.removeItem(DARK_MODE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDark) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
}

// Export functions for use in other scripts
window.darkMode = {
    toggle: toggleDarkMode,
    enable: enableDarkMode,
    disable: disableDarkMode,
    isEnabled: isDarkModeEnabled,
    getPreference: getDarkModePreference,
    reset: resetDarkModePreference
};

// Listen for dark mode changes from other tabs
window.addEventListener('storage', (e) => {
    if (e.key === DARK_MODE_KEY) {
        if (e.newValue === 'true') {
            enableDarkMode();
        } else if (e.newValue === 'false') {
            disableDarkMode();
        }
    }
});

console.log('🌓 Dark mode script loaded');