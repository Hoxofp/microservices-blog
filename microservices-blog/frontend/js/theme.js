// Theme Management - Ultra Premium
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
        const newTheme = current === 'dark' ? 'light' : 'dark';
        this.set(newTheme);

        // Add transition animation
        document.body.style.transition = 'background 0.5s ease, color 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    },

    // Initialize theme on page load
    init() {
        // Set theme immediately to prevent flash
        document.documentElement.setAttribute('data-theme', this.get());
        this.updateToggleButton();
    },

    // Update toggle button icon
    updateToggleButton() {
        const icon = document.getElementById('themeIcon');
        if (icon) {
            const isDark = this.get() === 'dark';
            icon.textContent = isDark ? '☀️' : '🌙';
            icon.parentElement.title = isDark ? 'Aydınlık Mod' : 'Karanlık Mod';
        }
    }
};

// Initialize theme immediately
theme.init();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        theme.set(e.matches ? 'dark' : 'light');
    }
});
