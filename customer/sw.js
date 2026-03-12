/* ═══════════════════════════════════════
   CORA — Service Worker v3.0
   Production-grade PWA with smart caching
   ═══════════════════════════════════════ */

const CACHE_VERSION = 'cora-v3.0.0';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE   = `${CACHE_VERSION}-images`;

// Maximum entries per cache
const MAX_DYNAMIC_ENTRIES = 50;
const MAX_IMAGE_ENTRIES   = 100;

// Static assets to pre-cache on install
const STATIC_ASSETS = [
    '/cora/customer/index.html',
    '/cora/customer/css/app.css',
    '/cora/customer/js/app.js',
    '/cora/customer/js/api.js',
    '/cora/customer/js/components/loading.js',
    '/cora/customer/js/components/navbar.js',
    '/cora/customer/js/components/promo-carousel.js',
    '/cora/customer/js/components/restaurant-card.js',
    '/cora/customer/js/components/menu-item.js',
    '/cora/customer/js/components/cart-bar.js',
    '/cora/customer/js/screens/home.js',
    '/cora/customer/js/screens/restaurant.js',
    '/cora/customer/js/screens/cart.js',
    '/cora/customer/js/screens/tracking.js',
    '/cora/customer/js/screens/orders.js',
    '/cora/customer/js/screens/support.js',
    '/cora/customer/js/screens/profile.js',
    '/cora/customer/js/screens/search.js',
    '/cora/customer/manifest.json',
];

// CDN patterns to cache on first use
const CDN_PATTERNS = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'unpkg.com/lucide',
    'cdn.jsdelivr.net',
];

// API base path
const API_PATH = '/cora/api/';

// Image domains to cache
const IMAGE_HOSTS = [
    'images.unsplash.com',
    'plus.unsplash.com',
    'proteinstructure.fun',
];

// ── Install ─────────────────────────────────────
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                return Promise.allSettled(
                    STATIC_ASSETS.map(url =>
                        cache.add(url).catch(err => {
                            console.warn(`SW: Failed to cache ${url}:`, err);
                        })
                    )
                );
            })
            .then(() => self.skipWaiting())
    );
});

// ── Activate — Clean old caches ─────────────────
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(k => k !== STATIC_CACHE && k !== DYNAMIC_CACHE && k !== IMAGE_CACHE)
                    .map(k => {
                        console.log(`SW: Deleting old cache ${k}`);
                        return caches.delete(k);
                    })
            ))
            .then(() => self.clients.claim())
            .then(() => {
                return self.clients.matchAll().then(clients => {
                    clients.forEach(client => {
                        client.postMessage({
                            type: 'SW_UPDATED',
                            version: CACHE_VERSION
                        });
                    });
                });
            })
    );
});

// ── Fetch Strategy Router ───────────────────────
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip non-http
    if (!url.protocol.startsWith('http')) return;

    // 1. API calls — Network First with offline fallback
    if (url.pathname.includes(API_PATH)) {
        event.respondWith(networkFirstAPI(event.request));
        return;
    }

    // 2. Images — Cache First with network fallback
    if (isImageRequest(url)) {
        event.respondWith(cacheFirstImage(event.request));
        return;
    }

    // 3. CDN assets — Stale While Revalidate
    if (isCDNAsset(url)) {
        event.respondWith(staleWhileRevalidate(event.request, DYNAMIC_CACHE));
        return;
    }

    // 4. Static assets — Cache First
    if (isStaticAsset(url)) {
        event.respondWith(cacheFirstStatic(event.request));
        return;
    }

    // 5. Everything else — Network First
    event.respondWith(networkFirst(event.request));
});

// ── Strategy: Network First (API) ───────────────
async function networkFirstAPI(request) {
    try {
        const response = await fetch(request);
        return response;
    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            data: null,
            message: 'No internet connection. Please try again when online.'
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// ── Strategy: Cache First (Static) ──────────────
async function cacheFirstStatic(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        if (request.mode === 'navigate') {
            const fallback = await caches.match('/cora/customer/index.html');
            if (fallback) return fallback;
        }
        return new Response('Offline', { status: 503 });
    }
}

// ── Strategy: Cache First (Images) ──────────────
async function cacheFirstImage(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(IMAGE_CACHE);
            cache.put(request, response.clone());
            trimCache(IMAGE_CACHE, MAX_IMAGE_ENTRIES);
        }
        return response;
    } catch (err) {
        return new Response(
            `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
                <rect width="200" height="200" fill="#FFF0F5"/>
                <text x="100" y="105" text-anchor="middle" fill="#D1386C" font-size="14" font-family="sans-serif">Image unavailable</text>
            </svg>`,
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }
}

