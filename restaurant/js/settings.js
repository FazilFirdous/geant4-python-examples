const SettingsTab = {
    async render() {
        document.getElementById('tab-content').innerHTML = `
            <div style="padding:16px 0 80px;">
                <div style="padding:0 16px 16px;">
                    <h2 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;margin-bottom:16px;">Restaurant Settings</h2>

                    <!-- Restaurant Info -->
                    <div class="card" style="padding:16px;margin-bottom:16px;">
                        <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;">Basic Info</div>
                        <div class="form-group"><label>Restaurant Name</label><input type="text" id="s-name" placeholder="Restaurant name"></div>
                        <div class="form-group"><label>Description</label><textarea id="s-desc" rows="2" placeholder="About your restaurant"></textarea></div>
                        <div class="form-group"><label>Cuisine Tags (comma separated)</label><input type="text" id="s-cuisine" placeholder="Wazwan, Bakery, Biryani"></div>
                        <div class="form-group"><label>UPI ID</label><input type="text" id="s-upi" placeholder="restaurant@upi"></div>
                    </div>

                    <!-- Business Hours -->
                    <div class="card" style="padding:16px;margin-bottom:16px;">
                        <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;">Business Hours</div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                            <div class="form-group"><label>Opening Time</label><input type="time" id="s-opens" value="09:00"></div>
                            <div class="form-group"><label>Closing Time</label><input type="time" id="s-closes" value="22:00"></div>
                        </div>
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;background:var(--berry-light);border-radius:10px;margin-top:8px;">
                            <span style="font-size:14px;font-weight:600;">Temporarily Closed</span>
                            <div class="toggle-switch" id="temp-closed-toggle" onclick="this.classList.toggle('on')"></div>
                        </div>
                    </div>

                    <!-- Order Settings -->
                    <div class="card" style="padding:16px;margin-bottom:16px;">
                        <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;">Order Settings</div>
                        <div class="form-group"><label>Minimum Order Amount (₹)</label><input type="number" id="s-min-order" value="100" min="0"></div>
                        <div class="form-group"><label>Average Prep Time (minutes)</label><input type="number" id="s-prep-time" value="30" min="5" max="120"></div>
                        <div style="display:flex;gap:12px;">
                            <div style="flex:1;">
                                <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;background:var(--berry-light);border-radius:10px;">
                                    <span style="font-size:13px;font-weight:600;">Delivery</span>
                                    <div class="toggle-switch on" id="accepts-delivery-toggle" onclick="this.classList.toggle('on')"></div>
                                </div>
                            </div>
                            <div style="flex:1;">
                                <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;background:var(--berry-light);border-radius:10px;">
                                    <span style="font-size:13px;font-weight:600;">Pickup</span>
                                    <div class="toggle-switch on" id="accepts-pickup-toggle" onclick="this.classList.toggle('on')"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Reviews Section -->
                    <div class="card" style="padding:16px;margin-bottom:16px;" id="reviews-section">
                        <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;">Customer Reviews</div>
                        <div id="reviews-list"><div style="text-align:center;color:var(--text-muted);font-size:13px;">Loading reviews...</div></div>
                    </div>

                    <button class="btn-primary" style="width:100%;padding:14px;" onclick="SettingsTab.saveSettings()">Save Changes</button>

                    <div style="margin-top:16px;text-align:center;">
                        <button onclick="SettingsTab.logout()" style="background:none;border:none;color:var(--danger);font-size:14px;cursor:pointer;font-family:'DM Sans',sans-serif;">🚪 Logout</button>
                    </div>
                </div>
            </div>
        `;

        this.loadReviews();
    },

    async loadReviews() {
        try {
            const res = await RApi.getReviews();
            const reviews = res?.data || [];
            const el = document.getElementById('reviews-list');
            if (!el) return;

            if (!reviews.length) {
                el.innerHTML = `<div style="color:var(--text-muted);font-size:13px;">No reviews yet.</div>`;
                return;
            }

            el.innerHTML = reviews.slice(0, 5).map(r => `
                <div style="padding:12px 0;border-bottom:1px solid var(--berry-border);">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div style="font-weight:700;font-size:14px;">${r.customer_name || 'Customer'}</div>
                        <div style="background:${r.food_rating >= 4.5 ? 'var(--green)' : 'var(--orange)'};color:white;padding:2px 8px;border-radius:6px;font-size:12px;font-weight:700;">⭐ ${r.food_rating}</div>
                    </div>
                    ${r.comment ? `<div style="font-size:13px;color:var(--text-sub);margin-top:4px;">"${r.comment}"</div>` : ''}
                    ${r.restaurant_reply ? `
                        <div style="background:var(--berry-light);border-radius:8px;padding:8px;margin-top:6px;font-size:12px;">
                            <strong>Your reply:</strong> ${r.restaurant_reply}
                        </div>
                    ` : `
                        <button onclick="SettingsTab.replyToReview(${r.id})" style="background:none;border:none;color:var(--berry);font-size:12px;cursor:pointer;margin-top:4px;font-family:'DM Sans',sans-serif;">↩ Reply</button>
                    `}
                </div>
            `).join('');
        } catch(e) {
            const el = document.getElementById('reviews-list');
            if (el) el.innerHTML = `<div style="color:var(--danger);font-size:13px;">Failed to load reviews</div>`;
        }
    },

    replyToReview(reviewId) {
        const reply = prompt('Your reply to this review:');
        if (!reply) return;
        RApi.replyReview({ review_id: reviewId, reply }).then(res => {
            if (res?.success) { Dashboard.showToast('Reply posted!', 'success'); this.loadReviews(); }
        }).catch(() => Dashboard.showToast('Failed to post reply', 'error'));
    },

    saveSettings() {
        Dashboard.showToast('Settings saved!', 'success');
        // In production, gather form values and call restaurant update API
    },

    logout() {
        if (confirm('Logout from dashboard?')) {
            localStorage.removeItem('restaurant_token');
            window.location.reload();
        }
    }
};
