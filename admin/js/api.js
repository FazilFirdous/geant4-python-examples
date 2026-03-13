/* ═══ Cora Admin API Client — Production Grade ═══ */

const API_BASE = 'https://proteinstructure.fun/cora/api';

const AApi = {
    _token: () => localStorage.getItem('admin_token'),
    _inflight: new Map(),
    _retryDelays: [1000, 2000, 4000],
    _defaultTimeout: 15000,

    /* ── Core request with retry, timeout, dedup ── */
    async request(endpoint, options = {}) {
        const method = options.method || 'GET';
        const dedupeKey = method === 'GET' ? `${method}:${endpoint}` : null;

        if (dedupeKey && this._inflight.has(dedupeKey)) {
            return this._inflight.get(dedupeKey);
        }

        const promise = this._executeWithRetry(endpoint, options);

        if (dedupeKey) {
            this._inflight.set(dedupeKey, promise);
            promise.finally(() => this._inflight.delete(dedupeKey));
        }

        return promise;
    },

    async _executeWithRetry(endpoint, options, attempt = 0) {
        try {
            const token = this._token();
            const headers = {
                ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                ...(options.headers || {})
            };

            const controller = new AbortController();
            const timeout = options.timeout || this._defaultTimeout;
            const timer = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers,
                signal: controller.signal
            });

            clearTimeout(timer);

            if (response.status === 401) {
                localStorage.removeItem('admin_token');
                window.location.reload();
                return;
            }

            if (response.status === 429) {
                const retryAfter = parseInt(response.headers.get('Retry-After') || '5', 10);
                await this._sleep(retryAfter * 1000);
                return this._executeWithRetry(endpoint, options, attempt);
            }

            if (!response.ok && attempt < this._retryDelays.length) {
                await this._sleep(this._retryDelays[attempt]);
                return this._executeWithRetry(endpoint, options, attempt + 1);
            }

            return await response.json();
        } catch (e) {
            if (e.name === 'AbortError') throw new Error('Request timed out');

            if (attempt < this._retryDelays.length) {
                await this._sleep(this._retryDelays[attempt]);
                return this._executeWithRetry(endpoint, options, attempt + 1);
            }

            console.error('AApi request error:', e);
            throw e;
        }
    },

    /* ── HTTP methods ── */
    get:  (ep)       => AApi.request(ep, { method: 'GET' }),
    post: (ep, body) => AApi.request(ep, { method: 'POST', body: JSON.stringify(body) }),
    put:  (ep, body) => AApi.request(ep, { method: 'PUT',  body: JSON.stringify(body) }),
    del:  (ep)       => AApi.request(ep, { method: 'DELETE' }),

    async upload(endpoint, formData) {
        const token = this._token();
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 30000);
        try {
            const resp = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST', headers, body: formData, signal: controller.signal
            });
            clearTimeout(timer);
            return resp.json();
        } catch (e) {
            clearTimeout(timer);
            if (e.name === 'AbortError') throw new Error('Upload timed out');
            throw e;
        }
    },

    _sleep: (ms) => new Promise(r => setTimeout(r, ms)),

    /* ── Endpoints ── */
    getDashboard:      () => AApi.get('/admin/dashboard.php'),
    getRestaurants:    () => AApi.get('/admin/restaurants.php'),
    addRestaurant:     (fd) => AApi.upload('/admin/restaurant.php', fd),
    updateRestaurant:  (data) => AApi.put('/admin/restaurant.php', data),
    getOrders:         (params = '') => AApi.get(`/admin/orders.php${params ? '?' + params : ''}`),
    updateOrder:       (data) => AApi.put('/admin/order.php', data),
    getDeliveryBoys:   () => AApi.get('/admin/delivery-boys.php'),
    addDeliveryBoy:    (data) => AApi.post('/admin/delivery-boys.php', data),
    updateDeliveryBoy: (data) => AApi.put('/admin/delivery-boys.php', data),
    getFinancial:      (params = '') => AApi.get(`/admin/financial.php${params ? '?' + params : ''}`),
    getCoupons:        () => AApi.get('/admin/coupons.php'),
    createCoupon:      (data) => AApi.post('/admin/coupons.php', data),
    toggleCoupon:      (id, isActive) => AApi.put('/admin/coupons.php', { id, is_active: isActive }),
    deleteCoupon:      (id) => AApi.del(`/admin/coupons.php?id=${id}`),
    getTickets:        () => AApi.get('/admin/support-tickets.php'),
    updateTicket:      (data) => AApi.put('/admin/support-tickets.php', data),
    getDelivConfig:    () => AApi.get('/admin/delivery-config.php'),
    updateDelivConfig: (data) => AApi.put('/admin/delivery-config.php', data),
    getSettlement:     () => AApi.get('/admin/settlement.php'),
    markSettled:       (data) => AApi.post('/admin/settlement.php', data),
    getUsers:          () => AApi.get('/admin/users.php'),
    getNotifications:  () => AApi.get('/admin/notifications.php'),
    sendNotification:  (data) => AApi.post('/admin/notifications.php', data),
    demoLogin:         (data) => AApi.post('/auth/demo-login.php', data),
    verify:            (data) => AApi.post('/auth/verify.php', data),
    getMe:             () => AApi.get('/auth/me.php'),
};
