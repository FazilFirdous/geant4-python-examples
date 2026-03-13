/* ═══ Cora Restaurant — Settings Tab (Production) ═══ */

const SettingsTab = {
    settings: {},
    reviews: [],

    /* ── Render ── */
    async render() {
        const r = Dashboard.restaurant || {};

        document.getElementById('tab-content').innerHTML = `
            <div class="settings-container">
                <!-- Restaurant Info Card -->
                <div class="settings-section">
                    <div class="settings-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--berry)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
                        Basic Info
                    </div>
                    <div class="card settings-card">
                        <div class="form-group">
                            <label>Restaurant Name</label>
                            <input type="text" id="s-name" placeholder="Restaurant name" value="${r.name || ''}" maxlength="100">
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="s-desc" rows="3" placeholder="About your restaurant" maxlength="500">${r.description || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Cuisine Tags (comma separated)</label>
                            <input type="text" id="s-cuisine" placeholder="Wazwan, Bakery, Biryani" value="${r.cuisine_type || ''}">
                        </div>
                        <div class="form-group">
                            <label>Address</label>
                            <input type="text" id="s-address" placeholder="Full restaurant address" value="${r.address || ''}">
                        </div>
                        <div class="form-group">
                            <label>UPI ID</label>
                            <input type="text" id="s-upi" placeholder="restaurant@upi" value="${r.upi_id || ''}">
                        </div>
                    </div>
                </div>

                <!-- Business Hours -->
                <div class="settings-section">
                    <div class="settings-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--berry)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Business Hours
                    </div>
                    <div class="card settings-card">
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                            <div class="form-group">
                                <label>Opening Time</label>
                                <input type="time" id="s-opens" value="${r.opens_at || '09:00'}">
                            </div>
                            <div class="form-group">
                                <label>Closing Time</label>
                                <input type="time" id="s-closes" value="${r.closes_at || '22:00'}">
                            </div>
                        </div>
                        <div class="settings-toggle-row">
                            <div>
                                <span class="settings-toggle-label">Temporarily Closed</span>
                                <span class="settings-toggle-desc">Pause all incoming orders</span>
                            </div>
                            <div class="toggle-switch ${r.is_open == 0 ? 'on' : ''}" id="temp-closed-toggle"
                                onclick="this.classList.toggle('on')" role="switch" tabindex="0"
                                aria-label="Toggle temporarily closed"></div>
                        </div>
                    </div>
                </div>

                <!-- Order Settings -->
                <div class="settings-section">
                    <div class="settings-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--berry)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/></svg>
                        Order Settings
                    </div>
                    <div class="card settings-card">
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                            <div class="form-group">
                                <label>Min Order (₹)</label>
                                <input type="number" id="s-min-order" value="${r.min_order_amount || 100}" min="0" max="5000">
                            </div>
                            <div class="form-group">
                                <label>Avg Prep Time (min)</label>
                                <input type="number" id="s-prep-time" value="${r.avg_prep_time || 30}" min="5" max="120">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Delivery Fee (₹)</label>
                            <input type="number" id="s-delivery-fee" value="${r.delivery_fee || 30}" min="0" max="200">
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                            <div class="settings-toggle-row compact">
                                <span class="settings-toggle-label">Delivery</span>
                                <div class="toggle-switch ${r.accepts_delivery !== false ? 'on' : ''}" id="accepts-delivery-toggle"
                                    onclick="this.classList.toggle('on')" role="switch" tabindex="0"></div>
                            </div>
                            <div class="settings-toggle-row compact">
                                <span class="settings-toggle-label">Pickup</span>
                                <div class="toggle-switch ${r.accepts_pickup !== false ? 'on' : ''}" id="accepts-pickup-toggle"
                                    onclick="this.classList.toggle('on')" role="switch" tabindex="0"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Appearance -->
                <div class="settings-section">
                    <div class="settings-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--berry)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                        Appearance
                    </div>
                    <div class="card settings-card">
                        <div class="settings-toggle-row">
                            <div>
                                <span class="settings-toggle-label">Dark Mode</span>
                                <span class="settings-toggle-desc">Reduce eye strain in low light</span>
                            </div>
                            <div class="toggle-switch ${document.documentElement.classList.contains('dark') ? 'on' : ''}"
                                onclick="Dashboard.toggleDarkMode();this.classList.toggle('on')"
                                role="switch" tabindex="0" aria-label="Toggle dark mode"></div>
                        </div>
                        <div class="settings-toggle-row">
                            <div>
                                <span class="settings-toggle-label">Sound Alerts</span>
                                <span class="settings-toggle-desc">Play sound on new orders</span>
                            </div>
                            <div class="toggle-switch ${localStorage.getItem('restaurant_sound') !== 'false' ? 'on' : ''}" id="sound-toggle"
                                onclick="SettingsTab.toggleSound(this)" role="switch" tabindex="0"></div>
                        </div>
                    </div>
                </div>

                <!-- Reviews Section -->
                <div class="settings-section">
                    <div class="settings-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--berry)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        Customer Reviews
                    </div>
                    <div class="card settings-card" id="reviews-section">
                        <div id="reviews-summary"></div>
                        <div id="reviews-list"><div style="text-align:center;color:var(--text-muted);font-size:13px;padding:12px;">Loading reviews...</div></div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="settings-actions">
                    <button class="btn-primary" style="width:100%;padding:14px;" onclick="SettingsTab.saveSettings()" id="save-settings-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                        Save All Changes
                    </button>

                    <div class="settings-footer-links">
                        <button onclick="SettingsTab.shareRestaurant()" class="settings-link-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                            Share Restaurant
                        </button>
                        <button onclick="SettingsTab.logout()" class="settings-link-btn danger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                            Logout
                        </button>
                    </div>

                    <div class="settings-version">
                        CORA Restaurant Dashboard v${Dashboard.VERSION}
                    </div>
                </div>
            </div>
        `;

        this._loadReviews();
    },

    /* ── Reviews ── */
    async _loadReviews() {
        try {
            const res = await RApi.getReviews();
            this.reviews = res?.data || [];

            // Summary
            const summaryEl = document.getElementById('reviews-summary');
            if (summaryEl && this.reviews.length) {
                const avgRating = this.reviews.reduce((s, r) => s + parseFloat(r.food_rating || 0), 0) / this.reviews.length;
                summaryEl.innerHTML = `
                    <div class="reviews-summary-bar">
                        <div class="reviews-avg-rating">
                            <span class="reviews-avg-number">${avgRating.toFixed(1)}</span>
                            <div class="reviews-stars">${this._starsHtml(avgRating)}</div>
                            <span class="reviews-count">${this.reviews.length} review${this.reviews.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                `;
            }

            // List
            const el = document.getElementById('reviews-list');
            if (!el) return;

            if (!this.reviews.length) {
                el.innerHTML = `<div style="color:var(--text-muted);font-size:13px;padding:4px 0;">No reviews yet. They'll appear as customers rate their orders.</div>`;
                return;
            }

            el.innerHTML = this.reviews.slice(0, 10).map(r => `
                <div class="review-item">
                    <div class="review-header">
                        <div class="review-customer">
                            <div class="review-avatar">${(r.customer_name || 'C')[0].toUpperCase()}</div>
                            <div>
                                <div class="review-name">${r.customer_name || 'Customer'}</div>
                                <div class="review-date">${Dashboard.timeSince(r.created_at)}</div>
                            </div>
                        </div>
                        <div class="review-rating-badge" style="background:${parseFloat(r.food_rating) >= 4 ? 'var(--green)' : parseFloat(r.food_rating) >= 3 ? 'var(--orange)' : 'var(--danger)'};">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            ${parseFloat(r.food_rating).toFixed(1)}
                        </div>
                    </div>
                    ${r.comment ? `<div class="review-comment">"${r.comment}"</div>` : ''}
                    ${r.restaurant_reply ? `
                        <div class="review-reply">
                            <strong>Your reply:</strong> ${r.restaurant_reply}
                        </div>
                    ` : `
                        <button onclick="SettingsTab.replyToReview(${r.id})" class="review-reply-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
                            Reply
                        </button>
                    `}
                </div>
            `).join('');
        } catch(e) {
            const el = document.getElementById('reviews-list');
            if (el) el.innerHTML = `<div style="color:var(--danger);font-size:13px;">Failed to load reviews</div>`;
        }
    },

    _starsHtml(rating) {
        const full = Math.floor(rating);
        const half = rating - full >= 0.5;
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < full) {
                stars += '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FFB800" stroke="#FFB800" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
            } else if (i === full && half) {
                stars += '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FFB800" stroke="#FFB800" stroke-width="1"><defs><clipPath id="half"><rect x="0" y="0" width="12" height="24"/></clipPath></defs><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" clip-path="url(#half)"/><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="#DDD" stroke-width="1"/></svg>';
            } else {
                stars += '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DDD" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
            }
        }
        return stars;
    },

    replyToReview(reviewId) {
        Dashboard.showModal({
            title: 'Reply to Review',
            content: `
                <div class="form-group">
                    <label>Your reply</label>
                    <textarea id="review-reply-text" rows="3" placeholder="Thank you for your feedback..." maxlength="500"></textarea>
                </div>
            `,
            actions: [
                { label: 'Post Reply', class: 'btn-primary', style: 'flex:1;padding:12px;', action: 'reply',
                    onClick: async (modal) => {
                        const reply = modal.querySelector('#review-reply-text')?.value.trim();
                        if (!reply) { Dashboard.showToast('Enter a reply', 'error'); return; }
                        const btn = modal.querySelector('[data-action="reply"]');
                        if (btn) { btn.disabled = true; btn.textContent = 'Posting...'; }
                        try {
                            const res = await RApi.replyReview({ review_id: reviewId, reply });
                            if (res?.success) {
                                modal.remove();
                                Dashboard.showToast('Reply posted!', 'success');
                                this._loadReviews();
                            } else throw new Error(res?.message);
                        } catch(e) {
                            Dashboard.showToast(e.message || 'Failed to post reply', 'error');
                            if (btn) { btn.disabled = false; btn.textContent = 'Post Reply'; }
                        }
                    }
                },
                { label: 'Cancel', class: 'btn-secondary', style: 'flex:1;padding:12px;', action: 'close' }
            ]
        });
    },

    /* ── Save Settings ── */
    async saveSettings() {
        const btn = document.getElementById('save-settings-btn');
        if (btn) { btn.disabled = true; btn.innerHTML = '<span class="btn-spinner"></span> Saving...'; }

        const data = {
            name: document.getElementById('s-name')?.value.trim(),
            description: document.getElementById('s-desc')?.value.trim(),
            cuisine_type: document.getElementById('s-cuisine')?.value.trim(),
            address: document.getElementById('s-address')?.value.trim(),
            upi_id: document.getElementById('s-upi')?.value.trim(),
            opens_at: document.getElementById('s-opens')?.value,
            closes_at: document.getElementById('s-closes')?.value,
            min_order_amount: parseInt(document.getElementById('s-min-order')?.value || 100),
            avg_prep_time: parseInt(document.getElementById('s-prep-time')?.value || 30),
            delivery_fee: parseInt(document.getElementById('s-delivery-fee')?.value || 30),
            is_temp_closed: document.getElementById('temp-closed-toggle')?.classList.contains('on'),
            accepts_delivery: document.getElementById('accepts-delivery-toggle')?.classList.contains('on'),
            accepts_pickup: document.getElementById('accepts-pickup-toggle')?.classList.contains('on'),
        };

        // Validation
        if (!data.name) {
            Dashboard.showToast('Restaurant name is required', 'error');
            if (btn) { btn.disabled = false; btn.innerHTML = 'Save All Changes'; }
            return;
        }

        if (data.opens_at && data.closes_at && data.opens_at >= data.closes_at) {
            Dashboard.showToast('Closing time must be after opening time', 'error');
            if (btn) { btn.disabled = false; btn.innerHTML = 'Save All Changes'; }
            return;
        }

        try {
            const res = await RApi.updateSettings(data);
            if (res?.success) {
                // Update local restaurant data
                Object.assign(Dashboard.restaurant || {}, data);
                Dashboard.showToast('Settings saved successfully!', 'success');

                // Update header if name changed
                const nameEl = document.getElementById('restaurant-name-header');
                if (nameEl && data.name) nameEl.textContent = data.name;
            } else {
                throw new Error(res?.message);
            }
        } catch(e) {
            Dashboard.showToast(e.message || 'Failed to save settings', 'error');
        }

        if (btn) { btn.disabled = false; btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save All Changes`; }
    },

    /* ── Other Actions ── */
    toggleSound(toggleEl) {
        const isOn = toggleEl.classList.toggle('on');
        localStorage.setItem('restaurant_sound', isOn);
        Dashboard.showToast(isOn ? 'Sound alerts enabled' : 'Sound alerts muted', 'info');
    },

    async shareRestaurant() {
        const r = Dashboard.restaurant;
        const text = `Check out ${r?.name || 'our restaurant'} on CORA! Order delicious food delivered to your door.`;
        const url = 'https://proteinstructure.fun/cora/';

        if (navigator.share) {
            try {
                await navigator.share({ title: r?.name || 'CORA', text, url });
            } catch(e) { /* user cancelled */ }
        } else {
            try {
                await navigator.clipboard.writeText(`${text}\n${url}`);
                Dashboard.showToast('Link copied to clipboard!', 'success');
            } catch(e) {
                Dashboard.showToast('Could not share', 'error');
            }
        }
    },

    logout() {
        Dashboard.showModal({
            title: 'Logout',
            content: '<p>Are you sure you want to logout from the dashboard?</p>',
            actions: [
                { label: 'Logout', class: 'btn-danger', style: 'flex:1;padding:12px;', action: 'logout',
                    onClick: () => {
                        Dashboard.stopPolling();
                        localStorage.removeItem('restaurant_token');
                        window.location.reload();
                    }
                },
                { label: 'Cancel', class: 'btn-secondary', style: 'flex:1;padding:12px;', action: 'close' }
            ]
        });
    }
};
