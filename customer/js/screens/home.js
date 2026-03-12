/* ═══ Home Screen ═══ */
const HomeScreen = {
    _restaurants: [],
    _currentCuisine: 'All',

    // Category config: [label, lucide-icon or custom SVG path]
    _categories: [
        { label: 'All',       icon: 'utensils' },
        { label: 'Popular',   icon: 'flame' },
        { label: 'Wazwan',    icon: 'beef' },
        { label: 'Bakery',    icon: 'cake' },
        { label: 'Burgers',   icon: 'sandwich' },
        { label: 'Chai',      icon: 'coffee' },
        { label: 'Healthy',   icon: 'leaf' },
        { label: 'Snacks',    icon: 'package' },
        { label: 'Biryani',   icon: 'bowl-steam' },
    ],

    async render() {
        try {
            const catHtml = this._categories.map((c, i) => `
                <div class="category-pill ${i === 0 ? 'active' : ''}"
                     onclick="HomeScreen.filterCuisine('${c.label}', this)">
                    <span class="cat-icon-wrap"><i data-lucide="${c.icon}"></i></span>
                    <span class="cat-label">${c.label}</span>
                </div>
            `).join('');

            App.setScreen(`
                <div id="home-screen">
                    <!-- Header -->
                    <div class="screen-header">
                        <div style="display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1;">
                            <div>
                                <div class="header-logo">Cora
                                    <svg style="display:inline-block;vertical-align:middle;margin-left:4px;" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
                                </div>
                                <div class="header-subtitle">Kulgam's Food, Delivered</div>
                            </div>
                            <div style="text-align:right;color:white;font-size:13px;">
                                <div>Hi, ${App.user?.name || 'Guest'}</div>
                            </div>
                        </div>
                        <div class="header-address-bar" onclick="window.location.hash='#profile'">
                            <i data-lucide="map-pin" style="width:14px;height:14px;flex-shrink:0;"></i>
                            <span>Kulgam Town</span>
                            <i data-lucide="chevron-down" style="width:14px;height:14px;margin-left:auto;opacity:0.7;"></i>
                        </div>
                        <div class="header-search" onclick="window.location.hash='#search'">
                            <i data-lucide="search" style="width:16px;height:16px;opacity:0.8;flex-shrink:0;"></i>
                            <span style="color:rgba(255,255,255,0.7);font-size:14px;">Search restaurants or dishes...</span>
                        </div>
                    </div>

                    <!-- Category Pills -->
                    <div class="category-pills" id="category-pills">
                        ${catHtml}
                    </div>

                    <!-- Promo Carousel -->
                    <div class="carousel-wrap" id="carousel-wrap">
                        ${Loading.skeleton(1)}
                    </div>

                    <!-- Restaurants -->
                    <div class="section-header">
                        <span class="section-title">Restaurants Near You</span>
                        <span id="restaurant-count" style="font-size:13px;color:var(--text-muted);"></span>
                    </div>

                    <div class="restaurants-grid" id="restaurants-grid">
                        ${Loading.skeleton(4)}
                    </div>

                    <div style="height:20px;"></div>
                </div>
            `);

            CartBar.update();

            // Load data in parallel
            const [bannersRes, restaurantsRes] = await Promise.all([
                API.getBanners().catch(() => ({ success: false, data: [] })),
                API.getRestaurants().catch(() => ({ success: false, data: [] }))
            ]);

            // Render carousel
            const banners = (bannersRes && bannersRes.data) ? bannersRes.data : [];
            if (banners.length > 0) {
                document.getElementById('carousel-wrap').innerHTML = '<div id="promo-carousel"></div>';
                PromoCarousel.init(banners, 'promo-carousel');
            } else {
                // Show a default promo slide even without DB banners
                const defaultBanners = [{
                    title: 'Kulgam\'s Best Food',
                    subtitle: 'Fresh & hot, delivered to your door',
                    bg_gradient: 'linear-gradient(135deg, #D1386C, #8C1D47)'
                }, {
                    title: 'Traditional Wazwan',
                    subtitle: 'Authentic Kashmiri cuisine',
                    bg_gradient: 'linear-gradient(135deg, #8C1D47, #D1386C)'
                }];
                document.getElementById('carousel-wrap').innerHTML = '<div id="promo-carousel"></div>';
                PromoCarousel.init(defaultBanners, 'promo-carousel');
            }

            // Render restaurants
            HomeScreen._restaurants = (restaurantsRes && restaurantsRes.data) ? restaurantsRes.data : [];
            HomeScreen.renderRestaurants(HomeScreen._restaurants);

        } catch (e) {
            console.error('HomeScreen render error:', e);
            App.showToast('Something went wrong loading the home screen', 'error');
            const grid = document.getElementById('restaurants-grid');
            if (grid) {
                grid.innerHTML = Loading.error('Failed to load restaurants. Tap to retry.', 'HomeScreen.render()');
            }
        }
    },

    renderRestaurants(list) {
        try {
            const grid    = document.getElementById('restaurants-grid');
            const countEl = document.getElementById('restaurant-count');
            if (!grid) return;

            if (!list || list.length === 0) {
                grid.innerHTML = `
                    <div class="empty-state" style="grid-column:1/-1;">
                        <div style="width:80px;height:80px;background:var(--berry-light);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--berry)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
                        </div>
                        <h3>No restaurants yet</h3>
                        <p>Coming soon! New restaurants joining Cora daily.</p>
                    </div>
                `;
                if (countEl) countEl.textContent = '';
                return;
            }

            if (countEl) countEl.textContent = `${list.length} open`;
            grid.innerHTML = list.map(r => RestaurantCard.render(r)).join('');

            // Activate Lucide icons inside cards
            if (typeof lucide !== 'undefined') lucide.createIcons();

            // Cache for offline
            try { localStorage.setItem('cora_restaurants_cache', JSON.stringify(list)); } catch (e) {}
        } catch (e) {
            console.error('renderRestaurants error:', e);
        }
    },

    filterCuisine(cuisine, el) {
        try {
            this._currentCuisine = cuisine;
            document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
            el.classList.add('active');

            const filtered = (cuisine === 'All' || cuisine === 'Popular')
                ? this._restaurants
                : this._restaurants.filter(r =>
                    (r.cuisine_tags || '').toLowerCase().includes(cuisine.toLowerCase())
                );
            this.renderRestaurants(filtered);
        } catch (e) {
            console.error('filterCuisine error:', e);
        }
    }
};
