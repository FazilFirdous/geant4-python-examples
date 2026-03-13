/* ═══ Cora Restaurant — Menu Tab (Production) ═══ */

const MenuTab = {
    menu: [],
    searchQuery: '',
    expandedCategories: new Set(),

    /* ── Render ── */
    async render() {
        document.getElementById('tab-content').innerHTML = `
            <div class="menu-container">
                <!-- Header -->
                <div class="menu-header">
                    <div>
                        <h2 class="section-title">Menu</h2>
                        <div id="menu-stats" class="menu-stats"></div>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <button class="btn-secondary" style="padding:8px 12px;font-size:13px;" onclick="MenuTab.toggleAllAvailability()" title="Toggle all items">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
                        </button>
                        <button class="btn-primary" style="padding:8px 16px;font-size:13px;" onclick="MenuTab.showItemForm()">+ Add Item</button>
                    </div>
                </div>

                <!-- Search -->
                <div class="menu-search-bar">
                    <div class="search-input-wrap">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <input type="text" id="menu-search" placeholder="Search menu items..."
                            oninput="MenuTab.onSearch(this.value)" autocomplete="off">
                    </div>
                </div>

                <!-- Menu Content -->
                <div id="menu-content">
                    <div class="tab-loading">
                        <div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div>
                    </div>
                </div>
            </div>
        `;
        await this.loadMenu();
    },

    /* ── Data ── */
    async loadMenu() {
        try {
            const res = await RApi.getMenu();
            this.menu = res?.data || [];
            this._updateStats();
            this.renderMenu();
        } catch(e) {
            document.getElementById('menu-content').innerHTML = `
                <div class="orders-error">
                    <p>Failed to load menu</p>
                    <button class="btn-secondary" style="padding:8px 16px;font-size:13px;" onclick="MenuTab.loadMenu()">Retry</button>
                </div>`;
        }
    },

    _updateStats() {
        const el = document.getElementById('menu-stats');
        if (!el) return;
        const totalItems = this.menu.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
        const availItems = this.menu.reduce((sum, cat) => sum + (cat.items || []).filter(i => i.is_available).length, 0);
        el.textContent = `${totalItems} items · ${availItems} available · ${this.menu.length} categories`;
    },

    onSearch(query) {
        this.searchQuery = query.toLowerCase().trim();
        this.renderMenu();
    },

    /* ── Render Menu ── */
    renderMenu() {
        const el = document.getElementById('menu-content');
        if (!el) return;

        if (!this.menu.length) {
            el.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--berry)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
                    </div>
                    <h3 style="font-family:'Playfair Display',serif;font-size:20px;">No menu items yet</h3>
                    <p style="color:var(--text-muted);">Add your first dish to get started!</p>
                    <button class="btn-primary" style="padding:10px 20px;margin-top:8px;" onclick="MenuTab.showItemForm()">+ Add First Item</button>
                </div>
            `;
            return;
        }

        let categories = this.menu;

        // Filter by search
        if (this.searchQuery) {
            categories = categories.map(cat => ({
                ...cat,
                items: (cat.items || []).filter(item =>
                    item.name.toLowerCase().includes(this.searchQuery) ||
                    (item.description || '').toLowerCase().includes(this.searchQuery)
                )
            })).filter(cat => cat.items.length > 0);

            if (categories.length === 0) {
                el.innerHTML = `
                    <div class="empty-state" style="padding:40px 20px;">
                        <p style="color:var(--text-muted);font-size:14px;">No items match "${this.searchQuery}"</p>
                    </div>`;
                return;
            }
        }

        el.innerHTML = categories.map(cat => {
            const availCount = (cat.items || []).filter(i => i.is_available).length;
            const totalCount = (cat.items || []).length;

            return `
                <div class="menu-category" data-category-id="${cat.id}">
                    <div class="menu-category-header" onclick="MenuTab.toggleCategory(${cat.id})">
                        <div>
                            <span class="menu-category-name">${cat.name}</span>
                            <span class="menu-category-count">${availCount}/${totalCount} available</span>
                        </div>
                        <svg class="category-chevron ${this.expandedCategories.has(cat.id) || this.searchQuery ? 'expanded' : ''}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                    <div class="menu-category-items ${this.expandedCategories.has(cat.id) || this.searchQuery ? 'expanded' : ''}">
                        ${(cat.items || []).map(item => this._menuItemHtml(item)).join('')}
                        ${totalCount === 0 ? '<div class="menu-empty-cat">No items in this category</div>' : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    toggleCategory(catId) {
        if (this.expandedCategories.has(catId)) {
            this.expandedCategories.delete(catId);
        } else {
            this.expandedCategories.add(catId);
        }
        this.renderMenu();
    },

    _menuItemHtml(item) {
        const unavailClass = item.is_available ? '' : 'unavailable';
        return `
            <div class="menu-item-row ${unavailClass}" id="menu-item-row-${item.id}">
                <div class="veg-dot ${item.is_veg ? 'veg' : 'nonveg'}" title="${item.is_veg ? 'Vegetarian' : 'Non-veg'}"></div>
                <div class="menu-item-info">
                    <div class="menu-item-name-row">
                        <span class="menu-item-name">${item.name}</span>
                        ${item.is_popular ? '<span class="menu-badge popular">Popular</span>' : ''}
                        ${!item.is_available ? '<span class="menu-badge unavail">Unavailable</span>' : ''}
                    </div>
                    ${item.description ? `<div class="menu-item-desc">${item.description}</div>` : ''}
                    <div class="menu-item-price-row">
                        <span class="menu-item-price">₹${parseFloat(item.price).toFixed(0)}</span>
                        ${item.prep_time_minutes ? `<span class="menu-item-prep">${item.prep_time_minutes} min</span>` : ''}
                    </div>
                </div>
                <div class="menu-item-actions">
                    <div class="toggle-switch ${item.is_available ? 'on' : ''}"
                        onclick="event.stopPropagation();MenuTab.toggleItem(${item.id}, this)"
                        title="${item.is_available ? 'Available' : 'Unavailable'}"
                        role="switch" aria-checked="${!!item.is_available}" tabindex="0"></div>
                    <button class="menu-item-edit-btn" onclick="MenuTab.showItemForm(${item.id})" title="Edit item" aria-label="Edit ${item.name}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
                    </button>
                    <button class="menu-item-delete-btn" onclick="MenuTab.confirmDeleteItem(${item.id}, '${item.name.replace(/'/g, "\\'")}')" title="Delete item" aria-label="Delete ${item.name}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
        `;
    },

    /* ── Item CRUD ── */
    async toggleItem(id, toggleEl) {
        try {
            const res = await RApi.toggleItem(id);
            if (res?.success) {
                const isAvail = res.data.is_available;
                toggleEl.classList.toggle('on', !!isAvail);
                toggleEl.setAttribute('aria-checked', !!isAvail);

                // Update local data
                this.menu.forEach(cat => {
                    const item = (cat.items || []).find(i => i.id === id);
                    if (item) item.is_available = isAvail;
                });
                this._updateStats();

                Dashboard.showToast(isAvail ? 'Item available' : 'Item marked unavailable', 'info');
            }
        } catch(e) { Dashboard.showToast('Failed to toggle availability', 'error'); }
    },

    confirmDeleteItem(id, name) {
        Dashboard.showModal({
            title: 'Delete Menu Item',
            content: `
                <p style="color:var(--danger);">Are you sure you want to delete <strong>"${name}"</strong>?</p>
                <p style="font-size:13px;color:var(--text-muted);margin-top:8px;">This action cannot be undone.</p>
            `,
            actions: [
                { label: 'Delete', class: 'btn-danger', style: 'flex:1;padding:12px;', action: 'delete',
                    onClick: async (modal) => {
                        modal.remove();
                        await this.deleteItem(id);
                    }
                },
                { label: 'Keep', class: 'btn-secondary', style: 'flex:1;padding:12px;', action: 'close' }
            ]
        });
    },

    async deleteItem(id) {
        try {
            const res = await RApi.deleteMenuItem(id);
            if (res?.success) {
                // Remove from local data
                this.menu.forEach(cat => {
                    cat.items = (cat.items || []).filter(i => i.id !== id);
                });
                this._updateStats();
                this.renderMenu();
                Dashboard.showToast('Item deleted', 'info');
            }
        } catch(e) { Dashboard.showToast('Failed to delete item', 'error'); }
    },

    /* ── Add/Edit Item Form ── */
    showItemForm(editId = null) {
        let editItem = null;
        if (editId) {
            this.menu.forEach(cat => {
                const found = (cat.items || []).find(i => i.id === editId);
                if (found) editItem = { ...found, category_id: cat.id };
            });
        }

        const categories = this.menu.map(c => `
            <option value="${c.id}" ${editItem?.category_id === c.id ? 'selected' : ''}>${c.name}</option>
        `).join('');

        const isEdit = !!editItem;
        const title = isEdit ? `Edit: ${editItem.name}` : 'Add Menu Item';

        Dashboard.showModal({
            title,
            content: `
                <form id="item-form" class="item-form">
                    <div class="form-group">
                        <label>Item Name *</label>
                        <input type="text" name="name" required placeholder="e.g. Chicken Biryani"
                            value="${editItem?.name || ''}" maxlength="100">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" rows="2" placeholder="Brief description of the dish"
                            maxlength="255">${editItem?.description || ''}</textarea>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                        <div class="form-group">
                            <label>Price (₹) *</label>
                            <input type="number" name="price" required min="1" max="5000" placeholder="149"
                                value="${editItem?.price ? parseFloat(editItem.price).toFixed(0) : ''}">
                        </div>
                        <div class="form-group">
                            <label>Prep Time (min)</label>
                            <input type="number" name="prep_time_minutes" value="${editItem?.prep_time_minutes || 20}" min="1" max="120">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select name="category_id">
                            <option value="">No Category</option>
                            ${categories}
                            <option value="__new__">+ New Category...</option>
                        </select>
                    </div>
                    <div id="new-cat-field" style="display:none;" class="form-group">
                        <label>New Category Name</label>
                        <input type="text" id="new-cat-name" placeholder="e.g. Kashmiri Specials" maxlength="50">
                    </div>
                    <div class="form-row-checkboxes">
                        <label class="checkbox-label">
                            <input type="checkbox" name="is_veg" ${editItem?.is_veg ? 'checked' : ''}>
                            <span class="veg-dot veg" style="width:12px;height:12px;"></span> Vegetarian
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="is_popular" ${editItem?.is_popular ? 'checked' : ''}> Popular
                        </label>
                    </div>
                    <div class="form-group">
                        <label>Item Photo ${isEdit ? '' : '(optional)'}</label>
                        <div class="file-upload-area" id="file-upload-area">
                            <input type="file" name="image" accept="image/*" id="item-image-input"
                                onchange="MenuTab._previewImage(this)">
                            <div id="image-preview" class="image-preview-box">
                                ${editItem?.image_url ? `<img src="${editItem.image_url}" alt="Current image" style="max-width:100%;max-height:120px;border-radius:8px;">` : `
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                    <span style="font-size:12px;color:var(--text-muted);">Tap to upload photo</span>
                                `}
                            </div>
                        </div>
                    </div>
                </form>
            `,
            actions: [
                { label: isEdit ? 'Save Changes' : 'Add Item', class: 'btn-primary', style: 'flex:1;padding:12px;', action: 'save',
                    onClick: async (modal) => {
                        await this._saveItem(modal, editId);
                    }
                },
                { label: 'Cancel', class: 'btn-secondary', style: 'flex:1;padding:12px;', action: 'close' }
            ]
        });

        // Category select change handler
        setTimeout(() => {
            const catSelect = document.querySelector('[name="category_id"]');
            if (catSelect) {
                catSelect.addEventListener('change', function() {
                    const newCatField = document.getElementById('new-cat-field');
                    if (newCatField) newCatField.style.display = this.value === '__new__' ? 'block' : 'none';
                });
            }
        }, 50);
    },

    _previewImage(input) {
        const preview = document.getElementById('image-preview');
        if (!preview || !input.files?.[0]) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width:100%;max-height:120px;border-radius:8px;">`;
        };
        reader.readAsDataURL(input.files[0]);
    },

    async _saveItem(modal, editId) {
        const form = modal.querySelector('#item-form');
        if (!form) return;

        const formData = new FormData(form);

        // Handle new category
        const catSelect = form.querySelector('[name="category_id"]');
        if (catSelect?.value === '__new__') {
            const newCatName = document.getElementById('new-cat-name')?.value.trim();
            if (!newCatName) {
                Dashboard.showToast('Enter a category name', 'error');
                return;
            }
            formData.set('new_category_name', newCatName);
            formData.delete('category_id');
        }

        // Validate
        if (!formData.get('name')?.trim()) {
            Dashboard.showToast('Item name is required', 'error');
            return;
        }
        if (!formData.get('price') || parseFloat(formData.get('price')) <= 0) {
            Dashboard.showToast('Enter a valid price', 'error');
            return;
        }

        const btn = modal.querySelector('[data-action="save"]');
        if (btn) { btn.disabled = true; btn.innerHTML = '<span class="btn-spinner"></span> Saving...'; }

        try {
            const res = editId
                ? await RApi.updateMenuItem(editId, formData)
                : await RApi.saveMenuItem(formData);

            if (res?.success) {
                modal.remove();
                Dashboard.showToast(editId ? 'Item updated!' : 'Item added!', 'success');
                await this.loadMenu();
            } else {
                throw new Error(res?.message);
            }
        } catch(err) {
            Dashboard.showToast(err.message || 'Failed to save item', 'error');
            if (btn) { btn.disabled = false; btn.textContent = editId ? 'Save Changes' : 'Add Item'; }
        }
    },

    /* ── Bulk Operations ── */
    async toggleAllAvailability() {
        const totalItems = this.menu.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
        const availItems = this.menu.reduce((sum, cat) => sum + (cat.items || []).filter(i => i.is_available).length, 0);
        const allAvailable = availItems === totalItems;

        Dashboard.showModal({
            title: allAvailable ? 'Mark All Unavailable' : 'Mark All Available',
            content: `<p>This will mark <strong>all ${totalItems} items</strong> as ${allAvailable ? 'unavailable' : 'available'}.</p>`,
            actions: [
                { label: 'Confirm', class: allAvailable ? 'btn-danger' : 'btn-success', style: 'flex:1;padding:12px;', action: 'confirm',
                    onClick: async (modal) => {
                        modal.remove();
                        let count = 0;
                        for (const cat of this.menu) {
                            for (const item of (cat.items || [])) {
                                if (item.is_available === (allAvailable ? 1 : 0)) {
                                    try {
                                        await RApi.toggleItem(item.id);
                                        count++;
                                    } catch(e) {}
                                }
                            }
                        }
                        Dashboard.showToast(`${count} items updated`, 'success');
                        await this.loadMenu();
                    }
                },
                { label: 'Cancel', class: 'btn-secondary', style: 'flex:1;padding:12px;', action: 'close' }
            ]
        });
    }
};
