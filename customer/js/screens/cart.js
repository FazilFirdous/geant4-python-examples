const CartScreen = {
    selectedAddressId: null,
    paymentMethod: 'cod',
    couponCode: '',
    couponDiscount: 0,
    orderType: 'delivery',
    addresses: [],

    async render() {
        if (App.cart.length === 0) {
            App.setScreen(`
                <div class="screen-header">
                    <div style="display:flex;align-items:center;gap:12px;position:relative;z-index:1;">
                        <button class="screen-back-btn" onclick="history.back()">←</button>
                        <h2 style="color:white;font-family:'Playfair Display',serif;font-size:22px;">Your Cart</h2>
                    </div>
                </div>
                <div class="empty-state" style="margin-top:40px;">
                    <div class="empty-state-emoji">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Add items from a restaurant to get started</p>
                    <button class="btn-primary" onclick="window.location.hash='#home'" style="margin-top:16px;">Browse Restaurants</button>
                </div>
            `);
            return;
        }

        const restaurantId = App.cart[0]?.restaurantId;
        this.orderType = 'delivery';
        this.couponDiscount = 0;
        this.couponCode = '';
        this.selectedAddressId = null;

        App.setScreen(`
            <div class="screen-header">
                <div style="display:flex;align-items:center;gap:12px;position:relative;z-index:1;">
                    <button class="screen-back-btn" onclick="history.back()">←</button>
                    <h2 style="color:white;font-family:'Playfair Display',serif;font-size:22px;">Your Cart</h2>
                </div>
                <div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:6px;z-index:1;position:relative;">${App.cart[0]?.restaurantName || ''}</div>
            </div>

            <div id="cart-body" style="padding-bottom:100px;">
                <!-- Cart Items -->
                <div class="card" style="margin:16px;padding:0;">
                    <div id="cart-items"></div>
                </div>

                <!-- Order Type -->
                <div style="padding:0 16px 12px;">
                    <div style="font-size:13px;font-weight:600;color:var(--text-sub);margin-bottom:8px;">Order Type</div>
                    <div style="display:flex;gap:8px;">
                        <button id="ot-delivery" class="btn-primary" style="flex:1;padding:10px;" onclick="CartScreen.setOrderType('delivery')">🛵 Delivery</button>
                        <button id="ot-pickup" class="btn-secondary" style="flex:1;padding:10px;" onclick="CartScreen.setOrderType('pickup')">🏃 Pickup</button>
                    </div>
                </div>

                <!-- Addresses -->
                <div id="address-section" style="padding:0 16px 12px;">
                    <div style="font-size:13px;font-weight:600;color:var(--text-sub);margin-bottom:8px;">Delivery Address</div>
                    <div id="address-list">${Loading.spinner('Loading addresses...')}</div>
                    <button class="btn-secondary" style="width:100%;margin-top:8px;padding:10px;" onclick="CartScreen.showAddAddressForm()">+ Add New Address</button>
                </div>

                <!-- Special Instructions -->
                <div style="padding:0 16px 12px;">
                    <div class="input-group">
                        <label>Special Instructions (optional)</label>
                        <textarea id="special-instructions" placeholder="Allergies, special requests..."></textarea>
                    </div>
                </div>

                <!-- Coupon -->
                <div style="padding:0 16px 12px;">
                    <div style="font-size:13px;font-weight:600;color:var(--text-sub);margin-bottom:8px;">Have a coupon?</div>
                    <div style="display:flex;gap:8px;">
                        <input type="text" id="coupon-input" placeholder="Enter coupon code" style="flex:1;background:white;border:1.5px solid var(--berry-border);border-radius:12px;padding:12px 14px;font-size:14px;outline:none;font-family:'DM Sans',sans-serif;" oninput="this.value=this.value.toUpperCase()">
                        <button class="btn-secondary" onclick="CartScreen.applyCoupon()" style="padding:12px 16px;">Apply</button>
                    </div>
                    <div id="coupon-status" style="margin-top:6px;font-size:13px;"></div>
                </div>

                <!-- Price Breakdown -->
                <div class="card" style="margin:0 16px 12px;padding:16px;">
                    <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:12px;">Price Details</div>
                    <div id="price-breakdown"></div>
                </div>

                <!-- Payment Method -->
                <div style="padding:0 16px 12px;">
                    <div style="font-size:13px;font-weight:600;color:var(--text-sub);margin-bottom:8px;">Payment Method</div>
                    <div class="payment-options">
                        <div class="payment-option selected" id="pm-cod" onclick="CartScreen.setPayment('cod')">
                            <div class="payment-icon">💵</div>
                            <div class="payment-name">Cash on Delivery</div>
                        </div>
                        <div class="payment-option" id="pm-upi" onclick="CartScreen.setPayment('upi')">
                            <div class="payment-icon">📱</div>
                            <div class="payment-name">Pay via UPI</div>
                        </div>
                    </div>
                </div>

                <!-- Place Order -->
                <div style="padding:0 16px 16px;">
                    <button class="btn-primary" style="width:100%;font-size:16px;padding:16px;" id="place-order-btn" onclick="CartScreen.placeOrder()">
                        Place Order →
                    </button>
                </div>
            </div>
        `);

        this.renderCartItems();
        this.renderPriceBreakdown();
        await this.loadAddresses();
    },

    renderCartItems() {
        const container = document.getElementById('cart-items');
        if (!container) return;
        container.innerHTML = App.cart.map(item => `
            <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--berry-border);">
                <div class="veg-dot ${item.is_veg ? 'veg' : 'nonveg'}"></div>
                <div style="flex:1;">
                    <div style="font-size:14px;font-weight:600;">${item.name}</div>
                    <div style="font-size:13px;color:var(--text-sub);">₹${item.price.toFixed(0)} × ${item.quantity}</div>
                </div>
                <div class="qty-control">
                    <button class="qty-btn" onclick="CartScreen.removeItem(${item.id})">−</button>
                    <span class="qty-count">${item.quantity}</span>
                    <button class="qty-btn" onclick="CartScreen.addItem(${item.id})">+</button>
                </div>
                <div style="font-size:15px;font-weight:700;min-width:50px;text-align:right;">₹${(item.price * item.quantity).toFixed(0)}</div>
            </div>
        `).join('') + `
            <div style="padding:12px 16px;">
                <button onclick="App.clearCart();window.location.hash='#home'" style="background:none;border:none;color:var(--danger);font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;">🗑️ Clear cart</button>
            </div>
        `;
    },

    addItem(id) {
        const item = App.cart.find(i => i.id === id);
        if (item) { item.quantity++; App.saveCart(); this.renderCartItems(); this.renderPriceBreakdown(); }
    },

    removeItem(id) {
        App.removeFromCart(id);
        this.renderCartItems();
        this.renderPriceBreakdown();
        if (App.cart.length === 0) this.render();
    },

    renderPriceBreakdown() {
        const subtotal    = App.getCartTotal();
        const deliveryFee = this.orderType === 'delivery' ? 25 : 0;
        const platformFee = 5;
        const discount    = this.couponDiscount;
        const total       = Math.max(0, subtotal + deliveryFee + platformFee - discount);

        const el = document.getElementById('price-breakdown');
        if (!el) return;

        el.innerHTML = `
            <div class="price-row">
                <span>Subtotal (${App.getCartCount()} items)</span>
                <span>₹${subtotal.toFixed(0)}</span>
            </div>
            ${this.orderType === 'delivery' ? `<div class="price-row"><span>Delivery fee</span><span>₹${deliveryFee}</span></div>` : ''}
            <div class="price-row"><span>Platform fee</span><span>₹${platformFee}</span></div>
            ${discount > 0 ? `<div class="price-row discount"><span>Coupon (${this.couponCode})</span><span>−₹${discount.toFixed(0)}</span></div>` : ''}
            <div class="price-row total"><span>Total</span><span>₹${total.toFixed(0)}</span></div>
        `;
    },

    setOrderType(type) {
        this.orderType = type;
        ['delivery','pickup'].forEach(t => {
            const btn = document.getElementById(`ot-${t}`);
            if (btn) btn.className = `btn-${t === type ? 'primary' : 'secondary'}`;
        });
        const addrSection = document.getElementById('address-section');
        if (addrSection) addrSection.style.display = type === 'delivery' ? 'block' : 'none';
        this.renderPriceBreakdown();
    },

    setPayment(method) {
        this.paymentMethod = method;
        document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
        document.getElementById(`pm-${method}`)?.classList.add('selected');
    },

    async loadAddresses() {
        try {
            const res = await API.getAddresses();
            this.addresses = res.data || [];
            this.renderAddresses();
        } catch (e) {
            document.getElementById('address-list').innerHTML = `<p style="color:var(--text-muted);font-size:13px;">Could not load addresses</p>`;
        }
    },

    renderAddresses() {
        const el = document.getElementById('address-list');
        if (!el) return;
        if (!this.addresses.length) {
            el.innerHTML = `<p style="color:var(--text-muted);font-size:13px;">No saved addresses. Add one below.</p>`;
            return;
        }
        el.innerHTML = this.addresses.map(a => `
            <div class="address-card ${a.id === this.selectedAddressId ? 'selected' : ''}" onclick="CartScreen.selectAddress(${a.id})">
                <div class="address-icon">${a.label === 'Home' ? '🏠' : (a.label === 'Work' ? '🏢' : '📍')}</div>
                <div class="address-details">
                    <div class="address-label">${a.label}</div>
                    <div class="address-text">${a.full_address}${a.landmark ? ', ' + a.landmark : ''}</div>
                </div>
            </div>
        `).join('');

        // Auto-select default or first
        const def = this.addresses.find(a => a.is_default) || this.addresses[0];
        if (def) this.selectAddress(def.id, false);
    },

    selectAddress(id, rerender = true) {
        this.selectedAddressId = id;
        if (rerender) {
            document.querySelectorAll('.address-card').forEach(el => el.classList.remove('selected'));
            document.querySelector(`.address-card[onclick*="${id}"]`)?.classList.add('selected');
        }
    },

    showAddAddressForm() {
        const el = document.getElementById('address-section');
        el.insertAdjacentHTML('beforeend', `
            <div class="card" style="padding:16px;margin-top:10px;" id="add-addr-form">
                <div class="input-group"><label>Label</label>
                    <select id="addr-label"><option>Home</option><option>Work</option><option>Other</option></select>
                </div>
                <div class="input-group"><label>Full Address</label>
                    <textarea id="addr-full" placeholder="House/Flat no, Street, Area" style="height:70px;"></textarea>
                </div>
                <div class="input-group"><label>Landmark (optional)</label>
                    <input type="text" id="addr-landmark" placeholder="Near mosque, hospital...">
                </div>
                <div class="input-group"><label>Area</label>
                    <select id="addr-area">
                        <option>Kulgam Town</option><option>Qaimoh</option><option>Yaripora</option>
                        <option>DH Pora</option><option>Devsar</option><option>Frisal</option>
                    </select>
                </div>
                <div style="display:flex;gap:8px;">
                    <button class="btn-primary" style="flex:1;padding:10px;" onclick="CartScreen.saveAddress()">Save</button>
                    <button class="btn-secondary" style="flex:1;padding:10px;" onclick="document.getElementById('add-addr-form').remove()">Cancel</button>
                </div>
            </div>
        `);
    },

    async saveAddress() {
        const data = {
            label:        document.getElementById('addr-label').value,
            full_address: document.getElementById('addr-full').value,
            landmark:     document.getElementById('addr-landmark').value,
            area:         document.getElementById('addr-area').value,
            is_default:   this.addresses.length === 0 ? 1 : 0
        };
        if (!data.full_address) { App.showToast('Enter full address', 'error'); return; }
        try {
            const res = await API.addAddress(data);
            if (res.success) {
                this.addresses.push(res.data);
                this.renderAddresses();
                document.getElementById('add-addr-form')?.remove();
                App.showToast('Address saved!', 'success');
            }
        } catch (e) { App.showToast('Failed to save address', 'error'); }
    },

    async applyCoupon() {
        const code = document.getElementById('coupon-input').value.trim().toUpperCase();
        if (!code) return;
        const statusEl = document.getElementById('coupon-status');
        statusEl.textContent = 'Checking...';

        try {
            const res = await API.applyCoupon({ code, subtotal: App.getCartTotal() });
            if (res.success) {
                this.couponCode     = code;
                this.couponDiscount = res.data.discount;
                statusEl.innerHTML  = `<span style="color:var(--green);">✓ ${res.message}</span>`;
                this.renderPriceBreakdown();
            } else {
                throw new Error(res.message);
            }
        } catch (e) {
            statusEl.innerHTML = `<span style="color:var(--danger);">✗ ${e.message}</span>`;
            this.couponCode = '';
            this.couponDiscount = 0;
        }
    },

    async placeOrder() {
        if (this.orderType === 'delivery' && !this.selectedAddressId) {
            App.showToast('Please select a delivery address', 'error');
            return;
        }

        const btn = document.getElementById('place-order-btn');
        btn.disabled = true;
        btn.innerHTML = '<div class="loading-spinner" style="width:20px;height:20px;border-width:2px;margin:0 auto;"></div>';

        const orderData = {
            restaurant_id:        App.cart[0].restaurantId,
            items:                App.cart.map(i => ({ menu_item_id: i.id, quantity: i.quantity })),
            order_type:           this.orderType,
            payment_method:       this.paymentMethod,
            address_id:           this.selectedAddressId || null,
            coupon_code:          this.couponCode || null,
            special_instructions: document.getElementById('special-instructions')?.value || ''
        };

        try {
            const res = await API.placeOrder(orderData);
            if (!res.success) throw new Error(res.message);

            const order = res.data;

            // WhatsApp confirmation
            CartScreen.sendWhatsAppConfirmation(order);

            // UPI payment — restaurant_upi_id comes from order response
            if (this.paymentMethod === 'upi') {
                const upiId  = order.restaurant_upi_id || '';
                const upiURL = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(order.restaurant_name || App.cart[0].restaurantName)}&am=${parseFloat(order.total_amount).toFixed(2)}&cu=INR&tn=CORA_${order.order_number}`;
                window.location.href = upiURL;
                setTimeout(() => {
                    if (confirm('Have you completed the UPI payment? Tap OK to confirm.')) {
                        API.put('/customer/order.php', { id: order.id, payment_status: 'paid' }).catch(() => {});
                    }
                }, 3000);
            }

            App.clearCart();
            CartScreen.showOrderSuccess(order);

        } catch (e) {
            App.showToast(e.message || 'Failed to place order', 'error');
            btn.disabled = false;
            btn.textContent = 'Place Order →';
        }
    },

    showOrderSuccess(order) {
        App.setScreen(`
            <div style="text-align:center;padding:60px 24px;">
                <div id="success-animation" style="font-size:80px;animation:bounceIn 0.6s ease;">✅</div>
                <h2 style="font-family:'Playfair Display',serif;font-size:28px;font-weight:700;margin-top:20px;color:var(--text);">Order Placed! 🎉</h2>
                <p style="color:var(--text-sub);margin-top:8px;font-size:15px;">Your order has been sent to the restaurant</p>
                <div class="card" style="padding:20px;margin:24px 0;text-align:left;">
                    <div style="font-size:13px;color:var(--text-muted);">Order Number</div>
                    <div style="font-size:20px;font-weight:700;color:var(--berry);font-family:'Playfair Display',serif;">${order.order_number}</div>
                    <div style="font-size:13px;color:var(--text-muted);margin-top:12px;">Total Amount</div>
                    <div style="font-size:20px;font-weight:700;">₹${parseFloat(order.total_amount).toFixed(0)}</div>
                    <div style="font-size:13px;color:var(--text-muted);margin-top:12px;">Payment</div>
                    <div style="font-size:15px;font-weight:600;text-transform:uppercase;">${order.payment_method}</div>
                </div>
                <button class="btn-primary" style="width:100%;margin-bottom:12px;" onclick="window.location.hash='#order/${order.id}'">
                    Track My Order 🛵
                </button>
                <button class="btn-secondary" style="width:100%;" onclick="window.location.hash='#home'">
                    Back to Home
                </button>
                ${CartScreen._waConfirmLink ? `
                <a href="${CartScreen._waConfirmLink}" target="_blank" rel="noopener"
                   style="display:block;width:100%;margin-top:12px;padding:14px;background:#25D366;color:white;border-radius:14px;font-weight:600;font-size:14px;text-align:center;text-decoration:none;box-sizing:border-box;">
                    💬 Share Order on WhatsApp
                </a>` : ''}
            </div>
            <style>
                @keyframes bounceIn {
                    0%   { transform: scale(0);   opacity: 0; }
                    60%  { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1);   opacity: 1; }
                }
            </style>
        `);
    },

    _waConfirmLink: null,

    sendWhatsAppConfirmation(order) {
        const cartSnapshot = [...App.cart]; // snapshot before cart is cleared
        const items = cartSnapshot.map(i => `${i.quantity}x ${i.name} = ₹${(i.price * i.quantity).toFixed(0)}`).join('\n');
        const msg = encodeURIComponent(
            `✅ Your CORA Order is Confirmed!\n\n` +
            `Order: ${order.order_number}\n` +
            `Restaurant: ${order.restaurant_name || cartSnapshot[0]?.restaurantName || ''}\n\n` +
            `Items:\n${items}\n\n` +
            `Total: ₹${parseFloat(order.total_amount).toFixed(0)}\n` +
            `Payment: ${order.payment_method?.toUpperCase()}\n\n` +
            `Track your order in the Cora app!`
        );
        const phone = App.user?.phone?.replace(/\D/g, '') || '';
        this._waConfirmLink = phone ? `https://wa.me/${phone}?text=${msg}` : null;
    }
};
