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
                        <button class="screen-back-btn" onclick="history.back()">
                            <i data-lucide="arrow-left" style="width:20px;height:20px;"></i>
                        </button>
                        <h2 style="color:white;font-family:'Playfair Display',serif;font-size:22px;">Your Cart</h2>
                    </div>
                </div>
                <div class="empty-state" style="margin-top:40px;">
                    <div style="width:80px;height:80px;background:var(--berry-light);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
                        <i data-lucide="shopping-cart" style="width:40px;height:40px;color:var(--berry);"></i>
                    </div>
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
                    <button class="screen-back-btn" onclick="history.back()">
                        <i data-lucide="arrow-left" style="width:20px;height:20px;"></i>
                    </button>
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
                        <button id="ot-delivery" class="btn-primary" style="flex:1;padding:10px;" onclick="CartScreen.setOrderType('delivery')">
                            <i data-lucide="bike" style="width:16px;height:16px;"></i> Delivery
                        </button>
                        <button id="ot-pickup" class="btn-secondary" style="flex:1;padding:10px;" onclick="CartScreen.setOrderType('pickup')">
                            <i data-lucide="walking" style="width:16px;height:16px;"></i> Pickup
                        </button>
                    </div>
                </div>

                <!-- Addresses -->
                <div id="address-section" style="padding:0 16px 12px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                        <div style="font-size:13px;font-weight:600;color:var(--text-sub);">Delivery Address</div>
                        <button onclick="CartScreen.detectLocation()" style="background:none;border:none;color:var(--berry);font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:4px;">
                            <i data-lucide="locate" style="width:14px;height:14px;"></i> Detect Location
                        </button>
                    </div>
                    <div id="address-list">${Loading.spinner('Loading addresses...')}</div>
                    <button class="btn-secondary" style="width:100%;margin-top:8px;padding:10px;" onclick="CartScreen.showAddAddressForm()">
                        <i data-lucide="plus" style="width:14px;height:14px;"></i> Add New Address
                    </button>
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
                            <div style="width:40px;height:40px;background:var(--green-light);border-radius:10px;display:flex;align-items:center;justify-content:center;">
                                <i data-lucide="banknote" style="width:20px;height:20px;color:var(--green);"></i>
                            </div>
                            <div class="payment-name">Cash on Delivery</div>
                        </div>
                        <div class="payment-option" id="pm-upi" onclick="CartScreen.setPayment('upi')">
                            <div style="width:40px;height:40px;background:var(--berry-light);border-radius:10px;display:flex;align-items:center;justify-content:center;">
                                <i data-lucide="smartphone" style="width:20px;height:20px;color:var(--berry);"></i>
                            </div>
                            <div class="payment-name">Pay via UPI</div>
                        </div>
                    </div>
                </div>

                <!-- Place Order -->
                <div style="padding:0 16px 16px;">
                    <button class="btn-primary" style="width:100%;font-size:16px;padding:16px;" id="place-order-btn" onclick="CartScreen.placeOrder()">
                        Place Order
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
                <button onclick="App.clearCart();window.location.hash='#home'" style="background:none;border:none;color:var(--danger);font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:4px;">
                    <i data-lucide="trash-2" style="width:14px;height:14px;"></i> Clear cart
                </button>
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
        const iconMap = { Home: 'home', Work: 'briefcase' };
        const esc = (s) => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        el.innerHTML = this.addresses.map(a => `
            <div class="address-card ${a.id === this.selectedAddressId ? 'selected' : ''}" data-addr-id="${a.id}" onclick="CartScreen.selectAddress(${a.id})">
                <div style="width:36px;height:36px;background:var(--berry-light);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <i data-lucide="${iconMap[a.label] || 'map-pin'}" style="width:18px;height:18px;color:var(--berry);"></i>
                </div>
                <div class="address-details">
                    <div class="address-label">${esc(a.label)}</div>
                    <div class="address-text">${esc(a.full_address)}${a.landmark ? ', ' + esc(a.landmark) : ''}</div>
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
            document.querySelector(`.address-card[data-addr-id="${id}"]`)?.classList.add('selected');
        }
    },

    // Geolocation auto-detect
    detectLocation() {
        if (!navigator.geolocation) {
            App.showToast('Geolocation not supported by your browser', 'error');
            return;
        }
        App.showToast('Detecting your location...', 'info');
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    // Reverse geocode via Nominatim
                    const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
                    const geo = await resp.json();
                    const addr = geo.address || {};
                    const fullAddr = geo.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                    const area = addr.suburb || addr.village || addr.town || addr.city || 'Kulgam Town';

                    // Auto-fill the add address form
                    CartScreen.showAddAddressForm();
                    setTimeout(() => {
                        const fullEl = document.getElementById('addr-full');
                        const areaEl = document.getElementById('addr-area');
                        if (fullEl) fullEl.value = fullAddr.substring(0, 200);
                        // Try to match area
                        if (areaEl) {
                            const opts = [...areaEl.options].map(o => o.value);
                            const match = opts.find(o => area.toLowerCase().includes(o.toLowerCase()));
                            if (match) areaEl.value = match;
                        }
                        App.showToast('Location detected!', 'success');
                    }, 100);
                } catch (e) {
                    App.showToast('Could not detect address. Fill manually.', 'error');
                    CartScreen.showAddAddressForm();
                }
            },
            (err) => {
                App.showToast('Location access denied. Fill address manually.', 'error');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    },

    showAddAddressForm() {
        if (document.getElementById('add-addr-form')) return;
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
                        <option>Nandimarg</option><option>Pahloo</option>
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
                statusEl.style.color = 'var(--green)';
                statusEl.textContent = '✓ ' + res.message;
                this.renderPriceBreakdown();
            } else {
                throw new Error(res.message);
            }
        } catch (e) {
            statusEl.style.color = 'var(--danger)';
            statusEl.textContent = '✗ ' + e.message;
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
            // For UPI: show payment sheet BEFORE placing order
            if (this.paymentMethod === 'upi') {
                const confirmed = await CartScreen.handleUpiPayment(orderData);
                if (!confirmed) {
                    btn.disabled = false;
                    btn.textContent = 'Place Order';
                    return;
                }
            }

            const res = await API.placeOrder(orderData);
            if (!res.success) throw new Error(res.message);

            const order = res.data;
            CartScreen.sendWhatsAppConfirmation(order);

            // Mark UPI as paid if user confirmed
            if (this.paymentMethod === 'upi') {
                API.put('/customer/order.php', { id: order.id, payment_status: 'paid' }).catch(() => {});
            }

            App.clearCart();
            CartScreen.showOrderSuccess(order);

        } catch (e) {
            App.showToast(e.message || 'Failed to place order', 'error');
            btn.disabled = false;
            btn.textContent = 'Place Order';
        }
    },

    // UPI payment handler — opens UPI app, waits for user confirmation
    handleUpiPayment(orderData) {
        return new Promise((resolve) => {
            const total = App.getCartTotal() + (this.orderType === 'delivery' ? 25 : 0) + 5 - this.couponDiscount;
            const restName = App.cart[0]?.restaurantName || 'CORA';

            // Cleanup function to safely resolve once
            let resolved = false;
            const safeResolve = (val) => {
                if (resolved) return;
                resolved = true;
                const modal = document.getElementById('upi-modal');
                if (modal) modal.remove();
                resolve(val);
            };

            // Show UPI payment modal
            const modal = document.createElement('div');
            modal.id = 'upi-modal';
            modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:300;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease;';

            // Close on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) safeResolve(false);
            });

            modal.innerHTML = `
                <div style="background:white;width:90%;max-width:380px;border-radius:24px;padding:28px;text-align:center;animation:slideUp 0.4s ease;">
                    <div style="width:64px;height:64px;background:var(--berry-light);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
                        <i data-lucide="smartphone" style="width:32px;height:32px;color:var(--berry);"></i>
                    </div>
                    <h3 style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;">UPI Payment</h3>
                    <div style="font-size:36px;font-weight:700;color:var(--berry);margin:12px 0;">₹${total.toFixed(0)}</div>
                    <p style="color:var(--text-sub);font-size:13px;margin-bottom:20px;">Pay to <strong>${restName}</strong> via any UPI app</p>

                    <div style="display:flex;gap:12px;justify-content:center;margin-bottom:20px;flex-wrap:wrap;">
                        <div onclick="CartScreen._openUpi('gpay', ${total})" style="width:56px;height:56px;background:#f5f5f5;border-radius:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;font-weight:600;flex-direction:column;gap:2px;">
                            <div style="font-size:20px;">G</div>
                            <span style="font-size:9px;">GPay</span>
                        </div>
                        <div onclick="CartScreen._openUpi('phonepe', ${total})" style="width:56px;height:56px;background:#f5f5f5;border-radius:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;font-weight:600;flex-direction:column;gap:2px;">
                            <div style="font-size:20px;color:#5f259f;">P</div>
                            <span style="font-size:9px;">PhonePe</span>
                        </div>
                        <div onclick="CartScreen._openUpi('paytm', ${total})" style="width:56px;height:56px;background:#f5f5f5;border-radius:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;font-weight:600;flex-direction:column;gap:2px;">
                            <div style="font-size:20px;color:#00baf2;">₹</div>
                            <span style="font-size:9px;">Paytm</span>
                        </div>
                        <div onclick="CartScreen._openUpi('any', ${total})" style="width:56px;height:56px;background:#f5f5f5;border-radius:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;font-weight:600;flex-direction:column;gap:2px;">
                            <div style="font-size:20px;">UPI</div>
                            <span style="font-size:9px;">Other</span>
                        </div>
                    </div>

                    <button class="btn-primary" style="width:100%;padding:14px;margin-bottom:10px;" id="upi-confirm-btn">
                        I've Completed Payment
                    </button>
                    <button class="btn-secondary" style="width:100%;padding:12px;" id="upi-cancel-btn">
                        Cancel
                    </button>
                </div>
            `;
            document.body.appendChild(modal);

            // Attach event listeners properly (no inline onclick for resolve)
            modal.querySelector('#upi-confirm-btn').addEventListener('click', () => safeResolve(true));
            modal.querySelector('#upi-cancel-btn').addEventListener('click', () => safeResolve(false));

            if (typeof lucide !== 'undefined') lucide.createIcons();
            CartScreen._upiResolve = safeResolve;

            // Safety timeout — auto-cancel after 5 minutes
            setTimeout(() => {
                if (!resolved) {
                    safeResolve(false);
                    App.showToast('Payment timed out. Please try again.', 'error');
                }
            }, 300000);
        });
    },

    _upiResolve: null,

    _openUpi(app, amount) {
        const restName = App.cart[0]?.restaurantName || 'CORA';
        const upiUrl = `upi://pay?pa=cora@upi&pn=${encodeURIComponent(restName)}&am=${amount.toFixed(2)}&cu=INR&tn=CORA_ORDER`;
        window.location.href = upiUrl;
    },

    showOrderSuccess(order) {
        // Generate premium confetti — mix of circles, stars, and berry shapes
        const confettiColors = ['#D1386C', '#8C1D47', '#FFB800', '#1DB954', '#FF6B35', '#E040FB', '#FF80AB', '#4A00E0'];
        let confettiHtml = '';
        for (let i = 0; i < 60; i++) {
            const color = confettiColors[i % confettiColors.length];
            const left = Math.random() * 100;
            const delay = Math.random() * 1.2;
            const size = 4 + Math.random() * 8;
            const dur = 2 + Math.random() * 2;
            const drift = -40 + Math.random() * 80;
            const shape = Math.random();
            const borderR = shape > 0.7 ? '50%' : shape > 0.4 ? '2px' : '50% 0 50% 50%';
            confettiHtml += `<div style="position:absolute;width:${size}px;height:${size}px;background:${color};border-radius:${borderR};left:${left}%;top:-10px;animation:confettiFall ${dur}s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s forwards;--drift:${drift}px;opacity:0;"></div>`;
        }

        // Starburst rays
        let starburst = '';
        for (let i = 0; i < 12; i++) {
            const angle = i * 30;
            starburst += `<div style="position:absolute;top:50%;left:50%;width:2px;height:40px;background:linear-gradient(to bottom, var(--berry), transparent);transform-origin:center 0;transform:rotate(${angle}deg) translateY(-50px);opacity:0;animation:rayBurst 0.6s ease ${0.8 + i * 0.03}s forwards;"></div>`;
        }

        // Floating berry particles
        let floatingParticles = '';
        for (let i = 0; i < 8; i++) {
            const x = 20 + Math.random() * 60;
            const y = 10 + Math.random() * 80;
            const s = 6 + Math.random() * 10;
            const d = 3 + Math.random() * 4;
            floatingParticles += `<div style="position:absolute;left:${x}%;top:${y}%;width:${s}px;height:${s}px;background:var(--berry);opacity:0.08;border-radius:50%;animation:floatParticle ${d}s ease-in-out infinite alternate;animation-delay:${i * 0.5}s;"></div>`;
        }

        const eta = 30 + Math.floor(Math.random() * 15);

        App.setScreen(`
            <div style="position:relative;overflow:hidden;min-height:100vh;background:linear-gradient(180deg, #FFF0F5 0%, #FFEDF5 40%, #FFF5F8 100%);">
                <!-- Floating berry particles bg -->
                <div style="position:absolute;inset:0;pointer-events:none;z-index:1;">${floatingParticles}</div>

                <!-- Confetti burst -->
                <div id="confetti-container" style="position:absolute;inset:0;pointer-events:none;z-index:10;">${confettiHtml}</div>

                <!-- Success hero section -->
                <div style="text-align:center;padding:48px 24px 24px;position:relative;z-index:5;">
                    <!-- Glow backdrop -->
                    <div style="position:absolute;top:20px;left:50%;transform:translateX(-50%);width:200px;height:200px;background:radial-gradient(circle, rgba(209,56,108,0.15) 0%, transparent 70%);border-radius:50%;animation:glowPulse 3s ease-in-out infinite;"></div>

                    <div class="success-glow-ring" style="position:relative;display:inline-block;">
                        ${starburst}
                        <svg width="130" height="130" viewBox="0 0 130 130" style="filter:drop-shadow(0 0 20px rgba(209,56,108,0.3));">
                            <defs>
                                <linearGradient id="berryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#D1386C"/>
                                    <stop offset="100%" style="stop-color:#8C1D47"/>
                                </linearGradient>
                            </defs>
                            <circle cx="65" cy="65" r="56" fill="none" stroke="url(#berryGrad)" stroke-width="3" opacity="0.2"/>
                            <circle cx="65" cy="65" r="56" fill="none" stroke="url(#berryGrad)" stroke-width="3.5" stroke-dasharray="352" stroke-dashoffset="352" class="success-circle-draw" stroke-linecap="round"/>
                            <circle cx="65" cy="65" r="42" fill="url(#berryGrad)" opacity="0" class="success-fill"/>
                            <path d="M43 67 L57 81 L87 49" fill="none" stroke="white" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="70" stroke-dashoffset="70" class="success-check-draw"/>
                        </svg>
                        <div class="success-pulse-ring"></div>
                        <div class="success-pulse-ring" style="animation-delay:0.4s;"></div>
                        <div class="success-pulse-ring" style="animation-delay:0.8s;"></div>
                    </div>

                    <h2 style="font-family:'Playfair Display',serif;font-size:32px;font-weight:700;margin-top:20px;color:var(--text);animation:slideUp 0.6s ease 1s both;">Order Confirmed!</h2>
                    <p style="color:var(--text-sub);margin-top:8px;font-size:15px;animation:slideUp 0.6s ease 1.1s both;">Your food is being prepared with love</p>
                </div>

                <!-- Order details card -->
                <div style="padding:0 20px;position:relative;z-index:5;animation:slideUp 0.6s ease 1.2s both;">
                    <div style="background:white;border-radius:20px;padding:24px;border:1.5px solid rgba(209,56,108,0.12);box-shadow:0 8px 32px rgba(209,56,108,0.08);position:relative;overflow:hidden;">
                        <div style="position:absolute;top:-20px;right:-20px;width:120px;height:120px;background:radial-gradient(circle, rgba(209,56,108,0.06) 0%, transparent 70%);border-radius:50%;"></div>
                        <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;font-weight:600;">Order Number</div>
                        <div style="font-size:24px;font-weight:700;color:var(--berry);font-family:'Playfair Display',serif;margin-top:4px;">${order.order_number}</div>

                        <div style="display:flex;gap:24px;margin-top:18px;">
                            <div>
                                <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">Total</div>
                                <div style="font-size:22px;font-weight:700;margin-top:4px;">₹${parseFloat(order.total_amount).toFixed(0)}</div>
                            </div>
                            <div>
                                <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">Payment</div>
                                <div style="font-size:13px;font-weight:600;text-transform:uppercase;margin-top:6px;padding:4px 12px;background:${order.payment_method === 'upi' ? 'linear-gradient(135deg, #FFF0F5, #FFE0EC)' : 'linear-gradient(135deg, #E8F5E9, #C8E6C9)'};color:${order.payment_method === 'upi' ? 'var(--berry)' : '#2E7D32'};border-radius:10px;display:inline-block;">${order.payment_method}</div>
                            </div>
                        </div>

                        <div style="margin-top:18px;padding-top:16px;border-top:1px dashed rgba(209,56,108,0.15);display:flex;align-items:center;gap:8px;">
                            <div style="width:32px;height:32px;background:var(--berry-light);border-radius:10px;display:flex;align-items:center;justify-content:center;">
                                <i data-lucide="clock" style="width:16px;height:16px;color:var(--berry);"></i>
                            </div>
                            <span style="font-size:14px;color:var(--text-sub);">Estimated delivery in <strong style="color:var(--text);">~${eta} mins</strong></span>
                        </div>
                    </div>

                    <button class="btn-primary" style="width:100%;margin-top:16px;padding:16px;font-size:16px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:8px;" onclick="window.location.hash='#order/${order.id}'">
                        <i data-lucide="map-pin" style="width:18px;height:18px;"></i>
                        <span>Track My Order</span>
                    </button>
                    <button class="btn-secondary" style="width:100%;margin-top:10px;padding:14px;" onclick="window.location.hash='#home'">
                        Back to Home
                    </button>
                    ${CartScreen._waConfirmLink ? `
                    <a href="${CartScreen._waConfirmLink}" target="_blank" rel="noopener"
                       style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:10px;padding:14px;background:#25D366;color:white;border-radius:14px;font-weight:600;font-size:14px;text-align:center;text-decoration:none;box-sizing:border-box;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.348 0-4.518-.816-6.222-2.18l-.435-.354-2.638.884.884-2.638-.354-.435A9.956 9.956 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
                        Share on WhatsApp
                    </a>` : ''}
                    <div style="height:40px;"></div>
                </div>
            </div>
            <style>
                .success-glow-ring { position:relative; display:inline-block; }
                .success-circle-draw { animation: drawCircleAnim 1s cubic-bezier(0.65, 0, 0.35, 1) 0.3s forwards; }
                .success-fill { animation: fillCircle 0.5s ease 1s forwards; }
                .success-check-draw { animation: drawCheckAnim 0.4s ease 1.2s forwards; }
                .success-pulse-ring {
                    position:absolute; inset:-24px; border:2px solid var(--berry);
                    border-radius:50%; opacity:0;
                    animation: pulseRing 2.5s ease-out 1.5s infinite;
                }
                @keyframes drawCircleAnim { to { stroke-dashoffset:0; } }
                @keyframes fillCircle { to { opacity:1; } }
                @keyframes drawCheckAnim { to { stroke-dashoffset:0; } }
                @keyframes pulseRing {
                    0% { transform:scale(0.8); opacity:0.5; }
                    100% { transform:scale(1.8); opacity:0; }
                }
                @keyframes confettiFall {
                    0% { transform:translateY(0) translateX(0) rotate(0deg) scale(0); opacity:0; }
                    10% { opacity:1; transform:translateY(0) translateX(0) rotate(0deg) scale(1); }
                    100% { transform:translateY(${window.innerHeight || 800}px) translateX(var(--drift)) rotate(${540 + Math.random()*360}deg) scale(0.3); opacity:0; }
                }
                @keyframes rayBurst {
                    0% { opacity:0; height:0; }
                    50% { opacity:0.8; height:40px; }
                    100% { opacity:0; height:60px; }
                }
                @keyframes glowPulse {
                    0%, 100% { transform:translateX(-50%) scale(1); opacity:0.6; }
                    50% { transform:translateX(-50%) scale(1.2); opacity:1; }
                }
                @keyframes floatParticle {
                    0% { transform:translateY(0) scale(1); }
                    100% { transform:translateY(-20px) scale(1.3); }
                }
                @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
                @keyframes slideUp { from { transform:translateY(30px);opacity:0; } to { transform:translateY(0);opacity:1; } }
            </style>
        `);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    _waConfirmLink: null,

    sendWhatsAppConfirmation(order) {
        const cartSnapshot = [...App.cart];
        const items = cartSnapshot.map(i => `${i.quantity}x ${i.name} = ₹${(i.price * i.quantity).toFixed(0)}`).join('\n');
        const msg = encodeURIComponent(
            `Your CORA Order is Confirmed!\n\n` +
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
