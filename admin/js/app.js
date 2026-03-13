/* ═══ Cora Admin — Main App Controller (Production) ═══ */

const Admin = {
    currentTab: 'dashboard',
    VERSION: '2.0.0',

    /* ── Init ── */
    async init() {
        try {
            this._setupDarkMode();
            this._setupKeyboardShortcuts();

            const token = localStorage.getItem('admin_token');
            if (!token) { this._showAuth(); return; }

            try {
                const res = await AApi.getMe();
                if (res?.success && res.data.role === 'admin') {
                    this._showMain();
                    this.switchTab('dashboard');
                } else {
                    localStorage.removeItem('admin_token');
                    this._showAuth();
                }
            } catch (e) {
                this._showAuth();
            }
        } catch (e) {
            console.error('Admin init error:', e);
            this._showAuth();
        }
    },

    /* ── Screens ── */
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

    /* ── Tab Navigation ── */
    switchTab(tab) {
        try {
            this.currentTab = tab;
            document.querySelectorAll('.admin-tab').forEach(el => {
                el.classList.toggle('active', el.dataset.tab === tab);
            });

            const content = document.getElementById('admin-content');
            content.innerHTML = `
                <div class="tab-loading-admin">
                    ${Array(3).fill('<div class="skel" style="height:80px;margin-bottom:12px;border-radius:12px;"></div>').join('')}
                </div>`;

            const tabs = {
                dashboard:  AdminDashboard,
                restaurants: AdminRestaurants,
                orders:     AdminOrders,
                delivery:   AdminDelivery,
                financial:  AdminFinancial,
                coupons:    AdminCoupons,
                settlement: AdminSettlement,
                support:    AdminSupport
            };

            const handler = tabs[tab];
            if (handler) handler.render(content);

            if (typeof lucide !== 'undefined') setTimeout(() => lucide.createIcons(), 100);
        } catch (e) {
            console.error('switchTab error:', e);
            showToast('Failed to load tab', 'error');
        }
    },

    /* ── Dark Mode ── */
    _setupDarkMode() {
        if (localStorage.getItem('admin_dark_mode') === 'true') {
            document.documentElement.classList.add('dark');
        }
    },

    toggleDarkMode() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('admin_dark_mode', isDark);
        showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled', 'info');
    },

    /* ── Keyboard Shortcuts ── */
    _setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

            if (e.altKey && e.key === 'd') { e.preventDefault(); this.toggleDarkMode(); }
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay').forEach(m => { if (m.style.display !== 'none') m.style.display = 'none'; });
            }
        });
    },

    /* ── Modal System ── */
    showModal(modalId, { title, content, actions = [] }) {
        let modal = document.getElementById(modalId);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-box">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="document.getElementById('${modalId}').style.display='none'" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
                <div class="modal-body">${content}</div>
                ${actions.length ? `<div class="modal-footer">${actions.map(a =>
                    `<button class="${a.class || 'btn-primary btn-sm'}" data-action="${a.action || ''}">${a.label}</button>`
                ).join('')}</div>` : ''}
            </div>`;

        // Bind action handlers
        modal.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = actions.find(a => a.action === btn.dataset.action);
                if (action?.onClick) action.onClick(modal);
            });
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        return modal;
    }
};

/* ═══ Auth Controller ═══ */
const AdminAuth = {
    async login() {
        try {
            const phone = document.getElementById('phone-input').value.trim();
            if (phone.length !== 10 || isNaN(phone)) {
                showToast('Enter a valid 10-digit phone number', 'error');
                return;
            }

            const btn = document.getElementById('admin-login-btn');
            btn.disabled = true;
            btn.innerHTML = '<span class="btn-spinner"></span> Logging in...';

            const fullPhone = '+91' + phone;
            const res = await AApi.demoLogin({ phone: fullPhone, role: 'admin' });

            if (res?.success) {
                if (res.data.user.role !== 'admin') {
                    showToast('This phone is not registered as admin', 'error');
                    btn.disabled = false;
                    btn.textContent = 'Login';
                    return;
                }
                localStorage.setItem('admin_token', res.data.token);
                Admin._showMain();
                Admin.switchTab('dashboard');
            } else {
                showToast(res?.message || 'Login failed', 'error');
                btn.disabled = false;
                btn.textContent = 'Login';
            }
        } catch (e) {
            showToast(e.message || 'Login failed', 'error');
            const btn = document.getElementById('admin-login-btn');
            if (btn) { btn.disabled = false; btn.textContent = 'Login'; }
        }
    },

    logout() {
        Admin.showModal('logout-modal', {
            title: 'Logout',
            content: '<p>Are you sure you want to logout from the admin dashboard?</p>',
            actions: [
                { label: 'Logout', class: 'btn-danger btn-sm', action: 'logout', onClick: () => {
                    localStorage.removeItem('admin_token');
                    location.reload();
                }},
                { label: 'Cancel', class: 'btn-outline btn-sm', action: 'cancel', onClick: (m) => { m.style.display = 'none'; }}
            ]
        });
    }
};

/* ═══ Toast System ═══ */
function showToast(msg, type = 'info', duration = 3500) {
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
        toast.style.cssText = 'transform:translateY(-20px);opacity:0;transition:all 0.3s ease;pointer-events:auto;';
        toast.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;">
                ${type === 'success' ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>' : ''}
                ${type === 'error' ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>' : ''}
                <span>${msg}</span>
            </div>`;
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
}

/* ═══ Utility ═══ */
function formatDate(dt) {
    if (!dt) return '—';
    const d = new Date(dt);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ' ' +
           d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function formatCurrency(amount) {
    return '₹' + parseFloat(amount || 0).toFixed(0);
}

/* ═══ Boot ═══ */
document.addEventListener('DOMContentLoaded', () => {
    try {
        setTimeout(() => Admin.init(), 300);
    } catch (e) {
        console.error('Admin init error:', e);
    }
});
