// API Configuration
const API_BASE_URL = window.API_URL ||
    (window.location.hostname === 'localhost' ? 'http://localhost:3000' : '');

// API Helper
const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = localStorage.getItem('token');

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth endpoints
    async register(username, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },

    async login(username, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },

    // Category endpoints
    async getCategories() {
        return this.request('/categories');
    },

    async getPopularCategories() {
        return this.request('/categories/popular');
    },

    async getCategoryBySlug(slug) {
        return this.request(`/categories/${slug}`);
    },

    async getCategoryPosts(slug, sort = 'new') {
        return this.request(`/categories/${slug}/posts?sort=${sort}`);
    },

    async createCategory(name, description, icon, color) {
        return this.request('/categories', {
            method: 'POST',
            body: JSON.stringify({ name, description, icon, color })
        });
    },

    // Post endpoints
    async getPosts(sort = 'new') {
        return this.request(`/posts?sort=${sort}`);
    },

    async getPost(id) {
        return this.request(`/posts/${id}`);
    },

    async createPost(title, content, categoryId) {
        return this.request('/posts', {
            method: 'POST',
            body: JSON.stringify({ title, content, categoryId })
        });
    },

    // Vote endpoints
    async upvote(postId) {
        return this.request(`/posts/${postId}/upvote`, { method: 'POST' });
    },

    async downvote(postId) {
        return this.request(`/posts/${postId}/downvote`, { method: 'POST' });
    },

    // Comment endpoints
    async getComments(postId) {
        return this.request(`/posts/${postId}/comments`);
    },

    async addComment(postId, content) {
        return this.request(`/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content })
        });
    }
};
