const ProfileScreen = {
    async render() {
        const user = App.user || {};
        App.setScreen(`
            <div class="screen-header" style="padding-bottom:60px;">
                <div style="position:relative;z-index:1;">
                    <h2 style="color:white;font-family:'Playfair Display',serif;font-size:24px;font-weight:700;">My Profile</h2>
                </div>
                <div style="position:relative;z-index:1;text-align:center;margin-top:12px;">
                    <div style="width:72px;height:72px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto;display:flex;align-items:center;justify-content:center;font-size:36px;">
                        ${user.name ? user.name[0].toUpperCase() : '👤'}
                    </div>
                    <div style="color:white;font-weight:700;font-size:18px;margin-top:8px;">${user.name || 'Guest'}</div>
                    <div style="color:rgba(255,255,255,0.8);font-size:13px;">${user.phone || ''}</div>
                </div>
            </div>

            <div style="margin-top:-30px;padding:0 16px;position:relative;z-index:5;padding-bottom:80px;">
                <!-- Edit Profile -->
                <div class="card" style="padding:16px;margin-bottom:12px;">
                    <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;">Personal Info</div>
                    <div class="input-group">
                        <label>Name</label>
                        <input type="text" id="profile-name" value="${user.name || ''}" placeholder="Your name">
                    </div>
                    <div class="input-group">
                        <label>Email (optional)</label>
                        <input type="email" id="profile-email" value="${user.email || ''}" placeholder="email@example.com">
                    </div>
                    <button class="btn-primary" style="width:100%;padding:12px;" onclick="ProfileScreen.saveProfile()">
                        Save Changes
                    </button>
                </div>

                <!-- Saved Addresses -->
                <div class="card" style="padding:16px;margin-bottom:12px;" id="addresses-card">
                    <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;">Saved Addresses</div>
                    <div id="profile-addresses">${Loading.spinner()}</div>
                    <button class="btn-secondary" style="width:100%;margin-top:12px;padding:10px;" onclick="ProfileScreen.showAddAddress()">
                        + Add New Address
                    </button>
                </div>

                <!-- App Settings -->
                <div class="card" style="padding:16px;margin-bottom:12px;">
                    <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;">Settings</div>
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;">
                        <span>🔔 Order Notifications</span>
                        <div class="toggle-switch on"></div>
                    </div>
                </div>

                <!-- Legal -->
                <div class="card" style="padding:8px 16px;margin-bottom:12px;">
                    <a href="/privacy-policy.html" target="_blank" style="display:block;padding:12px 0;color:var(--text);text-decoration:none;border-bottom:1px solid var(--berry-border);font-size:14px;">🔒 Privacy Policy</a>
                    <a href="/terms.html" target="_blank" style="display:block;padding:12px 0;color:var(--text);text-decoration:none;border-bottom:1px solid var(--berry-border);font-size:14px;">📋 Terms of Service</a>
                    <a href="/refund-policy.html" target="_blank" style="display:block;padding:12px 0;color:var(--text);text-decoration:none;font-size:14px;">💰 Refund Policy</a>
                </div>

                <!-- App Version -->
                <div style="text-align:center;color:var(--text-muted);font-size:12px;margin-bottom:16px;">
                    Cora v1.0.0 · Made with ❤️ for Kulgam
                </div>

                <!-- Logout -->
                <button class="btn-danger" style="width:100%;padding:14px;" onclick="ProfileScreen.confirmLogout()">
                    🚪 Logout
                </button>
            </div>
        `);

        this.loadAddresses();
    },

    async loadAddresses() {
        try {
            const res = await API.getAddresses();
            const addrs = res.data || [];
            const el = document.getElementById('profile-addresses');
            if (!el) return;

            if (!addrs.length) {
                el.innerHTML = `<p style="color:var(--text-muted);font-size:13px;">No saved addresses yet.</p>`;
                return;
            }

            el.innerHTML = addrs.map(a => `
                <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--berry-border);">
                    <span style="font-size:20px;">${a.label === 'Home' ? '🏠' : (a.label === 'Work' ? '🏢' : '📍')}</span>
                    <div style="flex:1;">
                        <div style="font-size:13px;font-weight:700;">${a.label}${a.is_default ? ' <span style="font-size:10px;background:var(--berry);color:white;padding:1px 6px;border-radius:4px;">DEFAULT</span>' : ''}</div>
                        <div style="font-size:12px;color:var(--text-muted);">${a.full_address}${a.landmark ? ', '+a.landmark : ''}</div>
                    </div>
                    <button onclick="ProfileScreen.deleteAddress(${a.id})" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:18px;">🗑️</button>
                </div>
            `).join('');
        } catch (e) {
            console.error('Failed to load addresses:', e);
        }
    },

    async saveProfile() {
        const name  = document.getElementById('profile-name').value.trim();
        const email = document.getElementById('profile-email').value.trim();
        try {
            const res = await API.updateProfile({ name, email });
            if (res.success) {
                App.user = { ...App.user, name, email };
                localStorage.setItem('cora_user', JSON.stringify(App.user));
                App.showToast('Profile updated!', 'success');
            }
        } catch (e) { App.showToast(e.message || 'Failed to update', 'error'); }
    },

    async deleteAddress(id) {
        if (!confirm('Delete this address?')) return;
        try {
            await API.deleteAddress(id);
            this.loadAddresses();
            App.showToast('Address deleted', 'info');
        } catch (e) { App.showToast('Failed to delete', 'error'); }
    },

    showAddAddress() {
        // Reuse CartScreen's form logic
        CartScreen.addresses = [];
        CartScreen.showAddAddressForm();
    },

    confirmLogout() {
        if (confirm('Are you sure you want to logout?')) {
            App.logout();
        }
    }
};
