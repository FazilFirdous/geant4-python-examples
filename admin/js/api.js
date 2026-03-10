const API_BASE = '/api';

const AApi = {
    _token: () => localStorage.getItem('admin_token'),

    async request(endpoint, options = {}) {
        const token = this._token();
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(options.headers || {})
        };
        const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
        const data = await response.json();
        if (response.status === 401) { localStorage.removeItem('admin_token'); window.location.reload(); }
        return data;
    },

    get:  (ep)       => AApi.request(ep, { method: 'GET' }),
    post: (ep, body) => AApi.request(ep, { method: 'POST', body: JSON.stringify(body) }),
    put:  (ep, body) => AApi.request(ep, { method: 'PUT',  body: JSON.stringify(body) }),
    del:  (ep)       => AApi.request(ep, { method: 'DELETE' }),

    async upload(endpoint, formData) {
        const token = this._token();
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const resp = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', headers, body: formData });
        return resp.json();
    },

    getDashboard:     () => AApi.get('/admin/dashboard.php'),
    getRestaurants:   () => AApi.get('/admin/restaurants.php'),
    addRestaurant:    (fd) => AApi.upload('/admin/restaurant.php', fd),
    updateRestaurant: (data) => AApi.put('/admin/restaurant.php', data),
    getOrders:        (params = '') => AApi.get(`/admin/orders.php${params ? '?' + params : ''}`),
    updateOrder:      (data) => AApi.put('/admin/order.php', data),
    getDeliveryBoys:  () => AApi.get('/admin/delivery-boys.php'),
    addDeliveryBoy:   (data) => AApi.post('/admin/delivery-boys.php', data),
    getFinancial:     (params = '') => AApi.get(`/admin/financial.php${params ? '?' + params : ''}`),
    getCoupons:       () => AApi.get('/admin/coupons.php'),
    createCoupon:     (data) => AApi.post('/admin/coupons.php', data),
    toggleCoupon:     (id, isActive) => AApi.put('/admin/coupons.php', { id, is_active: isActive }),
    getTickets:       () => AApi.get('/admin/support-tickets.php'),
    updateTicket:     (data) => AApi.put('/admin/support-tickets.php', data),
    getDelivConfig:   () => AApi.get('/admin/delivery-config.php'),
    updateDelivConfig: (data) => AApi.put('/admin/delivery-config.php', data),
    getSettlement:    () => AApi.get('/admin/settlement.php'),
    markSettled:      (data) => AApi.post('/admin/settlement.php', data),
    verify:           (data) => AApi.post('/auth/verify.php', data),
    getMe:            () => AApi.get('/auth/me.php'),
};
