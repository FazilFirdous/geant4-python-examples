/* ============================================================
   Cora Admin — orders.js
   ============================================================ */
const AdminOrders = {
    _currentFilter: '',

    async render(container) {
        container.innerHTML = `<div style="padding:16px;">
            <h2 style="font-family:'Playfair Display',serif;font-size:20px;margin-bottom:16px;">All Orders</h2>

            <!-- Filters -->
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
                ${['','pending','confirmed','preparing','ready','picked_up','on_the_way','delivered','cancelled'].map(s => `
                    <button class="filter-pill ${s===''?'active':''}" data-status="${s}"
                        onclick="AdminOrders.filter('${s}', this)">${s || 'All'}</button>
                `).join('')}
            </div>

            <div id="orders-list"><div class="skel" style="height:60px;border-radius:12px;"></div></div>
        </div>
        <div id="order-modal" class="modal-overlay" style="display:none;"></div>`;

        this._load();
    },

    async _load() {
        const params = this._currentFilter ? `status=${this._currentFilter}` : '';
        const res = await AApi.getOrders(params);
        const wrap = document.getElementById('orders-list');
        if (!wrap) return;
        if (!res.success) { wrap.innerHTML = '<p class="empty-state">Failed to load orders</p>'; return; }
        const orders = res.data;
        if (!orders.length) { wrap.innerHTML = '<p class="empty-state">No orders found</p>'; return; }

        wrap.innerHTML = `<div class="data-table-wrap"><table class="data-table">
            <thead><tr><th>Order #</th><th>Customer</th><th>Restaurant</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>${orders.map(o => `
            <tr>
                <td><strong>${o.order_number}</strong></td>
                <td>${o.customer_name || '—'}<br><small style="color:#999;">${o.customer_phone || ''}</small></td>
                <td>${o.restaurant_name || '—'}</td>
                <td>₹${o.total_amount}</td>
                <td><span class="badge badge-${o.status}">${o.status}</span></td>
                <td style="font-size:12px;color:#666;">${this._fmt(o.placed_at)}</td>
                <td class="action-btns">
                    <button class="btn-xs btn-outline" onclick="AdminOrders.viewOrder(${o.id})">View</button>
                    ${o.status !== 'delivered' && o.status !== 'cancelled' ?
                        `<button class="btn-xs btn-danger" onclick="AdminOrders.cancelOrder(${o.id})">Cancel</button>` : ''}
                    ${o.customer_phone ?
                        `<a class="btn-xs btn-wa" href="https://wa.me/${o.customer_phone.replace('+','')}" target="_blank">💬 WA</a>` : ''}
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
        const res = await AApi.getOrders(`id=${id}`);
        const o = res.success && res.data[0];
        if (!o) { showToast('Order not found'); return; }
        const modal = document.getElementById('order-modal');
        modal.style.display = 'flex';
        modal.innerHTML = `<div class="modal-box">
            <div class="modal-header">
                <h3>${o.order_number}</h3>
                <button class="modal-close" onclick="AdminOrders.closeModal()">✕</button>
            </div>
            <div style="padding:20px;overflow-y:auto;max-height:70vh;">
                <p><strong>Customer:</strong> ${o.customer_name} · ${o.customer_phone}</p>
                <p><strong>Restaurant:</strong> ${o.restaurant_name}</p>
                <p><strong>Status:</strong> <span class="badge badge-${o.status}">${o.status}</span></p>
                <p><strong>Payment:</strong> ${o.payment_method} · ${o.payment_status}</p>
                <p><strong>Address:</strong> ${o.delivery_address || 'Pickup'}</p>
                <p><strong>Items:</strong></p>
                <ul style="margin:8px 0 12px 16px;">${(o.items || []).map(i =>
                    `<li>${i.quantity}× ${i.item_name} — ₹${i.total_price}</li>`).join('')}
                </ul>
                <div style="border-top:1px solid #eee;padding-top:12px;">
                    <p>Subtotal: ₹${o.subtotal}</p>
                    ${o.delivery_fee ? `<p>Delivery: ₹${o.delivery_fee}</p>` : ''}
                    ${o.discount_amount ? `<p>Discount: -₹${o.discount_amount}</p>` : ''}
                    <p><strong>Total: ₹${o.total_amount}</strong></p>
                </div>
                ${o.special_instructions ? `<p style="margin-top:8px;font-style:italic;">Note: ${o.special_instructions}</p>` : ''}
                <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
                    ${o.status !== 'delivered' && o.status !== 'cancelled' ?
                        `<button class="btn-danger btn-sm" onclick="AdminOrders.cancelOrder(${o.id})">Cancel Order</button>` : ''}
                    ${o.customer_phone ?
                        `<a class="btn-wa btn-sm" href="https://wa.me/${o.customer_phone.replace('+','')}?text=Hi%20${encodeURIComponent(o.customer_name)}%2C%20this%20is%20Cora%20support%20regarding%20your%20order%20${o.order_number}" target="_blank">💬 WhatsApp Customer</a>` : ''}
                </div>
            </div>
        </div>`;
    },

    async cancelOrder(id) {
        if (!confirm('Cancel this order?')) return;
        const res = await AApi.updateOrder({ id, status: 'cancelled', cancel_reason: 'Cancelled by admin' });
        if (res.success) { showToast('Order cancelled'); this.closeModal(); this._load(); }
        else showToast(res.message || 'Error');
    },

    closeModal() {
        const m = document.getElementById('order-modal');
        if (m) m.style.display = 'none';
    },

    _fmt(dt) {
        if (!dt) return '—';
        const d = new Date(dt);
        return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short' }) + ' ' +
               d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
    }
};
