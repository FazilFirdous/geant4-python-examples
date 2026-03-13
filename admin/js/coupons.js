/* ═══ Cora Admin — Coupons Management (Production) ═══ */

const AdminCoupons = {
    _coupons: [],

    async render(container) {
        container.innerHTML = `<div class="admin-page">
            <div class="page-header">
                <h2 class="page-title">Coupons</h2>
                <button class="btn-primary btn-sm" onclick="AdminCoupons.showAddForm()">+ Create Coupon</button>
            </div>

            <!-- Stats -->
            <div id="coupon-stats" class="mini-stats-row"></div>

            <!-- List -->
            <div id="coupon-list"><div class="skel" style="height:60px;border-radius:12px;"></div></div>
        </div>
        <div id="coupon-modal" class="modal-overlay" style="display:none;"></div>`;
        this._load();
    },

    async _load() {
        try {
            const res = await AApi.getCoupons();
            const wrap = document.getElementById('coupon-list');
            if (!wrap) return;
            if (!res?.success) { wrap.innerHTML = '<div class="empty-state"><p>Failed to load coupons</p></div>'; return; }

            this._coupons = res.data || [];

            // Stats
            const statsEl = document.getElementById('coupon-stats');
            if (statsEl) {
                const active = this._coupons.filter(c => c.is_active).length;
                const expired = this._coupons.filter(c => c.expires_at && new Date(c.expires_at) < new Date()).length;
                statsEl.innerHTML = `
                    <div class="mini-stat"><span class="mini-stat-value">${this._coupons.length}</span><span class="mini-stat-label">Total</span></div>
                    <div class="mini-stat"><span class="mini-stat-value" style="color:var(--green);">${active}</span><span class="mini-stat-label">Active</span></div>
                    <div class="mini-stat"><span class="mini-stat-value" style="color:var(--danger);">${expired}</span><span class="mini-stat-label">Expired</span></div>
                `;
            }

            if (!this._coupons.length) { wrap.innerHTML = '<div class="empty-state"><p>No coupons yet. Create your first promotion!</p></div>'; return; }

            wrap.innerHTML = `<div class="data-table-wrap"><table class="data-table">
                <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Limit</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>${this._coupons.map(c => {
                    const isExpired = c.expires_at && new Date(c.expires_at) < new Date();
                    return `
                    <tr class="${isExpired ? 'row-faded' : ''}">
                        <td><strong class="coupon-code">${c.code}</strong>
                            ${c.description ? `<div style="font-size:11px;color:var(--text-muted);max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${c.description}</div>` : ''}
                        </td>
                        <td><span class="badge ${c.discount_type === 'percentage' ? 'badge-orange' : 'badge-blue'}">${c.discount_type === 'percentage' ? '%' : '₹'}</span></td>
                        <td style="font-weight:600;">${c.discount_type === 'percentage' ? c.discount_value + '%' : '₹' + c.discount_value}
                            ${c.max_discount_amount ? `<div style="font-size:10px;color:var(--text-muted);">max ₹${c.max_discount_amount}</div>` : ''}
                        </td>
                        <td>₹${c.min_order_amount ?? 0}</td>
                        <td>${c.max_uses_per_user ?? '∞'}</td>
                        <td style="font-size:12px;">${c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-IN') : '<span style="color:var(--text-muted);">Never</span>'}
                            ${isExpired ? '<div style="font-size:10px;color:var(--danger);">EXPIRED</div>' : ''}
                        </td>
                        <td>
                            <span class="badge ${c.is_active && !isExpired ? 'badge-delivered' : 'badge-cancelled'}">${c.is_active && !isExpired ? 'Active' : 'Inactive'}</span>
                        </td>
                        <td class="action-btns">
                            <button class="btn-xs ${c.is_active ? 'btn-danger' : 'btn-success'}"
                                onclick="AdminCoupons.toggle(${c.id}, ${c.is_active ? 0 : 1})">
                                ${c.is_active ? 'Off' : 'On'}
                            </button>
                            <button class="btn-xs btn-outline" onclick="AdminCoupons.copyCoupon('${c.code}')" title="Copy code">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                            </button>
                        </td>
                    </tr>`;
                }).join('')}
                </tbody></table></div>`;
        } catch (e) {
            document.getElementById('coupon-list').innerHTML = '<div class="empty-state"><p>Error loading coupons</p></div>';
        }
    },

    showAddForm() {
        Admin.showModal('coupon-modal', {
            title: 'Create Coupon',
            content: `
                <div class="form-group">
                    <label>Coupon Code (UPPERCASE) *</label>
                    <input id="c-code" placeholder="KULGAM50" style="text-transform:uppercase;" oninput="this.value=this.value.toUpperCase()" maxlength="20">
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                    <div class="form-group">
                        <label>Discount Type *</label>
                        <select id="c-type">
                            <option value="percentage">Percentage (%)</option>
                            <option value="flat">Flat Amount (₹)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Discount Value *</label>
                        <input id="c-value" type="number" placeholder="50" min="1">
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                    <div class="form-group"><label>Min Order (₹)</label><input id="c-minorder" type="number" value="0" min="0"></div>
                    <div class="form-group"><label>Max Discount (₹)</label><input id="c-maxdisc" type="number" value="0" min="0" placeholder="0 = no cap"></div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                    <div class="form-group"><label>Per-User Limit</label><input id="c-peruserlimit" type="number" value="1" min="0" placeholder="0 = unlimited"></div>
                    <div class="form-group"><label>Expiry Date</label><input id="c-expiry" type="date"></div>
                </div>
                <div class="form-group"><label>Description</label><input id="c-desc" placeholder="50% off your first order!" maxlength="200"></div>
            `,
            actions: [
                { label: 'Create Coupon', class: 'btn-primary btn-sm', action: 'create', onClick: () => this.submitCreate() },
                { label: 'Cancel', class: 'btn-outline btn-sm', action: 'cancel', onClick: (m) => { m.style.display = 'none'; }}
            ]
        });
    },

    async submitCreate() {
        const code = document.getElementById('c-code')?.value.trim().toUpperCase();
        const value = parseFloat(document.getElementById('c-value')?.value);

        if (!code) { showToast('Coupon code is required', 'error'); return; }
        if (!value || value <= 0) { showToast('Enter a valid discount value', 'error'); return; }

        const maxDiscVal = parseInt(document.getElementById('c-maxdisc')?.value);
        const perUserLimit = parseInt(document.getElementById('c-peruserlimit')?.value);

        try {
            const res = await AApi.createCoupon({
                code,
                discount_type: document.getElementById('c-type')?.value,
                discount_value: value,
                min_order_amount: parseFloat(document.getElementById('c-minorder')?.value) || 0,
                max_discount_amount: maxDiscVal > 0 ? maxDiscVal : null,
                max_uses_per_user: perUserLimit > 0 ? perUserLimit : null,
                expires_at: document.getElementById('c-expiry')?.value || null,
                description: document.getElementById('c-desc')?.value.trim() || ''
            });
            if (res?.success) {
                showToast('Coupon created!', 'success');
                document.getElementById('coupon-modal').style.display = 'none';
                this._load();
            } else showToast(res?.message || 'Error', 'error');
        } catch (e) { showToast('Failed to create coupon', 'error'); }
    },

    async toggle(id, isActive) {
        try {
            const res = await AApi.toggleCoupon(id, isActive ? 1 : 0);
            if (res?.success) {
                showToast(isActive ? 'Coupon activated' : 'Coupon deactivated', 'success');
                this._load();
            } else showToast('Error', 'error');
        } catch (e) { showToast('Failed to toggle coupon', 'error'); }
    },

    async copyCoupon(code) {
        try {
            await navigator.clipboard.writeText(code);
            showToast(`Copied: ${code}`, 'success');
        } catch (e) {
            showToast('Failed to copy', 'error');
        }
    }
};
