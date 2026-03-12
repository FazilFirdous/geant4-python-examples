/* ═══════════════════════════════════════
   CORA — Home Screen
   Production-grade with greeting, reorder,
   cuisine grid, categories, pull-to-refresh
   ═══════════════════════════════════════ */
const HomeScreen = {
    _restaurants: [],
    _currentCuisine: 'All',
    _lastOrders: [],
    _isRefreshing: false,

    // Category config: [label, lucide-icon]
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

    // ── Cuisine quick grid (shown below carousel) ─
    _cuisineGrid: [
        { name: 'Kashmiri', icon: 'beef', color: '#E65100', bg: '#FFF3E0' },
        { name: 'Indian',   icon: 'utensils', color: '#D1386C', bg: '#FFF0F5' },
        { name: 'Chinese',  icon: 'soup', color: '#F57C00', bg: '#FFF8E1' },
        { name: 'Fast Food', icon: 'zap', color: '#1565C0', bg: '#E3F2FD' },
        { name: 'Mughlai',  icon: 'crown', color: '#6A1B9A', bg: '#F3E5F5' },
        { name: 'Street',   icon: 'store', color: '#2E7D32', bg: '#E8F5E9' },
        { name: 'Desserts', icon: 'ice-cream-cone', color: '#AD1457', bg: '#FCE4EC' },
        { name: 'Drinks',   icon: 'cup-soda', color: '#00838F', bg: '#E0F7FA' },
    ],

    // ── Render ──────────────────────────────────
    async render() {
        const greeting = (typeof App !== 'undefined' && App.getGreeting)
            ? App.getGreeting() : 'Hello';
        const userName = (typeof App !== 'undefined' && App.user?.name)
            ? App.user.name.split(' ')[0] : 'Guest';

        const catHtml = this._categories.map((c, i) => `
            <div class="category-pill ${i === 0 ? 'active' : ''}"
                 onclick="HomeScreen.filterCuisine('${c.label}', this)"
                 role="tab" aria-selected="${i === 0}" tabindex="0">
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
                        <div style="text-align:right;color:white;">
                            <div style="font-size:13px;opacity:0.8;">${greeting},</div>
                            <div style="font-size:16px;font-weight:700;">${userName}</div>
                        </div>
                    </div>
                    <div class="header-address-bar" onclick="window.location.hash='#profile'" aria-label="Change delivery address">
                        <i data-lucide="map-pin" style="width:14px;height:14px;flex-shrink:0;"></i>
                        <span id="home-address-text" style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">Kulgam Town</span>
                        <i data-lucide="chevron-down" style="width:14px;height:14px;margin-left:auto;opacity:0.7;"></i>
                    </div>
                    <div class="header-search" onclick="window.location.hash='#search'" aria-label="Search food">
                        <i data-lucide="search" style="width:16px;height:16px;opacity:0.8;flex-shrink:0;"></i>
                        <span style="color:rgba(255,255,255,0.7);font-size:14px;">Search restaurants or dishes...</span>
                    </div>
                </div>

                <!-- Category Pills -->
                <div class="category-pills" id="category-pills" role="tablist" aria-label="Food categories">
                    ${catHtml}
                </div>

                <!-- Promo Carousel -->
                <div class="carousel-wrap" id="carousel-wrap">
                    ${Loading.carouselSkeleton()}
                </div>

                <!-- Cuisine Quick Grid -->
                <div style="padding:0 16px 4px;">
                    <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:10px;color:var(--text);">What's on your mind?</div>
                    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;" id="cuisine-grid">
                        ${this._renderCuisineGrid()}
                    </div>
                </div>

                <!-- Reorder Section -->
                <div id="reorder-section" style="display:none;"></div>

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
        try {
            const results = await Promise.allSettled([
                API.getBanners(),
                API.getRestaurants(),
                API.getOrders().catch(() => ({ data: [] })),
            ]);

            const bannersRes     = results[0].status === 'fulfilled' ? results[0].value : { data: [] };
            const restaurantsRes = results[1].status === 'fulfilled' ? results[1].value : { data: [] };
            const ordersRes      = results[2].status === 'fulfilled' ? results[2].value : { data: [] };

            // Render carousel
            const banners = (bannersRes && bannersRes.data) ? bannersRes.data : [];
            this._renderCarousel(banners);

            // Render restaurants
            this._restaurants = (restaurantsRes && restaurantsRes.data) ? restaurantsRes.data : [];
            this.renderRestaurants(this._restaurants);

            // Render reorder section
            this._lastOrders = ((ordersRes && ordersRes.data) || [])
                .filter(o => o.status === 'delivered')
                .slice(0, 3);
            this._renderReorderSection();

            // Load saved address
            this._loadDefaultAddress();

        } catch (e) {
            console.error('HomeScreen render error:', e);
            App.showToast('Something went wrong loading the home screen', 'error');
            const grid = document.getElementById('restaurants-grid');
            if (grid) {
                grid.innerHTML = Loading.error('Failed to load restaurants. Tap to retry.', 'HomeScreen.render()');
            }
        }
    },

    // ── Cuisine Grid ────────────────────────────
    _renderCuisineGrid() {
        return this._cuisineGrid.map(c => `
            <div onclick="HomeScreen.filterCuisine('${c.name}', null)" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 4px;border-radius:14px;cursor:pointer;transition:all 0.2s ease;">
                <div style="width:44px;height:44px;border-radius:50%;background:${c.bg};display:flex;align-items:center;justify-content:center;">
                    <i data-lucide="${c.icon}" style="width:22px;height:22px;color:${c.color};"></i>
                </div>
                <span style="font-size:11px;font-weight:600;color:var(--text-sub);text-align:center;line-height:1.2;">${c.name}</span>
            </div>
        `).join('');
    },

    // ── Carousel ────────────────────────────────
    _renderCarousel(banners) {
        const wrap = document.getElementById('carousel-wrap');
        if (!wrap) return;

        if (banners.length > 0) {
            wrap.innerHTML = '<div id="promo-carousel"></div>';
            PromoCarousel.init(banners, 'promo-carousel');
        } else {
            const defaultBanners = [
                { title: "Kulgam's Best Food", subtitle: 'Fresh & hot, delivered to your door', bg_gradient: 'linear-gradient(135deg, #D1386C, #8C1D47)' },
                { title: 'Traditional Wazwan', subtitle: 'Authentic Kashmiri cuisine', bg_gradient: 'linear-gradient(135deg, #8C1D47, #D1386C)' },
                { title: 'Fast Delivery', subtitle: 'Get food at your doorstep in 30 min', bg_gradient: 'linear-gradient(135deg, #6A1040, #D1386C)' },
            ];
            wrap.innerHTML = '<div id="promo-carousel"></div>';
            PromoCarousel.init(defaultBanners, 'promo-carousel');
        }
    },

    // ── Reorder Section ─────────────────────────
    _renderReorderSection() {
        const section = document.getElementById('reorder-section');
        if (!section || !this._lastOrders.length) return;

        section.style.display = 'block';
        section.innerHTML = `
            <div style="padding:0 16px;">
                <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:8px;">
                    <i data-lucide="repeat" style="width:18px;height:18px;color:var(--berry);"></i>
                    Order Again
                </div>
                <div style="display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px;">
                    ${this._lastOrders.map(o => `
                        <div onclick="OrdersScreen.reorder(${o.id})" style="min-width:180px;background:var(--bg-card);border:1px solid var(--berry-border);border-radius:14px;padding:12px;cursor:pointer;transition:all 0.2s ease;flex-shrink:0;">
                            <div style="font-size:13px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${o.restaurant_name}</div>
                            <div style="font-size:12px;color:var(--text-muted);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                                ${(o.items || []).slice(0, 2).map(i => i.item_name).join(', ')}
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
                                <span style="font-size:14px;font-weight:700;color:var(--text);">₹${parseFloat(o.total_amount).toFixed(0)}</span>
                                <span style="font-size:11px;color:var(--berry);font-weight:600;display:inline-flex;align-items:center;gap:2px;"><i data-lucide="plus" style="width:12px;height:12px;"></i> Add</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    // ── Load Default Address ────────────────────
    _loadDefaultAddress() {
        try {
            const addresses = JSON.parse(localStorage.getItem('cora_addresses') || '[]');
            const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
            if (defaultAddr) {
                const el = document.getElementById('home-address-text');
                if (el) el.textContent = defaultAddr.label + ' - ' + (defaultAddr.full_address || '').substring(0, 30);
            }
        } catch (e) {}
    },

    // ── Render Restaurants ──────────────────────
    renderRestaurants(list) {
        try {
            const grid    = document.getElementById('restaurants-grid');
            const countEl = document.getElementById('restaurant-count');
            if (!grid) return;

            if (!list || list.length === 0) {
                grid.innerHTML = Loading.empty({
                    icon: 'utensils',
                    title: 'No restaurants yet',
                    subtitle: 'Coming soon! New restaurants joining Cora daily.',
                });
                if (countEl) countEl.textContent = '';
                if (typeof lucide !== 'undefined') lucide.createIcons();
                return;
            }

            // Separate open vs closed
            const open = list.filter(r => parseInt(r.is_open));
            const closed = list.filter(r => !parseInt(r.is_open));
            const sortedList = [...open, ...closed];

            if (countEl) countEl.textContent = `${open.length} open`;
            grid.innerHTML = sortedList.map(r => RestaurantCard.render(r)).join('');

            // Activate Lucide icons inside cards
            if (typeof lucide !== 'undefined') lucide.createIcons();

            // Cache for offline
            try { localStorage.setItem('cora_restaurants_cache', JSON.stringify(list)); } catch (e) {}
        } catch (e) {
            console.error('renderRestaurants error:', e);
        }
    },

    // ── Filter Cuisine ──────────────────────────
    filterCuisine(cuisine, el) {
        try {
            this._currentCuisine = cuisine;

            // Update category pills UI
            if (el) {
                document.querySelectorAll('.category-pill').forEach(p => {
                    p.classList.remove('active');
                    p.setAttribute('aria-selected', 'false');
                });
                el.classList.add('active');
                el.setAttribute('aria-selected', 'true');
            } else {
                // From cuisine grid — update pills to match
                document.querySelectorAll('.category-pill').forEach(p => {
                    const label = p.querySelector('.cat-label')?.textContent;
                    const match = label === cuisine;
                    p.classList.toggle('active', match);
                    p.setAttribute('aria-selected', match ? 'true' : 'false');
                });
            }

            const filtered = (cuisine === 'All' || cuisine === 'Popular')
                ? this._restaurants
                : this._restaurants.filter(r =>
                    (r.cuisine_tags || '').toLowerCase().includes(cuisine.toLowerCase())
                );
            this.renderRestaurants(filtered);

            // Haptic feedback
            if (typeof App !== 'undefined') App.haptic();
        } catch (e) {
            console.error('filterCuisine error:', e);
        }
    },

    // ── Refresh ─────────────────────────────────
    async refresh() {
        if (this._isRefreshing) return;
        this._isRefreshing = true;
        try {
            if (typeof API !== 'undefined' && API.clearCache) API.clearCache();
            await this.render();
            App.showToast('Refreshed!', 'success');
        } finally {
            this._isRefreshing = false;
        }
    }
};
