// API Configuration
const CONFIG = {
    // API URL - use Railway backend for production
    API_URL: 'https://ii3140virtuallab18223136-production.up.railway.app/api',
    // API_URL: 'http://localhost:3001/api', // Uncomment for local testing

    // Supabase (untuk auth di frontend - optional)
    SUPABASE_URL: 'https://inlksxdnfiruqaiumofw.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlubGtzeGRuZmlydXFhaXVtb2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMjg0NTIsImV4cCI6MjA3NTYwNDQ1Mn0.35KjPxnqPSJD5PcNJiOinrDu2RlG3rPUDKdre3dSxXU'
};

// Make it available globally
window.APP_CONFIG = CONFIG;

// Helper functions for API calls
window.API = {
    // Get auth token from localStorage
    getToken() {
        const userData = localStorage.getItem('bobolingoUser');
        if (!userData) return null;
        try {
            const user = JSON.parse(userData);
            return user.token || null;
        } catch {
            return null;
        }
    },

    // Set user data with token
    setUserData(userData) {
        localStorage.setItem('bobolingoUser', JSON.stringify(userData));
    },

    // Clear user data (logout)
    clearUserData() {
        localStorage.removeItem('bobolingoUser');
    },

    // Get user data
    getUserData() {
        const userData = localStorage.getItem('bobolingoUser');
        if (!userData) return null;
        try {
            return JSON.parse(userData);
        } catch {
            return null;
        }
    },

    // Generic API call helper
    async call(endpoint, options = {}) {
        const token = this.getToken();

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        try {
            const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
                ...defaultOptions,
                ...options,
                headers: {
                    ...defaultOptions.headers,
                    ...options.headers
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Authentication APIs
    auth: {
        async login(email, password) {
            const response = await window.API.call('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            // Save user data with token
            if (response.success && response.data) {
                window.API.setUserData({
                    user: response.data.user,
                    token: response.data.token
                });
            }

            return response;
        },

        async register(email, password, username) {
            const response = await window.API.call('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, username })
            });

            // Save user data with token
            if (response.success && response.data) {
                window.API.setUserData({
                    user: response.data.user,
                    token: response.data.token
                });
            }

            return response;
        },

        async logout() {
            try {
                await window.API.call('/auth/logout', { method: 'POST' });
            } catch (error) {
                console.error('Logout API error:', error);
            } finally {
                // Always clear local data
                window.API.clearUserData();
            }
        },

        async verifyToken() {
            return window.API.call('/auth/verify-token', { method: 'POST' });
        }
    },

    // User APIs
    user: {
        async getProfile() {
            return window.API.call('/users/profile');
        },

        async updateProfile(username) {
            return window.API.call('/users/profile', {
                method: 'PUT',
                body: JSON.stringify({ username })
            });
        },

        async getStats() {
            return window.API.call('/users/stats');
        },

        async deleteAccount() {
            const response = await window.API.call('/users/account', {
                method: 'DELETE'
            });

            // Clear local data after deletion
            if (response.success) {
                window.API.clearUserData();
            }

            return response;
        }
    },

    // Game APIs
    game: {
        async saveScore(game_type, score, difficulty, completed = false) {
            return window.API.call('/games/save-score', {
                method: 'POST',
                body: JSON.stringify({
                    game_type,
                    score,
                    difficulty,
                    completed
                })
            });
        },

        async getLeaderboard(game_type, limit = 10) {
            return window.API.call(`/games/leaderboard/${game_type}?limit=${limit}`);
        },

        async getHistory(game_type = null) {
            const query = game_type ? `?game_type=${game_type}` : '';
            return window.API.call(`/games/history${query}`);
        },

        async getGameStats(game_type) {
            return window.API.call(`/games/stats/${game_type}`);
        }
    },

    // Grammar APIs
    grammar: {
        async check(text, language = 'en-US') {
            return window.API.call('/grammar/check', {
                method: 'POST',
                body: JSON.stringify({ text, language })
            });
        },

        async getSuggestions(word) {
            return window.API.call(`/grammar/suggestions/${word}`);
        }
    }
};

console.log('✅ API Config loaded');
console.log('📡 API URL:', CONFIG.API_URL);
console.log('🔑 Token present:', !!window.API.getToken());
