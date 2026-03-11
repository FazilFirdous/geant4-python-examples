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
        el.innerHTML = this.addresses.map(a => `
            <div class="address-card ${a.id === this.selectedAddressId ? 'selected' : ''}" onclick="CartScreen.selectAddress(${a.id})">
                <div style="width:36px;height:36px;background:var(--berry-light);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <i data-lucide="${iconMap[a.label] || 'map-pin'}" style="width:18px;height:18px;color:var(--berry);"></i>
                </div>
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

            // Show UPI payment modal
            const modal = document.createElement('div');
            modal.id = 'upi-modal';
            modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:300;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease;';
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

                    <button class="btn-primary" style="width:100%;padding:14px;margin-bottom:10px;" id="upi-confirm-btn" onclick="document.getElementById('upi-modal').remove();CartScreen._upiResolve(true);">
                        I've Completed Payment
                    </button>
                    <button class="btn-secondary" style="width:100%;padding:12px;" onclick="document.getElementById('upi-modal').remove();CartScreen._upiResolve(false);">
                        Cancel
                    </button>
                </div>
            `;
            document.body.appendChild(modal);
            if (typeof lucide !== 'undefined') lucide.createIcons();
            CartScreen._upiResolve = resolve;
        });
    },

    _upiResolve: null,

    _openUpi(app, amount) {
        const restName = App.cart[0]?.restaurantName || 'CORA';
        const upiUrl = `upi://pay?pa=cora@upi&pn=${encodeURIComponent(restName)}&am=${amount.toFixed(2)}&cu=INR&tn=CORA_ORDER`;
        window.location.href = upiUrl;
    },

    showOrderSuccess(order) {
        // Generate confetti particles
        const confettiColors = ['#D1386C', '#8C1D47', '#FFB800', '#1DB954', '#FF6B35', '#4A00E0'];
        let confettiHtml = '';
        for (let i = 0; i < 40; i++) {
            const color = confettiColors[i % confettiColors.length];
            const left = Math.random() * 100;
            const delay = Math.random() * 0.8;
            const size = 4 + Math.random() * 6;
            const dur = 1.5 + Math.random() * 1.5;
            confettiHtml += `<div style="position:absolute;width:${size}px;height:${size}px;background:${color};border-radius:${Math.random()>0.5?'50%':'2px'};left:${left}%;top:-10px;animation:confettiFall ${dur}s ease ${delay}s forwards;opacity:0;"></div>`;
        }

        App.setScreen(`
            <div style="position:relative;overflow:hidden;min-height:100vh;background:var(--berry-light);">
                <!-- Confetti -->
                <div id="confetti-container" style="position:absolute;inset:0;pointer-events:none;z-index:10;">${confettiHtml}</div>

                <!-- Glowing success circle -->
                <div style="text-align:center;padding:50px 24px 30px;position:relative;z-index:5;">
                    <div class="success-glow-ring">
                        <svg width="120" height="120" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--berry)" stroke-width="3" opacity="0.15"/>
                            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--berry)" stroke-width="3" stroke-dasharray="327" stroke-dashoffset="327" class="success-circle-draw"/>
                            <circle cx="60" cy="60" r="38" fill="var(--berry)" opacity="0" class="success-fill"/>
                            <path d="M40 62 L53 75 L80 46" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="65" stroke-dashoffset="65" class="success-check-draw"/>
                        </svg>
                        <div class="success-pulse-ring"></div>
                        <div class="success-pulse-ring" style="animation-delay:0.3s;"></div>
                    </div>

                    <h2 style="font-family:'Playfair Display',serif;font-size:30px;font-weight:700;margin-top:24px;color:var(--text);">Order Confirmed!</h2>
                    <p style="color:var(--text-sub);margin-top:8px;font-size:15px;">Your food is being prepared with love</p>
                </div>

                <!-- Order card -->
                <div style="padding:0 20px;position:relative;z-index:5;">
                    <div class="card" style="padding:24px;border:2px solid var(--berry-border);position:relative;overflow:hidden;">
                        <div style="position:absolute;top:0;right:0;width:100px;height:100px;background:var(--berry);opacity:0.04;border-radius:0 0 0 100%;"></div>
                        <div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">Order Number</div>
                        <div style="font-size:22px;font-weight:700;color:var(--berry);font-family:'Playfair Display',serif;margin-top:4px;">${order.order_number}</div>

                        <div style="display:flex;gap:20px;margin-top:16px;">
                            <div>
                                <div style="font-size:12px;color:var(--text-muted);">Total</div>
                                <div style="font-size:20px;font-weight:700;margin-top:2px;">₹${parseFloat(order.total_amount).toFixed(0)}</div>
                            </div>
                            <div>
                                <div style="font-size:12px;color:var(--text-muted);">Payment</div>
                                <div style="font-size:14px;font-weight:600;text-transform:uppercase;margin-top:4px;padding:3px 10px;background:${order.payment_method === 'upi' ? 'var(--berry-light)' : 'var(--green-light)'};color:${order.payment_method === 'upi' ? 'var(--berry)' : 'var(--green)'};border-radius:8px;display:inline-block;">${order.payment_method}</div>
                            </div>
                        </div>

                        <div style="margin-top:16px;padding-top:16px;border-top:1px dashed var(--berry-border);font-size:13px;color:var(--text-sub);">
                            <i data-lucide="clock" style="width:14px;height:14px;display:inline;vertical-align:middle;margin-right:4px;"></i>
                            Estimated delivery in ~${30 + Math.floor(Math.random() * 15)} mins
                        </div>
                    </div>

                    <button class="btn-primary" style="width:100%;margin-top:16px;padding:16px;font-size:16px;position:relative;overflow:hidden;" onclick="window.location.hash='#order/${order.id}'">
                        <span style="position:relative;z-index:1;">Track My Order</span>
                        <i data-lucide="map-pin" style="width:18px;height:18px;position:relative;z-index:1;"></i>
                    </button>
                    <button class="btn-secondary" style="width:100%;margin-top:10px;padding:14px;" onclick="window.location.hash='#home'">
                        Back to Home
                    </button>
                    ${CartScreen._waConfirmLink ? `
                    <a href="${CartScreen._waConfirmLink}" target="_blank" rel="noopener"
                       style="display:block;width:100%;margin-top:10px;padding:14px;background:#25D366;color:white;border-radius:14px;font-weight:600;font-size:14px;text-align:center;text-decoration:none;box-sizing:border-box;">
                        Share on WhatsApp
                    </a>` : ''}
                    <div style="height:40px;"></div>
                </div>
            </div>
            <style>
                .success-glow-ring { position:relative; display:inline-block; }
                .success-circle-draw { animation: drawCircleAnim 0.8s ease 0.2s forwards; }
                .success-fill { animation: fillCircle 0.4s ease 0.7s forwards; }
                .success-check-draw { animation: drawCheckAnim 0.5s ease 0.9s forwards; }
                .success-pulse-ring {
                    position:absolute; inset:-20px; border:2px solid var(--berry);
                    border-radius:50%; opacity:0;
                    animation: pulseRing 2s ease-out 1.2s infinite;
                }
                @keyframes drawCircleAnim { to { stroke-dashoffset:0; } }
                @keyframes fillCircle { to { opacity:1; } }
                @keyframes drawCheckAnim { to { stroke-dashoffset:0; } }
                @keyframes pulseRing {
                    0% { transform:scale(0.8); opacity:0.6; }
                    100% { transform:scale(1.6); opacity:0; }
                }
                @keyframes confettiFall {
                    0% { transform:translateY(0) rotate(0deg); opacity:1; }
                    100% { transform:translateY(${window.innerHeight || 800}px) rotate(${360 + Math.random()*360}deg); opacity:0; }
                }
                @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
                @keyframes slideUp { from { transform:translateY(40px);opacity:0; } to { transform:translateY(0);opacity:1; } }
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
