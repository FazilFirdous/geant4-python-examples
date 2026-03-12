/* ═══════════════════════════════════════
   CORA — Menu Item Component
   Production-grade food item card
   ═══════════════════════════════════════ */
const MenuItem = {
    // ── Render a menu item row ──────────────────
    render(item, restaurantId, restaurantName) {
        const cartItem = App.cart.find(i => i.id === item.id);
        const qty = cartItem ? cartItem.quantity : 0;
        const escapedName = (item.name || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const escapedRName = (restaurantName || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');

        // Image or themed placeholder
        let imgHtml;
        if (item.image_url) {
            imgHtml = `<div class="menu-item-img-wrap">
                <img class="menu-item-img" src="${item.image_url}" alt="${escapedName}" loading="lazy"
                     onerror="this.parentElement.innerHTML=MenuItem._placeholder('${escapedName}', ${item.is_veg})">
            </div>`;
        } else {
            imgHtml = `<div class="menu-item-img-wrap">${MenuItem._placeholder(item.name, item.is_veg)}</div>`;
        }

        // Price display with discount
        let priceHtml;
        if (item.original_price && parseFloat(item.original_price) > parseFloat(item.price)) {
            const discount = Math.round(((parseFloat(item.original_price) - parseFloat(item.price)) / parseFloat(item.original_price)) * 100);
            priceHtml = `
                <div class="menu-item-price" style="display:flex;align-items:center;gap:6px;">
                    <span>₹${parseFloat(item.price).toFixed(0)}</span>
                    <span style="font-size:12px;font-weight:400;color:var(--text-muted);text-decoration:line-through;">₹${parseFloat(item.original_price).toFixed(0)}</span>
                    <span style="font-size:11px;font-weight:700;color:var(--green);background:var(--green-light);padding:1px 6px;border-radius:4px;">${discount}% OFF</span>
                </div>
            `;
        } else {
            priceHtml = `<div class="menu-item-price">₹${parseFloat(item.price).toFixed(0)}</div>`;
        }

        // Quantity controls
        const addControl = qty > 0 ? `
            <div class="qty-control">
                <button class="qty-btn" onclick="event.stopPropagation();MenuItem.remove(${item.id})" aria-label="Decrease quantity">−</button>
                <span class="qty-count" aria-label="${qty} items">${qty}</span>
                <button class="qty-btn" onclick="event.stopPropagation();MenuItem.add(${item.id}, '${escapedName}', ${item.price}, ${item.is_veg}, ${restaurantId}, '${escapedRName}')" aria-label="Increase quantity">+</button>
            </div>
        ` : `
            <button class="add-btn" onclick="event.stopPropagation();MenuItem.add(${item.id}, '${escapedName}', ${item.price}, ${item.is_veg}, ${restaurantId}, '${escapedRName}')" aria-label="Add ${escapedName} to cart">ADD</button>
        `;

        // Tags and badges
        let badges = '';
        if (item.is_popular) {
            badges += '<span class="menu-badge menu-badge-popular"><i data-lucide="flame" style="width:10px;height:10px;"></i> Popular</span>';
        }
        if (item.is_new) {
            badges += '<span class="menu-badge menu-badge-new">NEW</span>';
        }
        if (item.spice_level && item.spice_level > 2) {
            badges += `<span class="menu-badge menu-badge-spicy">${'🌶️'.repeat(Math.min(item.spice_level, 3))}</span>`;
        }

        // Customizable indicator
        const customizable = item.has_variants || item.is_customizable ? `
            <div style="font-size:11px;color:var(--berry);margin-top:2px;display:inline-flex;align-items:center;gap:3px;">
                <i data-lucide="settings-2" style="width:10px;height:10px;"></i> Customizable
            </div>
        ` : '';

        return `
            <div class="menu-item" id="menu-item-${item.id}" role="article" aria-label="${item.name}, ₹${parseFloat(item.price).toFixed(0)}">
                <div class="menu-item-info">
                    <div class="menu-item-name">
                        <div class="veg-dot ${item.is_veg ? 'veg' : 'nonveg'}" aria-label="${item.is_veg ? 'Vegetarian' : 'Non-vegetarian'}"></div>
                        <span>${item.name}</span>
                    </div>
                    ${badges ? `<div class="menu-badges-row" style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap;">${badges}</div>` : ''}
                    ${item.description ? `<div class="menu-item-desc">${item.description}</div>` : ''}
                    ${priceHtml}
                    ${customizable}
                    <div style="margin-top:8px;" id="add-ctrl-${item.id}">${addControl}</div>
                </div>
                ${imgHtml}
            </div>
        `;
    },

    // ── SVG-based themed placeholder with food icon ─
    _placeholder(name, isVeg) {
        const bg = isVeg ? '#E8F5E9' : '#FFF0F5';
        const color = isVeg ? '#2E7D32' : '#D1386C';
        let iconPath;
        const n = (name || '').toLowerCase();

        if (n.includes('biryani') || n.includes('rice') || n.includes('pulao') || n.includes('chawal')) {
            iconPath = '<path d="M12 6c-1.7 0-3 1.3-3 3 0 2.4 3 5 3 5s3-2.6 3-5c0-1.7-1.3-3-3-3z"/><path d="M12 22c-4.97 0-9-2.24-9-5v-1c0-2.76 4.03-5 9-5s9 2.24 9 5v1c0 2.76-4.03 5-9 5z"/>';
        } else if (n.includes('burger') || n.includes('sandwich')) {
            iconPath = '<path d="M3 11h18"/><path d="M3 15h18"/><path d="M5 11V8a7 7 0 0 1 14 0v3"/><path d="M5 15v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"/>';
        } else if (n.includes('pizza')) {
            iconPath = '<path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 20 6-6-20A20 20 0 0 0 2 16"/><path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4"/>';
        } else if (n.includes('cake') || n.includes('pastry') || n.includes('brownie') || n.includes('cookie')) {
            iconPath = '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/>';
        } else if (n.includes('chai') || n.includes('tea') || n.includes('coffee') || n.includes('kehwa')) {
            iconPath = '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>';
        } else if (n.includes('ice cream') || n.includes('sundae') || n.includes('kulfi') || n.includes('shake') || n.includes('scoop')) {
            iconPath = '<path d="m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11"/><path d="M17 7A5 5 0 0 0 7 7"/><path d="M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4"/>';
        } else if (n.includes('naan') || n.includes('roti') || n.includes('paratha') || n.includes('bread') || n.includes('sheermal')) {
            iconPath = '<circle cx="12" cy="12" r="8"/><path d="M12 4c-1.5 2-2.5 4-2.5 8s1 6 2.5 8"/><path d="M12 4c1.5 2 2.5 4 2.5 8s-1 6-2.5 8"/><path d="M4 12h16"/>';
        } else if (n.includes('kebab') || n.includes('tikka') || n.includes('seekh')) {
            iconPath = '<path d="M12 2v20"/><circle cx="12" cy="6" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="18" r="2"/>';
        } else if (n.includes('fries') || n.includes('nugget') || n.includes('ring')) {
            iconPath = '<path d="M6 2 3 22h18L18 2"/><path d="M9 2v4"/><path d="M12 2v6"/><path d="M15 2v4"/>';
        } else if (n.includes('samosa') || n.includes('roll') || n.includes('shawarma') || n.includes('wrap')) {
            iconPath = '<path d="M4 20 20 4"/><path d="m14 6-4 4"/><path d="M4 20c0 0 4-4 8-4s8 4 8 4"/>';
        } else if (n.includes('momos') || n.includes('dumpling')) {
            iconPath = '<path d="M12 3c-3.87 0-7 3.13-7 7 0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="10" r="3"/>';
        } else if (n.includes('soup') || n.includes('shorba')) {
            iconPath = '<path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 21h10"/><path d="M9.3 3.7c.3 1.2-.1 2.7-1.2 4.3"/><path d="M14 3c0 1.3-.6 2.7-1.7 4.3"/>';
        } else if (n.includes('dal') || n.includes('curry') || n.includes('gravy') || n.includes('masala') || n.includes('korma') || n.includes('rogan')) {
            iconPath = '<path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.12 1.66c1.01.5 1.7 1.52 1.7 2.7 0 .76-.28 1.45-.75 1.97"/>';
        } else if (isVeg) {
            iconPath = '<path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.12 1.66c1.01.5 1.7 1.52 1.7 2.7 0 .76-.28 1.45-.75 1.97"/>';
        } else {
            iconPath = '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>';
        }

        return `<div class="menu-item-img-placeholder" style="background:${bg};display:flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${iconPath}</svg>
        </div>`;
    },

    // ── Add to cart ─────────────────────────────
    add(id, name, price, isVeg, restaurantId, restaurantName) {
        // Haptic feedback
        if (typeof App !== 'undefined') App.haptic();

        App.addToCart({ id, name, price, is_veg: isVeg }, restaurantId, restaurantName);
        MenuItem.updateControl(id, restaurantId, restaurantName);

        // Animate the add button
        const ctrl = document.getElementById('add-ctrl-' + id);
        if (ctrl) {
            ctrl.style.animation = 'none';
            ctrl.offsetHeight;
            ctrl.style.animation = 'scaleIn 0.2s ease';
        }
    },

    // ── Remove from cart ────────────────────────
    remove(id) {
        if (typeof App !== 'undefined') App.haptic();

        App.removeFromCart(id);
        const cartItem = App.cart.find(i => i.id === id);
        const restaurantId   = cartItem ? cartItem.restaurantId   : (App.cart[0] ? App.cart[0].restaurantId   : 0);
        const restaurantName = cartItem ? cartItem.restaurantName : (App.cart[0] ? App.cart[0].restaurantName : '');
        MenuItem.updateControl(id, restaurantId, restaurantName);
    },

    // ── Update quantity control in-place ─────────
    updateControl(id, restaurantId, restaurantName) {
        const cartItem = App.cart.find(i => i.id === id);
        const qty = cartItem ? cartItem.quantity : 0;
        const ctrl = document.getElementById('add-ctrl-' + id);
        if (!ctrl) return;

        const escapedRName = (restaurantName || '').replace(/'/g, "\\'");

        if (qty > 0) {
            const escapedName = (cartItem.name || '').replace(/'/g, "\\'");
            ctrl.innerHTML = `
                <div class="qty-control">
                    <button class="qty-btn" onclick="event.stopPropagation();MenuItem.remove(${id})" aria-label="Decrease quantity">−</button>
                    <span class="qty-count" aria-label="${qty} items">${qty}</span>
                    <button class="qty-btn" onclick="event.stopPropagation();MenuItem.add(${id}, '${escapedName}', ${cartItem.price}, ${cartItem.is_veg}, ${restaurantId}, '${escapedRName}')" aria-label="Increase quantity">+</button>
                </div>
            `;
        } else {
            const nameEl = ctrl.closest('.menu-item')?.querySelector('.menu-item-name span');
            const iName = nameEl ? nameEl.textContent.trim().replace(/'/g, "\\'") : '';
            ctrl.innerHTML = `<button class="add-btn" onclick="event.stopPropagation();MenuItem.add(${id}, '${iName}', 0, 0, ${restaurantId}, '${escapedRName}')" aria-label="Add to cart">ADD</button>`;
        }
    },

    // ── Render a compact menu item (for search results, reorder) ─
    renderCompact(item, restaurantId, restaurantName) {
        const escapedName = (item.name || '').replace(/'/g, "\\'");
        const escapedRName = (restaurantName || '').replace(/'/g, "\\'");
        const cartItem = App.cart.find(i => i.id === item.id);
        const qty = cartItem ? cartItem.quantity : 0;

        return `
            <div class="menu-item-compact" style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--berry-border);">
                <div class="veg-dot ${item.is_veg ? 'veg' : 'nonveg'}" style="flex-shrink:0;"></div>
                <div style="flex:1;min-width:0;">
                    <div style="font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div>
                    <div style="font-size:13px;font-weight:700;color:var(--text);margin-top:2px;">₹${parseFloat(item.price).toFixed(0)}</div>
                </div>
                <div id="add-ctrl-compact-${item.id}">
                    ${qty > 0 ? `
                        <div class="qty-control" style="padding:2px 6px;">
                            <button class="qty-btn" style="width:22px;height:22px;font-size:14px;" onclick="event.stopPropagation();MenuItem.remove(${item.id})">−</button>
                            <span class="qty-count" style="font-size:13px;min-width:16px;">${qty}</span>
                            <button class="qty-btn" style="width:22px;height:22px;font-size:14px;" onclick="event.stopPropagation();MenuItem.add(${item.id}, '${escapedName}', ${item.price}, ${item.is_veg}, ${restaurantId}, '${escapedRName}')">+</button>
                        </div>
                    ` : `
                        <button class="add-btn" style="padding:4px 12px;font-size:12px;" onclick="event.stopPropagation();MenuItem.add(${item.id}, '${escapedName}', ${item.price}, ${item.is_veg}, ${restaurantId}, '${escapedRName}')">ADD</button>
                    `}
                </div>
            </div>
        `;
    }
};
