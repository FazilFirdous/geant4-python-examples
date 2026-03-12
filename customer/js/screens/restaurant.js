/* ═══════════════════════════════════════
   CORA — Restaurant Screen
   Full restaurant view with menu, reviews,
   info, favorites, share, order type toggle
   ═══════════════════════════════════════ */
const RestaurantScreen = {
    restaurant: null,
    orderType: 'delivery',
    _menu: [],
    _vegOnly: false,
    _isFavorite: false,
    _reviews: [],

    // ── Render ──────────────────────────────────
    async render(id) {
        App.setScreen(`
            <div id="restaurant-screen">
                <!-- Cover Image -->
                <div style="height:220px;position:relative;overflow:hidden;">
                    <div id="restaurant-cover" style="width:100%;height:100%;background:linear-gradient(135deg,var(--berry),var(--berry-deep));display:flex;align-items:center;justify-content:center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
                    </div>
                    <!-- Gradient overlay for readability -->
                    <div style="position:absolute;bottom:0;left:0;right:0;height:80px;background:linear-gradient(transparent,rgba(0,0,0,0.4));"></div>
                    <!-- Top actions -->
                    <div style="position:absolute;top:0;left:0;right:0;padding:50px 16px 0;display:flex;justify-content:space-between;align-items:flex-start;">
                        <button class="screen-back-btn" onclick="history.back()" aria-label="Go back"><i data-lucide="arrow-left" style="width:18px;height:18px;"></i></button>
                        <div style="display:flex;gap:8px;">
                            <button class="screen-back-btn" id="share-btn" onclick="RestaurantScreen.shareRestaurant()" aria-label="Share restaurant"><i data-lucide="share-2" style="width:18px;height:18px;"></i></button>
                            <button class="screen-back-btn" id="fav-btn" onclick="RestaurantScreen.toggleFavorite()" aria-label="Toggle favorite"><i data-lucide="heart" style="width:18px;height:18px;" id="fav-icon"></i></button>
                        </div>
                    </div>
                </div>

                <!-- Restaurant Info Card -->
                <div style="padding:16px;margin-top:-30px;position:relative;z-index:5;">
                    <div class="card" style="padding:16px;" id="restaurant-info-card">
                        ${Loading.spinner()}
                    </div>
                </div>

                <!-- Menu -->
                <div id="menu-container" style="padding-bottom:80px;">
                    ${Loading.menuSkeleton(6)}
                </div>
            </div>
        `);

        CartBar.update();

        try {
            const res = await API.getRestaurant(id);
            if (!res.success) throw new Error(res.message);

            const { restaurant, menu, reviews } = res.data;
            this.restaurant = restaurant;
            this._reviews = reviews || [];
            App.currentRestaurant = restaurant;

            // Check favorite status
            this._isFavorite = this._checkFavorite(restaurant.id);
            this._updateFavoriteIcon();

            // Cover image
            const cover = document.getElementById('restaurant-cover');
            if (restaurant.cover_image) {
                cover.innerHTML = `<img src="${restaurant.cover_image}" alt="${restaurant.name}" style="width:100%;height:100%;object-fit:cover;" loading="lazy">`;
            }

            // Info card
            this._renderInfoCard(restaurant);

            // Build menu
            this._menu = menu;
            this._vegOnly = false;
            this.renderMenu(menu);

        } catch (e) {
            App.showToast(e.message || 'Failed to load restaurant', 'error');
            document.getElementById('menu-container').innerHTML = Loading.error(e.message, `RestaurantScreen.render(${id})`);
        }
    },

    // ── Info Card ────────────────────────────────
    _renderInfoCard(restaurant) {
        const rating = parseFloat(restaurant.rating) || 0;
        const ratingClass = rating >= 4.5 ? 'high' : (rating > 0 ? 'low' : 'none');
        const estDelivery = (restaurant.avg_prep_time_minutes || 30) + 10;
        const reviewCount = restaurant.total_reviews || this._reviews.length || 0;

        const infoCard = document.getElementById('restaurant-info-card');
        if (!infoCard) return;

        infoCard.innerHTML = `
            <!-- Name & Rating -->
            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div style="flex:1;min-width:0;">
                    <h2 style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--text);">${restaurant.name}</h2>
                    <p style="font-size:13px;color:var(--text-muted);margin-top:2px;">${restaurant.cuisine_tags || 'Multi-cuisine'}</p>
                </div>
                <div class="rating-badge ${ratingClass}" style="font-size:14px;padding:5px 10px;flex-shrink:0;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FFB800" stroke="#FFB800" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ${rating > 0 ? rating.toFixed(1) : 'New'}
                    ${reviewCount > 0 ? `<span style="font-size:11px;font-weight:400;opacity:0.8;">(${reviewCount})</span>` : ''}
                </div>
            </div>

            <!-- Quick Info -->
            <div style="display:flex;gap:14px;margin-top:12px;flex-wrap:wrap;">
                <span style="font-size:13px;color:var(--text-sub);display:inline-flex;align-items:center;gap:4px;">
                    <i data-lucide="clock" style="width:13px;height:13px;"></i> ${restaurant.avg_prep_time_minutes || 30} min prep
                </span>
                <span style="font-size:13px;color:var(--text-sub);display:inline-flex;align-items:center;gap:4px;">
                    <i data-lucide="bike" style="width:13px;height:13px;"></i> ~${estDelivery} min delivery
                </span>
                <span style="font-size:13px;color:var(--text-sub);display:inline-flex;align-items:center;gap:4px;">
                    <i data-lucide="indian-rupee" style="width:13px;height:13px;"></i> Min ₹${restaurant.min_order_amount || 100}
                </span>
            </div>

            ${restaurant.description ? `<p style="font-size:13px;color:var(--text-sub);margin-top:10px;border-top:1px solid var(--berry-border);padding-top:10px;line-height:1.5;">${restaurant.description}</p>` : ''}

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
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding:10px 12px;background:var(--berry-light);border-radius:10px;">
                <span style="font-size:13px;font-weight:600;color:var(--green);display:inline-flex;align-items:center;gap:4px;">
                    <i data-lucide="leaf" style="width:14px;height:14px;"></i> Veg Only
                </span>
                <div class="toggle-switch" id="veg-toggle" onclick="RestaurantScreen.toggleVeg()"></div>
            </div>

            ${!restaurant.is_open ? `
                <div style="background:var(--berry-light);border:1px solid var(--berry-border);border-radius:10px;padding:12px;margin-top:12px;text-align:center;">
                    <div style="font-weight:700;color:var(--berry);display:flex;align-items:center;justify-content:center;gap:6px;">
                        <i data-lucide="clock" style="width:16px;height:16px;"></i> Currently Closed
                    </div>
                    <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Opens at ${RestaurantCard.formatTime(restaurant.opens_at)}</div>
                    <button onclick="RestaurantScreen.notifyOpen(${restaurant.id})" class="btn-secondary" style="margin-top:10px;width:100%;padding:8px;">
                        <i data-lucide="bell" style="width:14px;height:14px;"></i> Notify Me When Open
                    </button>
                </div>
            ` : ''}
        `;

        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    // ── Order Type Toggle ───────────────────────
    setOrderType(type) {
        this.orderType = type;
        ['delivery', 'pickup'].forEach(t => {
            const btn = document.getElementById(`btn-${t}`);
            if (btn) {
                btn.className = `btn-${t === type ? 'primary' : 'secondary'}`;
                btn.style.flex = '1';
                btn.style.padding = '10px';
            }
        });
    },

    // ── Veg Toggle ──────────────────────────────
    toggleVeg() {
        this._vegOnly = !this._vegOnly;
        const toggle = document.getElementById('veg-toggle');
        if (toggle) toggle.classList.toggle('on', this._vegOnly);
        this.renderMenu(this._menu);
    },

    // ── Render Menu ─────────────────────────────
    renderMenu(menu) {
        const r = this.restaurant;
        const rid = r.id;
        const rname = r.name;

        let html = '';

        // Category tabs
        if (menu.length > 1) {
            html += `<div class="menu-category-tabs" role="tablist">
                ${menu.map((cat, i) => {
                    const items = this._vegOnly ? (cat.items || []).filter(it => it.is_veg) : (cat.items || []);
                    return items.length > 0 ? `<div class="menu-tab ${i === 0 ? 'active' : ''}" role="tab" onclick="RestaurantScreen.scrollToCategory('cat-${cat.id || i}', this)">${cat.name} <span style="font-size:11px;color:var(--text-muted);font-weight:400;">(${items.length})</span></div>` : '';
                }).join('')}
            </div>`;
        }

        // Menu items by category
        let hasItems = false;
        html += menu.map((cat, idx) => {
            let items = cat.items || [];
            if (this._vegOnly) items = items.filter(i => i.is_veg);
            if (!items.length) return '';
            hasItems = true;
            return `
                <div id="cat-${cat.id || idx}">
                    <div class="menu-category-title">${cat.name} <span style="font-size:12px;font-weight:400;color:var(--text-muted);">(${items.length})</span></div>
                    <div class="card" style="margin:0 16px 12px;border-radius:16px;overflow:hidden;">
                        ${items.map(item => MenuItem.render(item, rid, rname)).join('')}
                    </div>
                </div>
            `;
        }).join('');

        if (!hasItems) {
            html = Loading.empty({
                icon: 'leaf',
                title: 'No items found',
                subtitle: this._vegOnly ? 'Try turning off the Veg Only filter' : 'This restaurant has no items yet',
            });
        }

        // Reviews section
        if (this._reviews.length > 0) {
            html += this._renderReviewsSection();
        }

        document.getElementById('menu-container').innerHTML = `<div style="padding-bottom:80px;">${html}</div>`;

        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    // ── Reviews Section ─────────────────────────
    _renderReviewsSection() {
        const reviews = this._reviews.slice(0, 5);
        return `
            <div style="padding:16px;">
                <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
                    <i data-lucide="star" style="width:18px;height:18px;color:var(--star);"></i>
                    Reviews (${this._reviews.length})
                </div>
                ${reviews.map(r => `
                    <div style="background:var(--bg-card);border:1px solid var(--berry-border);border-radius:12px;padding:12px;margin-bottom:8px;">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                            <div class="avatar avatar-sm" style="font-size:11px;">${(r.user_name || 'U')[0].toUpperCase()}</div>
                            <div style="flex:1;">
                                <div style="font-size:13px;font-weight:600;">${r.user_name || 'Customer'}</div>
                                <div style="display:flex;gap:2px;margin-top:1px;">
                                    ${Array(5).fill(0).map((_, i) => `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="${i < (r.rating || 0) ? 'var(--star)' : 'none'}" stroke="var(--star)" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`).join('')}
                                </div>
                            </div>
                            <span style="font-size:11px;color:var(--text-muted);">${new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        ${r.comment ? `<p style="font-size:13px;color:var(--text-sub);line-height:1.4;">${r.comment}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    },

    // ── Scroll to Category ──────────────────────
    scrollToCategory(id, tabEl) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Update active tab
        if (tabEl) {
            document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
            tabEl.classList.add('active');
        }
    },

    // ── Favorites ───────────────────────────────
    _checkFavorite(id) {
        try {
            const favs = JSON.parse(localStorage.getItem('cora_favorites') || '[]');
            return favs.includes(id);
        } catch (e) { return false; }
    },

    toggleFavorite() {
        if (!this.restaurant) return;
        const id = this.restaurant.id;

        try {
            let favs = JSON.parse(localStorage.getItem('cora_favorites') || '[]');
            if (favs.includes(id)) {
                favs = favs.filter(f => f !== id);
                this._isFavorite = false;
                App.showToast('Removed from favorites', 'info');
            } else {
                favs.push(id);
                this._isFavorite = true;
                App.showToast('Added to favorites!', 'success');
            }
            localStorage.setItem('cora_favorites', JSON.stringify(favs));
            this._updateFavoriteIcon();
        } catch (e) {}
    },

    _updateFavoriteIcon() {
        const icon = document.getElementById('fav-icon');
        if (icon) {
            icon.setAttribute('fill', this._isFavorite ? 'white' : 'none');
            icon.style.color = 'white';
        }
    },

    // ── Share Restaurant ────────────────────────
    shareRestaurant() {
        if (!this.restaurant) return;

        const shareData = {
            title: `${this.restaurant.name} on Cora`,
            text: `Check out ${this.restaurant.name} on Cora - ${this.restaurant.cuisine_tags || 'Great food'}!`,
            url: `https://proteinstructure.fun/cora/customer/#restaurant/${this.restaurant.id}`,
        };

        if (navigator.share) {
            navigator.share(shareData).catch(() => {});
        } else {
            navigator.clipboard?.writeText(shareData.url).catch(() => {});
            App.showToast('Link copied!', 'success');
        }
    },

    // ── Notify When Open ────────────────────────
    notifyOpen(restaurantId) {
        const waitList = JSON.parse(localStorage.getItem('cora_notify_open') || '[]');
        if (!waitList.includes(restaurantId)) {
            waitList.push(restaurantId);
            localStorage.setItem('cora_notify_open', JSON.stringify(waitList));
        }
        App.showToast("We'll notify you when they open!", 'success');
    }
};
