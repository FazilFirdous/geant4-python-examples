/* ═══════════════════════════════════════
   CORA Customer App — Main Router & State
   ═══════════════════════════════════════ */

const App = {
    user: null,
    cart: [],
    config: {},
    currentScreen: 'home',
    currentRestaurant: null,
    pollInterval: null,
    _sessionTimer: null,
    _sessionTimeout: 30 * 60 * 1000, // 30 minutes
    _prefersReducedMotion: false,
    _darkMode: false,
    _transitionDirection: 'forward',
    _previousScreen: null,

    // ── Init ──────────────────────────────────────
    async init() {
        try {
            // Detect user preferences
            this._prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this._darkMode = localStorage.getItem('cora_dark_mode') === '1' ||
                             (localStorage.getItem('cora_dark_mode') === null &&
                              window.matchMedia('(prefers-color-scheme: dark)').matches);
            if (this._darkMode) document.documentElement.classList.add('dark');

            // Listen for system dark mode changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (localStorage.getItem('cora_dark_mode') === null) {
                    this.setDarkMode(e.matches);
                }
            });

            // Restore saved session
            const token = localStorage.getItem('cora_token');
            const user  = localStorage.getItem('cora_user');
            if (token && user) {
                try {
                    App.user = JSON.parse(user);
                    API.setToken(token);
                } catch (e) {
                    App.user = null;
                    API.setToken(null);
                }
            }

            // Load cart from storage with corruption detection
            this._loadCart();

            // Network monitoring
            this._initNetworkEvents();

            // API auth expiry listener
            API.on('auth_expired', () => {
                App.user = null;
                App.showToast('Session expired. Please log in again.', 'error');
                App.showAuthScreen();
            });

            // Load server config
            this._loadConfig();

            // Session activity tracking
            this._initSessionTimeout();

            // Global error handler
            window.addEventListener('error', (e) => {
                console.error('Uncaught error:', e.error);
            });
            window.addEventListener('unhandledrejection', (e) => {
                console.error('Unhandled promise rejection:', e.reason);
            });

            // Always show main app — home screen is public
            App.showMainApp();

            // Router
            window.addEventListener('hashchange', () => App.route());
            window.addEventListener('popstate',   () => App.route());

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    // Close any open modals
                    const modal = document.querySelector('[id$="-modal"]');
                    if (modal) modal.remove();
                }
            });

        } catch (e) {
            console.error('App init error:', e);
            App.showMainApp();
        }
    },

    // ── Config ────────────────────────────────────
    async _loadConfig() {
        try {
            const res = await API.getConfig();
            if (res?.success) this.config = res.data || {};
        } catch (e) {
            // Use defaults
            this.config = {
                delivery_fee: 25,
                platform_fee: 5,
                free_delivery_above: 500,
                support_phone: '+919999999999',
                support_email: 'support@cora.app',
                areas: ['Kulgam Town', 'Qaimoh', 'Yaripora', 'DH Pora', 'Devsar', 'Frisal'],
                min_order_amount: 100,
                max_order_items: 50,
            };
        }
    },

    // ── Dark Mode ─────────────────────────────────
    setDarkMode(enabled) {
        this._darkMode = enabled;
        document.documentElement.classList.toggle('dark', enabled);
        localStorage.setItem('cora_dark_mode', enabled ? '1' : '0');
        // Update theme-color meta
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.content = enabled ? '#1A1A1A' : '#D1386C';
    },

    toggleDarkMode() {
        this.setDarkMode(!this._darkMode);
    },

    // ── Network Events ────────────────────────────
    _initNetworkEvents() {
        const banner = document.getElementById('offline-banner');

        window.addEventListener('online', () => {
            if (banner) {
                banner.style.display = 'none';
                banner.setAttribute('aria-hidden', 'true');
            }
            App.showToast('Back online', 'success');
        });

        window.addEventListener('offline', () => {
            if (banner) {
                banner.style.display = 'block';
                banner.setAttribute('aria-hidden', 'false');
            }
        });

        if (!navigator.onLine && banner) {
            banner.style.display = 'block';
            banner.setAttribute('aria-hidden', 'false');
        }
    },

    // ── Session Timeout ───────────────────────────
    _initSessionTimeout() {
        const resetTimer = () => {
            if (this._sessionTimer) clearTimeout(this._sessionTimer);
            if (App.user) {
                this._sessionTimer = setTimeout(() => {
                    App.showToast('Session timed out due to inactivity', 'info');
                    App.logout();
                }, this._sessionTimeout);
            }
        };

        ['click', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimer, { passive: true });
        });
        resetTimer();
    },

    // ── Cart Management ───────────────────────────
    _loadCart() {
        try {
            const saved = localStorage.getItem('cora_cart');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.every(i => i.id && i.name && i.price >= 0)) {
                    App.cart = parsed;
                } else {
                    App.cart = [];
                    localStorage.removeItem('cora_cart');
                }
            }
        } catch (e) {
            App.cart = [];
            localStorage.removeItem('cora_cart');
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
        // Attempt server-side logout (best effort)
        API.logout().catch(() => {});
        API.setToken(null);
        localStorage.removeItem('cora_user');
        localStorage.removeItem('cora_cart');
        API.clearCache();
        App.cart = [];
        App.user = null;
        if (this._sessionTimer) clearTimeout(this._sessionTimer);
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

            // Clear any existing polling
            if (App.pollInterval) {
                clearInterval(App.pollInterval);
                App.pollInterval = null;
            }

            // Clear rider tracking interval
            if (typeof TrackingScreen !== 'undefined' && TrackingScreen._riderInterval) {
                clearInterval(TrackingScreen._riderInterval);
                TrackingScreen._riderInterval = null;
            }

            // Determine transition direction
            const screenOrder = ['home', 'search', 'restaurant', 'cart', 'orders', 'order', 'profile', 'support'];
            const prevIdx = screenOrder.indexOf(this._previousScreen);
            const currIdx = screenOrder.indexOf(screen);
            this._transitionDirection = currIdx >= prevIdx ? 'forward' : 'back';
            this._previousScreen = screen;

            Navbar.setActive(screen);
            this.currentScreen = screen;

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
        if (!container) return;
        container.innerHTML = `
            <div style="padding:60px 20px;text-align:center;" role="alert">
                <div style="width:72px;height:72px;background:var(--berry-light);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--berry)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                </div>
                <h3 style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;margin-bottom:8px;">Something went wrong</h3>
                <p style="color:var(--text-sub);font-size:14px;margin-bottom:24px;">${this._escapeHtml(msg || 'An unexpected error occurred')}</p>
                <button class="btn-primary" onclick="window.location.hash='#home';HomeScreen.render()" style="padding:14px 32px;">Go Home</button>
            </div>
        `;
    },

    // ── Cart Operations ───────────────────────────
    addToCart(item, restaurantId, restaurantName) {
        if (!App.user) {
            App.showToast('Please log in to add items', 'info');
            App.showAuthScreen();
            return;
        }

        // Max cart items check
        const maxItems = this.config.max_order_items || 50;
        if (App.getCartCount() >= maxItems) {
            App.showToast(`Maximum ${maxItems} items allowed per order`, 'error');
            return;
        }

        // Different restaurant check
        if (App.cart.length > 0 && App.cart[0].restaurantId !== restaurantId) {
            this._showClearCartDialog(item, restaurantId, restaurantName);
            return;
        }

        this._addItemToCart(item, restaurantId, restaurantName);
    },

    _showClearCartDialog(item, restaurantId, restaurantName) {
        const fromName = App.cart[0].restaurantName || 'another restaurant';
        const dialog = document.createElement('div');
        dialog.id = 'clear-cart-modal';
        dialog.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:300;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;';
        dialog.innerHTML = `
            <div style="background:var(--card-bg, white);width:88%;max-width:340px;border-radius:20px;padding:24px;text-align:center;animation:slideUp 0.3s ease;">
                <div style="width:56px;height:56px;background:var(--berry-light);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
                    <i data-lucide="shopping-cart" style="width:26px;height:26px;color:var(--berry);"></i>
                </div>
                <h3 style="font-family:'Playfair Display',serif;font-size:18px;margin-bottom:8px;">Replace cart items?</h3>
                <p style="color:var(--text-sub);font-size:13px;margin-bottom:20px;">Your cart has items from <strong>${this._escapeHtml(fromName)}</strong>. Adding from <strong>${this._escapeHtml(restaurantName)}</strong> will clear your current cart.</p>
                <button class="btn-primary" style="width:100%;padding:13px;margin-bottom:8px;" id="clear-cart-yes">Yes, start fresh</button>
                <button class="btn-secondary" style="width:100%;padding:12px;" id="clear-cart-no">No, keep current</button>
            </div>
        `;
        document.body.appendChild(dialog);
        if (typeof lucide !== 'undefined') lucide.createIcons();

        dialog.querySelector('#clear-cart-yes').addEventListener('click', () => {
            App.cart = [];
            this._addItemToCart(item, restaurantId, restaurantName);
            dialog.remove();
        });
        dialog.querySelector('#clear-cart-no').addEventListener('click', () => dialog.remove());
        dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.remove(); });
    },

    _addItemToCart(item, restaurantId, restaurantName) {
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
                is_veg: item.is_veg,
                image_url: item.image_url || null,
            });
        }
        App.saveCart();
        CartBar.update();
        Navbar.updateCartBadge();
        App.showToast(`${item.name} added to cart`, 'success');

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(30);
    },

    removeFromCart(itemId) {
        const idx = App.cart.findIndex(item => item.id === itemId);
        if (idx === -1) return;
        if (App.cart[idx].quantity > 1) {
            App.cart[idx].quantity--;
        } else {
            App.cart.splice(idx, 1);
        }
        App.saveCart();
        CartBar.update();
        Navbar.updateCartBadge();
    },

    getCartTotal() { return App.cart.reduce((s, i) => s + i.price * i.quantity, 0); },
    getCartCount() { return App.cart.reduce((s, i) => s + i.quantity, 0); },

    clearCart() {
        App.cart = [];
        App.saveCart();
        CartBar.update();
        Navbar.updateCartBadge();
    },

    saveCart() {
        try {
            localStorage.setItem('cora_cart', JSON.stringify(App.cart));
        } catch (e) {
            // localStorage full — try clearing old data
            console.warn('Failed to save cart:', e);
        }
    },

    // ── Toast ─────────────────────────────────────
    showToast(msg, type = 'info', duration = 3000) {
        try {
            const toast = document.getElementById('toast');
            if (!toast) return;
            toast.textContent = msg;
            toast.className = `toast ${type} show`;
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'assertive');
            if (this._toastTimer) clearTimeout(this._toastTimer);
            this._toastTimer = setTimeout(() => {
                toast.classList.remove('show');
                toast.removeAttribute('role');
            }, duration);
        } catch (e) {}
    },
    _toastTimer: null,

    // ── Render Container ──────────────────────────
    setScreen(html) {
        const container = document.getElementById('screen-container');
        if (!container) return;

        // Add transition class
        if (!this._prefersReducedMotion) {
            container.style.animation = 'none';
            container.offsetHeight; // force reflow
            container.style.animation = '';
        }

        container.innerHTML = html;

        // Re-apply Lucide icons
        if (typeof lucide !== 'undefined') {
            requestAnimationFrame(() => lucide.createIcons());
        }
    },

    // ── Utility ───────────────────────────────────
    _escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    formatPrice(amount) {
        return '₹' + parseFloat(amount || 0).toFixed(0);
    },

    formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    },

    formatTime(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    },

    formatDateTime(dateStr) {
        if (!dateStr) return '';
        return this.formatDate(dateStr) + ', ' + this.formatTime(dateStr);
    },

    getGreeting() {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    },

    // ── Debounce ──────────────────────────────────
    debounce(fn, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    },

    // ── Throttle ──────────────────────────────────
    throttle(fn, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                fn(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
};

/* ═══ AUTH SCREEN ═══ */
const AuthScreen = {
    _bound: false,

    init() {
        if (!this._bound) {
            const loginBtn = document.getElementById('login-btn');
            const phoneInput = document.getElementById('phone-input');

            if (loginBtn) loginBtn.addEventListener('click', () => this.doLogin());
            if (phoneInput) {
                phoneInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') this.doLogin();
                });
                // Auto-format phone input
                phoneInput.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                });
            }
            this._bound = true;
        }
    },

    async doLogin() {
        const btn = document.getElementById('login-btn');
        const phoneInput = document.getElementById('phone-input');
        if (!btn || !phoneInput) return;

        try {
            const phone = phoneInput.value.replace(/\D/g, '').trim();

            // Validation
            if (phone.length !== 10) {
                App.showToast('Enter a valid 10-digit phone number', 'error');
                phoneInput.focus();
                return;
            }

            if (!/^[6-9]\d{9}$/.test(phone)) {
                App.showToast('Enter a valid Indian mobile number', 'error');
                phoneInput.focus();
                return;
            }

            // Prevent double-submit
            if (btn.disabled) return;
            btn.disabled = true;
            const origText = btn.textContent;
            btn.innerHTML = '<div class="loading-spinner" style="width:20px;height:20px;border-width:2px;border-color:rgba(255,255,255,0.3);border-top-color:white;margin:0 auto;"></div>';

            const fullPhone = '+91' + phone;
            const res = await API.demoLogin({ phone: fullPhone, role: 'customer' });

            if (res && res.success) {
                API.setToken(res.data.token);
                localStorage.setItem('cora_user', JSON.stringify(res.data.user));
                App.user = res.data.user;
                App.showToast(`Welcome${App.user.name ? ', ' + App.user.name : ''}!`, 'success');
                App.showMainApp();
                window.location.hash = '#home';
            } else {
                throw new Error((res && res.message) || 'Login failed');
            }
        } catch (e) {
            App.showToast(e.message || 'Login failed. Try again.', 'error');
            btn.disabled = false;
            btn.textContent = 'Continue';
        }
    }
};

// ── Initialize ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    try {
        App.init();
    } catch (e) {
        console.error('Fatal init error:', e);
        document.getElementById('loading-screen').innerHTML = `
            <div style="text-align:center;color:white;padding:40px;" role="alert">
                <p style="font-size:18px;">App failed to load</p>
                <p style="font-size:13px;opacity:0.7;margin-top:8px;">Please check your connection and try again</p>
                <button onclick="location.reload()" style="margin-top:20px;background:white;color:#D1386C;border:none;border-radius:12px;padding:12px 24px;font-weight:700;cursor:pointer;">Retry</button>
            </div>
        `;
    }
});
