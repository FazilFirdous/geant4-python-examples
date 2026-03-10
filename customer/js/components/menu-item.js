const MenuItem = {
    render(item, restaurantId, restaurantName) {
        const cartItem   = App.cart.find(i => i.id === item.id);
        const qty        = cartItem ? cartItem.quantity : 0;

        const imgHtml = item.image_url
            ? `<img class="menu-item-img" src="${item.image_url}" alt="${item.name}" loading="lazy">`
            : `<div class="menu-item-img-placeholder">${item.is_veg ? '🥗' : '🍖'}</div>`;

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
                ${imgHtml}
            </div>
        `;
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
            // Need to find item name — fetch from DOM
            const nameEl = ctrl.closest('.menu-item')?.querySelector('.menu-item-name');
            const iName  = nameEl ? nameEl.textContent.trim().replace(/POPULAR/g, '').trim() : '';
            ctrl.innerHTML = `<button class="add-btn" onclick="MenuItem.add(${id}, '${iName.replace(/'/g, "\\'")}', 0, 0, ${restaurantId}, '${restaurantName.replace(/'/g, "\\'")}')">ADD</button>`;
        }
    }
};
