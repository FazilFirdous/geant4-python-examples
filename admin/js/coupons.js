/* ============================================================
   Cora Admin — coupons.js
   ============================================================ */
const AdminCoupons = {
    async render(container) {
        container.innerHTML = `<div style="padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h2 style="font-family:'Playfair Display',serif;font-size:20px;">Coupons</h2>
                <button class="btn-primary btn-sm" onclick="AdminCoupons.showAddForm()">+ Create</button>
            </div>
            <div id="coupon-list"><div class="skel" style="height:60px;border-radius:12px;"></div></div>
        </div>
        <div id="coupon-modal" class="modal-overlay" style="display:none;"></div>`;
        this._load();
    },

    async _load() {
        const res = await AApi.getCoupons();
        const wrap = document.getElementById('coupon-list');
        if (!wrap) return;
        if (!res.success || !res.data.length) { wrap.innerHTML = '<p class="empty-state">No coupons yet</p>'; return; }

        wrap.innerHTML = `<div class="data-table-wrap"><table class="data-table">
            <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Per-User Limit</th><th>Expiry</th><th>Status</th><th>Toggle</th></tr></thead>
            <tbody>${res.data.map(c => `
            <tr>
                <td><strong>${c.code}</strong></td>
                <td>${c.discount_type}</td>
                <td>${c.discount_type === 'percentage' ? c.discount_value + '%' : '₹' + c.discount_value}</td>
                <td>₹${c.min_order_amount ?? 0}</td>
                <td>${c.max_uses_per_user ?? '∞'}</td>
                <td style="font-size:12px;">${c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-IN') : 'Never'}</td>
                <td><span class="badge ${c.is_active ? 'badge-delivered' : 'badge-cancelled'}">${c.is_active ? 'Active' : 'Inactive'}</span></td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" ${c.is_active ? 'checked' : ''} onchange="AdminCoupons.toggle(${c.id}, this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </td>
            </tr>`).join('')}
            </tbody></table></div>`;
    },

    showAddForm() {
        const modal = document.getElementById('coupon-modal');
        modal.style.display = 'flex';
        modal.innerHTML = `<div class="modal-box">
            <div class="modal-header"><h3>Create Coupon</h3><button class="modal-close" onclick="AdminCoupons.closeModal()"><i data-lucide="x" style="width:18px;height:18px;"></i></button></div>
            <div style="padding:20px;">
                <div class="form-group"><label>Coupon Code (UPPERCASE)</label><input id="c-code" placeholder="KULGAM50" style="text-transform:uppercase;" oninput="this.value=this.value.toUpperCase()"></div>
                <div class="form-group"><label>Discount Type</label>
                    <select id="c-type">
                        <option value="percentage">Percentage (%)</option>
                        <option value="flat">Flat Amount (₹)</option>
                    </select>
                </div>
                <div class="form-group"><label>Discount Value</label><input id="c-value" type="number" placeholder="50"></div>
                <div class="form-group"><label>Min Order Amount (₹)</label><input id="c-minorder" type="number" value="0"></div>
                <div class="form-group"><label>Max Discount (₹, 0=no cap)</label><input id="c-maxdisc" type="number" value="0"></div>
                <div class="form-group"><label>Per-User Limit (0=unlimited)</label><input id="c-peruserlimit" type="number" value="1"></div>
                <div class="form-group"><label>Expiry Date (optional)</label><input id="c-expiry" type="date"></div>
                <div class="form-group"><label>Description</label><input id="c-desc" placeholder="50% off your first order!"></div>
                <button class="btn-primary" style="width:100%;margin-top:8px;" onclick="AdminCoupons.submitCreate()">Create Coupon</button>
            </div>
        </div>`;
    },

    async submitCreate() {
        const expiryVal = document.getElementById('c-expiry').value;
        const maxDiscVal = parseInt(document.getElementById('c-maxdisc').value);
        const perUserLimit = parseInt(document.getElementById('c-peruserlimit').value);
        const res = await AApi.createCoupon({
            code:                document.getElementById('c-code').value.trim().toUpperCase(),
            discount_type:       document.getElementById('c-type').value,
            discount_value:      parseFloat(document.getElementById('c-value').value),
            min_order_amount:    parseFloat(document.getElementById('c-minorder').value),
            max_discount_amount: maxDiscVal > 0 ? maxDiscVal : null,
            max_uses_per_user:   perUserLimit > 0 ? perUserLimit : null,
            expires_at:          expiryVal || null,
            description:         document.getElementById('c-desc').value.trim()
        });
        if (res.success) { showToast('Coupon created!'); this.closeModal(); this._load(); }
        else showToast(res.message || 'Error creating coupon');
    },

    async toggle(id, isActive) {
        const res = await AApi.toggleCoupon(id, isActive ? 1 : 0);
        if (res.success) showToast(isActive ? 'Coupon activated' : 'Coupon deactivated');
        else showToast('Error');
    },

    closeModal() {
        const m = document.getElementById('coupon-modal');
        if (m) m.style.display = 'none';
    }
};
