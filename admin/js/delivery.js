/* ============================================================
   Cora Admin — delivery.js
   ============================================================ */
const AdminDelivery = {
    _boys: [],
    _restaurants: [],

    async render(container) {
        container.innerHTML = `<div style="padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h2 style="font-family:'Playfair Display',serif;font-size:20px;">Delivery Boys</h2>
                <button class="btn-primary btn-sm" onclick="AdminDelivery.showAddForm()">+ Add</button>
            </div>
            <div id="db-list"><div class="skel" style="height:60px;border-radius:12px;"></div></div>
            <div id="db-modal" class="modal-overlay" style="display:none;"></div>

            <!-- Delivery Config -->
            <div class="admin-card" style="margin-top:24px;">
                <h3 class="card-title">Delivery Configuration</h3>
                <div id="deliv-config-wrap"><div class="skel" style="height:40px;border-radius:8px;"></div></div>
            </div>
        </div>`;

        this._loadBoys();
        this._loadConfig();
    },

    async _loadBoys() {
        const [dbRes, rRes] = await Promise.all([AApi.getDeliveryBoys(), AApi.getRestaurants()]);
        this._boys = dbRes.success ? dbRes.data : [];
        this._restaurants = rRes.success ? rRes.data : [];
        const wrap = document.getElementById('db-list');
        if (!wrap) return;

        if (!this._boys.length) { wrap.innerHTML = '<p class="empty-state">No delivery boys yet</p>'; return; }

        wrap.innerHTML = `<div class="data-table-wrap"><table class="data-table">
            <thead><tr><th>Name</th><th>Phone</th><th>Restaurant</th><th>Status</th><th>Orders</th><th>Actions</th></tr></thead>
            <tbody>${this._boys.map(b => `
            <tr>
                <td><strong>${b.name}</strong></td>
                <td>${b.phone}</td>
                <td>${b.restaurant_name || 'Public Pool'}</td>
                <td>
                    <span class="badge ${b.is_active ? 'badge-delivered' : 'badge-cancelled'}">${b.is_active ? 'Active' : 'Inactive'}</span>
                    ${b.is_available ? '<span class="badge badge-preparing" style="margin-left:4px;">Available</span>' : ''}
                </td>
                <td>${b.total_deliveries ?? 0}</td>
                <td class="action-btns">
                    <button class="btn-xs ${b.is_active ? 'btn-danger' : 'btn-success'}"
                        onclick="AdminDelivery.toggleActive(${b.id}, ${b.is_active ? 0 : 1})">
                        ${b.is_active ? 'Disable' : 'Enable'}
                    </button>
                </td>
            </tr>`).join('')}
            </tbody></table></div>`;
    },

    showAddForm() {
        const modal = document.getElementById('db-modal');
        modal.style.display = 'flex';
        modal.innerHTML = `<div class="modal-box">
            <div class="modal-header"><h3>Add Delivery Boy</h3><button class="modal-close" onclick="AdminDelivery.closeModal()"><i data-lucide="x" style="width:18px;height:18px;"></i></button></div>
            <div style="padding:20px;">
                <div class="form-group"><label>Full Name</label><input id="db-name" placeholder="Mohammed Amir"></div>
                <div class="form-group"><label>Phone (+91)</label><input id="db-phone" type="tel" maxlength="10" placeholder="9876543210"></div>
                <div class="form-group"><label>Assign to Restaurant (optional)</label>
                    <select id="db-rest">
                        <option value="">Public Pool</option>
                        ${this._restaurants.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Vehicle Number</label><input id="db-vehicle" placeholder="JK01AB1234"></div>
                <button class="btn-primary" style="width:100%;margin-top:8px;" onclick="AdminDelivery.submitAdd()">Add Delivery Boy</button>
            </div>
        </div>`;
    },

    async submitAdd() {
        const restId = document.getElementById('db-rest').value;
        const res = await AApi.addDeliveryBoy({
            name:          document.getElementById('db-name').value.trim(),
            phone:         '+91' + document.getElementById('db-phone').value.trim(),
            restaurant_id: restId ? parseInt(restId) : null,
            vehicle_number: document.getElementById('db-vehicle').value.trim()
        });
        if (res.success) { showToast('Delivery boy added!'); this.closeModal(); this._loadBoys(); }
        else showToast(res.message || 'Error');
    },

    async toggleActive(id, isActive) {
        /* Use update endpoint — reuse updateRestaurant pattern for delivery boy */
        const res = await AApi.request('/admin/delivery-boys.php', {
            method: 'PUT',
            body: JSON.stringify({ id, is_active: isActive })
        });
        if (res.success) { showToast(isActive ? 'Enabled' : 'Disabled'); this._loadBoys(); }
        else showToast('Error');
    },

    async _loadConfig() {
        const res = await AApi.getDelivConfig();
        const wrap = document.getElementById('deliv-config-wrap');
        if (!wrap || !res.success) return;
        const c = res.data;
        wrap.innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
                <div class="form-group"><label>Base Delivery Fee (₹)</label><input id="cfg-base" type="number" value="${c.base_delivery_fee ?? 20}"></div>
                <div class="form-group"><label>Per KM Fee (₹)</label><input id="cfg-km" type="number" value="${c.per_km_fee ?? 5}"></div>
                <div class="form-group"><label>Free Delivery Above (₹)</label><input id="cfg-free" type="number" value="${c.free_delivery_above ?? 299}"></div>
                <div class="form-group"><label>Max Delivery Distance (km)</label><input id="cfg-maxdist" type="number" value="${c.max_delivery_distance_km ?? 10}"></div>
            </div>
            <button class="btn-primary btn-sm" onclick="AdminDelivery.saveConfig()">Save Config</button>`;
    },

    async saveConfig() {
        const res = await AApi.updateDelivConfig({
            base_delivery_fee:       document.getElementById('cfg-base').value,
            per_km_fee:              document.getElementById('cfg-km').value,
            free_delivery_above:     document.getElementById('cfg-free').value,
            max_delivery_distance_km: document.getElementById('cfg-maxdist').value
        });
        if (res.success) showToast('Config saved!');
        else showToast('Error saving config');
    },

    closeModal() {
        const m = document.getElementById('db-modal');
        if (m) m.style.display = 'none';
    }
};
