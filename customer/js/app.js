/* ═══════════════════════════════════════
   CORA Customer App — Main Router & Init
   ═══════════════════════════════════════ */

// App State
const App = {
    user: null,
    cart: [],
    currentScreen: 'home',
    currentRestaurant: null,
    pollInterval: null,

    // ── Init ──────────────────────────────────────
    async init() {
        try {
            // Restore saved session
            const token = localStorage.getItem('cora_token');
            const user  = localStorage.getItem('cora_user');
            if (token && user) {
                App.user = JSON.parse(user);
            }

            // Load cart from storage
            try {
                const savedCart = localStorage.getItem('cora_cart');
                if (savedCart) App.cart = JSON.parse(savedCart);
            } catch (e) { App.cart = []; }

            // Offline detection
            window.addEventListener('online',  () => {
                const b = document.getElementById('offline-banner');
                if (b) b.style.display = 'none';
            });
            window.addEventListener('offline', () => {
                const b = document.getElementById('offline-banner');
                if (b) b.style.display = 'block';
            });
            if (!navigator.onLine) {
                const b = document.getElementById('offline-banner');
                if (b) b.style.display = 'block';
            }

            // Always show main app — home screen is public
            App.showMainApp();

            // Router
            window.addEventListener('hashchange', () => App.route());
            window.addEventListener('popstate',   () => App.route());

        } catch (e) {
            console.error('App init error:', e);
            App.showMainApp();
        }
    },

    // ── Auth ──────────────────────────────────────
    showAuthScreen() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'block';
        document.getElementById('main-app').style.display = 'none';
        AuthScreen.init();
    },

    showMainApp() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        Navbar.init();
        App.route();
        // Activate Lucide icons in nav
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    requireAuth(callback) {
        if (App.user) {
            callback();
        } else {
            App.showToast('Please log in to continue', 'info');
            App.showAuthScreen();
        }
    },

    logout() {
        localStorage.removeItem('cora_token');
        localStorage.removeItem('cora_user');
        localStorage.removeItem('cora_cart');
        App.cart = [];
        App.user = null;
        window.location.hash = '#home';
        App.showMainApp();
    },

    // ── Router ──────────────────────────────────
    route() {
        try {
            const hash   = window.location.hash || '#home';
            const parts  = hash.slice(1).split('/');
            const screen = parts[0];
            const param  = parts[1];

            if (App.pollInterval) {
                clearInterval(App.pollInterval);
                App.pollInterval = null;
            }

            Navbar.setActive(screen);

            // Public routes (no login required)
            const publicRoutes = {
                'home':       () => HomeScreen.render(),
                'search':     () => SearchScreen.render(),
                'restaurant': () => RestaurantScreen.render(param),
            };

            // Auth-required routes
            const authRoutes = {
                'cart':    () => CartScreen.render(),
                'order':   () => TrackingScreen.render(param),
                'orders':  () => OrdersScreen.render(),
                'support': () => SupportScreen.render(),
                'profile': () => ProfileScreen.render(),
            };

            if (publicRoutes[screen]) {
                publicRoutes[screen]();
            } else if (authRoutes[screen]) {
                if (App.user) {
                    authRoutes[screen]();
                } else {
                    App.showToast('Please log in to continue', 'info');
                    App.showAuthScreen();
                }
            } else {
                HomeScreen.render();
            }
        } catch (e) {
            console.error('Route error:', e);
            App.showErrorScreen(e.message);
        }
    },

    showErrorScreen(msg) {
        const container = document.getElementById('screen-container');
        if (container) {
            container.innerHTML = `
                <div style="padding:40px 20px;text-align:center;">
                    <div style="width:64px;height:64px;background:var(--berry-light);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--berry)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                    </div>
                    <h3 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;margin-bottom:8px;">Something went wrong</h3>
                    <p style="color:var(--text-sub);font-size:14px;margin-bottom:24px;">Tap below to try again</p>
                    <button class="btn-primary" onclick="HomeScreen.render()" style="padding:12px 32px;">Go Home</button>
                </div>
            `;
        }
    },

    // ── Cart Management ───────────────────────
    addToCart(item, restaurantId, restaurantName) {
        if (!App.user) {
            App.showToast('Please log in to add items', 'info');
            App.showAuthScreen();
            return;
        }
        if (App.cart.length > 0 && App.cart[0].restaurantId !== restaurantId) {
            const fromName = App.cart[0].restaurantName || 'another restaurant';
            if (!confirm(`Your cart has items from ${fromName}. Adding from here will clear your cart. Continue?`)) return;
            App.cart = [];
        }
        const existing = App.cart.find(i => i.id === item.id);
        if (existing) {
            existing.quantity++;
        } else {
            App.cart.push({
                id: item.id,
                name: item.name,
                price: parseFloat(item.price),
                quantity: 1,
                restaurantId,
                restaurantName,
                is_veg: item.is_veg
            });
        }
        App.saveCart();
        CartBar.update();
        App.showToast(`${item.name} added to cart`, 'success');
    },

    removeFromCart(itemId) {
        const i = App.cart.findIndex(i => i.id === itemId);
        if (i === -1) return;
        if (App.cart[i].quantity > 1) {
            App.cart[i].quantity--;
        } else {
            App.cart.splice(i, 1);
        }
        App.saveCart();
        CartBar.update();
    },

    getCartTotal() { return App.cart.reduce((s, i) => s + i.price * i.quantity, 0); },
    getCartCount() { return App.cart.reduce((s, i) => s + i.quantity, 0); },

    clearCart() {
        App.cart = [];
        App.saveCart();
        CartBar.update();
    },

    saveCart() {
        localStorage.setItem('cora_cart', JSON.stringify(App.cart));
    },

    // ── Toast ─────────────────────────────────
    showToast(msg, type = 'info', duration = 3000) {
        try {
            const toast = document.getElementById('toast');
            if (!toast) return;
            toast.textContent = msg;
            toast.className = `toast ${type} show`;
            setTimeout(() => toast.classList.remove('show'), duration);
        } catch (e) {}
    },

    // ── Render Container ──────────────────────
    setScreen(html) {
        document.getElementById('screen-container').innerHTML = html;
        // Re-apply Lucide icons after dynamic render
        if (typeof lucide !== 'undefined') {
            setTimeout(() => lucide.createIcons(), 0);
        }
    }
};

