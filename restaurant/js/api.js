/* ═══ Cora Restaurant API Client — Production Grade ═══ */

const API_BASE = 'https://proteinstructure.fun/cora/api';

const RApi = {
    _token: () => localStorage.getItem('restaurant_token'),
    _inflight: new Map(),
    _retryDelays: [1000, 2000, 4000],
    _defaultTimeout: 15000,

    /* ── Core request with retry, timeout, dedup ── */
    async request(endpoint, options = {}) {
        const method = options.method || 'GET';
        const dedupeKey = method === 'GET' ? `${method}:${endpoint}` : null;

        // Deduplicate identical GET requests
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
                localStorage.removeItem('restaurant_token');
                this._emit('auth:expired');
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

            const data = await response.json();
            return data;
        } catch (e) {
            if (e.name === 'AbortError') {
                throw new Error('Request timed out');
            }

            // Network error — retry
            if (attempt < this._retryDelays.length) {
                await this._sleep(this._retryDelays[attempt]);
                return this._executeWithRetry(endpoint, options, attempt + 1);
            }

            // Offline queue for mutations
            if (!navigator.onLine && options.method && options.method !== 'GET') {
                this._queueOffline(endpoint, options);
                return { success: true, offline: true, message: 'Queued for when back online' };
            }

            console.error('RApi request error:', e);
            throw e;
        }
    },

    /* ── HTTP methods ── */
    get:  (ep)       => RApi.request(ep, { method: 'GET' }),
    post: (ep, body) => RApi.request(ep, { method: 'POST', body: JSON.stringify(body) }),
    put:  (ep, body) => RApi.request(ep, { method: 'PUT',  body: JSON.stringify(body) }),
    del:  (ep)       => RApi.request(ep, { method: 'DELETE' }),

    async upload(endpoint, formData) {
        const token = this._token();
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 30000);

        try {
            const resp = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers,
                body: formData,
                signal: controller.signal
            });
            clearTimeout(timer);
            return resp.json();
        } catch (e) {
            clearTimeout(timer);
            if (e.name === 'AbortError') throw new Error('Upload timed out');
            throw e;
        }
    },

    /* ── Offline queue ── */
    _offlineQueue: [],

    _queueOffline(endpoint, options) {
        this._offlineQueue.push({ endpoint, options, timestamp: Date.now() });
        localStorage.setItem('rapi_offline_queue', JSON.stringify(this._offlineQueue));
    },

    async flushOfflineQueue() {
        const stored = localStorage.getItem('rapi_offline_queue');
        if (stored) {
            try { this._offlineQueue = JSON.parse(stored); } catch(e) { this._offlineQueue = []; }
        }
        if (!this._offlineQueue.length) return;

        const queue = [...this._offlineQueue];
        this._offlineQueue = [];
        localStorage.removeItem('rapi_offline_queue');

        let succeeded = 0;
        for (const item of queue) {
            try {
                await this._executeWithRetry(item.endpoint, item.options);
                succeeded++;
            } catch (e) {
                this._offlineQueue.push(item);
            }
        }

        if (this._offlineQueue.length) {
            localStorage.setItem('rapi_offline_queue', JSON.stringify(this._offlineQueue));
        }

        if (succeeded > 0) {
            this._emit('offline:flushed', { succeeded, remaining: this._offlineQueue.length });
        }
    },

    /* ── Event system ── */
    _listeners: {},

    on(event, fn) {
        if (!this._listeners[event]) this._listeners[event] = [];
        this._listeners[event].push(fn);
        return () => { this._listeners[event] = this._listeners[event].filter(f => f !== fn); };
    },

    _emit(event, data) {
        (this._listeners[event] || []).forEach(fn => { try { fn(data); } catch(e) {} });
    },

    /* ── Helpers ── */
    _sleep: (ms) => new Promise(r => setTimeout(r, ms)),

    /* ── Endpoint methods ── */
    getOrders:         (status = '') => RApi.get(`/restaurant/orders.php${status ? '?status=' + status : ''}`),
    updateOrderStatus: (data)  => RApi.put('/restaurant/order-status.php', data),
    getMenu:           ()  => RApi.get('/restaurant/menu.php'),
    saveMenuItem:      (fd) => RApi.upload('/restaurant/menu-item.php', fd),
    updateMenuItem:    (id, fd) => RApi.upload(`/restaurant/menu-item.php?id=${id}`, fd),
    deleteMenuItem:    (id) => RApi.del(`/restaurant/menu-item.php?id=${id}`),
    toggleItem:        (id) => RApi.put('/restaurant/toggle-item.php', { id }),
    toggleOpen:        ()  => RApi.put('/restaurant/toggle-open.php', {}),
    getEarnings:       (period) => RApi.get(`/restaurant/earnings.php${period ? '?period=' + period : ''}`),
    getDeliveryBoys:   ()  => RApi.get('/restaurant/delivery-boys.php'),
    toggleBoyStatus:   (id) => RApi.put('/restaurant/delivery-boy-status.php', { delivery_boy_id: id }),
    getPublicPool:     ()  => RApi.get('/restaurant/public-pool.php'),
    postToPool:        (data) => RApi.post('/restaurant/public-pool.php', data),
    claimDelivery:     (data) => RApi.post('/restaurant/claim-delivery.php', data),
    notifyCustomer:    (data) => RApi.post('/restaurant/notify-customer.php', data),
    getReviews:        ()  => RApi.get('/restaurant/reviews.php'),
    replyReview:       (data) => RApi.post('/restaurant/review-reply.php', data),
    updateSettings:    (data) => RApi.put('/restaurant/settings.php', data),
    uploadLogo:        (fd) => RApi.upload('/restaurant/upload-logo.php', fd),
    demoLogin:         (data) => RApi.post('/auth/demo-login.php', data),
    verify:            (data) => RApi.post('/auth/verify.php', data),
    getMe:             () => RApi.get('/auth/me.php'),
};

// Flush offline queue when coming back online
window.addEventListener('online', () => {
    RApi.flushOfflineQueue();
});
