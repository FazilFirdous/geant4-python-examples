const RestaurantScreen = {
    restaurant: null,
    orderType: 'delivery',

    async render(id) {
        App.setScreen(`
            <div id="restaurant-screen">
                <div style="height:220px;position:relative;overflow:hidden;">
                    <div id="restaurant-cover" style="width:100%;height:100%;background:linear-gradient(135deg,var(--berry),var(--berry-deep));display:flex;align-items:center;justify-content:center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
                    </div>
                    <div style="position:absolute;top:0;left:0;right:0;padding:50px 16px 0;display:flex;justify-content:space-between;align-items:flex-start;">
                        <button class="screen-back-btn" onclick="history.back()"><i data-lucide="arrow-left" style="width:18px;height:18px;"></i></button>
                        <button class="screen-back-btn" id="fav-btn"><i data-lucide="heart" style="width:18px;height:18px;"></i></button>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FFB800" stroke="#FFB800" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ${rating > 0 ? rating.toFixed(1) : 'New'}
                    </div>
                </div>
                <div style="display:flex;gap:16px;margin-top:10px;flex-wrap:wrap;">
                    <span style="font-size:13px;color:var(--text-sub);display:inline-flex;align-items:center;gap:4px;"><i data-lucide="clock" style="width:13px;height:13px;"></i> ${restaurant.avg_prep_time_minutes || 30} min prep</span>
                    <span style="font-size:13px;color:var(--text-sub);display:inline-flex;align-items:center;gap:4px;"><i data-lucide="bike" style="width:13px;height:13px;"></i> ~${estDelivery} min delivery</span>
                    <span style="font-size:13px;color:var(--text-sub);display:inline-flex;align-items:center;gap:4px;"><i data-lucide="home" style="width:13px;height:13px;"></i> Min ₹${restaurant.min_order_amount}</span>
                </div>
                ${restaurant.description ? `<p style="font-size:13px;color:var(--text-sub);margin-top:8px;border-top:1px solid var(--berry-border);padding-top:8px;">${restaurant.description}</p>` : ''}

                <!-- Delivery / Pickup Toggle -->
                <div style="display:flex;gap:8px;margin-top:12px;">
                    ${restaurant.accepts_delivery ? `
                        <button id="btn-delivery" class="btn-${this.orderType === 'delivery' ? 'primary' : 'secondary'}"
                                style="flex:1;padding:10px;" onclick="RestaurantScreen.setOrderType('delivery')">
                            <i data-lucide="bike" style="width:16px;height:16px;"></i> Delivery
                        </button>
                    ` : ''}
                    ${restaurant.accepts_pickup ? `
                        <button id="btn-pickup" class="btn-${this.orderType === 'pickup' ? 'primary' : 'secondary'}"
                                style="flex:1;padding:10px;" onclick="RestaurantScreen.setOrderType('pickup')">
                            <i data-lucide="walking" style="width:16px;height:16px;"></i> Pickup
                        </button>
                    ` : ''}
                </div>

                <!-- Veg Toggle -->
                <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding:10px;background:var(--berry-light);border-radius:10px;">
                    <span style="font-size:13px;font-weight:600;color:var(--green);display:inline-flex;align-items:center;gap:4px;"><i data-lucide="leaf" style="width:14px;height:14px;"></i> Veg Only</span>
                    <div class="toggle-switch" id="veg-toggle" onclick="RestaurantScreen.toggleVeg()"></div>
                </div>

                ${!restaurant.is_open ? `
                    <div style="background:var(--berry-light);border:1px solid var(--berry-border);border-radius:10px;padding:12px;margin-top:12px;text-align:center;">
                        <div style="font-weight:700;color:var(--berry);display:flex;align-items:center;justify-content:center;gap:6px;"><i data-lucide="clock" style="width:16px;height:16px;"></i> Currently Closed</div>
                        <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Opens at ${RestaurantCard.formatTime(restaurant.opens_at)}</div>
                        <button onclick="RestaurantScreen.notifyOpen(${restaurant.id})" class="btn-secondary" style="margin-top:10px;width:100%;padding:8px;"><i data-lucide="bell" style="width:14px;height:14px;"></i> Notify Me When Open</button>
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
            html = `<div class="empty-state"><div style="width:60px;height:60px;background:var(--berry-light);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;"><i data-lucide="leaf" style="width:30px;height:30px;color:var(--berry);"></i></div><h3>No items found</h3><p>Try turning off the Veg Only filter</p></div>`;
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
        App.showToast('We\'ll notify you when they open!', 'success');
    }
};