/* ═══ AUTH SCREEN ═══ */
const AuthScreen = {
    _bound: false,

    init() {
        if (!this._bound) {
            document.getElementById('login-btn').addEventListener('click', () => this.doLogin());
            const input = document.getElementById('phone-input');
            if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.doLogin(); });
            this._bound = true;
        }
    },

    async doLogin() {
        try {
            const phone = document.getElementById('phone-input').value.trim();
            if (phone.length !== 10 || isNaN(phone)) {
                App.showToast('Enter a valid 10-digit phone number', 'error');
                return;
            }

            const btn = document.getElementById('login-btn');
            btn.disabled = true;
            btn.textContent = 'Logging in...';

            const fullPhone = '+91' + phone;
            const res = await API.demoLogin({ phone: fullPhone, role: 'customer' });

            if (res && res.success) {
                localStorage.setItem('cora_token', res.data.token);
                localStorage.setItem('cora_user', JSON.stringify(res.data.user));
                App.user = res.data.user;
                App.showToast(`Welcome! ${App.user.name || ''}`, 'success');
                App.showMainApp();
                window.location.hash = '#home';
            } else {
                throw new Error((res && res.message) || 'Login failed');
            }
        } catch (e) {
            App.showToast(e.message || 'Login failed. Try again.', 'error');
            const btn = document.getElementById('login-btn');
            if (btn) { btn.disabled = false; btn.textContent = 'Continue'; }
        }
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    try {
        App.init();
    } catch (e) {
        console.error('Fatal init error:', e);
        document.getElementById('loading-screen').innerHTML = `
            <div style="text-align:center;color:white;padding:40px;">
                <p style="font-size:18px;">App failed to load</p>
                <button onclick="location.reload()" style="margin-top:20px;background:white;color:#D1386C;border:none;border-radius:12px;padding:12px 24px;font-weight:700;cursor:pointer;">Retry</button>
            </div>
        `;
    }
});
