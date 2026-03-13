/* ═══════════════════════════════════════
   CORA — Orders Screen
   Full order history with filters, search,
   active order tracking, and reorder
   ═══════════════════════════════════════ */
const OrdersScreen = {
    _orders: [],
    _filter: 'all', // all, active, delivered, cancelled
    _searchQuery: '',

    // ── Status Labels ───────────────────────────
    _statusLabels: {
        placed: 'Order Placed',
        accepted: 'Accepted',
        preparing: 'Preparing',
        ready: 'Ready for Pickup',
        picked_up: 'Picked Up',
        on_the_way: 'On the Way',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
        delivery_issue: 'Delivery Issue'
    },

    _statusIcons: {
        placed: 'clock',
        accepted: 'check-circle',
        preparing: 'chef-hat',
        ready: 'package-check',
        picked_up: 'bike',
        on_the_way: 'truck',
        delivered: 'circle-check-big',
        cancelled: 'x-circle',
        delivery_issue: 'alert-triangle'
    },

    _activeStatuses: ['placed', 'accepted', 'preparing', 'ready', 'picked_up', 'on_the_way', 'delivery_issue'],

    // ── Render ──────────────────────────────────
    async render() {
        App.setScreen(`
            <div id="orders-screen">
                <!-- Header -->
                <div class="screen-header">
                    <div style="position:relative;z-index:1;">
                        <h2 style="color:white;font-family:'Playfair Display',serif;font-size:24px;font-weight:700;">My Orders</h2>
                        <p style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:2px;">Track and manage your orders</p>
                    </div>
                </div>

                <!-- Filter Tabs -->
                <div class="order-filter-tabs" style="display:flex;background:white;border-bottom:1px solid var(--berry-border);overflow-x:auto;scrollbar-width:none;">
                    ${this._renderFilterTabs()}
                </div>

                <!-- Search Orders -->
                <div style="padding:12px 16px;background:white;border-bottom:1px solid var(--berry-border);">
                    <div style="display:flex;align-items:center;gap:8px;background:var(--berry-light);border-radius:10px;padding:8px 12px;">
                        <i data-lucide="search" style="width:14px;height:14px;color:var(--text-muted);flex-shrink:0;"></i>
                        <input type="text" id="order-search" placeholder="Search by restaurant or order number..."
                               style="border:none;outline:none;background:transparent;font-size:13px;width:100%;font-family:'DM Sans',sans-serif;color:var(--text);"
                               oninput="OrdersScreen.onSearchOrders(this.value)" autocomplete="off">
                    </div>
                </div>

                <!-- Orders Body -->
                <div id="orders-body" style="padding-bottom:80px;">
                    ${Loading.orderSkeleton(4)}
                </div>
            </div>
        `);

        await this.loadOrders();
    },

    // ── Filter Tabs HTML ────────────────────────
    _renderFilterTabs() {
        const tabs = [
            { key: 'all', label: 'All', icon: 'list' },
            { key: 'active', label: 'Active', icon: 'zap' },
            { key: 'delivered', label: 'Delivered', icon: 'check-circle' },
            { key: 'cancelled', label: 'Cancelled', icon: 'x-circle' },
        ];

        return tabs.map(t => `
            <div class="order-filter-tab ${this._filter === t.key ? 'active' : ''}"
                 onclick="OrdersScreen.setFilter('${t.key}')"
                 style="display:flex;align-items:center;gap:5px;padding:12px 16px;font-size:13px;font-weight:${this._filter === t.key ? '700' : '500'};color:${this._filter === t.key ? 'var(--berry)' : 'var(--text-muted)'};cursor:pointer;white-space:nowrap;border-bottom:2px solid ${this._filter === t.key ? 'var(--berry)' : 'transparent'};transition:all 0.25s ease;">
                <i data-lucide="${t.icon}" style="width:14px;height:14px;"></i> ${t.label}
                ${t.key === 'active' && this._getActiveCount() > 0 ? `<span style="background:var(--berry);color:white;font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;margin-left:2px;">${this._getActiveCount()}</span>` : ''}
            </div>
        `).join('');
    },

    _getActiveCount() {
        return this._orders.filter(o => this._activeStatuses.includes(o.status)).length;
    },

    // ── Set Filter ──────────────────────────────
    setFilter(filter) {
        this._filter = filter;

        // Update tabs UI
        const tabsContainer = document.querySelector('.order-filter-tabs');
        if (tabsContainer) {
            tabsContainer.innerHTML = this._renderFilterTabs();
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        this._renderOrdersList();
    },

    // ── Search Orders ───────────────────────────
    onSearchOrders(query) {
        this._searchQuery = query.toLowerCase().trim();
        this._renderOrdersList();
    },

    // ── Load Orders from API ────────────────────
    async loadOrders() {
        try {
            const res = await API.getOrders();
            this._orders = res.data || [];

            if (!this._orders.length) {
                document.getElementById('orders-body').innerHTML = Loading.empty({
                    icon: 'package',
                    title: 'No orders yet',
                    subtitle: 'Your first delicious meal is just a tap away!',
                    actionText: 'Browse Restaurants',
                    actionFn: "window.location.hash='#home'"
                });
                if (typeof lucide !== 'undefined') lucide.createIcons();
                return;
            }

            this._renderOrdersList();

        } catch (e) {
            document.getElementById('orders-body').innerHTML = Loading.error(e.message, 'OrdersScreen.render()');
        }
    },

    // ── Render Orders List ──────────────────────
    _renderOrdersList() {
        const body = document.getElementById('orders-body');
        if (!body) return;

        let orders = [...this._orders];

        // Apply filter
        switch (this._filter) {
            case 'active':
                orders = orders.filter(o => this._activeStatuses.includes(o.status));
                break;
            case 'delivered':
                orders = orders.filter(o => o.status === 'delivered');
                break;
            case 'cancelled':
                orders = orders.filter(o => o.status === 'cancelled');
                break;
        }

        // Apply search
        if (this._searchQuery) {
            orders = orders.filter(o =>
                (o.restaurant_name || '').toLowerCase().includes(this._searchQuery) ||
                (o.order_number || '').toLowerCase().includes(this._searchQuery) ||
                (o.items || []).some(i => (i.item_name || '').toLowerCase().includes(this._searchQuery))
            );
        }

        if (!orders.length) {
            body.innerHTML = `
                <div class="empty-state" style="margin-top:40px;">
                    <div style="width:60px;height:60px;background:var(--berry-light);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
                        <i data-lucide="search-x" style="width:28px;height:28px;color:var(--berry);"></i>
                    </div>
                    <h3 style="font-family:'Playfair Display',serif;font-size:18px;">No orders found</h3>
                    <p style="font-size:13px;color:var(--text-muted);">${this._searchQuery ? 'Try a different search term' : 'No orders in this category'}</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        // Separate active from past
        const active = orders.filter(o => this._activeStatuses.includes(o.status));
        const past = orders.filter(o => !this._activeStatuses.includes(o.status));

        let html = '';

        if (active.length && this._filter !== 'delivered' && this._filter !== 'cancelled') {
            html += `
                <div style="padding:16px 16px 8px;font-family:'Playfair Display',serif;font-size:18px;font-weight:700;display:flex;align-items:center;gap:8px;">
                    <span style="width:10px;height:10px;background:var(--berry);border-radius:50%;display:inline-block;animation:pulse 1.5s infinite;"></span>
                    Active Orders (${active.length})
                </div>
            `;
            html += active.map(o => this._orderCardHtml(o)).join('');
        }

        if (past.length) {
            html += `<div style="padding:16px 16px 8px;font-family:'Playfair Display',serif;font-size:18px;font-weight:700;">Past Orders</div>`;

            // Group by month
            const grouped = this._groupByMonth(past);
            for (const [month, monthOrders] of Object.entries(grouped)) {
                html += `<div style="padding:8px 16px 4px;font-size:12px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">${month}</div>`;
                html += monthOrders.map(o => this._orderCardHtml(o)).join('');
            }
        }

        body.innerHTML = `<div>${html}</div>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    // ── Group orders by month ───────────────────
    _groupByMonth(orders) {
        const groups = {};
        orders.forEach(o => {
            const d = new Date(o.placed_at);
            const key = d.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
            if (!groups[key]) groups[key] = [];
            groups[key].push(o);
        });
        return groups;
    },

    // ── Order Card HTML ─────────────────────────
    _orderCardHtml(o) {
        const isActive = this._activeStatuses.includes(o.status);
        const statusLabel = this._statusLabels[o.status] || o.status;
        const statusIcon = this._statusIcons[o.status] || 'package';
        const date = new Date(o.placed_at);
        const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

        const itemsSummary = (o.items || []).slice(0, 3).map(i => `${i.quantity}x ${i.item_name}`).join(', ');
        const moreCount = (o.items || []).length > 3 ? (o.items.length - 3) : 0;

        return `
            <div class="order-card" onclick="window.location.hash='#order/${o.id}'" style="${isActive ? 'border-left:3px solid var(--berry);' : ''}">
                <!-- Restaurant & Status -->
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                    <div style="flex:1;min-width:0;">
                        <div style="font-size:14px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${o.restaurant_name}</div>
                        <div style="font-size:12px;color:var(--text-muted);margin-top:1px;">${o.order_number}</div>
                    </div>
                    <span class="order-status-badge status-${o.status}" style="display:inline-flex;align-items:center;gap:3px;flex-shrink:0;">
                        <i data-lucide="${statusIcon}" style="width:11px;height:11px;"></i> ${statusLabel}
                    </span>
                </div>

                <!-- Items -->
                <div style="font-size:13px;color:var(--text-sub);margin-top:8px;line-height:1.5;">
                    ${itemsSummary}${moreCount > 0 ? ` <span style="color:var(--berry);font-weight:600;">+${moreCount} more</span>` : ''}
                </div>

                <!-- Footer: Price, Date, Actions -->
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:10px;border-top:1px dashed var(--berry-border);">
                    <div style="font-size:16px;font-weight:700;color:var(--text);">₹${parseFloat(o.total_amount).toFixed(0)}</div>
                    <div style="display:flex;align-items:center;gap:8px;">
                        ${o.status === 'delivered' ? `
                            <button class="btn-secondary" style="padding:6px 14px;font-size:12px;border-radius:8px;" onclick="event.stopPropagation();OrdersScreen.reorder(${o.id})">
                                <i data-lucide="repeat" style="width:12px;height:12px;"></i> Reorder
                            </button>
                        ` : ''}
                        ${isActive ? `
                            <button class="btn-primary" style="padding:6px 14px;font-size:12px;border-radius:8px;" onclick="event.stopPropagation();window.location.hash='#tracking/${o.id}'">
                                <i data-lucide="map-pin" style="width:12px;height:12px;"></i> Track
                            </button>
                        ` : ''}
                        <span style="font-size:11px;color:var(--text-muted);white-space:nowrap;">${dateStr}, ${timeStr}</span>
                    </div>
                </div>

                ${isActive ? `
                    <!-- Active Order Progress -->
                    <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--berry-border);">
                        ${this._renderMiniTimeline(o.status)}
                    </div>
                ` : ''}
            </div>
        `;
    },

    // ── Mini Timeline for Active Orders ─────────
    _renderMiniTimeline(currentStatus) {
        const steps = ['placed', 'accepted', 'preparing', 'ready', 'on_the_way', 'delivered'];
        const currentIdx = steps.indexOf(currentStatus);

        return `
            <div style="display:flex;align-items:center;gap:4px;">
                ${steps.map((s, i) => {
                    const isDone = i <= currentIdx;
                    const isCurrent = i === currentIdx;
                    return `
                        <div style="flex:1;height:4px;border-radius:2px;background:${isDone ? 'var(--berry)' : 'var(--berry-border)'};${isCurrent ? 'animation:pulse 1.5s infinite;' : ''}transition:background 0.3s ease;"></div>
                    `;
                }).join('')}
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:4px;">
                <span style="font-size:10px;color:var(--text-muted);">Placed</span>
                <span style="font-size:10px;color:var(--text-muted);">Delivered</span>
            </div>
        `;
    },

    // ── Reorder ─────────────────────────────────
    async reorder(orderId) {
        try {
            const res = await API.getOrder(orderId);
            if (!res.success) throw new Error(res.message);
            const order = res.data;

            // Clear cart and add all items
            App.clearCart();
            (order.items || []).forEach(item => {
                App.cart.push({
                    id: item.menu_item_id,
                    name: item.item_name,
                    price: parseFloat(item.item_price),
                    quantity: item.quantity,
                    restaurantId: order.restaurant_id,
                    restaurantName: order.restaurant_name,
                    is_veg: 0
                });
            });
            App.saveCart();
            CartBar.update();
            App.showToast('Items added to cart!', 'success');
            window.location.hash = '#cart';
        } catch (e) {
            App.showToast('Failed to reorder', 'error');
        }
    },

    // ── Rate Order ──────────────────────────────
    showRating(orderId) {
        const overlay = document.createElement('div');
        overlay.id = 'rating-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(4px);';
        overlay.innerHTML = `
            <div style="background:white;border-radius:20px;padding:24px;width:90%;max-width:340px;text-align:center;">
                <h3 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;margin-bottom:4px;">Rate Your Order</h3>
                <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">How was your experience?</p>

                <div id="rating-stars" style="display:flex;justify-content:center;gap:8px;margin-bottom:16px;">
                    ${[1,2,3,4,5].map(i => `
                        <button onclick="OrdersScreen._selectRating(${i})" data-rating="${i}" style="background:none;border:none;cursor:pointer;padding:4px;transition:transform 0.2s ease;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--star)" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </button>
                    `).join('')}
                </div>

                <textarea id="rating-comment" placeholder="Leave a comment (optional)..." style="width:100%;border:1.5px solid var(--berry-border);border-radius:12px;padding:10px 14px;font-size:14px;font-family:'DM Sans',sans-serif;resize:vertical;min-height:60px;outline:none;transition:border-color 0.2s;"></textarea>

                <div style="display:flex;gap:8px;margin-top:16px;">
                    <button class="btn-secondary" onclick="document.getElementById('rating-overlay').remove()" style="flex:1;padding:12px;">Cancel</button>
                    <button class="btn-primary" id="submit-rating-btn" onclick="OrdersScreen._submitRating(${orderId})" style="flex:1;padding:12px;" disabled>Submit</button>
                </div>
            </div>
        `;
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
        document.body.appendChild(overlay);
        OrdersScreen._selectedRating = 0;
    },

    _selectedRating: 0,

    _selectRating(rating) {
        this._selectedRating = rating;
        const stars = document.querySelectorAll('#rating-stars button');
        stars.forEach((star, i) => {
            const svg = star.querySelector('svg');
            if (i < rating) {
                svg.setAttribute('fill', 'var(--star)');
                star.style.transform = 'scale(1.15)';
            } else {
                svg.setAttribute('fill', 'none');
                star.style.transform = 'scale(1)';
            }
        });
        const btn = document.getElementById('submit-rating-btn');
        if (btn) btn.disabled = false;
    },

    async _submitRating(orderId) {
        if (!this._selectedRating) return;
        const comment = document.getElementById('rating-comment')?.value?.trim() || '';

        try {
            const btn = document.getElementById('submit-rating-btn');
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = Loading.inlineSpinner(16, 'white') + ' Submitting...';
            }

            await API.submitReview({
                order_id: orderId,
                rating: this._selectedRating,
                comment
            });

            document.getElementById('rating-overlay')?.remove();
            App.showToast('Thank you for your review!', 'success');
        } catch (e) {
            App.showToast(e.message || 'Failed to submit review', 'error');
            const btn = document.getElementById('submit-rating-btn');
            if (btn) { btn.disabled = false; btn.textContent = 'Submit'; }
        }
    }
};
