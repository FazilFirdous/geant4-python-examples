/* ═══ Cora Admin — Restaurants Management (Production) ═══ */

const AdminRestaurants = {
    _list: [],
    _searchQuery: '',

    async render(container) {
        container.innerHTML = `<div class="admin-page">
            <div class="page-header">
                <h2 class="page-title">Restaurants</h2>
                <button class="btn-primary btn-sm" onclick="AdminRestaurants.showAddForm()">+ Add Restaurant</button>
            </div>

            <!-- Search -->
            <div class="admin-search-bar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" placeholder="Search restaurants..." oninput="AdminRestaurants._search(this.value)" autocomplete="off">
            </div>

            <!-- Stats -->
            <div id="rest-stats" class="mini-stats-row"></div>

            <!-- List -->
            <div id="rest-list"><div class="skel" style="height:60px;border-radius:12px;"></div></div>
        </div>
        <div id="rest-modal" class="modal-overlay" style="display:none;"></div>`;
        this._load();
    },

    async _load() {
        try {
            const res = await AApi.getRestaurants();
            if (!res?.success) return;
            this._list = res.data || [];

            // Stats
            const statsEl = document.getElementById('rest-stats');
            if (statsEl) {
                const active = this._list.filter(r => r.is_active).length;
                const open = this._list.filter(r => r.is_open).length;
                statsEl.innerHTML = `
                    <div class="mini-stat"><span class="mini-stat-value">${this._list.length}</span><span class="mini-stat-label">Total</span></div>
                    <div class="mini-stat"><span class="mini-stat-value" style="color:var(--green);">${active}</span><span class="mini-stat-label">Active</span></div>
                    <div class="mini-stat"><span class="mini-stat-value" style="color:var(--berry);">${open}</span><span class="mini-stat-label">Open Now</span></div>
                `;
            }

            this._renderList();
        } catch (e) {
            document.getElementById('rest-list').innerHTML = '<div class="empty-state"><p>Failed to load restaurants</p></div>';
        }
    },

    _search(query) {
        this._searchQuery = query.toLowerCase().trim();
        this._renderList();
    },

    _renderList() {
        const wrap = document.getElementById('rest-list');
        if (!wrap) return;

        let list = this._list;
        if (this._searchQuery) {
            list = list.filter(r =>
                (r.name || '').toLowerCase().includes(this._searchQuery) ||
                (r.area || '').toLowerCase().includes(this._searchQuery) ||
                (r.cuisine_tags || '').toLowerCase().includes(this._searchQuery)
            );
        }

        if (!list.length) { wrap.innerHTML = '<div class="empty-state"><p>No restaurants found</p></div>'; return; }

        wrap.innerHTML = `<div class="data-table-wrap"><table class="data-table">
            <thead><tr><th>Name</th><th>Owner</th><th>Area</th><th>Commission</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>${list.map(r => `
            <tr>
                <td>
                    <div style="display:flex;align-items:center;gap:6px;">
                        ${r.is_promoted ? '<span class="crown-badge">★</span>' : ''}
                        <div>
                            <strong>${r.name}</strong>
                            ${r.cuisine_tags ? `<div style="font-size:11px;color:var(--text-muted);margin-top:1px;">${r.cuisine_tags}</div>` : ''}
                        </div>
                    </div>
                </td>
                <td style="font-size:12px;">${r.owner_phone || '—'}</td>
                <td>${r.area || '—'}</td>
                <td>${r.commission_percent ?? 10}%</td>
                <td>
                    <span class="badge ${r.is_active ? 'badge-delivered' : 'badge-cancelled'}">${r.is_active ? 'Active' : 'Inactive'}</span>
                    ${r.is_open ? '<span class="badge badge-preparing" style="margin-left:4px;">Open</span>' : ''}
                </td>
                <td class="action-btns">
                    <button class="btn-xs btn-outline" onclick="AdminRestaurants.editRestaurant(${r.id})">Edit</button>
                    <button class="btn-xs ${r.is_active ? 'btn-danger' : 'btn-success'}"
                        onclick="AdminRestaurants.toggleActive(${r.id}, ${r.is_active ? 0 : 1})">
                        ${r.is_active ? 'Disable' : 'Enable'}
                    </button>
                    <button class="btn-xs btn-gold" onclick="AdminRestaurants.setCrown(${r.id})" title="Restaurant of the Week">★</button>
                </td>
            </tr>`).join('')}
            </tbody></table></div>`;
    },

    showAddForm() {
        const areas = ['Kulgam Town', 'Qaimoh', 'Devsar', 'Yaripora', 'DH Pora', 'Frisal'];

        Admin.showModal('rest-modal', {
            title: 'Add Restaurant',
            content: `
                <div class="form-group"><label>Owner Phone (+91)</label><input id="r-phone" type="tel" maxlength="10" placeholder="9876543210"></div>
                <div class="form-group"><label>Restaurant Name *</label><input id="r-name" placeholder="Taste of Kashmir" maxlength="100"></div>
                <div class="form-group"><label>Description</label><textarea id="r-desc" rows="2" maxlength="500"></textarea></div>
                <div class="form-group"><label>Cuisine Tags</label><input id="r-cuisine" placeholder="Kashmiri, Wazwan, Non-veg"></div>
                <div class="form-group"><label>Area *</label>
                    <select id="r-area"><option value="">Select area</option>${areas.map(a => `<option>${a}</option>`).join('')}</select>
                </div>
                <div class="form-group"><label>Address</label><input id="r-addr" placeholder="Main Chowk, Kulgam" maxlength="200"></div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
                    <div class="form-group"><label>Min Order (₹)</label><input id="r-minorder" type="number" value="100" min="0"></div>
                    <div class="form-group"><label>Prep Time (min)</label><input id="r-preptime" type="number" value="25" min="5"></div>
                    <div class="form-group"><label>Commission %</label><input id="r-commission" type="number" value="10" min="0" max="50"></div>
                </div>
                <div class="form-group"><label>Cover Image</label><input id="r-img" type="file" accept="image/*" style="border:1.5px solid var(--berry-border);border-radius:10px;padding:8px;width:100%;"></div>
            `,
            actions: [
                { label: 'Add Restaurant', class: 'btn-primary btn-sm', action: 'add', onClick: () => this.submitAdd() },
                { label: 'Cancel', class: 'btn-outline btn-sm', action: 'cancel', onClick: (m) => { m.style.display = 'none'; }}
            ]
        });
    },

    async submitAdd() {
        const name = document.getElementById('r-name')?.value.trim();
        const phone = document.getElementById('r-phone')?.value.trim();
        if (!name) { showToast('Restaurant name is required', 'error'); return; }
        if (!phone || phone.length !== 10) { showToast('Valid 10-digit phone required', 'error'); return; }

        const fd = new FormData();
        fd.append('owner_phone', '+91' + phone);
        fd.append('name', name);
        fd.append('description', document.getElementById('r-desc')?.value.trim() || '');
        fd.append('cuisine_tags', document.getElementById('r-cuisine')?.value.trim() || '');
        fd.append('area', document.getElementById('r-area')?.value || '');
        fd.append('address', document.getElementById('r-addr')?.value.trim() || '');
        fd.append('min_order_amount', document.getElementById('r-minorder')?.value || 100);
        fd.append('avg_prep_time_minutes', document.getElementById('r-preptime')?.value || 25);
        fd.append('commission_percent', document.getElementById('r-commission')?.value || 10);
        const imgFile = document.getElementById('r-img')?.files[0];
        if (imgFile) fd.append('cover_image', imgFile);

        try {
            const res = await AApi.addRestaurant(fd);
            if (res?.success) {
                showToast('Restaurant added!', 'success');
                document.getElementById('rest-modal').style.display = 'none';
                this._load();
            } else showToast(res?.message || 'Error', 'error');
        } catch (e) { showToast('Failed to add restaurant', 'error'); }
    },

    editRestaurant(id) {
        const r = this._list.find(x => x.id === id);
        if (!r) return;
        const areas = ['Kulgam Town', 'Qaimoh', 'Devsar', 'Yaripora', 'DH Pora', 'Frisal'];

        Admin.showModal('rest-modal', {
            title: `Edit: ${r.name}`,
            content: `
                <div class="form-group"><label>Name</label><input id="e-name" value="${r.name || ''}" maxlength="100"></div>
                <div class="form-group"><label>Description</label><textarea id="e-desc" rows="2" maxlength="500">${r.description || ''}</textarea></div>
                <div class="form-group"><label>Cuisine Tags</label><input id="e-cuisine" value="${r.cuisine_tags || ''}"></div>
                <div class="form-group"><label>Area</label>
                    <select id="e-area">${areas.map(a => `<option ${a === r.area ? 'selected' : ''}>${a}</option>`).join('')}</select>
                </div>
                <div class="form-group"><label>Address</label><input id="e-addr" value="${r.address || ''}" maxlength="200"></div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
                    <div class="form-group"><label>Min Order (₹)</label><input id="e-minorder" type="number" value="${r.min_order_amount || 100}"></div>
                    <div class="form-group"><label>Prep Time</label><input id="e-preptime" type="number" value="${r.avg_prep_time_minutes || 25}"></div>
                    <div class="form-group"><label>Commission %</label><input id="e-commission" type="number" value="${r.commission_percent ?? 10}"></div>
                </div>
            `,
            actions: [
                { label: 'Save Changes', class: 'btn-primary btn-sm', action: 'save', onClick: () => this.submitEdit(id) },
                { label: 'Cancel', class: 'btn-outline btn-sm', action: 'cancel', onClick: (m) => { m.style.display = 'none'; }}
            ]
        });
    },

    async submitEdit(id) {
        try {
            const res = await AApi.updateRestaurant({
                id,
                name: document.getElementById('e-name')?.value.trim(),
                description: document.getElementById('e-desc')?.value.trim(),
                cuisine_tags: document.getElementById('e-cuisine')?.value.trim(),
                area: document.getElementById('e-area')?.value,
                address: document.getElementById('e-addr')?.value.trim(),
                min_order_amount: document.getElementById('e-minorder')?.value,
                avg_prep_time_minutes: document.getElementById('e-preptime')?.value,
                commission_percent: document.getElementById('e-commission')?.value
            });
            if (res?.success) {
                showToast('Restaurant updated!', 'success');
                document.getElementById('rest-modal').style.display = 'none';
                this._load();
            } else showToast(res?.message || 'Error', 'error');
        } catch (e) { showToast('Failed to save', 'error'); }
    },

    async toggleActive(id, isActive) {
        try {
            const res = await AApi.updateRestaurant({ id, is_active: isActive });
            if (res?.success) {
                showToast(isActive ? 'Restaurant enabled' : 'Restaurant disabled', 'success');
                this._load();
            } else showToast('Error', 'error');
        } catch (e) { showToast('Failed to update', 'error'); }
    },

    async setCrown(id) {
        try {
            const res = await AApi.updateRestaurant({ id, is_promoted: 1, set_week_special: 1 });
            if (res?.success) { showToast('Restaurant of the Week set!', 'success'); this._load(); }
            else showToast('Error', 'error');
        } catch (e) { showToast('Failed to set crown', 'error'); }
    }
};
