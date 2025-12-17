// Auth utilities
const auth = {
    isLoggedIn() {
        return !!localStorage.getItem('token');
    },

    getToken() {
        return localStorage.getItem('token');
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    setSession(token, username) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ username }));
    },

    clearSession() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    logout() {
        this.clearSession();
        window.location.href = 'index.html';
    },

    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
};

// Update navbar based on auth state
function updateNavbar() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    if (auth.isLoggedIn()) {
        const user = auth.getUser();
        navLinks.innerHTML = `
            <a href="index.html">Ana Sayfa</a>
            <a href="create-post.html">Post Paylaş</a>
            <span style="color: var(--text-secondary);">Merhaba, ${user?.username || 'Kullanıcı'}</span>
            <a href="#" onclick="auth.logout(); return false;" class="btn btn-secondary">Çıkış</a>
        `;
    } else {
        navLinks.innerHTML = `
            <a href="index.html">Ana Sayfa</a>
            <a href="login.html">Giriş</a>
            <a href="register.html" class="btn btn-primary">Kayıt Ol</a>
        `;
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', updateNavbar);
