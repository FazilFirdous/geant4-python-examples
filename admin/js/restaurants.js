/* ============================================================
   Cora Admin — restaurants.js
   ============================================================ */
const AdminRestaurants = {
    _list: [],

    async render(container) {
        container.innerHTML = `<div style="padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h2 style="font-family:'Playfair Display',serif;font-size:20px;">Restaurants</h2>
                <button class="btn-primary btn-sm" onclick="AdminRestaurants.showAddForm()">+ Add</button>
            </div>
            <div id="rest-list"><div class="skel" style="height:60px;border-radius:12px;"></div></div>
        </div>
        <div id="rest-modal" class="modal-overlay" style="display:none;"></div>`;
        this._load();
    },

    async _load() {
        const res = await AApi.getRestaurants();
        if (!res.success) return;
        this._list = res.data;
        const wrap = document.getElementById('rest-list');
        if (!wrap) return;
        if (!this._list.length) { wrap.innerHTML = '<p class="empty-state">No restaurants yet</p>'; return; }

        wrap.innerHTML = `<div class="data-table-wrap"><table class="data-table">
            <thead><tr><th>Name</th><th>Owner Phone</th><th>Area</th><th>Commission</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>${this._list.map(r => `
            <tr>
                <td>
                    ${r.is_promoted ? '<span class="crown-badge">👑</span> ' : ''}
                    <strong>${r.name}</strong>
                    ${r.cuisine_tags ? `<br><small style="color:#999;">${r.cuisine_tags}</small>` : ''}
                </td>
                <td>${r.owner_phone || '—'}</td>
                <td>${r.area || '—'}</td>
                <td>${r.commission_percent ?? 10}%</td>
                <td>
                    <span class="badge ${r.is_active ? 'badge-delivered' : 'badge-cancelled'}">${r.is_active ? 'Active' : 'Inactive'}</span>
                    ${r.is_open ? '<span class="badge badge-preparing" style="margin-left:4px;">Open</span>' : ''}
                </td>
                <td class="action-btns">
                    <button class="btn-xs btn-outline" onclick="AdminRestaurants.editRestaurant(${r.id})">Edit</button>
                    <button class="btn-xs ${r.is_active ? 'btn-danger' : 'btn-success'}" onclick="AdminRestaurants.toggleActive(${r.id}, ${r.is_active ? 0 : 1})">${r.is_active ? 'Disable' : 'Enable'}</button>
                    <button class="btn-xs btn-gold" onclick="AdminRestaurants.setCrown(${r.id})" title="Set Restaurant of the Week">👑</button>
                </td>
            </tr>`).join('')}
            </tbody></table></div>`;
    },

    showAddForm() {
        const modal = document.getElementById('rest-modal');
        modal.style.display = 'flex';
        modal.innerHTML = `<div class="modal-box">
            <div class="modal-header"><h3>Add Restaurant</h3><button class="modal-close" onclick="AdminRestaurants.closeModal()">✕</button></div>
            <div style="padding:20px;overflow-y:auto;max-height:70vh;">
                <div class="form-group"><label>Owner Phone (+91)</label><input id="r-phone" type="tel" maxlength="10" placeholder="9876543210"></div>
                <div class="form-group"><label>Restaurant Name</label><input id="r-name" placeholder="Taste of Kashmir"></div>
                <div class="form-group"><label>Description</label><textarea id="r-desc" rows="2"></textarea></div>
                <div class="form-group"><label>Cuisine Tags (comma-separated)</label><input id="r-cuisine" placeholder="Kashmiri, Wazwan, Non-veg"></div>
                <div class="form-group"><label>Area</label>
                    <select id="r-area"><option value="">Select area</option>
                    ${['Kulgam Town','Qaimoh','Devsar','Yaripora','DH Pora','Frisal'].map(a => `<option>${a}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Address</label><input id="r-addr" placeholder="Main Chowk, Kulgam"></div>
                <div class="form-group"><label>Min Order (₹)</label><input id="r-minorder" type="number" value="100"></div>
                <div class="form-group"><label>Avg Prep Time (minutes)</label><input id="r-preptime" type="number" value="25"></div>
                <div class="form-group"><label>Commission (%)</label><input id="r-commission" type="number" value="10" min="0" max="50"></div>
                <div class="form-group"><label>Cover Image</label><input id="r-img" type="file" accept="image/*"></div>
                <button class="btn-primary" style="width:100%;margin-top:8px;" onclick="AdminRestaurants.submitAdd()">Add Restaurant</button>
            </div>
        </div>`;
    },

    async submitAdd() {
        const fd = new FormData();
        fd.append('owner_phone', '+91' + document.getElementById('r-phone').value.trim());
        fd.append('name', document.getElementById('r-name').value.trim());
        fd.append('description', document.getElementById('r-desc').value.trim());
        fd.append('cuisine_tags', document.getElementById('r-cuisine').value.trim());
        fd.append('area', document.getElementById('r-area').value);
        fd.append('address', document.getElementById('r-addr').value.trim());
        fd.append('min_order_amount', document.getElementById('r-minorder').value);
        fd.append('avg_prep_time_minutes', document.getElementById('r-preptime').value);
        fd.append('commission_percent', document.getElementById('r-commission').value);
        const imgFile = document.getElementById('r-img').files[0];
        if (imgFile) fd.append('cover_image', imgFile);

        const res = await AApi.addRestaurant(fd);
        if (res.success) {
            showToast('Restaurant added!');
            this.closeModal();
            this._load();
        } else {
            showToast(res.message || 'Error adding restaurant');
        }
    },

    editRestaurant(id) {
        const r = this._list.find(x => x.id === id);
        if (!r) return;
        const modal = document.getElementById('rest-modal');
        modal.style.display = 'flex';
        modal.innerHTML = `<div class="modal-box">
            <div class="modal-header"><h3>Edit Restaurant</h3><button class="modal-close" onclick="AdminRestaurants.closeModal()">✕</button></div>
            <div style="padding:20px;overflow-y:auto;max-height:70vh;">
                <div class="form-group"><label>Name</label><input id="e-name" value="${r.name}"></div>
                <div class="form-group"><label>Description</label><textarea id="e-desc" rows="2">${r.description || ''}</textarea></div>
                <div class="form-group"><label>Cuisine Tags</label><input id="e-cuisine" value="${r.cuisine_tags || ''}"></div>
                <div class="form-group"><label>Area</label>
                    <select id="e-area">
                    ${['Kulgam Town','Qaimoh','Devsar','Yaripora','DH Pora','Frisal'].map(a => `<option ${a === r.area ? 'selected' : ''}>${a}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Address</label><input id="e-addr" value="${r.address || ''}"></div>
                <div class="form-group"><label>Min Order (₹)</label><input id="e-minorder" type="number" value="${r.min_order_amount || 100}"></div>
                <div class="form-group"><label>Avg Prep Time</label><input id="e-preptime" type="number" value="${r.avg_prep_time_minutes || 25}"></div>
                <div class="form-group"><label>Commission (%)</label><input id="e-commission" type="number" value="${r.commission_percent ?? 10}"></div>
                <button class="btn-primary" style="width:100%;margin-top:8px;" onclick="AdminRestaurants.submitEdit(${id})">Save Changes</button>
            </div>
        </div>`;
    },

    async submitEdit(id) {
        const res = await AApi.updateRestaurant({
            id,
            name:                document.getElementById('e-name').value.trim(),
            description:         document.getElementById('e-desc').value.trim(),
            cuisine_tags:        document.getElementById('e-cuisine').value.trim(),
            area:                document.getElementById('e-area').value,
            address:             document.getElementById('e-addr').value.trim(),
            min_order_amount:    document.getElementById('e-minorder').value,
            avg_prep_time_minutes: document.getElementById('e-preptime').value,
            commission_percent:  document.getElementById('e-commission').value
        });
        if (res.success) { showToast('Saved!'); this.closeModal(); this._load(); }
        else showToast(res.message || 'Error');
    },

    async toggleActive(id, isActive) {
        const res = await AApi.updateRestaurant({ id, is_active: isActive });
        if (res.success) { showToast(isActive ? 'Restaurant enabled' : 'Restaurant disabled'); this._load(); }
        else showToast('Error');
    },

    async setCrown(id) {
        /* Remove crown from everyone, set on this one */
        const res = await AApi.updateRestaurant({ id, is_promoted: 1, set_week_special: 1 });
        if (res.success) { showToast('👑 Restaurant of the Week set!'); this._load(); }
        else showToast('Error setting crown');
    },

    closeModal() {
        const m = document.getElementById('rest-modal');
        if (m) m.style.display = 'none';
    }
};
