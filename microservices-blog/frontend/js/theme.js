// Theme Management
const theme = {
    // Get current theme
    get() {
        return localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    },

    // Set theme
    set(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('theme', themeName);
        this.updateToggleButton();
    },

    // Toggle between light and dark
    toggle() {
        const current = this.get();
        this.set(current === 'dark' ? 'light' : 'dark');
    },

    // Initialize theme on page load
    init() {
        this.set(this.get());
        this.updateToggleButton();
    },

    // Update toggle button icon
    updateToggleButton() {
        const btn = document.querySelector('.theme-toggle');
        if (btn) {
            const isDark = this.get() === 'dark';
            btn.innerHTML = isDark ? '☀️' : '🌙';
            btn.title = isDark ? 'Aydınlık Mod' : 'Karanlık Mod';
        }
    }
};

// Initialize theme on DOM load
document.addEventListener('DOMContentLoaded', () => {
    theme.init();
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        theme.set(e.matches ? 'dark' : 'light');
    }
});
