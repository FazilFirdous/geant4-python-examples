const MenuItem = {
    render(item, restaurantId, restaurantName) {
        const cartItem   = App.cart.find(i => i.id === item.id);
        const qty        = cartItem ? cartItem.quantity : 0;

        // Use real image or generate a themed placeholder
        let imgHtml;
        if (item.image_url) {
            imgHtml = `<img class="menu-item-img" src="${item.image_url}" alt="${item.name}" loading="lazy" onerror="this.parentElement.innerHTML=MenuItem._placeholder('${item.name}', ${item.is_veg})">`;
        } else {
            imgHtml = MenuItem._placeholder(item.name, item.is_veg);
        }

        const addControl = qty > 0 ? `
            <div class="qty-control">
                <button class="qty-btn" onclick="MenuItem.remove(${item.id})">−</button>
                <span class="qty-count">${qty}</span>
                <button class="qty-btn" onclick="MenuItem.add(${item.id}, '${item.name.replace(/'/g, "\\'")}', ${item.price}, ${item.is_veg}, ${restaurantId}, '${restaurantName.replace(/'/g, "\\'")}')">+</button>
            </div>
        ` : `
            <button class="add-btn" onclick="MenuItem.add(${item.id}, '${item.name.replace(/'/g, "\\'")}', ${item.price}, ${item.is_veg}, ${restaurantId}, '${restaurantName.replace(/'/g, "\\'")}')">ADD</button>
        `;

        return `
            <div class="menu-item" id="menu-item-${item.id}">
                <div class="menu-item-info">
                    <div class="menu-item-name">
                        <div class="veg-dot ${item.is_veg ? 'veg' : 'nonveg'}"></div>
                        ${item.name}
                        ${item.is_popular ? '<span style="font-size:10px;background:var(--star);color:white;padding:2px 6px;border-radius:4px;font-weight:700;">POPULAR</span>' : ''}
                    </div>
                    ${item.description ? `<div class="menu-item-desc">${item.description}</div>` : ''}
                    <div class="menu-item-price">₹${parseFloat(item.price).toFixed(0)}</div>
                    <div style="margin-top:8px;" id="add-ctrl-${item.id}">${addControl}</div>
                </div>
                <div class="menu-item-img-wrap">${imgHtml}</div>
            </div>
        `;
    },

    // SVG-based themed placeholder with food icon
    _placeholder(name, isVeg) {
        const bg = isVeg ? '#E8F5E9' : '#FFF0F5';
        const color = isVeg ? '#2E7D32' : '#D1386C';
        // Pick icon based on food name keywords
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
        } else if (n.includes('kebab') || n.includes('tikka')) {
            iconPath = '<path d="M12 2v20"/><circle cx="12" cy="6" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="18" r="2"/>';
        } else if (n.includes('fries') || n.includes('nugget') || n.includes('ring')) {
            iconPath = '<path d="M6 2 3 22h18L18 2"/><path d="M9 2v4"/><path d="M12 2v6"/><path d="M15 2v4"/>';
        } else if (n.includes('samosa') || n.includes('roll') || n.includes('shawarma') || n.includes('wrap')) {
            iconPath = '<path d="M4 20 20 4"/><path d="m14 6-4 4"/><path d="M4 20c0 0 4-4 8-4s8 4 8 4"/>';
        } else if (isVeg) {
            iconPath = '<path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.12 1.66c1.01.5 1.7 1.52 1.7 2.7 0 .76-.28 1.45-.75 1.97"/>';
        } else {
            iconPath = '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>';
        }

        return `<div class="menu-item-img-placeholder" style="background:${bg};display:flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${iconPath}</svg>
        </div>`;
    },

    add(id, name, price, isVeg, restaurantId, restaurantName) {
        App.addToCart({ id, name, price, is_veg: isVeg }, restaurantId, restaurantName);
        MenuItem.updateControl(id, restaurantId, restaurantName);
    },

    remove(id) {
        App.removeFromCart(id);
        const cartItem = App.cart.find(i => i.id === id);
        const restaurantId   = cartItem ? cartItem.restaurantId   : (App.cart[0] ? App.cart[0].restaurantId   : 0);
        const restaurantName = cartItem ? cartItem.restaurantName : (App.cart[0] ? App.cart[0].restaurantName : '');
        MenuItem.updateControl(id, restaurantId, restaurantName);
    },

    updateControl(id, restaurantId, restaurantName) {
        const cartItem = App.cart.find(i => i.id === id);
        const qty      = cartItem ? cartItem.quantity : 0;
        const ctrl     = document.getElementById('add-ctrl-' + id);
        if (!ctrl) return;

        if (qty > 0) {
            ctrl.innerHTML = `
                <div class="qty-control">
                    <button class="qty-btn" onclick="MenuItem.remove(${id})">−</button>
                    <span class="qty-count">${qty}</span>
                    <button class="qty-btn" onclick="MenuItem.add(${id}, '${cartItem.name.replace(/'/g, "\\'")}', ${cartItem.price}, ${cartItem.is_veg}, ${restaurantId}, '${restaurantName.replace(/'/g, "\\'")}')">+</button>
                </div>
            `;
        } else {
            const nameEl = ctrl.closest('.menu-item')?.querySelector('.menu-item-name');
            const iName  = nameEl ? nameEl.textContent.trim().replace(/POPULAR/g, '').trim() : '';
            ctrl.innerHTML = `<button class="add-btn" onclick="MenuItem.add(${id}, '${iName.replace(/'/g, "\\'")}', 0, 0, ${restaurantId}, '${restaurantName.replace(/'/g, "\\'")}')">ADD</button>`;
        }
    }
};
