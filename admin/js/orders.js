/* ═══ Cora Admin — Orders Management (Production) ═══ */

const AdminOrders = {
    _orders: [],
    _currentFilter: '',
    _searchQuery: '',

    async render(container) {
        container.innerHTML = `<div class="admin-page">
            <div class="page-header">
                <h2 class="page-title">All Orders</h2>
                <button class="btn-outline btn-sm" onclick="AdminOrders._load()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                    Refresh
                </button>
            </div>

            <!-- Search -->
            <div class="admin-search-bar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" placeholder="Search by order #, customer, restaurant..."
                    oninput="AdminOrders._search(this.value)" autocomplete="off">
            </div>

            <!-- Filters -->
            <div class="filter-row">
                ${['','placed','accepted','preparing','ready','picked_up','on_the_way','delivered','cancelled'].map(s => `
                    <button class="filter-pill ${s === '' ? 'active' : ''}" data-status="${s}"
                        onclick="AdminOrders.filter('${s}', this)">${s || 'All'}</button>
                `).join('')}
            </div>

            <!-- Count -->
            <div id="orders-count" class="orders-count-label"></div>

            <!-- Orders List -->
            <div id="orders-list"><div class="skel" style="height:60px;border-radius:12px;"></div></div>
        </div>
        <div id="order-modal" class="modal-overlay" style="display:none;"></div>`;

        this._load();
    },

    async _load() {
        try {
            const params = this._currentFilter ? `status=${this._currentFilter}` : '';
            const res = await AApi.getOrders(params);
            if (!res?.success) { document.getElementById('orders-list').innerHTML = '<div class="empty-state"><p>Failed to load orders</p></div>'; return; }
            this._orders = res.data || [];
            this._renderOrders();
        } catch (e) {
            document.getElementById('orders-list').innerHTML = '<div class="empty-state"><p>Error loading orders</p></div>';
        }
    },

    _search(query) {
        this._searchQuery = query.toLowerCase().trim();
        this._renderOrders();
    },

    _renderOrders() {
        let orders = [...this._orders];

        if (this._searchQuery) {
            orders = orders.filter(o =>
                (o.order_number || '').toLowerCase().includes(this._searchQuery) ||
                (o.customer_name || '').toLowerCase().includes(this._searchQuery) ||
                (o.customer_phone || '').includes(this._searchQuery) ||
                (o.restaurant_name || '').toLowerCase().includes(this._searchQuery)
            );
        }

        const wrap = document.getElementById('orders-list');
        const countEl = document.getElementById('orders-count');
        if (!wrap) return;

        if (countEl) countEl.textContent = orders.length ? `${orders.length} order${orders.length !== 1 ? 's' : ''}` : '';

        if (!orders.length) {
            wrap.innerHTML = '<div class="empty-state"><p>No orders found</p></div>';
            return;
        }

        wrap.innerHTML = `<div class="data-table-wrap"><table class="data-table">
            <thead><tr><th>Order #</th><th>Customer</th><th>Restaurant</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>${orders.map(o => `
            <tr>
                <td><strong>${o.order_number}</strong></td>
                <td>
                    <div style="font-weight:600;">${o.customer_name || '—'}</div>
                    <div style="font-size:11px;color:var(--text-muted);">${o.customer_phone || ''}</div>
                </td>
                <td>${o.restaurant_name || '—'}</td>
                <td style="font-weight:600;">₹${parseFloat(o.total_amount).toFixed(0)}</td>
                <td><span class="badge badge-${o.status}">${(o.status || '').replace(/_/g, ' ')}</span></td>
                <td style="font-size:12px;color:var(--text-muted);">${formatDate(o.placed_at)}</td>
                <td class="action-btns">
                    <button class="btn-xs btn-outline" onclick="AdminOrders.viewOrder(${o.id})">View</button>
                    ${!['delivered','cancelled'].includes(o.status) ?
                        `<button class="btn-xs btn-danger" onclick="AdminOrders.cancelOrder(${o.id})">Cancel</button>` : ''}
                    ${o.customer_phone ?
                        `<a class="btn-xs btn-wa" href="https://wa.me/${(o.customer_phone || '').replace(/[^0-9]/g,'')}" target="_blank" rel="noopener">WA</a>` : ''}
                </td>
            </tr>`).join('')}
            </tbody></table></div>`;
    },

    filter(status, btn) {
        this._currentFilter = status;
        document.querySelectorAll('.filter-pill').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        this._load();
    },

    async viewOrder(id) {
        try {
            const res = await AApi.getOrders(`id=${id}`);
            const o = res?.success && res.data?.[0];
            if (!o) { showToast('Order not found', 'error'); return; }

            Admin.showModal('order-modal', {
                title: `Order ${o.order_number}`,
                content: `
                    <div class="order-detail-grid">
                        <div class="order-detail-row">
                            <span class="order-detail-label">Customer</span>
                            <span>${o.customer_name || '—'} · ${o.customer_phone || '—'}</span>
                        </div>
                        <div class="order-detail-row">
                            <span class="order-detail-label">Restaurant</span>
                            <span>${o.restaurant_name || '—'}</span>
                        </div>
                        <div class="order-detail-row">
                            <span class="order-detail-label">Status</span>
                            <span class="badge badge-${o.status}">${(o.status || '').replace(/_/g, ' ')}</span>
                        </div>
                        <div class="order-detail-row">
                            <span class="order-detail-label">Payment</span>
                            <span>${(o.payment_method || '').toUpperCase()} · ${o.payment_status || 'pending'}</span>
                        </div>
                        <div class="order-detail-row">
                            <span class="order-detail-label">Type</span>
                            <span>${(o.order_type || 'delivery').toUpperCase()}</span>
                        </div>
                        ${o.delivery_address ? `<div class="order-detail-row"><span class="order-detail-label">Address</span><span>${o.delivery_address}</span></div>` : ''}
                        ${o.delivery_boy_name ? `<div class="order-detail-row"><span class="order-detail-label">Rider</span><span>${o.delivery_boy_name}</span></div>` : ''}
                    </div>

                    <div class="order-detail-items">
                        <strong style="font-size:13px;color:var(--text-sub);">ITEMS</strong>
                        ${(o.items || []).map(i => `
                            <div class="order-detail-item">
                                <span>${i.quantity}× ${i.item_name}</span>
                                <span>₹${parseFloat(i.total_price || i.item_price * i.quantity).toFixed(0)}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div class="order-detail-totals">
                        <div class="order-detail-row"><span>Subtotal</span><span>₹${parseFloat(o.subtotal || o.total_amount).toFixed(0)}</span></div>
                        ${o.delivery_fee ? `<div class="order-detail-row"><span>Delivery</span><span>₹${parseFloat(o.delivery_fee).toFixed(0)}</span></div>` : ''}
                        ${o.discount_amount ? `<div class="order-detail-row"><span>Discount</span><span style="color:var(--green);">-₹${parseFloat(o.discount_amount).toFixed(0)}</span></div>` : ''}
                        <div class="order-detail-row total"><span>Total</span><span>₹${parseFloat(o.total_amount).toFixed(0)}</span></div>
                    </div>

                    ${o.special_instructions ? `<div class="order-detail-note"><strong>Note:</strong> ${o.special_instructions}</div>` : ''}

                    <div class="order-detail-actions">
                        ${!['delivered','cancelled'].includes(o.status) ?
                            `<button class="btn-danger btn-sm" onclick="AdminOrders.cancelOrder(${o.id})">Cancel Order</button>` : ''}
                        ${o.customer_phone ?
                            `<a class="btn-wa btn-sm" href="https://wa.me/${(o.customer_phone || '').replace(/[^0-9]/g,'')}?text=Hi%20${encodeURIComponent(o.customer_name || '')}%2C%20this%20is%20Cora%20support%20regarding%20order%20${o.order_number}" target="_blank" rel="noopener">WhatsApp Customer</a>` : ''}
                    </div>
                `
            });
        } catch (e) {
            showToast('Failed to load order details', 'error');
        }
    },

    async cancelOrder(id) {
        Admin.showModal('cancel-confirm', {
            title: 'Cancel Order',
            content: `
                <p style="color:var(--danger);margin-bottom:12px;">Are you sure you want to cancel this order?</p>
                <div class="form-group">
                    <label>Reason</label>
                    <select id="cancel-reason">
                        <option value="Cancelled by admin">Admin decision</option>
                        <option value="Customer request">Customer request</option>
                        <option value="Restaurant unable to fulfill">Restaurant issue</option>
                        <option value="Payment issue">Payment issue</option>
                    </select>
                </div>
            `,
            actions: [
                { label: 'Cancel Order', class: 'btn-danger btn-sm', action: 'cancel', onClick: async (modal) => {
                    const reason = modal.querySelector('#cancel-reason')?.value || 'Cancelled by admin';
                    modal.style.display = 'none';
                    try {
                        const res = await AApi.updateOrder({ id, status: 'cancelled', cancel_reason: reason });
                        if (res?.success) {
                            showToast('Order cancelled', 'info');
                            document.getElementById('order-modal').style.display = 'none';
                            this._load();
                        } else showToast(res?.message || 'Error', 'error');
                    } catch (e) { showToast('Failed to cancel order', 'error'); }
                }},
                { label: 'Keep Order', class: 'btn-outline btn-sm', action: 'keep', onClick: (m) => { m.style.display = 'none'; }}
            ]
        });
    }
};
