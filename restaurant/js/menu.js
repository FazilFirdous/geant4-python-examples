const MenuTab = {
    menu: [],

    async render() {
        document.getElementById('tab-content').innerHTML = `
            <div style="padding:16px 0 80px;">
                <div style="padding:0 16px 12px;display:flex;justify-content:space-between;align-items:center;">
                    <h2 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;">Menu</h2>
                    <button class="btn-primary" style="padding:10px 16px;font-size:13px;" onclick="MenuTab.showAddForm()">+ Add Item</button>
                </div>
                <div id="menu-content"><div style="display:flex;justify-content:center;padding:40px;"><div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div></div></div>
            </div>
        `;
        await this.loadMenu();
    },

    async loadMenu() {
        try {
            const res = await RApi.getMenu();
            this.menu = res?.data || [];
            this.renderMenu();
        } catch(e) {
            document.getElementById('menu-content').innerHTML = `<div style="padding:20px;color:var(--danger);">Failed to load menu</div>`;
        }
    },

    renderMenu() {
        const el = document.getElementById('menu-content');
        if (!el) return;

        if (!this.menu.length) {
            el.innerHTML = `
                <div class="empty-state">
                    <div style="font-size:60px;">🍽️</div>
                    <h3 style="font-family:'Playfair Display',serif;font-size:20px;">No menu items yet</h3>
                    <p style="color:var(--text-muted);">Add your first dish to get started!</p>
                </div>
            `;
            return;
        }

        el.innerHTML = this.menu.map(cat => `
            <div style="margin-bottom:16px;">
                <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;padding:8px 16px;color:var(--text);">${cat.name}</div>
                <div class="card" style="margin:0 16px;">
                    ${(cat.items || []).map(item => this.menuItemHtml(item)).join('')}
                    ${cat.items?.length === 0 ? '<div style="padding:14px 16px;color:var(--text-muted);font-size:13px;">No items in this category</div>' : ''}
                </div>
            </div>
        `).join('');
    },

    menuItemHtml(item) {
        return `
            <div class="menu-item-row" id="menu-item-row-${item.id}">
                <div class="veg-dot ${item.is_veg ? 'veg' : 'nonveg'}"></div>
                <div style="flex:1;min-width:0;">
                    <div style="font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div>
                    <div style="font-size:14px;font-weight:700;color:var(--berry);">₹${parseFloat(item.price).toFixed(0)}</div>
                </div>
                <div style="display:flex;align-items:center;gap:8px;">
                    <div class="toggle-switch ${item.is_available ? 'on' : ''}" onclick="MenuTab.toggleItem(${item.id}, this)" title="${item.is_available ? 'Available' : 'Unavailable'}"></div>
                    <button onclick="MenuTab.deleteItem(${item.id})" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:16px;padding:4px;">🗑️</button>
                </div>
            </div>
        `;
    },

    async toggleItem(id, toggleEl) {
        try {
            const res = await RApi.toggleItem(id);
            if (res?.success) {
                const isAvail = res.data.is_available;
                toggleEl.classList.toggle('on', !!isAvail);
                Dashboard.showToast(isAvail ? 'Item marked available' : 'Item unavailable', 'info');
            }
        } catch(e) { Dashboard.showToast('Failed to toggle', 'error'); }
    },

    async deleteItem(id) {
        if (!confirm('Delete this menu item?')) return;
        try {
            const res = await RApi.deleteMenuItem(id);
            if (res?.success) {
                document.getElementById('menu-item-row-' + id)?.remove();
                Dashboard.showToast('Item deleted', 'info');
            }
        } catch(e) { Dashboard.showToast('Failed to delete', 'error'); }
    },

    showAddForm() {
        // Get categories from menu
        const categories = this.menu.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:200;display:flex;align-items:flex-end;justify-content:center;overflow-y:auto;';
        modal.innerHTML = `
            <div style="background:white;width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:24px;padding-bottom:40px;max-height:90vh;overflow-y:auto;">
                <h3 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;margin-bottom:16px;">Add Menu Item</h3>
                <form id="add-item-form">
                    <div class="form-group"><label>Item Name *</label><input type="text" name="name" required placeholder="e.g. Chicken Biryani"></div>
                    <div class="form-group"><label>Description</label><textarea name="description" rows="2" placeholder="Brief description of the dish"></textarea></div>
                    <div class="form-group"><label>Price (₹) *</label><input type="number" name="price" required min="1" placeholder="149"></div>
                    <div class="form-group"><label>Category</label>
                        <select name="category_id"><option value="">No Category</option>${categories}</select>
                    </div>
                    <div class="form-group"><label>Prep Time (minutes)</label><input type="number" name="prep_time_minutes" value="20" min="1" max="120"></div>
                    <div style="display:flex;gap:16px;margin-bottom:16px;">
                        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
                            <input type="checkbox" name="is_veg"> 🥗 Vegetarian
                        </label>
                        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
                            <input type="checkbox" name="is_popular"> ⭐ Popular
                        </label>
                    </div>
                    <div class="form-group"><label>Item Photo (optional)</label><input type="file" name="image" accept="image/*" style="border:1.5px solid var(--berry-border);border-radius:12px;padding:10px;width:100%;"></div>
                    <div style="display:flex;gap:8px;margin-top:8px;">
                        <button type="submit" class="btn-primary" style="flex:1;padding:12px;">Add Item</button>
                        <button type="button" class="btn-secondary" style="flex:1;padding:12px;" onclick="this.closest('[style]').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        modal.querySelector('#add-item-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const btn = modal.querySelector('[type=submit]');
            btn.disabled = true; btn.textContent = 'Saving...';
            try {
                const res = await RApi.saveMenuItem(formData);
                if (res?.success) {
                    modal.remove();
                    Dashboard.showToast('Item added!', 'success');
                    await this.loadMenu();
                } else {
                    throw new Error(res?.message);
                }
            } catch(err) {
                Dashboard.showToast(err.message || 'Failed to add item', 'error');
                btn.disabled = false; btn.textContent = 'Add Item';
            }
        });

        document.body.appendChild(modal);
    }
};
