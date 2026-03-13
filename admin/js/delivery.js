/* ═══ Cora Admin — Delivery Management (Production) ═══ */

const AdminDelivery = {
    _boys: [],
    _restaurants: [],

    async render(container) {
        container.innerHTML = `<div class="admin-page">
            <div class="page-header">
                <h2 class="page-title">Delivery Boys</h2>
                <button class="btn-primary btn-sm" onclick="AdminDelivery.showAddForm()">+ Add Rider</button>
            </div>

            <!-- Stats -->
            <div id="delivery-stats" class="mini-stats-row"></div>

            <!-- Search -->
            <div class="admin-search-bar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" placeholder="Search riders..." oninput="AdminDelivery._searchBoys(this.value)" autocomplete="off">
            </div>

            <div id="db-list"><div class="skel" style="height:60px;border-radius:12px;"></div></div>

            <!-- Delivery Config -->
            <div class="admin-card" style="margin-top:24px;">
                <div class="card-header-row">
                    <h3 class="card-title">Delivery Configuration</h3>
                    <span class="card-subtitle">Fee & distance settings</span>
                </div>
                <div id="deliv-config-wrap"><div class="skel" style="height:40px;border-radius:8px;"></div></div>
            </div>
        </div>
        <div id="db-modal" class="modal-overlay" style="display:none;"></div>`;

        await Promise.all([this._loadBoys(), this._loadConfig()]);
    },

    _searchQuery: '',

    _searchBoys(query) {
        this._searchQuery = query.toLowerCase().trim();
        this._renderBoysList();
    },

    async _loadBoys() {
        try {
            const [dbRes, rRes] = await Promise.all([AApi.getDeliveryBoys(), AApi.getRestaurants()]);
            this._boys = dbRes?.success ? dbRes.data : [];
            this._restaurants = rRes?.success ? rRes.data : [];

            // Stats
            const statsEl = document.getElementById('delivery-stats');
            if (statsEl) {
                const active = this._boys.filter(b => b.is_active).length;
                const available = this._boys.filter(b => b.is_available).length;
                const totalDeliveries = this._boys.reduce((s, b) => s + (b.total_deliveries || 0), 0);
                statsEl.innerHTML = `
                    <div class="mini-stat"><span class="mini-stat-value">${this._boys.length}</span><span class="mini-stat-label">Total</span></div>
                    <div class="mini-stat"><span class="mini-stat-value" style="color:var(--green);">${active}</span><span class="mini-stat-label">Active</span></div>
                    <div class="mini-stat"><span class="mini-stat-value" style="color:var(--berry);">${available}</span><span class="mini-stat-label">Available</span></div>
                    <div class="mini-stat"><span class="mini-stat-value">${totalDeliveries}</span><span class="mini-stat-label">Deliveries</span></div>
                `;
            }

            this._renderBoysList();
        } catch (e) {
            document.getElementById('db-list').innerHTML = '<div class="empty-state"><p>Failed to load riders</p></div>';
        }
    },

    _renderBoysList() {
        const wrap = document.getElementById('db-list');
        if (!wrap) return;

        let boys = this._boys;
        if (this._searchQuery) {
            boys = boys.filter(b =>
                (b.name || '').toLowerCase().includes(this._searchQuery) ||
                (b.phone || '').includes(this._searchQuery) ||
                (b.restaurant_name || '').toLowerCase().includes(this._searchQuery)
            );
        }

        if (!boys.length) { wrap.innerHTML = '<div class="empty-state"><p>No delivery boys found</p></div>'; return; }

        wrap.innerHTML = `<div class="data-table-wrap"><table class="data-table">
            <thead><tr><th>Name</th><th>Phone</th><th>Restaurant</th><th>Vehicle</th><th>Status</th><th>Deliveries</th><th>Actions</th></tr></thead>
            <tbody>${boys.map(b => `
            <tr>
                <td><strong>${b.name}</strong></td>
                <td style="font-size:12px;">${b.phone || '—'}</td>
                <td>${b.restaurant_name || '<span style="color:var(--text-muted);">Public Pool</span>'}</td>
                <td style="font-size:12px;">${b.vehicle_number || b.vehicle_type || '—'}</td>
                <td>
                    <span class="badge ${b.is_active ? 'badge-delivered' : 'badge-cancelled'}">${b.is_active ? 'Active' : 'Inactive'}</span>
                    ${b.is_available ? '<span class="badge badge-preparing" style="margin-left:4px;">Free</span>' : ''}
                </td>
                <td style="font-weight:600;">${b.total_deliveries ?? 0}</td>
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
        Admin.showModal('db-modal', {
            title: 'Add Delivery Boy',
            content: `
                <div class="form-group"><label>Full Name *</label><input id="db-name" placeholder="Mohammed Amir" maxlength="80"></div>
                <div class="form-group"><label>Phone (+91) *</label><input id="db-phone" type="tel" maxlength="10" placeholder="9876543210"></div>
                <div class="form-group"><label>Assign to Restaurant</label>
                    <select id="db-rest">
                        <option value="">Public Pool (freelance)</option>
                        ${this._restaurants.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Vehicle Number</label><input id="db-vehicle" placeholder="JK01AB1234" maxlength="20"></div>
                <div class="form-group"><label>Vehicle Type</label>
                    <select id="db-vehicle-type">
                        <option value="Bike">Bike</option>
                        <option value="Scooter">Scooter</option>
                        <option value="Bicycle">Bicycle</option>
                        <option value="Car">Car</option>
                    </select>
                </div>
            `,
            actions: [
                { label: 'Add Rider', class: 'btn-primary btn-sm', action: 'add', onClick: () => this.submitAdd() },
                { label: 'Cancel', class: 'btn-outline btn-sm', action: 'cancel', onClick: (m) => { m.style.display = 'none'; }}
            ]
        });
    },

    async submitAdd() {
        const name = document.getElementById('db-name')?.value.trim();
        const phone = document.getElementById('db-phone')?.value.trim();
        if (!name) { showToast('Name is required', 'error'); return; }
        if (!phone || phone.length !== 10) { showToast('Valid 10-digit phone required', 'error'); return; }

        const restId = document.getElementById('db-rest')?.value;
        try {
            const res = await AApi.addDeliveryBoy({
                name,
                phone: '+91' + phone,
                restaurant_id: restId ? parseInt(restId) : null,
                vehicle_number: document.getElementById('db-vehicle')?.value.trim() || '',
                vehicle_type: document.getElementById('db-vehicle-type')?.value || 'Bike'
            });
            if (res?.success) {
                showToast('Delivery boy added!', 'success');
                document.getElementById('db-modal').style.display = 'none';
                this._loadBoys();
            } else showToast(res?.message || 'Error', 'error');
        } catch (e) { showToast('Failed to add rider', 'error'); }
    },

    async toggleActive(id, isActive) {
        try {
            const res = await AApi.updateDeliveryBoy({ id, is_active: isActive });
            if (res?.success) {
                showToast(isActive ? 'Rider enabled' : 'Rider disabled', 'success');
                this._loadBoys();
            } else showToast('Error', 'error');
        } catch (e) { showToast('Failed to update', 'error'); }
    },

    async _loadConfig() {
        try {
            const res = await AApi.getDelivConfig();
            const wrap = document.getElementById('deliv-config-wrap');
            if (!wrap || !res?.success) return;
            const c = res.data;
            wrap.innerHTML = `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
                    <div class="form-group"><label>Base Delivery Fee (₹)</label><input id="cfg-base" type="number" value="${c.base_delivery_fee ?? 20}" min="0"></div>
                    <div class="form-group"><label>Per KM Fee (₹)</label><input id="cfg-km" type="number" value="${c.per_km_fee ?? 5}" min="0"></div>
                    <div class="form-group"><label>Free Delivery Above (₹)</label><input id="cfg-free" type="number" value="${c.free_delivery_above ?? 299}" min="0"></div>
                    <div class="form-group"><label>Max Distance (km)</label><input id="cfg-maxdist" type="number" value="${c.max_delivery_distance_km ?? 10}" min="1"></div>
                </div>
                <button class="btn-primary btn-sm" onclick="AdminDelivery.saveConfig()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Save Config
                </button>`;
        } catch (e) {}
    },

    async saveConfig() {
        try {
            const res = await AApi.updateDelivConfig({
                base_delivery_fee: document.getElementById('cfg-base')?.value,
                per_km_fee: document.getElementById('cfg-km')?.value,
                free_delivery_above: document.getElementById('cfg-free')?.value,
                max_delivery_distance_km: document.getElementById('cfg-maxdist')?.value
            });
            if (res?.success) showToast('Config saved!', 'success');
            else showToast('Error saving config', 'error');
        } catch (e) { showToast('Failed to save config', 'error'); }
    }
};
