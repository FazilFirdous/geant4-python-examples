/* ============================================================
   Cora Admin — app.js  (Demo Auth — no Firebase)
   ============================================================ */

const Admin = {
    currentTab: 'dashboard',

    init() {
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) { this._showAuth(); return; }

            AApi.getMe().then(res => {
                if (res && res.success && res.data.role === 'admin') {
                    this._showMain();
                    this.switchTab('dashboard');
                } else {
                    localStorage.removeItem('admin_token');
                    this._showAuth();
                }
            }).catch(() => this._showAuth());
        } catch (e) {
            this._showAuth();
        }
    },

    _showAuth() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'block';
        document.getElementById('main-app').style.display = 'none';
    },

    _showMain() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    switchTab(tab) {
        try {
            this.currentTab = tab;
            document.querySelectorAll('.admin-tab').forEach(el => {
                el.classList.toggle('active', el.dataset.tab === tab);
            });
            const content = document.getElementById('admin-content');
            content.innerHTML = '<div style="padding:20px;">' +
                Array(4).fill('<div style="height:80px;margin-bottom:12px;border-radius:12px;background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);animation:shimmer 1.5s infinite;"></div>').join('') +
                '</div>';

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

            if (typeof lucide !== 'undefined') setTimeout(() => lucide.createIcons(), 0);
        } catch (e) {
            console.error('switchTab error:', e);
        }
    }
};

const AdminAuth = {
    async login() {
        try {
            const phone = document.getElementById('phone-input').value.trim();
            if (phone.length !== 10 || isNaN(phone)) {
                showToast('Enter a valid 10-digit phone number');
                return;
            }

            const btn = document.getElementById('admin-login-btn');
            btn.disabled = true;
            btn.textContent = 'Logging in...';

            const fullPhone = '+91' + phone;
            const res = await AApi.demoLogin({ phone: fullPhone, role: 'admin' });

            if (res && res.success) {
                if (res.data.user.role !== 'admin') {
                    showToast('This phone is not registered as admin');
                    btn.disabled = false;
                    btn.textContent = 'Login';
                    return;
                }
                localStorage.setItem('admin_token', res.data.token);
                Admin._showMain();
                Admin.switchTab('dashboard');
            } else {
                showToast((res && res.message) || 'Login failed');
                btn.disabled = false;
                btn.textContent = 'Login';
            }
        } catch (e) {
            showToast(e.message || 'Login failed');
            const btn = document.getElementById('admin-login-btn');
            if (btn) { btn.disabled = false; btn.textContent = 'Login'; }
        }
    },

    logout() {
        localStorage.removeItem('admin_token');
        location.reload();
    }
};

function showToast(msg, type = 'info', duration = 3000) {
    try {
        const t = document.getElementById('toast');
        t.textContent = msg;
        t.className = `toast ${type} show`;
        setTimeout(() => t.classList.remove('show'), duration);
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        setTimeout(() => Admin.init(), 400);
    } catch (e) {
        console.error('Admin init error:', e);
    }
});
