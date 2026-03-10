const RestaurantScreen = {
    restaurant: null,
    orderType: 'delivery',

    async render(id) {
        App.setScreen(`
            <div id="restaurant-screen">
                <div style="height:220px;position:relative;overflow:hidden;">
                    <div id="restaurant-cover" style="width:100%;height:100%;background:linear-gradient(135deg,var(--berry),var(--berry-deep));display:flex;align-items:center;justify-content:center;font-size:80px;">🍽️</div>
                    <div style="position:absolute;top:0;left:0;right:0;padding:50px 16px 0;display:flex;justify-content:space-between;align-items:flex-start;">
                        <button class="screen-back-btn" onclick="history.back()">←</button>
                        <button class="screen-back-btn" id="fav-btn">🤍</button>
                    </div>
                </div>

                <div style="padding:16px;margin-top:-30px;position:relative;z-index:5;">
                    <div class="card" style="padding:16px;" id="restaurant-info-card">
                        ${Loading.spinner()}
                    </div>
                </div>

                <div id="menu-container" style="padding-bottom:80px;">
                    ${Loading.skeleton(4)}
                </div>
            </div>
        `);

        CartBar.update();

        try {
            const res = await API.getRestaurant(id);
            if (!res.success) throw new Error(res.message);

            const { restaurant, menu, reviews } = res.data;
            this.restaurant = restaurant;
            App.currentRestaurant = restaurant;

            // Cover image
            const cover = document.getElementById('restaurant-cover');
            if (restaurant.cover_image) {
                cover.innerHTML = `<img src="${restaurant.cover_image}" alt="${restaurant.name}" style="width:100%;height:100%;object-fit:cover;">`;
            }

            // Info card
            const rating     = parseFloat(restaurant.rating) || 0;
            const ratingClass = rating >= 4.5 ? 'high' : (rating > 0 ? 'low' : 'none');
            const estDelivery = (restaurant.avg_prep_time_minutes || 30) + 10;

            document.getElementById('restaurant-info-card').innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div>
                        <h2 style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;">${restaurant.name}</h2>
                        <p style="font-size:13px;color:var(--text-muted);margin-top:2px;">${restaurant.cuisine_tags || 'Multi-cuisine'}</p>
                    </div>
                    <div class="rating-badge ${ratingClass}" style="font-size:14px;padding:5px 10px;">
                        ⭐ ${rating > 0 ? rating.toFixed(1) : 'New'}
                    </div>
                </div>
                <div style="display:flex;gap:16px;margin-top:10px;flex-wrap:wrap;">
                    <span style="font-size:13px;color:var(--text-sub);">⏱ ${restaurant.avg_prep_time_minutes || 30} min prep</span>
                    <span style="font-size:13px;color:var(--text-sub);">🛵 ~${estDelivery} min delivery</span>
                    <span style="font-size:13px;color:var(--text-sub);">🏠 Min ₹${restaurant.min_order_amount}</span>
                </div>
                ${restaurant.description ? `<p style="font-size:13px;color:var(--text-sub);margin-top:8px;border-top:1px solid var(--berry-border);padding-top:8px;">${restaurant.description}</p>` : ''}

                <!-- Delivery / Pickup Toggle -->
                <div style="display:flex;gap:8px;margin-top:12px;">
                    ${restaurant.accepts_delivery ? `
                        <button id="btn-delivery" class="btn-${this.orderType === 'delivery' ? 'primary' : 'secondary'}"
                                style="flex:1;padding:10px;" onclick="RestaurantScreen.setOrderType('delivery')">
                            🛵 Delivery
                        </button>
                    ` : ''}
                    ${restaurant.accepts_pickup ? `
                        <button id="btn-pickup" class="btn-${this.orderType === 'pickup' ? 'primary' : 'secondary'}"
                                style="flex:1;padding:10px;" onclick="RestaurantScreen.setOrderType('pickup')">
                            🏃 Pickup
                        </button>
                    ` : ''}
                </div>

                <!-- Veg Toggle -->
                <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding:10px;background:var(--berry-light);border-radius:10px;">
                    <span style="font-size:13px;font-weight:600;color:var(--green);">🥗 Veg Only</span>
                    <div class="toggle-switch" id="veg-toggle" onclick="RestaurantScreen.toggleVeg()"></div>
                </div>

                ${!restaurant.is_open ? `
                    <div style="background:var(--berry-light);border:1px solid var(--berry-border);border-radius:10px;padding:12px;margin-top:12px;text-align:center;">
                        <div style="font-weight:700;color:var(--berry);">⏰ Currently Closed</div>
                        <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Opens at ${RestaurantCard.formatTime(restaurant.opens_at)}</div>
                        <button onclick="RestaurantScreen.notifyOpen(${restaurant.id})" class="btn-secondary" style="margin-top:10px;width:100%;padding:8px;">🔔 Notify Me When Open</button>
                    </div>
                ` : ''}
            `;

            // Build menu
            this._menu    = menu;
            this._vegOnly = false;
            this.renderMenu(menu);

        } catch (e) {
            App.showToast(e.message || 'Failed to load restaurant', 'error');
            document.getElementById('menu-container').innerHTML = Loading.error(e.message, `RestaurantScreen.render(${id})`);
        }
    },

    _menu: [],
    _vegOnly: false,

    setOrderType(type) {
        this.orderType = type;
        ['delivery','pickup'].forEach(t => {
            const btn = document.getElementById(`btn-${t}`);
            if (btn) {
                btn.className = `btn-${t === type ? 'primary' : 'secondary'}`;
                btn.style.flex = '1';
                btn.style.padding = '10px';
            }
        });
    },

    toggleVeg() {
        this._vegOnly = !this._vegOnly;
        const toggle = document.getElementById('veg-toggle');
        if (toggle) toggle.classList.toggle('on', this._vegOnly);
        this.renderMenu(this._menu);
    },

    renderMenu(menu) {
        const r     = this.restaurant;
        const rid   = r.id;
        const rname = r.name;

        let html = '';

        // Category tabs
        if (menu.length > 1) {
            html += `<div class="menu-category-tabs">
                ${menu.map((cat, i) => `<div class="menu-tab ${i===0?'active':''}" onclick="RestaurantScreen.scrollToCategory('cat-${cat.id || i}')">${cat.name}</div>`).join('')}
            </div>`;
        }

        // Menu items by category
        html += menu.map((cat, idx) => {
            let items = cat.items || [];
            if (this._vegOnly) items = items.filter(i => i.is_veg);
            if (!items.length) return '';
            return `
                <div id="cat-${cat.id || idx}">
                    <div class="menu-category-title">${cat.name}</div>
                    <div class="card" style="margin:0 16px 12px;border-radius:16px;overflow:hidden;">
                        ${items.map(item => MenuItem.render(item, rid, rname)).join('')}
                    </div>
                </div>
            `;
        }).join('');

        if (!html.trim() || html === '') {
            html = `<div class="empty-state"><div class="empty-state-emoji">🥗</div><h3>No items found</h3><p>Try turning off the Veg Only filter</p></div>`;
        }

        document.getElementById('menu-container').innerHTML = `<div style="padding-bottom:80px;">${html}</div>`;
    },

    scrollToCategory(id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    notifyOpen(restaurantId) {
        const waitList = JSON.parse(localStorage.getItem('cora_notify_open') || '[]');
        if (!waitList.includes(restaurantId)) {
            waitList.push(restaurantId);
            localStorage.setItem('cora_notify_open', JSON.stringify(waitList));
        }
        App.showToast('We\'ll notify you when they open! 🔔', 'success');
    }
};
