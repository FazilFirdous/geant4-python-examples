/* ═══ CORA API Client — Production Grade ═══ */
const API_BASE = 'https://proteinstructure.fun/cora/api';

const API = {
    _token: null,
    _activeRequests: new Map(),
    _requestId: 0,
    _retryDelays: [1000, 2000, 4000],
    _cache: new Map(),
    _cacheTTL: {},
    _online: navigator.onLine,
    _listeners: new Map(),

    // ── Token Management ──────────────────────────
    _getToken() {
        if (!this._token) this._token = localStorage.getItem('cora_token');
        return this._token;
    },

    setToken(token) {
        this._token = token;
        if (token) localStorage.setItem('cora_token', token);
        else localStorage.removeItem('cora_token');
    },

    // ── Event System ──────────────────────────────
    on(event, fn) {
        if (!this._listeners.has(event)) this._listeners.set(event, new Set());
        this._listeners.get(event).add(fn);
        return () => this._listeners.get(event)?.delete(fn);
    },

    _emit(event, data) {
        this._listeners.get(event)?.forEach(fn => {
            try { fn(data); } catch (e) { console.error('API event error:', e); }
        });
    },

    // ── Network Monitoring ────────────────────────
    _initNetworkMonitor() {
        window.addEventListener('online', () => {
            this._online = true;
            this._emit('online');
            // Retry queued requests
            this._processQueue();
        });
        window.addEventListener('offline', () => {
            this._online = false;
            this._emit('offline');
        });
    },

    _offlineQueue: [],

    _processQueue() {
        const queue = [...this._offlineQueue];
        this._offlineQueue = [];
        queue.forEach(({ resolve, reject, fn }) => {
            fn().then(resolve).catch(reject);
        });
    },

    // ── Cache Layer ───────────────────────────────
    _getCached(key) {
        const entry = this._cache.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiry) {
            this._cache.delete(key);
            return null;
        }
        return entry.data;
    },

    _setCache(key, data, ttlMs) {
        this._cache.set(key, { data, expiry: Date.now() + ttlMs });
        // Limit cache to 100 entries
        if (this._cache.size > 100) {
            const oldest = this._cache.keys().next().value;
            this._cache.delete(oldest);
        }
    },

    clearCache() {
        this._cache.clear();
    },

    // ── Request Deduplication ─────────────────────
    _dedupeKey(endpoint, options) {
        return `${options.method || 'GET'}:${endpoint}`;
    },

    // ── Core Request Method ───────────────────────
    async request(endpoint, options = {}) {
        const {
            retry = true,
            cacheTtl = 0,
            dedupe = false,
            signal = null,
            silent = false,
            timeout = 15000,
        } = options;

        // Cache check (GET only)
        const method = (options.method || 'GET').toUpperCase();
        if (method === 'GET' && cacheTtl > 0) {
            const cached = this._getCached(endpoint);
            if (cached) return cached;
        }

        // Deduplication — return existing promise for same endpoint
        if (dedupe && method === 'GET') {
            const dedupeKey = this._dedupeKey(endpoint, options);
            if (this._activeRequests.has(dedupeKey)) {
                return this._activeRequests.get(dedupeKey);
            }
        }

        const requestId = ++this._requestId;
        const controller = new AbortController();
        const abortSignal = signal || controller.signal;

        // Timeout
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const token = this._getToken();
        const headers = {
            'Content-Type': 'application/json',
            'X-Request-ID': String(requestId),
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(options.headers || {})
        };

        // Remove Content-Type for FormData
        if (options.body instanceof FormData) {
            delete headers['Content-Type'];
        }

        const doFetch = async (attempt = 0) => {
            try {
                if (!this._online && method !== 'GET') {
                    throw new Error('No internet connection. Please try again when online.');
                }

                const response = await fetch(`${API_BASE}${endpoint}`, {
                    method,
                    headers,
                    body: options.body,
                    signal: abortSignal,
                });

                clearTimeout(timeoutId);
                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        this.setToken(null);
                        localStorage.removeItem('cora_user');
                        if (typeof App !== 'undefined') {
                            App.user = null;
                            this._emit('auth_expired');
                        }
                        throw new Error('Session expired. Please log in again.');
                    }

                    if (response.status === 429) {
                        const retryAfter = parseInt(response.headers.get('Retry-After') || '5');
                        if (retry && attempt < 3) {
                            await this._sleep(retryAfter * 1000);
                            return doFetch(attempt + 1);
                        }
                        throw new Error('Too many requests. Please wait a moment.');
                    }

                    if (response.status >= 500 && retry && attempt < this._retryDelays.length) {
                        await this._sleep(this._retryDelays[attempt]);
                        return doFetch(attempt + 1);
                    }

                    throw new Error(data.message || `Request failed (${response.status})`);
                }

                // Cache successful GET responses
                if (method === 'GET' && cacheTtl > 0) {
                    this._setCache(endpoint, data, cacheTtl);
                }

                this._emit('request_success', { endpoint, requestId, data });
                return data;

            } catch (e) {
                clearTimeout(timeoutId);

                if (e.name === 'AbortError') {
                    throw new Error('Request timed out. Please try again.');
                }

                if (!navigator.onLine) {
                    this._online = false;
                    this._emit('offline');
                    throw new Error('No internet connection');
                }

                // Retry on network errors
                if (retry && attempt < this._retryDelays.length && !e.message.includes('Session expired')) {
                    await this._sleep(this._retryDelays[attempt]);
                    return doFetch(attempt + 1);
                }

                if (!silent) this._emit('request_error', { endpoint, requestId, error: e });
                throw e;
            }
        };

        const promise = doFetch();

        // Track for deduplication
        if (dedupe && method === 'GET') {
            const dedupeKey = this._dedupeKey(endpoint, options);
            this._activeRequests.set(dedupeKey, promise);
            promise.finally(() => this._activeRequests.delete(dedupeKey));
        }

        return promise;
    },

    _sleep(ms) { return new Promise(r => setTimeout(r, ms)); },

    // ── Cancel All Active Requests ────────────────
    cancelAll() {
        this._activeRequests.clear();
    },

    // ── Convenience Methods ───────────────────────
    get(endpoint, opts = {})     { return this.request(endpoint, { method: 'GET', ...opts }); },
    post(endpoint, body, opts = {}) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body), ...opts }); },
    put(endpoint, body, opts = {})  { return this.request(endpoint, { method: 'PUT',  body: JSON.stringify(body), ...opts }); },
    del(endpoint, opts = {})     { return this.request(endpoint, { method: 'DELETE', ...opts }); },

    async upload(endpoint, formData) {
        const token = this._getToken();
        const headers = {
            'X-Request-ID': String(++this._requestId),
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST', headers, body: formData
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Upload failed');
            return data;
        } catch (e) {
            if (!navigator.onLine) throw new Error('No internet connection');
            throw e;
        }
    },

    // ── Auth Endpoints ────────────────────────────
    demoLogin(data)     { return this.post('/auth/demo-login.php', data, { retry: false }); },
    verify(data)        { return this.post('/auth/verify.php', data, { retry: false }); },
    getMe()             { return this.get('/auth/me.php', { cacheTtl: 60000 }); },
    updateProfile(data) { return this.put('/auth/profile.php', data); },
    logout()            { return this.post('/auth/logout.php', {}); },

    // ── Customer Endpoints ────────────────────────
    getRestaurants(params = {}) {
        const q = new URLSearchParams(params).toString();
        return this.get(`/customer/restaurants.php${q ? '?' + q : ''}`, { cacheTtl: 30000, dedupe: true });
    },
    getRestaurant(id)   { return this.get(`/customer/restaurant.php?id=${id}`, { cacheTtl: 60000 }); },
    getBanners()        { return this.get('/customer/banners.php', { cacheTtl: 120000, dedupe: true }); },

    placeOrder(data)    { return this.post('/customer/order.php', data, { retry: false, timeout: 30000 }); },
    getOrder(id)        { return this.get(`/customer/order.php?id=${id}`); },
    getOrders(params = {}) {
        const q = new URLSearchParams(params).toString();
        return this.get(`/customer/orders.php${q ? '?' + q : ''}`);
    },
    cancelOrder(data)   { return this.post('/customer/order.php?action=cancel', data); },

    submitReview(data)  { return this.post('/customer/review.php', data); },

    getAddresses()      { return this.get('/customer/addresses.php', { cacheTtl: 60000 }); },
    addAddress(data)    { this.clearCache(); return this.post('/customer/addresses.php', data); },
    updateAddress(data) { this.clearCache(); return this.put('/customer/addresses.php', data); },
    deleteAddress(id)   { this.clearCache(); return this.del(`/customer/addresses.php?id=${id}`); },

    applyCoupon(data)   { return this.post('/customer/apply-coupon.php', data); },
    getAvailableCoupons() { return this.get('/customer/coupons.php', { cacheTtl: 60000 }); },

    createTicket(data)  { return this.post('/customer/support.php', data); },
    getTickets()        { return this.get('/customer/support.php'); },

    getFavorites()      { return this.get('/customer/favorites.php', { cacheTtl: 30000 }); },
    toggleFavorite(id)  { return this.post('/customer/favorites.php', { restaurant_id: id }); },

    getNotifications()  { return this.get('/customer/notifications.php'); },
    markNotificationRead(id) { return this.put('/customer/notifications.php', { id }); },

    // ── Config ────────────────────────────────────
    getConfig() { return this.get('/config/serve-config.php', { cacheTtl: 300000, dedupe: true }); },
};

// Init network monitor on load
API._initNetworkMonitor();
