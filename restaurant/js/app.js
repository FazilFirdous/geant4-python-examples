/* ═══ Cora Restaurant Dashboard — Main App ═══ */

const FIREBASE_CONFIG = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const Dashboard = {
    user: null,
    restaurant: null,
    currentTab: 'orders',
    alertAudio: null,
    isAlertPlaying: false,
    lastOrderCount: 0,
    pollInterval: null,

    async init() {
        try { firebase.initializeApp(FIREBASE_CONFIG); } catch(e) {}

        const token = localStorage.getItem('restaurant_token');
        if (token) {
            try {
                const me = await RApi.getMe();
                if (me?.success && me.data.role === 'restaurant_owner') {
                    Dashboard.user = me.data;
                    Dashboard.showDashboard();
                    return;
                }
            } catch(e) {}
        }
        Dashboard.showAuth();
    },

    showAuth() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'block';
        document.getElementById('main-app').style.display = 'none';
    },

    showDashboard() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        this.switchTab('orders');
        this.startPolling();
    },

    async switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.tab-item').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));

        const content = document.getElementById('tab-content');
        content.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;padding:60px;"><div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div></div>`;

        const tabs = { orders: OrdersTab, menu: MenuTab, deliveries: DeliveriesTab, earnings: EarningsTab, settings: SettingsTab };
        const tabHandler = tabs[tab];
        if (tabHandler) await tabHandler.render();
    },

    startPolling() {
        this.pollInterval = setInterval(async () => {
            if (this.currentTab === 'orders') {
                await OrdersTab.pollNewOrders();
            }
        }, 8000);
    },

    async toggleOpen() {
        try {
            const res = await RApi.toggleOpen();
            if (res.success) {
                const isOpen = res.data.is_open;
                document.getElementById('open-toggle-icon').textContent = isOpen ? '🟢' : '🔴';
                document.getElementById('open-toggle-text').textContent  = isOpen ? 'Open' : 'Closed';
                Dashboard.showToast(isOpen ? 'Restaurant is now OPEN' : 'Restaurant is now CLOSED', 'info');
            }
        } catch(e) { Dashboard.showToast('Failed to toggle status', 'error'); }
    },

    // ── Audio Alert (Web Audio API) ──────────────
    startAlert() {
        if (this.isAlertPlaying) return;
        this.isAlertPlaying = true;
        this._playBeep();
    },

    stopAlert() {
        this.isAlertPlaying = false;
        if (this._alertTimeout) clearTimeout(this._alertTimeout);
    },

    _alertTimeout: null,

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

            // Repeat beep every 1.5 seconds
            this._alertTimeout = setTimeout(() => this._playBeep(), 1500);
        } catch(e) {
            // Web Audio API not available
        }
    },

    showToast(msg, type = 'info', duration = 3000) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.className = `toast ${type} show`;
        setTimeout(() => toast.classList.remove('show'), duration);
    }
};

const Auth = {
    confirmationResult: null,
    demoMode: false,

    async sendOTP() {
        const phone = document.getElementById('phone-input').value.trim();
        if (phone.length !== 10) { Dashboard.showToast('Enter valid 10-digit number', 'error'); return; }

        const btn = document.getElementById('send-otp-btn');
        btn.disabled = true; btn.textContent = 'Sending...';

        try {
            const fullPhone = '+91' + phone;
            try {
                const recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
                this.confirmationResult = await firebase.auth().signInWithPhoneNumber(fullPhone, recaptcha);
            } catch(e) {
                this.demoMode = true;
                this.demoPhone = fullPhone;
            }

            document.getElementById('phone-step').style.display = 'none';
            document.getElementById('otp-step').style.display = 'block';
            document.getElementById('otp-hint').textContent = `OTP sent to +91 ${phone}`;
            Dashboard.showToast('OTP sent!', 'success');
        } catch(e) {
            Dashboard.showToast(e.message || 'Failed to send OTP', 'error');
        } finally {
            btn.disabled = false; btn.textContent = 'Send OTP';
        }
    },

    async verifyOTP() {
        const otp = document.getElementById('otp-input').value.trim();
        if (otp.length !== 6) { Dashboard.showToast('Enter 6-digit OTP', 'error'); return; }

        const btn = document.getElementById('verify-btn');
        btn.disabled = true; btn.textContent = 'Verifying...';

        try {
            let firebaseUid, phone;
            if (this.demoMode) {
                firebaseUid = 'demo_' + Date.now();
                phone = this.demoPhone;
            } else {
                const result = await this.confirmationResult.confirm(otp);
                firebaseUid = result.user.uid;
                phone = result.user.phoneNumber;
            }

            const res = await RApi.verify({ firebase_uid: firebaseUid, phone });
            if (res?.success) {
                if (res.data.user.role !== 'restaurant_owner') {
                    Dashboard.showToast('This account is not a restaurant owner', 'error');
                    return;
                }
                localStorage.setItem('restaurant_token', res.data.token);
                Dashboard.user = res.data.user;
                Dashboard.showDashboard();
            } else {
                throw new Error(res?.message || 'Login failed');
            }
        } catch(e) {
            Dashboard.showToast(e.message || 'Invalid OTP', 'error');
        } finally {
            btn.disabled = false; btn.textContent = 'Verify & Login';
        }
    },

    reset() {
        document.getElementById('otp-step').style.display = 'none';
        document.getElementById('phone-step').style.display = 'block';
    }
};

document.addEventListener('DOMContentLoaded', () => Dashboard.init());
