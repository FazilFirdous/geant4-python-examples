const HomeScreen = {
    async render() {
        App.setScreen(`
            <div id="home-screen">
                <div class="screen-header">
                    <div style="display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1;">
                        <div>
                            <div class="header-logo">Cora 🍽️</div>
                            <div class="header-subtitle">Kulgam's Food, Delivered</div>
                        </div>
                        <div style="text-align:right;color:white;font-size:13px;">
                            <div>Hi, ${App.user?.name || 'Guest'} 👋</div>
                        </div>
                    </div>
                    <div class="header-address-bar" onclick="window.location.hash='#profile'">
                        📍 <span>Kulgam Town</span>
                        <span style="margin-left:auto;opacity:0.7;">▼</span>
                    </div>
                    <div class="header-search" onclick="window.location.hash='#search'">
                        🔍 <span style="color:rgba(255,255,255,0.7);font-size:14px;">Search restaurants or dishes...</span>
                    </div>
                </div>

                <!-- Category Pills -->
                <div class="category-pills" id="category-pills">
                    ${['All','Wazwan','Bakery','Burgers','Pizza','Chinese','Snacks','Sweets','Biryani'].map((c,i) =>
                        `<div class="category-pill ${i===0?'active':''}" onclick="HomeScreen.filterCuisine('${c}', this)">${c === 'All' ? '🍽️ All' : c}</div>`
                    ).join('')}
                </div>

                <!-- Promo Carousel -->
                <div class="carousel-wrap" id="carousel-wrap">
                    <div style="display:flex;gap:8px;">
                        ${Loading.skeleton(1).replace('skeleton-card','skeleton-card').replace('height:130px','height:140px;border-radius:16px;')}
                    </div>
                </div>

                <!-- Restaurants -->
                <div class="section-header">
                    <span class="section-title">Restaurants</span>
                    <span id="restaurant-count" style="font-size:13px;color:var(--text-muted);">Loading...</span>
                </div>

                <div class="restaurants-grid" id="restaurants-grid">
                    ${Loading.skeleton(4)}
                </div>
            </div>
        `);

        CartBar.update();

        // Load data in parallel
        try {
            const [bannersRes, restaurantsRes] = await Promise.all([
                API.getBanners().catch(() => ({ success: false, data: [] })),
                API.getRestaurants().catch(() => ({ success: false, data: [] }))
            ]);

            // Render carousel
            const banners = bannersRes.data || [];
            if (banners.length > 0) {
                document.getElementById('carousel-wrap').innerHTML = '<div id="promo-carousel"></div>';
                PromoCarousel.init(banners, 'promo-carousel');
            } else {
                document.getElementById('carousel-wrap').style.display = 'none';
            }

            // Render restaurants
            HomeScreen._restaurants = restaurantsRes.data || [];
            HomeScreen.renderRestaurants(HomeScreen._restaurants);

        } catch (e) {
            document.getElementById('restaurants-grid').innerHTML = Loading.error('Failed to load restaurants', 'HomeScreen.render()');
        }
    },

    _restaurants: [],
    _currentCuisine: 'All',

    renderRestaurants(list) {
        const grid = document.getElementById('restaurants-grid');
        const countEl = document.getElementById('restaurant-count');
        if (!grid) return;

        if (!list || list.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-emoji">🍽️</div>
                    <h3>No restaurants found</h3>
                    <p>Try a different search or check back later!</p>
                </div>
            `;
            if (countEl) countEl.textContent = '';
            return;
        }

        if (countEl) countEl.textContent = `${list.length} restaurants`;
        grid.innerHTML = list.map(r => RestaurantCard.render(r)).join('');

        // Cache for offline
        localStorage.setItem('cora_restaurants_cache', JSON.stringify(list));
    },

    filterCuisine(cuisine, el) {
        this._currentCuisine = cuisine;
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        el.classList.add('active');

        const filtered = cuisine === 'All'
            ? this._restaurants
            : this._restaurants.filter(r => r.cuisine_tags?.toLowerCase().includes(cuisine.toLowerCase()));
        this.renderRestaurants(filtered);
    }
};
