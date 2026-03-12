const TrackingScreen = {
    order: null,
    pollTimer: null,

    async render(id) {
        App.setScreen(`
            <div class="screen-header">
                <div style="display:flex;align-items:center;gap:12px;position:relative;z-index:1;">
                    <button class="screen-back-btn" onclick="history.back()">
                        <i data-lucide="arrow-left" style="width:20px;height:20px;"></i>
                    </button>
                    <h2 style="color:white;font-family:'Playfair Display',serif;font-size:22px;">Track Order</h2>
                </div>
            </div>
            <div id="tracking-body">${Loading.spinner('Loading order...')}</div>
        `);

        await this.loadOrder(id);
        App.pollInterval = setInterval(() => this.loadOrder(id), 10000);
    },

    async loadOrder(id) {
        try {
            const res = await API.getOrder(id);
            if (!res.success) throw new Error(res.message);
            this.order = res.data;
            this.renderOrder();
        } catch (e) {
            const el = document.getElementById('tracking-body');
            if (el) el.innerHTML = Loading.error(e.message, `TrackingScreen.render(${id})`);
        }
    },

    // SVG icon builder for timeline
    _icon(name, color = 'var(--berry)') {
        const icons = {
            'clipboard-list': '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
            'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/>',
            'chef-hat': '<path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V20H6Z"/><line x1="6" x2="18" y1="17" y2="17"/>',
            'sparkles': '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
            'package-check': '<path d="m16 16 2 2 4-4"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/>',
            'bike': '<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>',
            'truck': '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 13.52 9H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
            'party-popper': '<path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>',
            'x-circle': '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
            'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>'
        };
        const path = icons[name] || icons['clipboard-list'];
        return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
    },

    renderOrder() {
        const o = this.order;
        if (!o) return;

        const statusConfig = {
            placed:         { icon: 'clipboard-list', color: '#E65100', msg: 'Order sent to restaurant!', friendly: 'Waiting for the restaurant to accept your order...' },
            accepted:       { icon: 'check-circle',   color: '#1565C0', msg: 'Order Accepted!', friendly: 'The restaurant has accepted your order!' },
            preparing:      { icon: 'chef-hat',        color: '#F57F17', msg: 'Being Prepared', friendly: 'Your chef is cooking up something delicious' },
            ready:          { icon: 'sparkles',        color: '#2E7D32', msg: 'Order Ready!', friendly: 'Your order is packed and ready' },
            picked_up:      { icon: 'package-check',   color: '#1565C0', msg: 'Picked Up', friendly: 'Delivery partner has your order!' },
            on_the_way:     { icon: 'bike',            color: 'var(--berry)', msg: 'On the Way!', friendly: 'Almost there! Your rider is heading to you' },
            delivered:      { icon: 'party-popper',    color: 'var(--green)', msg: 'Delivered!', friendly: 'Your order has been delivered. Enjoy!' },
            cancelled:      { icon: 'x-circle',        color: 'var(--danger)', msg: 'Cancelled', friendly: `Order was cancelled. ${o.cancel_reason ? 'Reason: ' + o.cancel_reason : ''}` },
            delivery_issue: { icon: 'alert-triangle',  color: '#E65100', msg: 'Delivery Issue', friendly: o.customer_note_delivery || 'We\'re working on a solution.' }
        };

        const statusSteps = ['placed','accepted','preparing','ready','picked_up','on_the_way','delivered'];
        const currentStep = statusSteps.indexOf(o.status);
        const sm = statusConfig[o.status] || statusConfig.placed;

        const timelineHtml = statusSteps.map((step, i) => {
            const isDone   = i < currentStep || o.status === 'delivered';
            const isActive = i === currentStep && o.status !== 'delivered' && o.status !== 'cancelled';
            const cfg      = statusConfig[step];
            const ts = { placed: o.placed_at, accepted: o.accepted_at, preparing: o.preparing_at, ready: o.ready_at, picked_up: o.picked_up_at, on_the_way: o.picked_up_at, delivered: o.delivered_at }[step];

            const dotColor = isDone ? 'var(--berry)' : (isActive ? sm.color : '#ddd');
            const lineColor = isDone ? 'var(--berry)' : '#eee';
            const textColor = isDone ? 'var(--text)' : (isActive ? sm.color : 'var(--text-muted)');

            return `
                <div class="timeline-item" style="display:flex;gap:14px;position:relative;">
                    <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;">
                        <div style="width:36px;height:36px;border-radius:50%;background:${isDone || isActive ? (isDone ? 'var(--berry)' : sm.color) : '#f5f5f5'};display:flex;align-items:center;justify-content:center;transition:all 0.3s;${isActive ? 'box-shadow:0 0 0 6px ' + sm.color + '22;' : ''}">
                            ${this._icon(cfg.icon, isDone || isActive ? 'white' : '#ccc')}
                        </div>
                        ${i < statusSteps.length - 1 ? `<div style="width:2px;height:32px;background:${lineColor};margin:4px 0;border-radius:1px;"></div>` : ''}
                    </div>
                    <div style="padding-top:6px;padding-bottom:${i < statusSteps.length - 1 ? '16' : '0'}px;">
                        <div style="font-size:14px;font-weight:${isDone || isActive ? '700' : '500'};color:${textColor};transition:all 0.3s;">
                            ${cfg.msg}
                        </div>
                        ${ts ? `<div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        const isRiderActive = ['picked_up','on_the_way'].includes(o.status);

        const deliveryBoyHtml = o.delivery_boy_name ? `
            <div class="card" style="margin:0 16px 12px;padding:16px;">
                <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Your Delivery Partner</div>
                <div style="display:flex;align-items:center;gap:14px;">
                    <div style="width:48px;height:48px;background:linear-gradient(135deg,var(--berry),var(--berry-deep));border-radius:50%;display:flex;align-items:center;justify-content:center;">
                        ${this._icon('bike', 'white')}
                    </div>
                    <div style="flex:1;">
                        <div style="font-weight:700;font-size:15px;">${o.delivery_boy_name}</div>
                        <div style="font-size:13px;color:var(--text-muted);">Delivery Partner</div>
                    </div>
                    <a href="tel:${o.delivery_boy_phone}" class="btn-secondary" style="padding:8px 14px;text-decoration:none;font-size:13px;">
                        <i data-lucide="phone" style="width:14px;height:14px;"></i> Call
                    </a>
                </div>
            </div>
        ` : '';

        const isDelivered = o.status === 'delivered';

        document.getElementById('tracking-body').innerHTML = `
            <!-- Status Hero -->
            <div style="background:linear-gradient(135deg,var(--berry),var(--berry-deep));padding:24px;text-align:center;position:relative;overflow:hidden;">
                <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
                <div style="position:absolute;bottom:-40px;left:-20px;width:100px;height:100px;background:rgba(255,255,255,0.05);border-radius:50%;"></div>
                <div style="width:72px;height:72px;background:rgba(255,255,255,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto;backdrop-filter:blur(10px);${isRiderActive ? 'animation:statusPulse 2s ease infinite;' : ''}">
                    ${this._icon(sm.icon, 'white')}
                </div>
                <h3 style="color:white;font-family:'Playfair Display',serif;font-size:22px;margin-top:12px;">${sm.msg}</h3>
                <p style="color:rgba(255,255,255,0.85);font-size:14px;margin-top:4px;">${sm.friendly}</p>
                <div style="background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border-radius:10px;padding:8px 16px;margin-top:12px;display:inline-block;color:white;font-size:13px;">
                    Order #${o.order_number}
                </div>
            </div>

            <!-- Rider Map (when active delivery) -->
            ${isRiderActive ? `
                <div style="padding:12px 16px 0;">
                    <div class="card" style="padding:0;overflow:hidden;border-radius:16px;">
                        <div id="rider-map" style="height:200px;background:#e8e8e8;position:relative;">
                            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;">
                                <div style="animation:ride 3s linear infinite;font-size:14px;">
                                    ${this._icon('bike', 'var(--berry)')}
                                </div>
                                <span style="font-size:12px;color:var(--text-muted);">Live tracking available when rider shares location</span>
                            </div>
                        </div>
                        <div style="padding:12px 16px;display:flex;align-items:center;gap:8px;background:white;">
                            <div style="width:8px;height:8px;background:var(--berry);border-radius:50%;animation:statusPulse 1.5s ease infinite;"></div>
                            <span style="font-size:13px;font-weight:600;color:var(--berry);">Rider is on the way</span>
                            <span style="margin-left:auto;font-size:12px;color:var(--text-muted);">ETA ~${10 + Math.floor(Math.random()*10)} min</span>
                        </div>
                    </div>
                </div>
            ` : ''}

            <!-- Delivery Animation -->
            ${isRiderActive ? `
                <div style="padding:12px 16px 0;">
                    <div style="position:relative;height:50px;background:white;border-radius:12px;overflow:hidden;border:1px solid var(--berry-border);">
                        <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:var(--berry-border);"></div>
                        <div style="position:absolute;bottom:0;left:0;width:${currentStep >= 5 ? '80' : '50'}%;height:3px;background:var(--berry);border-radius:2px;transition:width 1s ease;"></div>
                        <div style="position:absolute;top:50%;transform:translateY(-50%);animation:ride 3s linear infinite;">
                            ${this._icon('bike', 'var(--berry)')}
                        </div>
                    </div>
                </div>
            ` : ''}

            ${o.status === 'delivery_issue' ? `
                <div style="background:#FFF3E0;border:1px solid #FFE0B2;border-radius:12px;padding:14px;margin:12px 16px 0;">
                    <div style="font-weight:700;color:#E65100;display:flex;align-items:center;gap:6px;">
                        ${this._icon('alert-triangle', '#E65100')} Delivery Update
                    </div>
                    <div style="font-size:13px;color:#BF360C;margin-top:4px;">${o.customer_note_delivery || 'We\'re finding a delivery partner for you.'}</div>
                </div>
            ` : ''}

            ${deliveryBoyHtml}

            <!-- Timeline -->
            <div class="card" style="margin:12px 16px;padding:20px;">
                <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:16px;">Order Status</div>
                <div>${timelineHtml}</div>
            </div>

            <!-- Bill Summary -->
            <div class="card" style="margin:0 16px 12px;padding:16px;">
                <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:12px;">Bill Summary</div>
                <div class="price-row"><span>Subtotal</span><span>₹${parseFloat(o.subtotal).toFixed(0)}</span></div>
                ${parseFloat(o.delivery_fee) > 0 ? `<div class="price-row"><span>Delivery fee</span><span>₹${parseFloat(o.delivery_fee).toFixed(0)}</span></div>` : ''}
                <div class="price-row"><span>Platform fee</span><span>₹${parseFloat(o.platform_fee || 5).toFixed(0)}</span></div>
                ${parseFloat(o.discount_amount) > 0 ? `<div class="price-row discount"><span>Discount</span><span>−₹${parseFloat(o.discount_amount).toFixed(0)}</span></div>` : ''}
                <div class="price-row total"><span>Total</span><span>₹${parseFloat(o.total_amount).toFixed(0)}</span></div>
                <div style="margin-top:8px;display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;background:${o.payment_status === 'paid' ? 'var(--green-light)' : 'var(--berry-light)'};color:${o.payment_status === 'paid' ? 'var(--green)' : 'var(--berry)'};">
                    ${o.payment_method?.toUpperCase()} · ${o.payment_status?.toUpperCase()}
                </div>
            </div>

            <!-- Receipt -->
            <div style="padding:0 16px 12px;">
                <button class="btn-secondary" style="width:100%;padding:12px;" onclick="TrackingScreen.downloadReceipt()">
                    <i data-lucide="file-text" style="width:16px;height:16px;"></i> View Receipt
                </button>
            </div>

            <!-- Review -->
            ${isDelivered && !o.review ? `
                <div class="card" style="margin:0 16px 12px;padding:16px;">
                    <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:12px;">Rate your experience</div>
                    <div id="review-stars" style="display:flex;gap:10px;margin-bottom:12px;">
                        ${[1,2,3,4,5].map(s => `
                            <div onclick="TrackingScreen.setRating(${s})" data-star="${s}"
                                 style="width:40px;height:40px;border-radius:50%;background:#f5f5f5;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            </div>
                        `).join('')}
                    </div>
                    <textarea id="review-comment" placeholder="Tell us about your experience..." style="width:100%;background:white;border:1.5px solid var(--berry-border);border-radius:12px;padding:10px;font-size:13px;resize:none;height:70px;font-family:'DM Sans',sans-serif;outline:none;"></textarea>
                    <button class="btn-primary" style="width:100%;margin-top:10px;padding:12px;" onclick="TrackingScreen.submitReview(${o.id})">
                        Submit Review
                    </button>
                </div>
            ` : ''}

            <!-- Support -->
            <div style="padding:0 16px 24px;">
                <button class="btn-secondary" style="width:100%;padding:12px;" onclick="window.location.hash='#support'">
                    <i data-lucide="headphones" style="width:16px;height:16px;"></i> Need Help?
                </button>
            </div>

            <style>
                @keyframes statusPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.08); opacity: 0.8; }
                }
            </style>
        `;

        // Init map if rider is active and Leaflet available
        if (isRiderActive) this._initMap();

        if (typeof lucide !== 'undefined') setTimeout(() => lucide.createIcons(), 0);
    },

    async _initMap() {
        const mapEl = document.getElementById('rider-map');
        if (!mapEl || typeof L === 'undefined') return;

        // Kulgam coordinates (restaurant)
        const restPos = [33.645, 75.02];
        // Simulated delivery destination (customer)
        const custPos = [restPos[0] + 0.005 + Math.random() * 0.005, restPos[1] + 0.005 + Math.random() * 0.005];
        // Simulated rider position (between restaurant and customer)
        const progress = 0.3 + Math.random() * 0.4;
        const riderPos = [
            restPos[0] + (custPos[0] - restPos[0]) * progress,
            restPos[1] + (custPos[1] - restPos[1]) * progress
        ];

        const map = L.map('rider-map', { zoomControl: false, attributionControl: false }).setView(riderPos, 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { opacity: 0.9 }).addTo(map);

        // Route polyline (restaurant -> rider -> customer)
        const routePoints = [restPos, riderPos, custPos];
        L.polyline(routePoints, { color: '#D1386C', weight: 3, opacity: 0.5, dashArray: '8, 8' }).addTo(map);
        // Completed route (restaurant -> rider)
        L.polyline([restPos, riderPos], { color: '#D1386C', weight: 4, opacity: 0.9 }).addTo(map);

        // Restaurant marker
        const restIcon = L.divIcon({
            html: '<div style="background:white;width:28px;height:28px;border-radius:50%;border:3px solid #D1386C;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.2);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D1386C" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg></div>',
            className: '', iconSize: [28, 28], iconAnchor: [14, 14]
        });
        L.marker(restPos, { icon: restIcon }).addTo(map).bindPopup('Restaurant');

        // Customer destination marker
        const custIcon = L.divIcon({
            html: '<div style="background:white;width:28px;height:28px;border-radius:50%;border:3px solid #1DB954;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.2);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1DB954" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></svg></div>',
            className: '', iconSize: [28, 28], iconAnchor: [14, 14]
        });
        L.marker(custPos, { icon: custIcon }).addTo(map).bindPopup('Your Location');

        // Rider marker (animated)
        const riderIcon = L.divIcon({
            html: `<div style="background:linear-gradient(135deg,#D1386C,#8C1D47);padding:8px;border-radius:50%;box-shadow:0 2px 12px rgba(209,56,108,0.5);animation:statusPulse 2s ease infinite;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
            </div>`,
            className: '', iconSize: [36, 36], iconAnchor: [18, 18]
        });
        const riderMarker = L.marker(riderPos, { icon: riderIcon }).addTo(map);

        map.fitBounds([restPos, custPos], { padding: [50, 50] });

        // Simulate rider movement towards customer
        this._riderInterval = setInterval(() => {
            const cur = riderMarker.getLatLng();
            const newLat = cur.lat + (custPos[0] - cur.lat) * 0.05;
            const newLng = cur.lng + (custPos[1] - cur.lng) * 0.05;
            riderMarker.setLatLng([newLat, newLng]);
        }, 3000);
    },

    _riderInterval: null,

    selectedRating: 0,

    setRating(n) {
        this.selectedRating = n;
        document.querySelectorAll('[data-star]').forEach(el => {
            const starN = parseInt(el.dataset.star);
            const isActive = starN <= n;
            el.style.background = isActive ? 'var(--star)' : '#f5f5f5';
            el.style.transform = isActive ? 'scale(1.15)' : 'scale(1)';
            const svg = el.querySelector('svg');
            if (svg) {
                svg.setAttribute('fill', isActive ? 'white' : 'none');
                svg.setAttribute('stroke', isActive ? 'white' : '#ccc');
            }
        });
    },

    async submitReview(orderId) {
        if (!this.selectedRating) { App.showToast('Please select a rating', 'error'); return; }
        const comment = document.getElementById('review-comment')?.value || '';
        try {
            const res = await API.submitReview({ order_id: orderId, food_rating: this.selectedRating, comment });
            if (res.success) {
                App.showToast('Review submitted! Thank you', 'success');
                this.loadOrder(orderId);
            }
        } catch (e) { App.showToast(e.message || 'Failed to submit review', 'error'); }
    },

    downloadReceipt() {
        const o = this.order;
        if (!o) return;
        const receiptHtml = `
            <html><head><meta charset="UTF-8"><title>Receipt — ${o.order_number}</title>
            <style>
                body { font-family: 'DM Sans',sans-serif; max-width: 400px; margin: 20px auto; color: #1A1A1A; }
                .header { background: linear-gradient(135deg,#D1386C,#8C1D47); color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center; }
                .body { padding: 20px; border: 1px solid #FFE0EB; border-top: none; border-radius: 0 0 12px 12px; }
                .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #FFE0EB; font-size: 14px; }
                .total { font-weight: 700; font-size: 16px; border-top: 2px solid #D1386C; border-bottom: none; margin-top: 8px; }
            </style></head><body>
            <div class="header">
                <div style="font-size:24px;font-weight:700;">CORA</div>
                <div style="opacity:0.85;font-size:13px;">Kulgam's Food, Delivered</div>
            </div>
            <div class="body">
                <div style="text-align:center;padding:16px 0;">
                    <div style="font-size:22px;font-weight:700;font-family:Georgia,serif;">${o.order_number}</div>
                    <div style="font-size:12px;color:#6B6B6B;">${new Date(o.placed_at).toLocaleString('en-IN')}</div>
                </div>
                <div style="font-weight:700;margin-bottom:8px;">${o.restaurant_name || ''}</div>
                ${(o.items || []).map(i => `<div class="row"><span>${i.quantity}x ${i.item_name}</span><span>₹${(i.item_price * i.quantity).toFixed(0)}</span></div>`).join('')}
                <div class="row" style="margin-top:8px;"><span>Subtotal</span><span>₹${parseFloat(o.subtotal).toFixed(0)}</span></div>
                ${parseFloat(o.delivery_fee) > 0 ? `<div class="row"><span>Delivery</span><span>₹${parseFloat(o.delivery_fee).toFixed(0)}</span></div>` : ''}
                <div class="row"><span>Platform fee</span><span>₹${parseFloat(o.platform_fee || 5).toFixed(0)}</span></div>
                ${parseFloat(o.discount_amount) > 0 ? `<div class="row" style="color:#1DB954;"><span>Discount</span><span>−₹${parseFloat(o.discount_amount).toFixed(0)}</span></div>` : ''}
                <div class="row total"><span>Total</span><span>₹${parseFloat(o.total_amount).toFixed(0)}</span></div>
                <div style="text-align:center;margin-top:20px;color:#A0A0A0;font-size:12px;">Thank you for ordering with Cora!</div>
            </div>
            </body></html>
        `;
        const w = window.open('', '_blank');
        w.document.write(receiptHtml);
        w.document.close();
        w.print();
    }
};
