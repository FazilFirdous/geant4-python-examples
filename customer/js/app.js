/* ═══════════════════════════════════════
   CORA Customer App — Main Router & Init
   ═══════════════════════════════════════ */

// Firebase config — UPDATE BEFORE DEPLOYMENT
const FIREBASE_CONFIG = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// App State
const App = {
    user: null,
    cart: [],
    currentScreen: 'home',
    currentRestaurant: null,
    pollInterval: null,

    // ── Init ──────────────────────────────────────
    async init() {
        // Initialize Firebase
        try {
            firebase.initializeApp(FIREBASE_CONFIG);
        } catch (e) {
            console.warn('Firebase config not set. Auth will be disabled for demo.');
        }

        // Check stored session
        const token = localStorage.getItem('cora_token');
        const user  = localStorage.getItem('cora_user');

        if (token && user) {
            App.user = JSON.parse(user);
            App.showMainApp();
        } else {
            App.showAuthScreen();
        }

        // Load cart from storage
        const savedCart = localStorage.getItem('cora_cart');
        if (savedCart) App.cart = JSON.parse(savedCart);

        // Offline detection
        window.addEventListener('online',  () => document.getElementById('offline-banner').style.display = 'none');
        window.addEventListener('offline', () => document.getElementById('offline-banner').style.display = 'block');
        if (!navigator.onLine) document.getElementById('offline-banner').style.display = 'block';

        // Router
        window.addEventListener('hashchange', () => App.route());
        window.addEventListener('popstate',   () => App.route());
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
    },

    logout() {
        localStorage.removeItem('cora_token');
        localStorage.removeItem('cora_user');
        localStorage.removeItem('cora_cart');
        App.cart = [];
        App.user = null;
        window.location.hash = '';
        App.showAuthScreen();
    },

    // ── Router ──────────────────────────────────
    route() {
        const hash   = window.location.hash || '#home';
        const parts  = hash.slice(1).split('/');
        const screen = parts[0];
        const param  = parts[1];

        // Clear any active polling
        if (App.pollInterval) {
            clearInterval(App.pollInterval);
            App.pollInterval = null;
        }

        Navbar.setActive(screen);

        const routes = {
            'home':       () => HomeScreen.render(),
            'search':     () => SearchScreen.render(),
            'restaurant': () => RestaurantScreen.render(param),
            'cart':       () => CartScreen.render(),
            'order':      () => TrackingScreen.render(param),
            'orders':     () => OrdersScreen.render(),
            'support':    () => SupportScreen.render(),
            'profile':    () => ProfileScreen.render(),
        };

        const handler = routes[screen];
        if (handler) {
            handler();
        } else {
            HomeScreen.render();
        }
    },

    // ── Cart Management ───────────────────────
    addToCart(item, restaurantId, restaurantName) {
        if (App.cart.length > 0 && App.cart[0].restaurantId !== restaurantId) {
            if (!confirm('Your cart has items from another restaurant. Start a new cart?')) return;
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

    getCartTotal() {
        return App.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },

    getCartCount() {
        return App.cart.reduce((sum, i) => sum + i.quantity, 0);
    },

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
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.className = `toast ${type} show`;
        setTimeout(() => toast.classList.remove('show'), duration);
    },

    // ── Render Container ──────────────────────
    setScreen(html) {
        document.getElementById('screen-container').innerHTML = html;
    }
};

/* ═══ AUTH SCREEN ═══ */
const AuthScreen = {
    confirmationResult: null,

    init() {
        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('send-otp-btn').addEventListener('click', () => this.sendOTP());
        document.getElementById('verify-otp-btn').addEventListener('click', () => this.verifyOTP());
        document.getElementById('resend-otp-btn').addEventListener('click', () => {
            document.getElementById('auth-otp-step').style.display = 'none';
            document.getElementById('auth-phone-step').style.display = 'block';
        });
    },

    async sendOTP() {
        const phone = document.getElementById('phone-input').value.trim();
        if (phone.length !== 10 || isNaN(phone)) {
            App.showToast('Enter a valid 10-digit phone number', 'error');
            return;
        }

        const btn = document.getElementById('send-otp-btn');
        btn.disabled = true;
        btn.textContent = 'Sending...';

        try {
            // Try Firebase OTP
            const fullPhone = '+91' + phone;

            try {
                const recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
                this.confirmationResult = await firebase.auth().signInWithPhoneNumber(fullPhone, recaptcha);
            } catch (fbError) {
                console.warn('Firebase auth failed, using demo mode:', fbError.message);
                // Demo mode: simulate OTP sent
                this.demoPhone = fullPhone;
                this.demoMode  = true;
            }

            document.getElementById('auth-phone-step').style.display = 'none';
            document.getElementById('auth-otp-step').style.display = 'block';
            document.getElementById('otp-sent-to').textContent = `OTP sent to +91 ${phone}`;
            App.showToast('OTP sent!', 'success');

        } catch (e) {
            App.showToast(e.message || 'Failed to send OTP', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Send OTP';
        }
    },

    async verifyOTP() {
        const otp = document.getElementById('otp-input').value.trim();
        if (otp.length !== 6) {
            App.showToast('Enter the 6-digit OTP', 'error');
            return;
        }

        const btn = document.getElementById('verify-otp-btn');
        btn.disabled = true;
        btn.textContent = 'Verifying...';

        try {
            let firebaseUid, phone;

            if (this.demoMode) {
                // Demo mode: any 6-digit OTP works
                firebaseUid = 'demo_' + Date.now();
                phone = this.demoPhone;
            } else {
                const result = await this.confirmationResult.confirm(otp);
                firebaseUid = result.user.uid;
                phone = result.user.phoneNumber;
            }

            // Register/login with backend
            const res = await API.verify({ firebase_uid: firebaseUid, phone });
            if (res.success) {
                localStorage.setItem('cora_token', res.data.token);
                localStorage.setItem('cora_user', JSON.stringify(res.data.user));
                App.user = res.data.user;
                App.showMainApp();
                window.location.hash = '#home';
            } else {
                throw new Error(res.message);
            }
        } catch (e) {
            App.showToast(e.message || 'Invalid OTP', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Verify & Login';
        }
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => App.init());
