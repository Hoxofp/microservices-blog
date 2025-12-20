// API Configuration
// Railway'de her servis kendi URL'ine sahip olduğu için,
// Frontend build sırasında VITE_API_URL environment variable'ı set edilmeli
// Örnek: VITE_API_URL=https://gateway-production-xxxx.up.railway.app
const API_BASE_URL = import.meta.env.VITE_API_URL ||
    (window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://gateway-production-67d7.up.railway.app')

class ApiService {
    constructor() {
        this.baseUrl = API_BASE_URL
    }

    getToken() {
        return localStorage.getItem('token')
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`
        const token = this.getToken()

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            })

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}`)
            }

            return data
        } catch (error) {
            console.error('API Error:', error)
            throw error
        }
    }

    // Auth
    async login(username, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        })
    }

    async register(username, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        })
    }

    // Categories
    async getCategories() {
        return this.request('/categories')
    }

    async createCategory(name, description, icon, color) {
        return this.request('/categories', {
            method: 'POST',
            body: JSON.stringify({ name, description, icon, color })
        })
    }

    // Posts
    async getPosts(sort = 'new') {
        return this.request(`/posts?sort=${sort}`)
    }

    async getPost(id) {
        return this.request(`/posts/${id}`)
    }

    async createPost(title, content, categoryId) {
        return this.request('/posts', {
            method: 'POST',
            body: JSON.stringify({ title, content, categoryId })
        })
    }

    // Voting
    async upvote(postId) {
        return this.request(`/posts/${postId}/upvote`, { method: 'POST' })
    }

    async downvote(postId) {
        return this.request(`/posts/${postId}/downvote`, { method: 'POST' })
    }

    // Comments
    async getComments(postId) {
        return this.request(`/posts/${postId}/comments`)
    }

    async addComment(postId, content) {
        return this.request(`/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content })
        })
    }
}

export const api = new ApiService()
export default api
