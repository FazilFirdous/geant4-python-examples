const CACHE_NAME = 'cora-v2.1.0';
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

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS).catch(() => {}))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Network-first for API calls
    if (url.pathname.includes('/cora/api/')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(JSON.stringify({
                    success: false,
                    data: null,
                    message: 'No internet connection'
                }), { headers: { 'Content-Type': 'application/json' } });
            })
        );
        return;
    }

    // Cache-first for static assets
    if (STATIC_ASSETS.some(a => url.pathname.endsWith(a) || url.pathname === a)) {
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

    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
