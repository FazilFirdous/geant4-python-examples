/* ============================================================
   Cora Admin — app.js  (Firebase Auth + Tab Controller)
   ============================================================ */

const FIREBASE_CONFIG = {
    apiKey:            "YOUR_FIREBASE_API_KEY",
    authDomain:        "YOUR_PROJECT.firebaseapp.com",
    projectId:         "YOUR_PROJECT_ID",
    storageBucket:     "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId:             "YOUR_APP_ID"
};

/* ---------- global state ---------- */
let _firebaseApp = null;
let _firebaseAuth = null;
let _firebaseConfirm = null;
const DEMO_MODE = true;   // set false when real Firebase keys are in place

/* ============================================================
   Admin  — tab controller
   ============================================================ */
const Admin = {
    currentTab: 'dashboard',

    init() {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            this._showAuth();
            return;
        }
        AApi.getMe().then(res => {
            if (res.success && res.data.role === 'admin') {
                this._showMain();
                this.switchTab('dashboard');
            } else {
                localStorage.removeItem('admin_token');
                this._showAuth();
            }
        }).catch(() => this._showAuth());
    },

    _showAuth() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'block';
        document.getElementById('main-app').style.display = 'none';
        AdminAuth.init();
    },

    _showMain() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
    },

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.admin-tab').forEach(el => {
            el.classList.toggle('active', el.dataset.tab === tab);
        });
        const content = document.getElementById('admin-content');
        content.innerHTML = '<div class="skel-wrap">' + Array(4).fill('<div class="skel" style="height:80px;margin-bottom:12px;border-radius:12px;"></div>').join('') + '</div>';

        switch (tab) {
            case 'dashboard':   AdminDashboard.render(content);   break;
            case 'restaurants': AdminRestaurants.render(content);  break;
            case 'orders':      AdminOrders.render(content);       break;
            case 'delivery':    AdminDelivery.render(content);     break;
            case 'financial':   AdminFinancial.render(content);    break;
            case 'coupons':     AdminCoupons.render(content);      break;
            case 'settlement':  AdminSettlement.render(content);   break;
            case 'support':     AdminSupport.render(content);      break;
        }
    }
};

/* ============================================================
   AdminAuth — Firebase OTP + demo mode
   ============================================================ */
const AdminAuth = {
    _confirmResult: null,

    init() {
        try {
            if (!_firebaseApp) {
                _firebaseApp  = firebase.initializeApp(FIREBASE_CONFIG, 'admin');
                _firebaseAuth = firebase.auth(_firebaseApp);
                _firebaseAuth.useDeviceLanguage();
            }
        } catch(e) {
            console.warn('Firebase init skipped (demo mode):', e.message);
        }
    },

    async sendOTP() {
        const phone = document.getElementById('phone-input').value.trim();
        if (phone.length !== 10) { showToast('Enter valid 10-digit number'); return; }

        if (DEMO_MODE) {
            document.getElementById('admin-phone-step').style.display = 'none';
            document.getElementById('admin-otp-step').style.display   = 'block';
            showToast('Demo mode: use any 6 digits');
            return;
        }

        try {
            const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
            this._confirmResult = await _firebaseAuth.signInWithPhoneNumber('+91' + phone, verifier);
            document.getElementById('admin-phone-step').style.display = 'none';
            document.getElementById('admin-otp-step').style.display   = 'block';
        } catch(e) {
            showToast('Error: ' + e.message);
        }
    },

    async verifyOTP() {
        const otp = document.getElementById('otp-input').value.trim();
        if (otp.length !== 6) { showToast('Enter 6-digit OTP'); return; }

        let firebaseUid = 'demo_' + Date.now();
        const phone = document.getElementById('phone-input').value.trim();

        if (!DEMO_MODE) {
            try {
                const result = await this._confirmResult.confirm(otp);
                firebaseUid = result.user.uid;
            } catch(e) {
                showToast('Wrong OTP'); return;
            }
        }

        const res = await AApi.verify({ phone: '+91' + phone, firebase_uid: firebaseUid, role: 'admin' });
        if (res.success) {
            localStorage.setItem('admin_token', res.data.token);
            Admin._showMain();
            Admin.switchTab('dashboard');
        } else {
            showToast(res.message || 'Login failed — not an admin account');
        }
    },

    reset() {
        document.getElementById('admin-phone-step').style.display = 'block';
        document.getElementById('admin-otp-step').style.display   = 'none';
        document.getElementById('phone-input').value = '';
        document.getElementById('otp-input').value  = '';
    },

    logout() {
        localStorage.removeItem('admin_token');
        location.reload();
    }
};

/* ============================================================
   Toast utility
   ============================================================ */
function showToast(msg, duration = 3000) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), duration);
}

/* ============================================================
   Boot
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => Admin.init(), 600);
});
