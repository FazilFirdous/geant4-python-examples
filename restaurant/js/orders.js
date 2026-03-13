/* ═══ Cora Restaurant — Orders Tab (Production) ═══ */

const OrdersTab = {
    orders: [],
    filteredOrders: [],
    prevOrderIds: new Set(),
    currentFilter: 'active',
    searchQuery: '',
    _timers: new Map(),
    _audioPlayed: false,

    /* ── Render ── */
    async render() {
        document.getElementById('tab-content').innerHTML = `
            <div class="orders-container">
                <!-- Search Bar -->
                <div class="orders-search-bar">
                    <div class="search-input-wrap">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <input type="text" id="orders-search" placeholder="Search by order #, customer, item..."
                            oninput="OrdersTab.onSearch(this.value)" autocomplete="off">
                    </div>
                </div>

                <!-- Status Filter Tabs -->
                <div class="status-filter-row" role="tablist" aria-label="Order status filters">
                    ${this._renderFilterTabs()}
                </div>

                <!-- Orders Count -->
                <div id="orders-count" class="orders-count-bar"></div>

                <!-- Orders List -->
                <div id="orders-list" aria-live="polite">
                    <div class="tab-loading">
                        <div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div>
                    </div>
                </div>
            </div>
        `;
        await this.loadOrders('');
    },

    _renderFilterTabs() {
        const filters = [
            { key: 'active', label: 'Active', icon: '🔴' },
            { key: 'placed', label: 'New' },
            { key: 'accepted', label: 'Accepted' },
            { key: 'preparing', label: 'Preparing' },
            { key: 'ready', label: 'Ready' },
            { key: 'delivered', label: 'Delivered' },
            { key: 'cancelled', label: 'Cancelled' }
        ];
        return filters.map(f => `
            <button class="status-filter-chip ${f.key === this.currentFilter ? 'active' : ''}"
                data-filter="${f.key}" role="tab" aria-selected="${f.key === this.currentFilter}"
                onclick="OrdersTab.filterOrders('${f.key}', this)">
                ${f.label}<span class="filter-count" id="count-${f.key}"></span>
            </button>
        `).join('');
    },

    /* ── Data Loading ── */
    async loadOrders(status) {
        try {
            const res = await RApi.getOrders(status);
            this.orders = res?.data || [];

            // Track for new order detection
            const currentIds = new Set(this.orders.map(o => o.id));
            if (this.prevOrderIds.size > 0) {
                const newOrders = [...currentIds].filter(id => !this.prevOrderIds.has(id));
                if (newOrders.length > 0) {
                    Dashboard.startAlert();
                    const badge = document.getElementById('orders-badge');
                    if (badge) { badge.textContent = newOrders.length; badge.style.display = 'block'; }
                    Dashboard.showToast(`${newOrders.length} new order${newOrders.length > 1 ? 's' : ''}!`, 'success');
                }
            }
            this.prevOrderIds = currentIds;

            this._updateFilterCounts();
            this._applyFilters();
        } catch(e) {
            document.getElementById('orders-list').innerHTML = `
                <div class="orders-error">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                    <p>Failed to load orders</p>
                    <button class="btn-secondary" style="padding:8px 16px;font-size:13px;" onclick="OrdersTab.loadOrders('')">Retry</button>
                </div>`;
        }
    },

    async pollNewOrders() {
        try {
            const res = await RApi.getOrders('');
            const newOrders = res?.data || [];
            const newIds = new Set(newOrders.map(o => o.id));

            if (this.prevOrderIds.size > 0) {
                const added = [...newIds].filter(id => !this.prevOrderIds.has(id));
                if (added.length > 0) {
                    Dashboard.startAlert();
                    this.orders = newOrders;
                    this._updateFilterCounts();
                    this._applyFilters();
                    const badge = document.getElementById('orders-badge');
                    if (badge) { badge.textContent = added.length; badge.style.display = 'block'; }
                }

                // Also refresh if any order status changed
                const existingIds = [...newIds].filter(id => this.prevOrderIds.has(id));
                const changed = existingIds.some(id => {
                    const oldOrder = this.orders.find(o => o.id === id);
                    const newOrder = newOrders.find(o => o.id === id);
                    return oldOrder?.status !== newOrder?.status;
                });
                if (changed) {
                    this.orders = newOrders;
                    this._updateFilterCounts();
                    this._applyFilters();
                }
            }
            this.prevOrderIds = newIds;
        } catch(e) {}
    },

    /* ── Filtering ── */
    _updateFilterCounts() {
        const counts = {};
        this.orders.forEach(o => {
            counts[o.status] = (counts[o.status] || 0) + 1;
        });
        const activeCount = this.orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;
        counts.active = activeCount;

        ['active', 'placed', 'accepted', 'preparing', 'ready', 'delivered', 'cancelled'].forEach(key => {
            const el = document.getElementById(`count-${key}`);
            if (el) el.textContent = counts[key] ? ` (${counts[key]})` : '';
        });
    },

    filterOrders(status, el) {
        this.currentFilter = status;
        document.querySelectorAll('.status-filter-chip').forEach(t => {
            t.classList.toggle('active', t.dataset.filter === status);
            t.setAttribute('aria-selected', t.dataset.filter === status);
        });
        this._applyFilters();
    },

    onSearch(query) {
        this.searchQuery = query.toLowerCase().trim();
        this._applyFilters();
    },

    _applyFilters() {
        let filtered = [...this.orders];

        // Status filter
        if (this.currentFilter === 'active') {
            filtered = filtered.filter(o => !['delivered', 'cancelled'].includes(o.status));
        } else {
            filtered = filtered.filter(o => o.status === this.currentFilter);
        }

        // Search filter
        if (this.searchQuery) {
            filtered = filtered.filter(o =>
                (o.order_number || '').toLowerCase().includes(this.searchQuery) ||
                (o.customer_name || '').toLowerCase().includes(this.searchQuery) ||
                (o.customer_phone || '').includes(this.searchQuery) ||
                (o.items || []).some(i => (i.item_name || '').toLowerCase().includes(this.searchQuery))
            );
        }

        this.filteredOrders = filtered;
        this._renderOrdersList(filtered);
    },

    /* ── Render Orders ── */
    _renderOrdersList(orders) {
        const el = document.getElementById('orders-list');
        if (!el) return;

        // Clear old timers
        this._timers.forEach(t => clearInterval(t));
        this._timers.clear();

        const countEl = document.getElementById('orders-count');
        if (countEl) {
            countEl.textContent = orders.length ? `${orders.length} order${orders.length !== 1 ? 's' : ''}` : '';
        }

        if (!orders.length) {
            el.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--berry)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/></svg>
                    </div>
                    <h3 style="font-family:'Playfair Display',serif;font-size:20px;">No orders found</h3>
                    <p style="color:var(--text-muted);">${this.searchQuery ? 'Try a different search term' : 'New orders will appear here'}</p>
                </div>
            `;
            return;
        }

        // Group: new orders on top, then by timestamp desc
        const sorted = orders.sort((a, b) => {
            const priority = { placed: 0, accepted: 1, preparing: 2, ready: 3 };
            const pa = priority[a.status] ?? 99;
            const pb = priority[b.status] ?? 99;
            if (pa !== pb) return pa - pb;
            return new Date(b.placed_at || b.created_at) - new Date(a.placed_at || a.created_at);
        });

        el.innerHTML = sorted.map(o => this._orderCardHtml(o)).join('');

        // Start timers for active orders
        sorted.filter(o => ['placed', 'accepted', 'preparing'].includes(o.status)).forEach(o => {
            this._startTimer(o.id, o.placed_at);
        });
    },

    _orderCardHtml(o) {
        const isNew = o.status === 'placed';
        const statusConfig = {
            placed:    { color: '#E65100', bg: '#FFF3E0', label: 'NEW ORDER', icon: '🔔' },
            accepted:  { color: '#1565C0', bg: '#E3F2FD', label: 'ACCEPTED',  icon: '✓' },
            preparing: { color: '#F57F17', bg: '#FFF8E1', label: 'PREPARING', icon: '🍳' },
            ready:     { color: '#2E7D32', bg: '#E8F5E9', label: 'READY',     icon: '✅' },
            picked_up: { color: '#6A1B9A', bg: '#F3E5F5', label: 'PICKED UP', icon: '🏍️' },
            on_the_way:{ color: '#00838F', bg: '#E0F7FA', label: 'ON THE WAY',icon: '🚀' },
            delivered: { color: '#1DB954', bg: '#E8F8EF', label: 'DELIVERED', icon: '📦' },
            cancelled: { color: '#E53935', bg: '#FFEBEE', label: 'CANCELLED', icon: '✕' }
        };
        const sc = statusConfig[o.status] || statusConfig.placed;

        const waLink = `https://wa.me/${(o.customer_phone||'').replace(/\D/g,'')}?text=${encodeURIComponent('Hi! Update on your CORA order #' + o.order_number)}`;
        const itemCount = (o.items || []).reduce((s, i) => s + parseInt(i.quantity || 1), 0);
        const actionBtns = this._getActionButtons(o);

        return `
            <div class="order-card ${isNew ? 'new-order' : ''}" id="order-${o.id}" role="article" aria-label="Order ${o.order_number}">
                <div class="order-card-header">
                    <div>
                        <div class="order-number">#${o.order_number}</div>
                        <div class="order-header-sub">
                            <span class="order-type-badge">${(o.order_type || 'delivery').toUpperCase()}</span>
                            <span>${(o.payment_method || 'cod').toUpperCase()}</span>
                            <span>${itemCount} item${itemCount !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div id="timer-${o.id}" class="order-timer"></div>
                        <div class="order-status-pill" style="background:${sc.bg};color:${sc.color};">
                            ${sc.icon} ${sc.label}
                        </div>
                    </div>
                </div>

                <div class="order-body">
                    <!-- Customer Info Row -->
                    <div class="order-customer-row">
                        <div class="order-customer-info">
                            <div class="order-customer-avatar">${(o.customer_name || 'C')[0].toUpperCase()}</div>
                            <div>
                                <div class="order-customer-name">${o.customer_name || 'Customer'}</div>
                                <div class="order-customer-phone">${o.customer_phone || ''}</div>
                            </div>
                        </div>
                        <div class="order-total">${Dashboard.formatCurrency(o.total_amount)}</div>
                    </div>

                    <!-- Items List -->
                    <div class="order-items-list">
                        ${(o.items || []).map(i => `
                            <div class="order-item-row">
                                <div class="order-item-qty">${i.quantity}×</div>
                                <div class="order-item-name">${i.item_name}</div>
                                <div class="order-item-price">₹${(i.item_price * i.quantity).toFixed(0)}</div>
                            </div>
                        `).join('')}
                    </div>

                    ${o.special_instructions ? `
                        <div class="order-note">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
                            <span>${o.special_instructions}</span>
                        </div>
                    ` : ''}

                    <!-- Meta info -->
                    <div class="order-meta">
                        ${o.delivery_address ? `
                            <span class="order-meta-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                ${o.delivery_address}
                            </span>` : ''}
                        <span class="order-meta-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            ${Dashboard.formatTime(o.placed_at || o.created_at)}
                        </span>
                        ${o.delivery_boy_name ? `
                            <span class="order-meta-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
                                ${o.delivery_boy_name}
                            </span>` : ''}
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="order-actions">
                    ${actionBtns}
                    <a href="${waLink}" target="_blank" rel="noopener" class="wa-btn" aria-label="Contact customer on WhatsApp">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.111.553 4.094 1.518 5.818L.057 23.536a.5.5 0 00.607.607l5.718-1.461A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.94 0-3.79-.526-5.408-1.5l-.388-.237-4.021 1.054 1.054-4.021-.237-.388A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                    </a>
                    <button class="order-print-btn" onclick="OrdersTab.printOrder(${o.id})" aria-label="Print order" title="Print">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                    </button>
                </div>
            </div>
        `;
    },

    _getActionButtons(o) {
        const btn = (label, cls, action) =>
            `<button class="${cls}" style="flex:1;padding:10px;font-size:13px;" onclick="${action}">${label}</button>`;

        switch(o.status) {
            case 'placed':
                return `
                    ${btn('Accept Order', 'btn-success', `OrdersTab.acceptOrder(${o.id})`)}
                    ${btn('Reject', 'btn-danger', `OrdersTab.rejectOrder(${o.id})`)}
                `;
            case 'accepted':
                return btn('Start Preparing', 'btn-primary', `OrdersTab.updateStatus(${o.id},'preparing')`);
            case 'preparing':
                return btn('Mark Ready', 'btn-primary', `OrdersTab.updateStatus(${o.id},'ready')`);
            case 'ready':
                if (o.order_type === 'pickup') {
                    return btn('Mark Picked Up', 'btn-success', `OrdersTab.updateStatus(${o.id},'delivered')`);
                }
                return btn('Delivery Options', 'btn-primary', `OrdersTab.showDeliveryOptions(${o.id})`);
            case 'picked_up':
            case 'on_the_way':
                return btn('Mark Delivered', 'btn-success', `OrdersTab.updateStatus(${o.id},'delivered')`);
            default:
                return '';
        }
    },

    /* ── Order Actions ── */
    acceptOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        Dashboard.showModal({
            title: 'Accept Order',
            content: `
                <p style="margin-bottom:12px;">Accept order <strong>#${order?.order_number || orderId}</strong>?</p>
                <div class="form-group">
                    <label>Estimated prep time (minutes)</label>
                    <input type="number" id="accept-prep-time" value="${order?.estimated_prep_minutes || 25}" min="5" max="120">
                </div>
            `,
            actions: [
                { label: 'Accept', class: 'btn-success', style: 'flex:1;padding:12px;', action: 'accept',
                    onClick: (modal) => {
                        const prepTime = document.getElementById('accept-prep-time')?.value || 25;
                        modal.remove();
                        this.updateStatus(orderId, 'accepted', '', prepTime);
                    }
                },
                { label: 'Cancel', class: 'btn-secondary', style: 'flex:1;padding:12px;', action: 'close' }
            ]
        });
    },

    rejectOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        Dashboard.showModal({
            title: 'Reject Order',
            content: `
                <p style="margin-bottom:12px;color:var(--danger);">Reject order <strong>#${order?.order_number || orderId}</strong>?</p>
                <div class="form-group">
                    <label>Reason for rejection *</label>
                    <select id="reject-reason-select" style="margin-bottom:8px;">
                        <option value="">Select a reason</option>
                        <option value="Kitchen closed">Kitchen closed</option>
                        <option value="Item out of stock">Item out of stock</option>
                        <option value="Too many orders">Too many orders right now</option>
                        <option value="Delivery area too far">Delivery area too far</option>
                        <option value="custom">Other reason...</option>
                    </select>
                    <textarea id="reject-reason-text" rows="2" placeholder="Additional details (optional)" style="display:none;"></textarea>
                </div>
                <script>
                    document.getElementById('reject-reason-select').addEventListener('change', function() {
                        document.getElementById('reject-reason-text').style.display = this.value === 'custom' ? 'block' : 'none';
                    });
                </script>
            `,
            actions: [
                { label: 'Reject Order', class: 'btn-danger', style: 'flex:1;padding:12px;', action: 'reject',
                    onClick: (modal) => {
                        const select = modal.querySelector('#reject-reason-select');
                        const text = modal.querySelector('#reject-reason-text');
                        let reason = select?.value === 'custom' ? text?.value : select?.value;
                        if (!reason) {
                            Dashboard.showToast('Please select a rejection reason', 'error');
                            return;
                        }
                        modal.remove();
                        this.updateStatus(orderId, 'cancelled', reason);
                    }
                },
                { label: 'Keep Order', class: 'btn-secondary', style: 'flex:1;padding:12px;', action: 'close' }
            ]
        });

        // Attach change listener after modal renders
        setTimeout(() => {
            const select = document.getElementById('reject-reason-select');
            if (select) {
                select.addEventListener('change', function() {
                    const textEl = document.getElementById('reject-reason-text');
                    if (textEl) textEl.style.display = this.value === 'custom' ? 'block' : 'none';
                });
            }
        }, 50);
    },

    async updateStatus(orderId, status, note = '', prepTime = null) {
        try {
            const payload = { order_id: orderId, status, note };
            if (prepTime) payload.estimated_prep_minutes = parseInt(prepTime);

            const res = await RApi.updateOrderStatus(payload);
            if (res?.success) {
                Dashboard.stopAlert();
                const statusLabels = {
                    accepted: 'Order accepted!',
                    preparing: 'Started preparing!',
                    ready: 'Order marked ready!',
                    delivered: 'Order delivered!',
                    cancelled: 'Order cancelled'
                };
                Dashboard.showToast(statusLabels[status] || 'Status updated!', status === 'cancelled' ? 'info' : 'success');
                await this.loadOrders('');
                const badge = document.getElementById('orders-badge');
                if (badge) badge.style.display = 'none';
            } else {
                throw new Error(res?.message);
            }
        } catch(e) {
            Dashboard.showToast(e.message || 'Failed to update order', 'error');
        }
    },

    /* ── Delivery Options Modal ── */
    async showDeliveryOptions(orderId) {
        let availBoys = [];
        try {
            const res = await RApi.getDeliveryBoys();
            availBoys = (res?.data || []).filter(b => b.is_available && b.is_active);
        } catch(e) {}

        const order = this.orders.find(o => o.id === orderId);

        const ownBoysHtml = availBoys.length ? `
            <div style="margin-bottom:16px;">
                <div class="modal-section-label">Your Available Riders</div>
                ${availBoys.map(b => `
                    <button class="rider-select-btn" onclick="OrdersTab.assignDeliveryBoy(${orderId},${b.id},'${b.name.replace(/'/g,"\\'")}')">
                        <div class="rider-avatar">${b.name[0]}</div>
                        <div class="rider-info">
                            <div class="rider-name">${b.name}</div>
                            <div class="rider-details">${b.vehicle_type} · ${b.total_deliveries || 0} deliveries</div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--berry)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                `).join('')}
            </div>
            <div class="modal-section-label">Other Options</div>
        ` : '<div class="modal-section-label">No riders available — choose an option</div>';

        Dashboard.showModal({
            title: `Delivery — #${order?.order_number || orderId}`,
            content: `
                ${ownBoysHtml}
                <button class="delivery-option-btn" onclick="OrdersTab.postToPublicPool(${orderId});document.querySelector('.modal-overlay').remove()">
                    <div class="delivery-option-icon" style="background:#E3F2FD;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1565C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <div>
                        <div style="font-weight:600;font-size:14px;">Post to Public Pool</div>
                        <div style="font-size:12px;color:var(--text-muted);">Any freelance rider can pick up</div>
                    </div>
                </button>
                <button class="delivery-option-btn" onclick="OrdersTab.notifyCustomerPickup(${orderId});document.querySelector('.modal-overlay').remove()">
                    <div class="delivery-option-icon" style="background:#FFF3E0;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E65100" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
                    </div>
                    <div>
                        <div style="font-weight:600;font-size:14px;">Ask Customer to Pickup</div>
                        <div style="font-size:12px;color:var(--text-muted);">Send pickup notification</div>
                    </div>
                </button>
                <button class="delivery-option-btn" onclick="OrdersTab.notifyDelay(${orderId});document.querySelector('.modal-overlay').remove()">
                    <div class="delivery-option-icon" style="background:#FFF8E1;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57F17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div>
                        <div style="font-weight:600;font-size:14px;">Delay & Notify</div>
                        <div style="font-size:12px;color:var(--text-muted);">Let customer know about a delay</div>
                    </div>
                </button>
            `,
            actions: [
                { label: 'Cancel', class: 'btn-secondary', style: 'width:100%;padding:12px;', action: 'close' }
            ]
        });
    },

    async assignDeliveryBoy(orderId, boyId, boyName) {
        document.querySelector('.modal-overlay')?.remove();
        try {
            const res = await RApi.updateOrderStatus({ order_id: orderId, status: 'picked_up', delivery_boy_id: boyId });
            if (res?.success) {
                Dashboard.showToast(`${boyName} assigned to delivery!`, 'success');
                await this.loadOrders('');
            } else {
                throw new Error(res?.message);
            }
        } catch(e) {
            Dashboard.showToast(e.message || 'Failed to assign rider', 'error');
        }
    },

    async postToPublicPool(orderId) {
        try {
            const res = await RApi.postToPool({ order_id: orderId, offered_pay: 40 });
            if (res?.success) Dashboard.showToast('Posted to public delivery pool!', 'success');
        } catch(e) { Dashboard.showToast('Failed to post to pool', 'error'); }
    },

    async notifyCustomerPickup(orderId) {
        try {
            await RApi.notifyCustomer({ order_id: orderId, type: 'pickup_request' });
            Dashboard.showToast('Customer notified for pickup', 'success');
        } catch(e) { Dashboard.showToast('Failed to notify customer', 'error'); }
    },

    async notifyDelay(orderId) {
        try {
            await RApi.notifyCustomer({ order_id: orderId, type: 'delay_notice' });
            Dashboard.showToast('Customer notified of delay', 'success');
        } catch(e) { Dashboard.showToast('Failed to notify customer', 'error'); }
    },

    /* ── Print Order ── */
    printOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const items = (order.items || []).map(i =>
            `<tr><td>${i.quantity}×</td><td>${i.item_name}</td><td style="text-align:right">₹${(i.item_price * i.quantity).toFixed(0)}</td></tr>`
        ).join('');

        const printWindow = window.open('', '_blank', 'width=300,height=500');
        printWindow.document.write(`
            <!DOCTYPE html><html><head><title>Order #${order.order_number}</title>
            <style>body{font-family:monospace;font-size:12px;padding:10px;max-width:280px;margin:0 auto}
            h2{text-align:center;margin:0 0 8px}table{width:100%;border-collapse:collapse}td{padding:2px 0}
            .line{border-top:1px dashed #000;margin:6px 0}.total{font-weight:bold;font-size:14px}
            @media print{body{padding:0}}</style></head><body>
            <h2>CORA</h2><p style="text-align:center;margin:0">${Dashboard.restaurant?.name || 'Restaurant'}</p>
            <div class="line"></div>
            <p><strong>Order #${order.order_number}</strong><br>
            ${order.order_type?.toUpperCase()} · ${order.payment_method?.toUpperCase()}<br>
            ${Dashboard.formatDate(order.placed_at)} ${Dashboard.formatTime(order.placed_at)}</p>
            <div class="line"></div>
            <p><strong>${order.customer_name}</strong><br>${order.customer_phone || ''}</p>
            ${order.delivery_address ? `<p>${order.delivery_address}</p>` : ''}
            <div class="line"></div>
            <table>${items}</table>
            <div class="line"></div>
            <table><tr class="total"><td>TOTAL</td><td style="text-align:right">₹${parseFloat(order.total_amount).toFixed(0)}</td></tr></table>
            ${order.special_instructions ? `<div class="line"></div><p><em>Note: ${order.special_instructions}</em></p>` : ''}
            <div class="line"></div><p style="text-align:center">Thank you!</p>
            <script>setTimeout(()=>{window.print();window.close()},300)<\/script></body></html>
        `);
        printWindow.document.close();
    },

    /* ── Timer ── */
    _startTimer(orderId, placedAt) {
        const el = document.getElementById(`timer-${orderId}`);
        if (!el) return;
        const placed = new Date(placedAt);

        const update = () => {
            const secs = Math.floor((Date.now() - placed) / 1000);
            const m = Math.floor(secs / 60);
            const s = secs % 60;
            el.textContent = `${m}m ${s < 10 ? '0' : ''}${s}s`;

            // Urgency colors
            if (m >= 15) {
                el.style.color = '#FF4444';
                el.style.fontWeight = '700';
            } else if (m >= 8) {
                el.style.color = '#FFB800';
            }
        };

        update();
        const interval = setInterval(update, 1000);
        this._timers.set(orderId, interval);
    }
};