// ── Strategy: Stale While Revalidate ────────────
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
            cache.put(request, response.clone());
            trimCache(cacheName, MAX_DYNAMIC_ENTRIES);
        }
        return response;
    }).catch(() => cached);

    return cached || fetchPromise;
}

// ── Strategy: Network First (generic) ───────────
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
            trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_ENTRIES);
        }
        return response;
    } catch (err) {
        const cached = await caches.match(request);
        if (cached) return cached;

        if (request.mode === 'navigate') {
            const fallback = await caches.match('/cora/customer/index.html');
            if (fallback) return fallback;
        }
        return new Response('Offline', { status: 503 });
    }
}

// ── Helper: Check if image request ──────────────
function isImageRequest(url) {
    if (IMAGE_HOSTS.some(h => url.hostname.includes(h))) return true;
    const ext = url.pathname.split('.').pop()?.toLowerCase();
    return ['jpg','jpeg','png','gif','webp','avif','svg','ico'].includes(ext);
}

// ── Helper: Check if CDN asset ──────────────────
function isCDNAsset(url) {
    return CDN_PATTERNS.some(p => url.hostname.includes(p) || url.href.includes(p));
}

// ── Helper: Check if static asset ───────────────
function isStaticAsset(url) {
    return STATIC_ASSETS.some(a => url.pathname.endsWith(a) || url.pathname === a);
}

// ── Helper: Trim cache to max entries ───────────
async function trimCache(cacheName, maxEntries) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxEntries) {
        const deleteCount = keys.length - maxEntries;
        await Promise.all(
            keys.slice(0, deleteCount).map(key => cache.delete(key))
        );
    }
}

// ── Message Handler ─────────────────────────────
self.addEventListener('message', event => {
    const { type } = event.data || {};

    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;

        case 'CLEAR_CACHES':
            caches.keys().then(keys =>
                Promise.all(keys.map(k => caches.delete(k)))
            ).then(() => {
                event.source?.postMessage({ type: 'CACHES_CLEARED' });
            });
            break;

        case 'GET_VERSION':
            event.source?.postMessage({
                type: 'VERSION',
                version: CACHE_VERSION
            });
            break;

        case 'CACHE_URLS':
            if (event.data.urls) {
                caches.open(DYNAMIC_CACHE).then(cache => {
                    event.data.urls.forEach(url => {
                        cache.add(url).catch(() => {});
                    });
                });
            }
            break;
    }
});

// ── Background Sync ─────────────────────────────
self.addEventListener('sync', event => {
    if (event.tag === 'sync-orders') {
        event.waitUntil(syncPendingOrders());
    }
});

async function syncPendingOrders() {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({ type: 'SYNC_ORDERS' });
    });
}

// ── Push Notifications ──────────────────────────
self.addEventListener('push', event => {
    if (!event.data) return;

    try {
        const data = event.data.json();
        const options = {
            body: data.body || 'You have a new update',
            icon: '/cora/customer/icons/icon-192.png',
            badge: '/cora/customer/icons/badge-72.png',
            vibrate: [100, 50, 100],
            data: {
                url: data.url || '/cora/customer/',
                orderId: data.orderId
            },
            actions: data.actions || [],
            tag: data.tag || 'cora-notification',
            renotify: true,
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'CORA', options)
        );
    } catch (e) {
        console.error('SW: Push notification error:', e);
    }
});

// ── Notification Click ──────────────────────────
self.addEventListener('notificationclick', event => {
    event.notification.close();

    const url = event.notification.data?.url || '/cora/customer/';

    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then(clients => {
            for (const client of clients) {
                if (client.url.includes('/cora/customer/') && 'focus' in client) {
                    client.postMessage({
                        type: 'NOTIFICATION_CLICK',
                        data: event.notification.data
                    });
                    return client.focus();
                }
            }
            return self.clients.openWindow(url);
        })
    );
});
