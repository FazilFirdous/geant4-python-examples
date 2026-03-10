const API_BASE = '/api';

const RApi = {
    _token: () => localStorage.getItem('restaurant_token'),

    async request(endpoint, options = {}) {
        const token = this._token();
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(options.headers || {})
        };

        const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
        const data = await response.json();

        if (response.status === 401) {
            localStorage.removeItem('restaurant_token');
            window.location.reload();
            return;
        }

        return data;
    },

    get:  (ep)       => RApi.request(ep, { method: 'GET' }),
    post: (ep, body) => RApi.request(ep, { method: 'POST', body: JSON.stringify(body) }),
    put:  (ep, body) => RApi.request(ep, { method: 'PUT',  body: JSON.stringify(body) }),
    del:  (ep)       => RApi.request(ep, { method: 'DELETE' }),

    async upload(endpoint, formData) {
        const token = this._token();
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const resp = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', headers, body: formData });
        return resp.json();
    },

    // Restaurant-specific
    getOrders:        (status = '') => RApi.get(`/restaurant/orders.php${status ? '?status=' + status : ''}`),
    updateOrderStatus: (data)  => RApi.put('/restaurant/order-status.php', data),
    getMenu:          ()  => RApi.get('/restaurant/menu.php'),
    saveMenuItem:     (fd) => RApi.upload('/restaurant/menu-item.php', fd),
    deleteMenuItem:   (id) => RApi.del(`/restaurant/menu-item.php?id=${id}`),
    toggleItem:       (id) => RApi.put('/restaurant/toggle-item.php', { id }),
    toggleOpen:       ()  => RApi.put('/restaurant/toggle-open.php', {}),
    getEarnings:      ()  => RApi.get('/restaurant/earnings.php'),
    getDeliveryBoys:  ()  => RApi.get('/restaurant/delivery-boys.php'),
    toggleBoyStatus:  (id) => RApi.put('/restaurant/delivery-boy-status.php', { delivery_boy_id: id }),
    getPublicPool:    ()  => RApi.get('/restaurant/public-pool.php'),
    postToPool:       (data) => RApi.post('/restaurant/public-pool.php', data),
    claimDelivery:    (data) => RApi.post('/restaurant/claim-delivery.php', data),
    notifyCustomer:   (data) => RApi.post('/restaurant/notify-customer.php', data),
    getReviews:       ()  => RApi.get('/restaurant/reviews.php'),
    replyReview:      (data) => RApi.post('/restaurant/review-reply.php', data),
    verify:           (data) => RApi.post('/auth/verify.php', data),
    getMe:            ()  => RApi.get('/auth/me.php'),
};
