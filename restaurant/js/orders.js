const OrdersTab = {
    orders: [],
    prevOrderIds: new Set(),

    async render() {
        document.getElementById('tab-content').innerHTML = `
            <div style="padding:16px 0;">
                <!-- Status Filter Tabs -->
                <div style="display:flex;overflow-x:auto;gap:8px;padding:0 16px 12px;scrollbar-width:none;">
                    ${['active','placed','accepted','preparing','ready','delivered','cancelled'].map((s,i) =>
                        `<div class="status-filter-tab ${i===0?'active':''}" data-filter="${s}" onclick="OrdersTab.filterOrders('${s}',this)"
                              style="padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;background:${i===0?'var(--berry)':'white'};color:${i===0?'white':'var(--text-sub)'};border:1px solid var(--berry-border);transition:all 0.25s;">
                            ${s.charAt(0).toUpperCase()+s.slice(1)}
                        </div>`
                    ).join('')}
                </div>
                <div id="orders-list">
                    <div style="display:flex;justify-content:center;padding:40px;"><div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div></div>
                </div>
            </div>
        `;
        await this.loadOrders('');
    },

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
                }
            }
            this.prevOrderIds = currentIds;

            this.renderOrdersList(this.orders);
        } catch(e) {
            document.getElementById('orders-list').innerHTML = `<div style="padding:20px;color:var(--danger);">Failed to load orders</div>`;
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
                    this.renderOrdersList(this.orders);
                    const badge = document.getElementById('orders-badge');
                    if (badge) { badge.textContent = added.length; badge.style.display = 'block'; }
                }
            }
            this.prevOrderIds = newIds;
        } catch(e) {}
    },

    filterOrders(status, el) {
        document.querySelectorAll('.status-filter-tab').forEach(t => {
            t.style.background = 'white'; t.style.color = 'var(--text-sub)';
        });
        el.style.background = 'var(--berry)'; el.style.color = 'white';

        const statusMap = {
            active: null, placed: 'placed', accepted: 'accepted',
            preparing: 'preparing', ready: 'ready', delivered: 'delivered', cancelled: 'cancelled'
        };

        this.loadOrders(statusMap[status] || '');
    },

    renderOrdersList(orders) {
        const el = document.getElementById('orders-list');
        if (!el) return;

        if (!orders.length) {
            el.innerHTML = `
                <div class="empty-state">
                    <div style="font-size:60px;">📋</div>
                    <h3 style="font-family:'Playfair Display',serif;font-size:20px;">No orders</h3>
                    <p style="color:var(--text-muted);">New orders will appear here</p>
                </div>
            `;
            return;
        }

        el.innerHTML = orders.map(o => this.orderCardHtml(o)).join('');

        // Start timers for placed orders
        orders.filter(o => o.status === 'placed').forEach(o => {
            this.startTimer(o.id, o.placed_at);
        });
    },

    orderCardHtml(o) {
        const isNew = o.status === 'placed';
        const statusColors = {
            placed:'#E65100', accepted:'#1565C0', preparing:'#F57F17',
            ready:'#2E7D32', delivered:'var(--green)', cancelled:'var(--danger)'
        };

        const waLink = `https://wa.me/${(o.customer_phone||'').replace(/\D/g,'')}?text=${encodeURIComponent('Hi! Your CORA order ' + o.order_number + ' is ready.')}`;

        const actionBtns = this.getActionButtons(o);

        return `
            <div class="order-card ${isNew ? 'new-order' : ''}" id="order-${o.id}">
                <div class="order-card-header">
                    <div>
                        <div class="order-number">#${o.order_number}</div>
                        <div style="color:rgba(255,255,255,0.8);font-size:12px;margin-top:2px;">${o.order_type?.toUpperCase()} · ${o.payment_method?.toUpperCase()}</div>
                    </div>
                    <div style="text-align:right;">
                        <div id="timer-${o.id}" class="order-timer"></div>
                        <div style="color:rgba(255,255,255,0.9);font-size:12px;background:rgba(255,255,255,0.15);padding:2px 8px;border-radius:10px;margin-top:4px;">${o.status?.toUpperCase()}</div>
                    </div>
                </div>
                <div class="order-body">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <div>
                            <div style="font-weight:700;font-size:15px;">${o.customer_name || 'Customer'}</div>
                            <div style="font-size:12px;color:var(--text-muted);">${o.customer_phone || ''}</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-size:18px;font-weight:700;">₹${parseFloat(o.total_amount).toFixed(0)}</div>
                        </div>
                    </div>

                    ${(o.items || []).map(i => `
                        <div class="order-item-row">
                            <span>${i.quantity}× ${i.item_name}</span>
                            <span>₹${(i.item_price * i.quantity).toFixed(0)}</span>
                        </div>
                    `).join('')}

                    ${o.special_instructions ? `
                        <div style="background:var(--berry-light);border-radius:8px;padding:8px;margin-top:8px;font-size:12px;color:var(--berry);">
                            📝 ${o.special_instructions}
                        </div>
                    ` : ''}

                    <div class="order-meta">
                        ${o.delivery_address ? `<span class="order-meta-item">📍 ${o.delivery_address}</span>` : ''}
                        ${o.estimated_prep_minutes ? `<span class="order-meta-item">⏱ ${o.estimated_prep_minutes} min</span>` : ''}
                    </div>
                </div>
                <div class="order-actions" style="flex-wrap:wrap;gap:8px;">
                    ${actionBtns}
                    <a href="${waLink}" target="_blank" class="wa-btn" style="font-size:12px;padding:8px 12px;">💬 WhatsApp</a>
                </div>
            </div>
        `;
    },

    getActionButtons(o) {
        switch(o.status) {
            case 'placed':
                return `
                    <button class="btn-success" style="flex:1;padding:10px;" onclick="OrdersTab.updateStatus(${o.id},'accepted')">✅ Accept</button>
                    <button class="btn-danger"  style="flex:1;padding:10px;" onclick="OrdersTab.rejectOrder(${o.id})">❌ Reject</button>
                `;
            case 'accepted':
                return `<button class="btn-primary" style="flex:1;padding:10px;" onclick="OrdersTab.updateStatus(${o.id},'preparing')">🍳 Start Preparing</button>`;
            case 'preparing':
                return `<button class="btn-primary" style="flex:1;padding:10px;" onclick="OrdersTab.updateStatus(${o.id},'ready')">✨ Mark Ready</button>`;
            case 'ready':
                if (o.order_type === 'pickup') {
                    return `<button class="btn-success" style="flex:1;padding:10px;" onclick="OrdersTab.updateStatus(${o.id},'delivered')">✅ Mark Picked Up</button>`;
                }
                return `
                    <button class="btn-primary" style="flex:1;padding:10px;" onclick="OrdersTab.showDeliveryOptions(${o.id})">🛵 Delivery Options</button>
                `;
            case 'picked_up':
            case 'on_the_way':
                return `<button class="btn-success" style="flex:1;padding:10px;" onclick="OrdersTab.updateStatus(${o.id},'delivered')">🎉 Mark Delivered</button>`;
            default:
                return '';
        }
    },

    async updateStatus(orderId, status, note = '') {
        try {
            const res = await RApi.updateOrderStatus({ order_id: orderId, status, note });
            if (res?.success) {
                Dashboard.stopAlert();
                Dashboard.showToast('Order status updated!', 'success');
                await this.loadOrders('');
                const badge = document.getElementById('orders-badge');
                if (badge) badge.style.display = 'none';
            } else {
                throw new Error(res?.message);
            }
        } catch(e) {
            Dashboard.showToast(e.message || 'Failed to update', 'error');
        }
    },

    rejectOrder(orderId) {
        const reason = prompt('Reason for rejection (required):');
        if (!reason) return;
        this.updateStatus(orderId, 'cancelled', reason);
    },

    showDeliveryOptions(orderId) {
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:200;display:flex;align-items:flex-end;justify-content:center;';
        modal.innerHTML = `
            <div style="background:white;width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:24px;padding-bottom:40px;">
                <h3 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;margin-bottom:16px;">Delivery Options</h3>
                <button class="btn-primary" style="width:100%;margin-bottom:10px;padding:14px;" onclick="OrdersTab.postToPublicPool(${orderId});this.closest('[style]').remove()">
                    🌐 Post to Public Pool
                </button>
                <button class="btn-secondary" style="width:100%;margin-bottom:10px;padding:14px;" onclick="OrdersTab.notifyCustomerPickup(${orderId});this.closest('[style]').remove()">
                    🏃 Ask Customer to Pickup
                </button>
                <button class="btn-secondary" style="width:100%;margin-bottom:10px;padding:14px;" onclick="OrdersTab.notifyDelay(${orderId});this.closest('[style]').remove()">
                    ⏰ Delay & Notify Customer
                </button>
                <button onclick="this.closest('[style]').remove()" style="width:100%;background:none;border:none;color:var(--text-muted);font-size:14px;cursor:pointer;padding:10px;">Cancel</button>
            </div>
        `;
        document.body.appendChild(modal);
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

    startTimer(orderId, placedAt) {
        const el = document.getElementById(`timer-${orderId}`);
        if (!el) return;
        const placed = new Date(placedAt);
        const update = () => {
            const secs = Math.floor((Date.now() - placed) / 1000);
            const m = Math.floor(secs / 60);
            const s = secs % 60;
            if (el) el.textContent = `${m}m ${s}s`;
        };
        update();
        setInterval(update, 1000);
    }
};
