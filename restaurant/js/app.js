/* ═══ Cora Restaurant Dashboard — Main App Controller ═══ */

const Dashboard = {
    user: null,
    restaurant: null,
    currentTab: 'orders',
    isAlertPlaying: false,
    pollInterval: null,
    _alertTimeout: null,
    _sessionTimer: null,
    _lastActivity: Date.now(),
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 min
    VERSION: '2.0.0',

    /* ── Initialization ── */
    async init() {
        try {
            this._setupDarkMode();
            this._setupActivityTracking();
            this._setupOnlineStatus();
            this._setupKeyboardShortcuts();

            const token = localStorage.getItem('restaurant_token');
            if (token) {
                try {
                    const me = await RApi.getMe();
                    if (me?.success && me.data.role === 'restaurant_owner') {
                        this.user = me.data;
                        if (me.data.restaurant) this.restaurant = me.data.restaurant;
                        this.showDashboard();
                        return;
                    }
                } catch (e) { /* fallthrough to auth */ }
            }
            this.showAuth();
        } catch (e) {
            console.error('Dashboard init error:', e);
            this.showAuth();
        }
    },

    /* ── Screen Management ── */
    showAuth() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'block';
        document.getElementById('main-app').style.display = 'none';
        this._stopSessionTimer();
    },

    async showDashboard() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Populate header info
        await this._loadRestaurantHeader();
        this._startSessionTimer();
        this.switchTab('orders');
        this.startPolling();
    },

    async _loadRestaurantHeader() {
        try {
            const me = await RApi.getMe();
            if (me?.success && me.data.restaurant) {
                const r = me.data.restaurant;
                this.restaurant = r;
                const nameEl = document.getElementById('restaurant-name-header');
                const statusEl = document.getElementById('restaurant-status-text');
                const toggleIcon = document.getElementById('open-toggle-icon');
                const toggleText = document.getElementById('open-toggle-text');
                if (nameEl) nameEl.textContent = r.name;
                if (statusEl) {
                    const rating = parseFloat(r.rating || 0).toFixed(1);
                    const orders = r.total_orders || 0;
                    statusEl.innerHTML = `<span style="display:inline-flex;align-items:center;gap:3px;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="gold" stroke="gold" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${rating}</span> · ${orders} orders`;
                }
                if (toggleIcon) toggleIcon.style.background = r.is_open == 1 ? '#1DB954' : '#E53935';
                if (toggleText) toggleText.textContent = r.is_open == 1 ? 'Open' : 'Closed';
            }
        } catch (e) {
            console.error('Failed to load restaurant info:', e);
        }
    },

    /* ── Tab Navigation ── */
    async switchTab(tab) {
        try {
            this.currentTab = tab;
            document.querySelectorAll('.tab-item').forEach(el =>
                el.classList.toggle('active', el.dataset.tab === tab)
            );

            const content = document.getElementById('tab-content');
            content.innerHTML = `
                <div class="tab-loading">
                    <div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div>
                </div>`;

            const tabs = {
                orders: OrdersTab,
                menu: MenuTab,
                deliveries: DeliveriesTab,
                earnings: EarningsTab,
                settings: SettingsTab
            };

            const tabHandler = tabs[tab];
            if (tabHandler) await tabHandler.render();

            if (typeof lucide !== 'undefined') lucide.createIcons();
        } catch (e) {
            console.error('switchTab error:', e);
            this.showToast('Failed to load tab', 'error');
        }
    },

    /* ── Polling ── */
    startPolling() {
        if (this.pollInterval) clearInterval(this.pollInterval);
        this.pollInterval = setInterval(async () => {
            try {
                if (this.currentTab === 'orders') {
                    await OrdersTab.pollNewOrders();
                }
            } catch (e) {}
        }, 8000);
    },

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    },

    /* ── Open/Close Toggle ── */
    async toggleOpen() {
        try {
            const res = await RApi.toggleOpen();
            if (res?.success) {
                const isOpen = res.data.is_open;
                const icon = document.getElementById('open-toggle-icon');
                const text = document.getElementById('open-toggle-text');
                if (icon) icon.style.background = isOpen ? '#1DB954' : '#E53935';
                if (text) text.textContent = isOpen ? 'Open' : 'Closed';

                if (this.restaurant) this.restaurant.is_open = isOpen;

                this.showToast(
                    isOpen ? 'Restaurant is now OPEN — accepting orders' : 'Restaurant is now CLOSED',
                    isOpen ? 'success' : 'info'
                );
            }
        } catch (e) {
            this.showToast('Failed to toggle status', 'error');
        }
    },

    /* ── Audio Alert System ── */
    startAlert() {
        if (this.isAlertPlaying) return;
        this.isAlertPlaying = true;
        this._playBeep();

        // Also vibrate if supported
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 200]);
        }
    },

    stopAlert() {
        this.isAlertPlaying = false;
        if (this._alertTimeout) clearTimeout(this._alertTimeout);
    },

    _playBeep() {
        if (!this.isAlertPlaying) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
            this._alertTimeout = setTimeout(() => this._playBeep(), 1500);
        } catch (e) {}
    },

    /* ── Toast Notifications ── */
    showToast(msg, type = 'info', duration = 3500) {
        try {
            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:8px;width:90%;max-width:380px;pointer-events:none;';
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.style.cssText = 'transform:translateY(-20px);opacity:0;transition:all 0.3s ease;pointer-events:auto;position:relative;';
            toast.innerHTML = `
                <div style="display:flex;align-items:center;gap:8px;">
                    ${type === 'success' ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>' : ''}
                    ${type === 'error' ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>' : ''}
                    ${type === 'info' ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>' : ''}
                    <span>${msg}</span>
                </div>
            `;
            container.appendChild(toast);

            requestAnimationFrame(() => {
                toast.style.transform = 'translateY(0)';
                toast.style.opacity = '1';
            });

            setTimeout(() => {
                toast.style.transform = 'translateY(-20px)';
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        } catch (e) {}
    },

    /* ── Modal System ── */
    showModal({ title, content, actions = [], width = '480px' }) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-sheet" style="max-width:${width};">
                <div class="modal-handle"></div>
                ${title ? `<h3 class="modal-title">${title}</h3>` : ''}
                <div class="modal-content">${content}</div>
                ${actions.length ? `
                    <div class="modal-actions">
                        ${actions.map(a => `
                            <button class="${a.class || 'btn-secondary'}" style="${a.style || 'flex:1;padding:12px;'}"
                                data-action="${a.action || ''}">${a.label}</button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        // Handle action buttons
        overlay.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                if (action === 'close') {
                    overlay.remove();
                } else {
                    const handler = actions.find(a => a.action === action);
                    if (handler?.onClick) handler.onClick(overlay);
                }
            });
        });

        document.body.appendChild(overlay);
        return overlay;
    },

    /* ── Dark Mode ── */
    _setupDarkMode() {
        const darkMode = localStorage.getItem('restaurant_dark_mode') === 'true';
        if (darkMode) document.documentElement.classList.add('dark');
    },

    toggleDarkMode() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('restaurant_dark_mode', isDark);
        this.showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled', 'info');
    },

    /* ── Session Timer ── */
    _startSessionTimer() {
        this._lastActivity = Date.now();
        this._sessionTimer = setInterval(() => {
            if (Date.now() - this._lastActivity > this.SESSION_TIMEOUT) {
                this._stopSessionTimer();
                this.showToast('Session expired. Please login again.', 'error');
                setTimeout(() => {
                    localStorage.removeItem('restaurant_token');
                    window.location.reload();
                }, 2000);
            }
        }, 60000);
    },

    _stopSessionTimer() {
        if (this._sessionTimer) clearInterval(this._sessionTimer);
    },

    _setupActivityTracking() {
        ['click', 'keydown', 'touchstart', 'scroll'].forEach(event => {
            document.addEventListener(event, () => { this._lastActivity = Date.now(); }, { passive: true });
        });
    },

    /* ── Online/Offline Banner ── */
    _setupOnlineStatus() {
        const showBanner = (online) => {
            let banner = document.getElementById('connectivity-banner');
            if (online) {
                if (banner) banner.remove();
                return;
            }
            if (banner) return;
            banner = document.createElement('div');
            banner.id = 'connectivity-banner';
            banner.className = 'offline-banner';
            banner.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" x2="23" y1="1" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg> You're offline — changes will sync when reconnected`;
            document.body.prepend(banner);
        };

        window.addEventListener('online', () => {
            showBanner(true);
            this.showToast('Back online', 'success');
        });
        window.addEventListener('offline', () => showBanner(false));
        if (!navigator.onLine) showBanner(false);
    },

    /* ── Keyboard Shortcuts ── */
    _setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

            // Alt+1-5 for tab switching
            if (e.altKey && e.key >= '1' && e.key <= '5') {
                e.preventDefault();
                const tabs = ['orders', 'menu', 'deliveries', 'earnings', 'settings'];
                const idx = parseInt(e.key) - 1;
                if (tabs[idx]) this.switchTab(tabs[idx]);
            }

            // Alt+O to toggle open/close
            if (e.altKey && e.key === 'o') {
                e.preventDefault();
                this.toggleOpen();
            }

            // Alt+D to toggle dark mode
            if (e.altKey && e.key === 'd') {
                e.preventDefault();
                this.toggleDarkMode();
            }

            // Escape to stop alert
            if (e.key === 'Escape') {
                this.stopAlert();
                document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
            }
        });
    },

    /* ── Utilities ── */
    formatCurrency(amount) {
        return '₹' + parseFloat(amount || 0).toFixed(0);
    },

    formatTime(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    },

    formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    },

    timeSince(dateStr) {
        if (!dateStr) return '';
        const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
        if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
        return Math.floor(seconds / 86400) + 'd ago';
    }
};

