/* ═══ Cora Restaurant Dashboard — Main App (Demo Auth) ═══ */

const Dashboard = {
    user: null,
    restaurant: null,
    currentTab: 'orders',
    isAlertPlaying: false,
    pollInterval: null,
    _alertTimeout: null,

    async init() {
        try {
            const token = localStorage.getItem('restaurant_token');
            if (token) {
                try {
                    const me = await RApi.getMe();
                    if (me?.success && me.data.role === 'restaurant_owner') {
                        Dashboard.user = me.data;
                        if (me.data.restaurant) Dashboard.restaurant = me.data.restaurant;
                        Dashboard.showDashboard();
                        return;
                    }
                } catch (e) { /* fallthrough to auth */ }
            }
            Dashboard.showAuth();
        } catch (e) {
            console.error('Dashboard init error:', e);
            Dashboard.showAuth();
        }
    },

    showAuth() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'block';
        document.getElementById('main-app').style.display = 'none';
    },

    async showDashboard() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Fetch and display restaurant info in header
        try {
            const me = await RApi.getMe();
            if (me?.success && me.data.restaurant) {
                const r = me.data.restaurant;
                Dashboard.restaurant = r;
                const nameEl = document.getElementById('restaurant-name-header');
                const statusEl = document.getElementById('restaurant-status-text');
                const toggleIcon = document.getElementById('open-toggle-icon');
                const toggleText = document.getElementById('open-toggle-text');
                if (nameEl) nameEl.textContent = r.name;
                if (statusEl) statusEl.textContent = `${r.rating} · ${r.total_orders || 0} orders`;
                if (toggleIcon) toggleIcon.style.background = r.is_open == 1 ? '#1DB954' : '#E53935';
                if (toggleText) toggleText.textContent = r.is_open == 1 ? 'Open' : 'Closed';
            }
        } catch (e) {
            console.error('Failed to load restaurant info:', e);
        }

        this.switchTab('orders');
        this.startPolling();
    },

    async switchTab(tab) {
        try {
            this.currentTab = tab;
            document.querySelectorAll('.tab-item').forEach(el =>
                el.classList.toggle('active', el.dataset.tab === tab)
            );
            const content = document.getElementById('tab-content');
            content.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;padding:60px;"><div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div></div>`;

            const tabs = { orders: OrdersTab, menu: MenuTab, deliveries: DeliveriesTab, earnings: EarningsTab, settings: SettingsTab };
            const tabHandler = tabs[tab];
            if (tabHandler) await tabHandler.render();

            if (typeof lucide !== 'undefined') lucide.createIcons();
        } catch (e) {
            console.error('switchTab error:', e);
            Dashboard.showToast('Failed to load tab', 'error');
        }
    },

    startPolling() {
        this.pollInterval = setInterval(async () => {
            try {
                if (this.currentTab === 'orders') {
                    await OrdersTab.pollNewOrders();
                }
            } catch (e) {}
        }, 8000);
    },

    async toggleOpen() {
        try {
            const res = await RApi.toggleOpen();
            if (res && res.success) {
                const isOpen = res.data.is_open;
                const icon = document.getElementById('open-toggle-icon');
                const text = document.getElementById('open-toggle-text');
                if (icon) icon.style.background = isOpen ? '#1DB954' : '#E53935';
                if (text) text.textContent = isOpen ? 'Open' : 'Closed';
                Dashboard.showToast(isOpen ? 'Restaurant is now OPEN' : 'Restaurant is now CLOSED', 'info');
            }
        } catch (e) {
            Dashboard.showToast('Failed to toggle status', 'error');
        }
    },

    startAlert() {
        if (this.isAlertPlaying) return;
        this.isAlertPlaying = true;
        this._playBeep();
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

    showToast(msg, type = 'info', duration = 3000) {
        try {
            const toast = document.getElementById('toast');
            if (!toast) return;
            toast.textContent = msg;
            toast.className = `toast ${type} show`;
            setTimeout(() => toast.classList.remove('show'), duration);
        } catch (e) {}
    }
};

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
            btn.textContent = 'Logging in...';

            const fullPhone = '+91' + phone;
            const res = await RApi.demoLogin({ phone: fullPhone, role: 'restaurant_owner' });

            if (res && res.success) {
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
                throw new Error((res && res.message) || 'Login failed');
            }
        } catch (e) {
            Dashboard.showToast(e.message || 'Login failed', 'error');
            const btn = document.getElementById('rest-login-btn');
            if (btn) { btn.disabled = false; btn.textContent = 'Login'; }
        }
    },

    reset() { /* legacy — no-op in demo mode */ }
};

document.addEventListener('DOMContentLoaded', () => {
    try {
        Dashboard.init();
    } catch (e) {
        console.error('Fatal Dashboard init error:', e);
    }
});
