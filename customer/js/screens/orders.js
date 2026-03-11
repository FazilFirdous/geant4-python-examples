const OrdersScreen = {
    async render() {
        App.setScreen(`
            <div class="screen-header">
                <div style="position:relative;z-index:1;">
                    <h2 style="color:white;font-family:'Playfair Display',serif;font-size:24px;font-weight:700;">My Orders</h2>
                    <p style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:2px;">All your past and active orders</p>
                </div>
            </div>
            <div id="orders-body">${Loading.skeleton(4)}</div>
        `);

        try {
            const res = await API.getOrders();
            const orders = res.data || [];

            if (!orders.length) {
                document.getElementById('orders-body').innerHTML = `
                    <div class="empty-state" style="margin-top:40px;">
                        <div style="width:70px;height:70px;background:var(--berry-light);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;"><i data-lucide="package" style="width:32px;height:32px;color:var(--berry);"></i></div>
                        <h3>No orders yet</h3>
                        <p>Your first order is waiting!</p>
                        <button class="btn-primary" onclick="window.location.hash='#home'" style="margin-top:16px;">Browse Restaurants</button>
                    </div>
                `;
                return;
            }

            const activeStatuses = ['placed','accepted','preparing','ready','picked_up','on_the_way','delivery_issue'];
            const active = orders.filter(o => activeStatuses.includes(o.status));
            const past   = orders.filter(o => !activeStatuses.includes(o.status));

            let html = '';

            if (active.length) {
                html += `<div style="padding:16px 16px 8px;font-family:'Playfair Display',serif;font-size:18px;font-weight:700;display:flex;align-items:center;gap:8px;"><span style="width:10px;height:10px;background:var(--berry);border-radius:50%;display:inline-block;"></span> Active Orders</div>`;
                html += active.map(o => OrdersScreen.orderCardHtml(o)).join('');
            }

            if (past.length) {
                html += `<div style="padding:16px 16px 8px;font-family:'Playfair Display',serif;font-size:18px;font-weight:700;">Past Orders</div>`;
                html += past.map(o => OrdersScreen.orderCardHtml(o)).join('');
            }

            document.getElementById('orders-body').innerHTML = `<div style="padding-bottom:16px;">${html}</div>`;

        } catch (e) {
            document.getElementById('orders-body').innerHTML = Loading.error(e.message, 'OrdersScreen.render()');
        }
    },

    orderCardHtml(o) {
        const statusLabels = {
            placed:'Order Placed', accepted:'Accepted', preparing:'Preparing', ready:'Ready',
            picked_up:'Picked Up', on_the_way:'On the Way', delivered:'Delivered',
            cancelled:'Cancelled', delivery_issue:'Delivery Issue'
        };

        return `
            <div class="order-card" onclick="window.location.hash='#order/${o.id}'">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div>
                        <div style="font-size:13px;font-weight:700;">${o.restaurant_name}</div>
                        <div style="font-size:12px;color:var(--text-muted);">${o.order_number}</div>
                    </div>
                    <div>
                        <span class="order-status-badge status-${o.status}">${statusLabels[o.status] || o.status}</span>
                    </div>
                </div>
                <div style="font-size:13px;color:var(--text-sub);margin-top:8px;">
                    ${(o.items || []).slice(0, 2).map(i => `${i.quantity}x ${i.item_name}`).join(', ')}
                    ${(o.items || []).length > 2 ? ` +${(o.items || []).length - 2} more` : ''}
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
                    <div style="font-size:15px;font-weight:700;">₹${parseFloat(o.total_amount).toFixed(0)}</div>
                    <div style="display:flex;gap:8px;">
                        ${o.status === 'delivered' ? `
                            <button class="btn-secondary" style="padding:6px 12px;font-size:12px;" onclick="event.stopPropagation();OrdersScreen.reorder(${o.id})">
                                <i data-lucide="repeat" style="width:12px;height:12px;"></i> Reorder
                            </button>
                        ` : ''}
                        <span style="font-size:12px;color:var(--text-muted);">${new Date(o.placed_at).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</span>
                    </div>
                </div>
            </div>
        `;
    },

    async reorder(orderId) {
        try {
            const res = await API.getOrder(orderId);
            if (!res.success) throw new Error(res.message);
            const order = res.data;

            // Clear cart and add all items
            App.clearCart();
            (order.items || []).forEach(item => {
                App.cart.push({
                    id:             item.menu_item_id,
                    name:           item.item_name,
                    price:          parseFloat(item.item_price),
                    quantity:       item.quantity,
                    restaurantId:   order.restaurant_id,
                    restaurantName: order.restaurant_name,
                    is_veg:         0
                });
            });
            App.saveCart();
            CartBar.update();
            App.showToast('Items added to cart!', 'success');
            window.location.hash = '#cart';
        } catch (e) {
            App.showToast('Failed to reorder', 'error');
        }
    }
};