/* ═══ Auth Controller ═══ */
const Auth = {
    async login() {
        try {
            const phone = document.getElementById('phone-input').value.trim();
            if (phone.length !== 10 || isNaN(phone)) {
                Dashboard.showToast('Enter a valid 10-digit phone number', 'error');
                return;
            }

            const btn = document.getElementById('rest-login-btn');
            btn.disabled = true;
            btn.innerHTML = '<span class="btn-spinner"></span> Logging in...';

            const fullPhone = '+91' + phone;
            const res = await RApi.demoLogin({ phone: fullPhone, role: 'restaurant_owner' });

            if (res?.success) {
                if (res.data.user.role !== 'restaurant_owner') {
                    Dashboard.showToast('This phone is not a restaurant account', 'error');
                    btn.disabled = false;
                    btn.textContent = 'Login';
                    return;
                }
                localStorage.setItem('restaurant_token', res.data.token);
                Dashboard.user = res.data.user;
                Dashboard.showDashboard();
            } else {
                throw new Error(res?.message || 'Login failed');
            }
        } catch (e) {
            Dashboard.showToast(e.message || 'Login failed', 'error');
            const btn = document.getElementById('rest-login-btn');
            if (btn) { btn.disabled = false; btn.textContent = 'Login'; }
        }
    },

    reset() { /* legacy — no-op in demo mode */ }
};

/* ═══ Boot ═══ */
document.addEventListener('DOMContentLoaded', () => {
    try {
        Dashboard.init();
    } catch (e) {
        console.error('Fatal Dashboard init error:', e);
    }
});
