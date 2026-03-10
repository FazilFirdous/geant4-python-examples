/* ═══ CORA API Client ═══ */
const API_BASE = 'https://proteinstructure.fun/cora/api';

const API = {
    _getToken() {
        return localStorage.getItem('cora_token');
    },

    async request(endpoint, options = {}) {
        const token = this._getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(options.headers || {})
        };

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('cora_token');
                    localStorage.removeItem('cora_user');
                    if (typeof App !== 'undefined') App.user = null;
                    return null;
                }
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (e) {
            if (!navigator.onLine) {
                throw new Error('No internet connection');
            }
            throw e;
        }
    },

    get(endpoint)        { return this.request(endpoint, { method: 'GET' }); },
    post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); },
    put(endpoint, body)  { return this.request(endpoint, { method: 'PUT',  body: JSON.stringify(body) }); },
    delete(endpoint)     { return this.request(endpoint, { method: 'DELETE' }); },

    async upload(endpoint, formData) {
        const token = this._getToken();
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST', headers, body: formData
            });
            return response.json();
        } catch (e) {
            if (!navigator.onLine) throw new Error('No internet connection');
            throw e;
        }
    },

    // Auth
    demoLogin:      (data) => API.post('/auth/demo-login.php', data),
    verify:         (data) => API.post('/auth/verify.php', data),
    getMe:          ()     => API.get('/auth/me.php'),
    updateProfile:  (data) => API.put('/auth/profile.php', data),

    // Customer endpoints
    getRestaurants: (params = {}) => {
        const q = new URLSearchParams(params).toString();
        return API.get(`/customer/restaurants.php${q ? '?' + q : ''}`);
    },
    getRestaurant:  (id)   => API.get(`/customer/restaurant.php?id=${id}`),
    getBanners:     ()     => API.get('/customer/banners.php'),
    placeOrder:     (data) => API.post('/customer/order.php', data),
    getOrder:       (id)   => API.get(`/customer/order.php?id=${id}`),
    getOrders:      ()     => API.get('/customer/orders.php'),
    submitReview:   (data) => API.post('/customer/review.php', data),
    getAddresses:   ()     => API.get('/customer/addresses.php'),
    addAddress:     (data) => API.post('/customer/addresses.php', data),
    updateAddress:  (data) => API.put('/customer/addresses.php', data),
    deleteAddress:  (id)   => API.delete(`/customer/addresses.php?id=${id}`),
    applyCoupon:    (data) => API.post('/customer/apply-coupon.php', data),
    createTicket:   (data) => API.post('/customer/support.php', data),
};
