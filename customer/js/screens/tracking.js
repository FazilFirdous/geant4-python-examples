const TrackingScreen = {
    order: null,
    pollTimer: null,

    async render(id) {
        App.setScreen(`
            <div class="screen-header">
                <div style="display:flex;align-items:center;gap:12px;position:relative;z-index:1;">
                    <button class="screen-back-btn" onclick="history.back()">←</button>
                    <h2 style="color:white;font-family:'Playfair Display',serif;font-size:22px;">Track Order</h2>
                </div>
            </div>
            <div id="tracking-body">${Loading.spinner('Loading order...')}</div>
        `);

        await this.loadOrder(id);

        // Poll every 10 seconds
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

    renderOrder() {
        const o = this.order;
        if (!o) return;

        const statusMessages = {
            placed:         { emoji: '📋', msg: 'Order sent to restaurant!', friendly: 'Waiting for the restaurant to accept your order...' },
            accepted:       { emoji: '✅', msg: 'Order Accepted!', friendly: 'The restaurant has accepted your order!' },
            preparing:      { emoji: '👨‍🍳', msg: 'Preparing', friendly: 'Your chef is working their magic 🍳' },
            ready:          { emoji: '✨', msg: 'Order Ready!', friendly: 'Your order is ready!' },
            picked_up:      { emoji: '🏃', msg: 'Picked Up', friendly: 'Delivery partner has picked up your order!' },
            on_the_way:     { emoji: '🛵', msg: 'On the Way!', friendly: 'Almost there! Your rider is on the way 🛵' },
            delivered:      { emoji: '🎉', msg: 'Delivered!', friendly: 'Your order has been delivered. Enjoy! 😋' },
            cancelled:      { emoji: '❌', msg: 'Cancelled', friendly: `Order was cancelled. Reason: ${o.cancel_reason || 'N/A'}` },
            delivery_issue: { emoji: '⚠️', msg: 'Delivery Issue', friendly: o.customer_note_delivery || 'There\'s an issue with delivery. We\'re working on it.' }
        };

        const statusSteps = ['placed','accepted','preparing','ready','picked_up','on_the_way','delivered'];
        const currentStep = statusSteps.indexOf(o.status);
        const sm          = statusMessages[o.status] || { emoji: '📋', msg: o.status, friendly: '' };

        const timelineHtml = statusSteps.map((step, i) => {
            const isDone    = i < currentStep || o.status === 'delivered';
            const isActive  = i === currentStep && o.status !== 'delivered' && o.status !== 'cancelled';
            const stepMsg   = statusMessages[step];
            const timestamps = {
                placed: o.placed_at, accepted: o.accepted_at, preparing: o.preparing_at,
                ready: o.ready_at, picked_up: o.picked_up_at, on_the_way: o.picked_up_at, delivered: o.delivered_at
            };
            const ts = timestamps[step];

            return `
                <div class="timeline-item">
                    <div class="timeline-dot-wrap">
                        <div class="timeline-dot ${isDone ? 'done' : (isActive ? 'active' : '')}"></div>
                        ${i < statusSteps.length - 1 ? `<div class="timeline-line ${isDone ? 'done' : ''}"></div>` : ''}
                    </div>
                    <div class="timeline-content" style="padding-bottom:16px;">
                        <div class="timeline-status ${isDone ? 'done' : (isActive ? 'active' : '')}">
                            ${stepMsg.emoji} ${stepMsg.msg}
                        </div>
                        ${ts ? `<div class="timeline-time">${new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        const deliveryIssueHtml = o.status === 'delivery_issue' ? `
            <div style="background:#FFF3E0;border:1px solid #FFE0B2;border-radius:12px;padding:14px;margin:0 16px 12px;">
                <div style="font-weight:700;color:#E65100;">⚠️ Delivery Update</div>
                <div style="font-size:13px;color:#BF360C;margin-top:4px;">${o.customer_note_delivery || 'We\'re finding a delivery partner for you.'}</div>
            </div>
        ` : '';

        const deliveryBoyHtml = o.delivery_boy_name ? `
            <div class="card" style="margin:0 16px 12px;padding:16px;">
                <div style="font-size:13px;font-weight:700;color:var(--text-muted);margin-bottom:10px;">YOUR DELIVERY PARTNER</div>
                <div style="display:flex;align-items:center;gap:14px;">
                    <div style="width:48px;height:48px;background:var(--berry-light);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;">🛵</div>
                    <div style="flex:1;">
                        <div style="font-weight:700;font-size:15px;">${o.delivery_boy_name}</div>
                        <div style="font-size:13px;color:var(--text-muted);">Delivery Partner</div>
                    </div>
                    <a href="tel:${o.delivery_boy_phone}" class="btn-secondary" style="padding:8px 14px;text-decoration:none;font-size:13px;">📞 Call</a>
                </div>
            </div>
        ` : '';

        const isDelivered = o.status === 'delivered';

        document.getElementById('tracking-body').innerHTML = `
            <!-- Status Hero -->
            <div style="background:linear-gradient(135deg,var(--berry),var(--berry-deep));padding:24px;text-align:center;">
                <div style="font-size:52px;">${sm.emoji}</div>
                <h3 style="color:white;font-family:'Playfair Display',serif;font-size:22px;margin-top:8px;">${sm.msg}</h3>
                <p style="color:rgba(255,255,255,0.85);font-size:14px;margin-top:4px;">${sm.friendly}</p>
                <div style="background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border-radius:10px;padding:8px 16px;margin-top:12px;display:inline-block;color:white;font-size:13px;">
                    Order #${o.order_number}
                </div>
            </div>

            <!-- Delivery Animation (for active deliveries) -->
            ${['picked_up','on_the_way'].includes(o.status) ? `
                <div style="background:var(--berry-light);padding:16px;text-align:center;overflow:hidden;">
                    <div style="position:relative;height:60px;background:white;border-radius:12px;overflow:hidden;">
                        <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:var(--berry-border);"></div>
                        <div style="position:absolute;font-size:30px;animation:ride 3s linear infinite;top:50%;transform:translateY(-50%);">🛵</div>
                    </div>
                </div>
            ` : ''}

            ${deliveryIssueHtml}
            ${deliveryBoyHtml}

            <!-- Timeline -->
            <div class="card" style="margin:12px 16px;padding:16px;">
                <div style="font-size:13px;font-weight:700;color:var(--text-muted);margin-bottom:14px;">ORDER STATUS</div>
                <div class="timeline">${timelineHtml}</div>
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

            <!-- Receipt Download -->
            <div style="padding:0 16px 12px;">
                <button class="btn-secondary" style="width:100%;padding:12px;" onclick="TrackingScreen.downloadReceipt()">
                    📄 View Receipt
                </button>
            </div>

            <!-- Review (if delivered) -->
            ${isDelivered && !o.review ? `
                <div class="card" style="margin:0 16px 12px;padding:16px;">
                    <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:8px;">Rate your experience</div>
                    <div id="review-stars" style="display:flex;gap:8px;font-size:32px;margin-bottom:12px;">
                        ${[1,2,3,4,5].map(s => `<span onclick="TrackingScreen.setRating(${s})" style="cursor:pointer;opacity:0.4;" data-star="${s}">⭐</span>`).join('')}
                    </div>
                    <textarea id="review-comment" placeholder="Tell us about your experience..." style="width:100%;background:white;border:1.5px solid var(--berry-border);border-radius:12px;padding:10px;font-size:13px;resize:none;height:70px;font-family:'DM Sans',sans-serif;outline:none;"></textarea>
                    <button class="btn-primary" style="width:100%;margin-top:10px;padding:12px;" onclick="TrackingScreen.submitReview(${o.id})">
                        Submit Review ⭐
                    </button>
                </div>
            ` : ''}

            <!-- Support -->
            <div style="padding:0 16px 24px;">
                <button class="btn-secondary" style="width:100%;padding:12px;" onclick="window.location.hash='#support'">
                    💬 Need Help?
                </button>
            </div>
        `;
    },

    selectedRating: 0,

    setRating(n) {
        this.selectedRating = n;
        document.querySelectorAll('[data-star]').forEach(el => {
            el.style.opacity = parseInt(el.dataset.star) <= n ? '1' : '0.3';
        });
    },

    async submitReview(orderId) {
        if (!this.selectedRating) { App.showToast('Please select a rating', 'error'); return; }
        const comment = document.getElementById('review-comment')?.value || '';
        try {
            const res = await API.submitReview({ order_id: orderId, food_rating: this.selectedRating, comment });
            if (res.success) {
                App.showToast('Review submitted! Thank you 🙏', 'success');
                this.loadOrder(orderId);
            }
        } catch (e) { App.showToast(e.message || 'Failed to submit review', 'error'); }
    },

    downloadReceipt() {
        const o = this.order;
        if (!o) return;
        const items = (o.items || []).map(i => `${i.quantity}x ${i.item_name} — ₹${(i.item_price * i.quantity).toFixed(0)}`).join('\n');
        const receiptHtml = `
            <html><head><meta charset="UTF-8"><title>Receipt</title>
            <style>
                body { font-family: 'DM Sans',sans-serif; max-width: 400px; margin: 20px auto; color: #1A1A1A; }
                .header { background: linear-gradient(135deg,#D1386C,#8C1D47); color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center; }
                .body { padding: 20px; border: 1px solid #FFE0EB; border-top: none; border-radius: 0 0 12px 12px; }
                .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #FFE0EB; font-size: 14px; }
                .total { font-weight: 700; font-size: 16px; border-top: 2px solid #D1386C; border-bottom: none; margin-top: 8px; }
                .order-num { font-size: 22px; font-weight: 700; font-family: Georgia,serif; }
            </style></head><body>
            <div class="header">
                <div style="font-size:32px;">🍽️</div>
                <div style="font-size:24px;font-weight:700;">CORA</div>
                <div style="opacity:0.85;font-size:13px;">Kulgam's Food, Delivered</div>
            </div>
            <div class="body">
                <div style="text-align:center;padding:16px 0;">
                    <div class="order-num">${o.order_number}</div>
                    <div style="font-size:12px;color:#6B6B6B;">${new Date(o.placed_at).toLocaleString('en-IN')}</div>
                </div>
                <div style="font-weight:700;margin-bottom:8px;">${o.restaurant_name || ''}</div>
                ${(o.items || []).map(i => `<div class="row"><span>${i.quantity}x ${i.item_name}</span><span>₹${(i.item_price * i.quantity).toFixed(0)}</span></div>`).join('')}
                <div class="row" style="margin-top:8px;"><span>Subtotal</span><span>₹${parseFloat(o.subtotal).toFixed(0)}</span></div>
                ${parseFloat(o.delivery_fee) > 0 ? `<div class="row"><span>Delivery</span><span>₹${parseFloat(o.delivery_fee).toFixed(0)}</span></div>` : ''}
                <div class="row"><span>Platform fee</span><span>₹${parseFloat(o.platform_fee || 5).toFixed(0)}</span></div>
                ${parseFloat(o.discount_amount) > 0 ? `<div class="row" style="color:#1DB954;"><span>Discount</span><span>−₹${parseFloat(o.discount_amount).toFixed(0)}</span></div>` : ''}
                <div class="row total"><span>Total</span><span>₹${parseFloat(o.total_amount).toFixed(0)}</span></div>
                <div style="text-align:center;margin-top:20px;color:#A0A0A0;font-size:12px;">Thank you for ordering with Cora! 🙏</div>
            </div>
            </body></html>
        `;
        const w = window.open('', '_blank');
        w.document.write(receiptHtml);
        w.document.close();
        w.print();
    }
};
