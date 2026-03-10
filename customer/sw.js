const CACHE_NAME = 'cora-v1.0.0';
const STATIC_ASSETS = [
    '/customer/index.html',
    '/customer/css/app.css',
    '/customer/js/app.js',
    '/customer/js/api.js',
    '/customer/js/components/loading.js',
    '/customer/js/components/navbar.js',
    '/customer/js/components/promo-carousel.js',
    '/customer/js/components/restaurant-card.js',
    '/customer/js/components/menu-item.js',
    '/customer/js/components/cart-bar.js',
    '/customer/js/screens/home.js',
    '/customer/js/screens/restaurant.js',
    '/customer/js/screens/cart.js',
    '/customer/js/screens/tracking.js',
    '/customer/js/screens/orders.js',
    '/customer/js/screens/support.js',
    '/customer/js/screens/profile.js',
    '/customer/js/screens/search.js',
    '/customer/manifest.json',
];

// Install: cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
             .then(() => self.skipWaiting())
    );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch: network-first for API, cache-first for static
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Network-first for API calls
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(JSON.stringify({
                    success: false,
                    data: null,
                    message: 'No internet connection'
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }

    // Cache-first for static assets
    if (STATIC_ASSETS.includes(url.pathname)) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                return cached || fetch(event.request).then(resp => {
                    const clone = resp.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return resp;
                });
            })
        );
        return;
    }

    // Default: network with cache fallback
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
