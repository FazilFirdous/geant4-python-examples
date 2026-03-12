/* ═══════════════════════════════════════
   CORA — Profile Screen
   Complete profile management with dark mode,
   address CRUD, notifications, about section
   ═══════════════════════════════════════ */
const ProfileScreen = {
    _addresses: [],
    _editingAddress: null,

    // ── Render ──────────────────────────────────
    async render() {
        const user = App.user || {};
        const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '';
        const isDark = document.documentElement.classList.contains('dark');
        const version = (typeof App !== 'undefined' && App.config?.version) ? App.config.version : '2.0.0';

        App.setScreen(`
            <div id="profile-screen">
                <!-- Header with Avatar -->
                <div class="screen-header" style="padding-bottom:60px;">
                    <div style="position:relative;z-index:1;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <h2 style="color:white;font-family:'Playfair Display',serif;font-size:24px;font-weight:700;">My Profile</h2>
                            <button class="screen-back-btn" onclick="history.back()" style="display:none;" aria-label="Go back">
                                <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
                            </button>
                        </div>
                    </div>
                    <div style="position:relative;z-index:1;text-align:center;margin-top:12px;">
                        <div class="avatar avatar-lg" style="margin:0 auto;background:rgba(255,255,255,0.2);">
                            ${initials || '<i data-lucide="user" style="width:32px;height:32px;"></i>'}
                        </div>
                        <div style="color:white;font-weight:700;font-size:18px;margin-top:8px;">${user.name || 'Guest'}</div>
                        <div style="color:rgba(255,255,255,0.8);font-size:13px;">${user.phone || ''}</div>
                        ${user.email ? `<div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:2px;">${user.email}</div>` : ''}
                    </div>
                </div>

                <div style="margin-top:-30px;padding:0 16px;position:relative;z-index:5;padding-bottom:80px;">
                    <!-- Edit Profile Card -->
                    <div class="card" style="padding:16px;margin-bottom:12px;">
                        <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px;">
                            <i data-lucide="user-circle" style="width:18px;height:18px;color:var(--berry);"></i> Personal Info
                        </div>
                        <div class="input-group">
                            <label>Full Name</label>
                            <input type="text" id="profile-name" value="${user.name || ''}" placeholder="Your name" autocomplete="name">
                        </div>
                        <div class="input-group">
                            <label>Email (optional)</label>
                            <input type="email" id="profile-email" value="${user.email || ''}" placeholder="email@example.com" autocomplete="email">
                        </div>
                        <button class="btn-primary" style="width:100%;padding:12px;" onclick="ProfileScreen.saveProfile()" id="save-profile-btn">
                            <i data-lucide="save" style="width:16px;height:16px;"></i> Save Changes
                        </button>
                    </div>

                    <!-- Saved Addresses Card -->
                    <div class="card" style="padding:16px;margin-bottom:12px;" id="addresses-card">
                        <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px;">
                            <i data-lucide="map-pin" style="width:18px;height:18px;color:var(--berry);"></i> Saved Addresses
                        </div>
                        <div id="profile-addresses">${Loading.spinner('Loading addresses...')}</div>
                        <button class="btn-secondary" style="width:100%;margin-top:12px;padding:10px;" onclick="ProfileScreen.showAddAddress()">
                            <i data-lucide="plus" style="width:16px;height:16px;"></i> Add New Address
                        </button>
                    </div>

                    <!-- App Settings Card -->
                    <div class="card" style="padding:16px;margin-bottom:12px;">
                        <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px;">
                            <i data-lucide="settings" style="width:18px;height:18px;color:var(--berry);"></i> Settings
                        </div>

                        <!-- Dark Mode Toggle -->
                        <div class="profile-setting-row" style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--berry-border);">
                            <span style="display:inline-flex;align-items:center;gap:8px;font-size:14px;">
                                <i data-lucide="${isDark ? 'moon' : 'sun'}" style="width:16px;height:16px;color:var(--berry);"></i>
                                Dark Mode
                            </span>
                            <div class="toggle-switch ${isDark ? 'on' : ''}" onclick="ProfileScreen.toggleDarkMode()"></div>
                        </div>

                        <!-- Notifications Toggle -->
                        <div class="profile-setting-row" style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--berry-border);">
                            <span style="display:inline-flex;align-items:center;gap:8px;font-size:14px;">
                                <i data-lucide="bell" style="width:16px;height:16px;color:var(--berry);"></i>
                                Order Notifications
                            </span>
                            <div class="toggle-switch on" id="notif-toggle" onclick="ProfileScreen.toggleNotifications()"></div>
                        </div>

                        <!-- Language -->
                        <div class="profile-setting-row" style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;">
                            <span style="display:inline-flex;align-items:center;gap:8px;font-size:14px;">
                                <i data-lucide="globe" style="width:16px;height:16px;color:var(--berry);"></i>
                                Language
                            </span>
                            <span style="font-size:13px;color:var(--text-muted);">English</span>
                        </div>
                    </div>

                    <!-- Support & Help Card -->
                    <div class="card" style="padding:8px 16px;margin-bottom:12px;">
                        <a onclick="window.location.hash='#support'" style="display:flex;align-items:center;gap:8px;padding:12px 0;color:var(--text);text-decoration:none;border-bottom:1px solid var(--berry-border);font-size:14px;cursor:pointer;">
                            <i data-lucide="headphones" style="width:16px;height:16px;color:var(--berry);"></i>
                            Help & Support
                            <i data-lucide="chevron-right" style="width:14px;height:14px;margin-left:auto;color:var(--text-muted);"></i>
                        </a>
                        <a onclick="ProfileScreen.shareApp()" style="display:flex;align-items:center;gap:8px;padding:12px 0;color:var(--text);text-decoration:none;border-bottom:1px solid var(--berry-border);font-size:14px;cursor:pointer;">
                            <i data-lucide="share-2" style="width:16px;height:16px;color:var(--berry);"></i>
                            Share Cora
                            <i data-lucide="chevron-right" style="width:14px;height:14px;margin-left:auto;color:var(--text-muted);"></i>
                        </a>
                        <a onclick="ProfileScreen.rateApp()" style="display:flex;align-items:center;gap:8px;padding:12px 0;color:var(--text);text-decoration:none;font-size:14px;cursor:pointer;">
                            <i data-lucide="star" style="width:16px;height:16px;color:var(--berry);"></i>
                            Rate Cora
                            <i data-lucide="chevron-right" style="width:14px;height:14px;margin-left:auto;color:var(--text-muted);"></i>
                        </a>
                    </div>

                    <!-- Legal Card -->
                    <div class="card" style="padding:8px 16px;margin-bottom:12px;">
                        <a href="/privacy-policy.html" target="_blank" style="display:flex;align-items:center;gap:8px;padding:12px 0;color:var(--text);text-decoration:none;border-bottom:1px solid var(--berry-border);font-size:14px;">
                            <i data-lucide="shield" style="width:16px;height:16px;color:var(--berry);"></i> Privacy Policy
                            <i data-lucide="external-link" style="width:12px;height:12px;margin-left:auto;color:var(--text-muted);"></i>
                        </a>
                        <a href="/terms.html" target="_blank" style="display:flex;align-items:center;gap:8px;padding:12px 0;color:var(--text);text-decoration:none;border-bottom:1px solid var(--berry-border);font-size:14px;">
                            <i data-lucide="file-text" style="width:16px;height:16px;color:var(--berry);"></i> Terms of Service
                            <i data-lucide="external-link" style="width:12px;height:12px;margin-left:auto;color:var(--text-muted);"></i>
                        </a>
                        <a href="/refund-policy.html" target="_blank" style="display:flex;align-items:center;gap:8px;padding:12px 0;color:var(--text);text-decoration:none;font-size:14px;">
                            <i data-lucide="wallet" style="width:16px;height:16px;color:var(--berry);"></i> Refund Policy
                            <i data-lucide="external-link" style="width:12px;height:12px;margin-left:auto;color:var(--text-muted);"></i>
                        </a>
                    </div>

                    <!-- App Info -->
                    <div style="text-align:center;color:var(--text-muted);font-size:12px;margin-bottom:16px;padding:8px;">
                        <div style="font-family:'Playfair Display',serif;font-size:20px;color:var(--berry);font-weight:700;margin-bottom:4px;">Cora</div>
                        v${version} · Made with love for Kulgam
                    </div>

                    <!-- Logout -->
                    <button class="btn-danger" style="width:100%;padding:14px;" onclick="ProfileScreen.confirmLogout()">
                        <i data-lucide="log-out" style="width:16px;height:16px;"></i> Logout
                    </button>

                    <!-- Delete Account -->
                    <button class="btn-ghost" style="width:100%;margin-top:8px;color:var(--text-muted);font-size:12px;" onclick="ProfileScreen.confirmDeleteAccount()">
                        Delete my account
                    </button>
                </div>
            </div>
        `);

        this.loadAddresses();
    },

    // ── Load Addresses ──────────────────────────
    async loadAddresses() {
        try {
            const res = await API.getAddresses();
            this._addresses = res.data || [];
            const el = document.getElementById('profile-addresses');
            if (!el) return;

            if (!this._addresses.length) {
                el.innerHTML = `<p style="color:var(--text-muted);font-size:13px;text-align:center;padding:12px 0;">No saved addresses yet.</p>`;
                return;
            }

            el.innerHTML = this._addresses.map(a => `
                <div class="address-card" style="margin-bottom:8px;${a.is_default ? 'border-color:var(--berry);' : ''}">
                    <div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;background:var(--berry-light);border-radius:50%;flex-shrink:0;">
                        <i data-lucide="${a.label === 'Home' ? 'home' : (a.label === 'Work' ? 'briefcase' : 'map-pin')}" style="width:16px;height:16px;color:var(--berry);"></i>
                    </div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-size:13px;font-weight:700;display:flex;align-items:center;gap:4px;">
                            ${a.label}
                            ${a.is_default ? '<span class="badge badge-berry" style="font-size:9px;">DEFAULT</span>' : ''}
                        </div>
                        <div style="font-size:12px;color:var(--text-muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${a.full_address}${a.landmark ? ', ' + a.landmark : ''}</div>
                    </div>
                    <div style="display:flex;gap:4px;">
                        ${!a.is_default ? `<button onclick="event.stopPropagation();ProfileScreen.setDefaultAddress(${a.id})" class="btn-icon" style="width:28px;height:28px;" aria-label="Set as default"><i data-lucide="check" style="width:14px;height:14px;"></i></button>` : ''}
                        <button onclick="event.stopPropagation();ProfileScreen.deleteAddress(${a.id})" class="btn-icon" style="width:28px;height:28px;background:var(--danger-light);color:var(--danger);" aria-label="Delete address"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                    </div>
                </div>
            `).join('');

            if (typeof lucide !== 'undefined') lucide.createIcons();
        } catch (e) {
            console.error('Failed to load addresses:', e);
            const el = document.getElementById('profile-addresses');
            if (el) el.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">Failed to load addresses.</p>';
        }
    },

    // ── Save Profile ────────────────────────────
    async saveProfile() {
        const name  = document.getElementById('profile-name').value.trim();
        const email = document.getElementById('profile-email').value.trim();

        if (!name) {
            App.showToast('Name is required', 'error');
            return;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            App.showToast('Invalid email format', 'error');
            return;
        }

        const btn = document.getElementById('save-profile-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = Loading.inlineSpinner(16, 'white') + ' Saving...';
        }

        try {
            const res = await API.updateProfile({ name, email });
            if (res.success) {
                App.user = { ...App.user, name, email };
                localStorage.setItem('cora_user', JSON.stringify(App.user));
                App.showToast('Profile updated!', 'success');
            }
        } catch (e) {
            App.showToast(e.message || 'Failed to update', 'error');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i data-lucide="save" style="width:16px;height:16px;"></i> Save Changes';
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
    },

    // ── Delete Address ──────────────────────────
    async deleteAddress(id) {
        // Use modal dialog instead of confirm()
        this._showConfirmDialog(
            'Delete Address',
            'Are you sure you want to delete this address?',
            async () => {
                try {
                    await API.deleteAddress(id);
                    this.loadAddresses();
                    App.showToast('Address deleted', 'info');
                } catch (e) {
                    App.showToast('Failed to delete', 'error');
                }
            }
        );
    },

    // ── Set Default Address ─────────────────────
    async setDefaultAddress(id) {
        try {
            await API.setDefaultAddress(id);
            this.loadAddresses();
            App.showToast('Default address updated', 'success');
        } catch (e) {
            App.showToast('Failed to set default', 'error');
        }
    },

    // ── Show Add Address Form ───────────────────
    showAddAddress() {
        if (typeof CartScreen !== 'undefined') {
            CartScreen.addresses = [];
            CartScreen.showAddAddressForm();
        }
    },

    // ── Toggle Dark Mode ────────────────────────
    toggleDarkMode() {
        if (typeof App !== 'undefined' && App.toggleDarkMode) {
            App.toggleDarkMode();
        } else {
            document.documentElement.classList.toggle('dark');
            try { localStorage.setItem('cora_dark_mode', document.documentElement.classList.contains('dark')); } catch (e) {}
        }
        // Re-render to update icon
        this.render();
    },

    // ── Toggle Notifications ────────────────────
    toggleNotifications() {
        const toggle = document.getElementById('notif-toggle');
        if (toggle) toggle.classList.toggle('on');
        const isOn = toggle?.classList.contains('on');
        try { localStorage.setItem('cora_notifications', isOn); } catch (e) {}
        App.showToast(isOn ? 'Notifications enabled' : 'Notifications disabled', 'info');
    },

    // ── Share App ───────────────────────────────
    shareApp() {
        const shareData = {
            title: 'Cora - Food Delivery',
            text: 'Order delicious food from Kulgam restaurants! Try Cora.',
            url: 'https://proteinstructure.fun/cora/',
        };

        if (navigator.share) {
            navigator.share(shareData).catch(() => {});
        } else {
            navigator.clipboard?.writeText(shareData.url).catch(() => {});
            App.showToast('Link copied to clipboard!', 'success');
        }
    },

    // ── Rate App ────────────────────────────────
    rateApp() {
        App.showToast('Thank you! Rating will be available soon.', 'info');
    },

    // ── Confirm Logout ──────────────────────────
    confirmLogout() {
        this._showConfirmDialog(
            'Logout',
            'Are you sure you want to logout?',
            () => { App.logout(); }
        );
    },

    // ── Confirm Delete Account ──────────────────
    confirmDeleteAccount() {
        this._showConfirmDialog(
            'Delete Account',
            'This will permanently delete your account and all data. This action cannot be undone.',
            async () => {
                try {
                    await API.deleteAccount();
                    App.logout();
                } catch (e) {
                    App.showToast('Failed to delete account', 'error');
                }
            },
            true // isDangerous
        );
    },

    // ── Confirm Dialog (no more confirm()) ──────
    _showConfirmDialog(title, message, onConfirm, isDangerous = false) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div style="background:var(--bg-card);border-radius:20px;padding:24px;width:90%;max-width:340px;margin:auto;box-shadow:var(--shadow-xl);animation:scaleIn 0.2s ease;">
                <h3 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--text);margin-bottom:8px;">${title}</h3>
                <p style="font-size:14px;color:var(--text-sub);line-height:1.5;margin-bottom:20px;">${message}</p>
                <div style="display:flex;gap:10px;">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()" style="flex:1;padding:12px;">Cancel</button>
                    <button class="${isDangerous ? 'btn-danger' : 'btn-primary'}" id="confirm-dialog-btn" style="flex:1;padding:12px;">${isDangerous ? 'Delete' : 'Confirm'}</button>
                </div>
            </div>
        `;

        const confirmBtn = overlay.querySelector('#confirm-dialog-btn');
        confirmBtn.addEventListener('click', () => {
            overlay.remove();
            onConfirm();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        document.body.appendChild(overlay);
    }
};
