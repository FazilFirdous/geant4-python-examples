/* ═══════════════════════════════════════
   CORA — Bottom Navigation Bar
   Production-grade with badges, a11y, animations
   ═══════════════════════════════════════ */
const Navbar = {
    _bound: false,
    _cartBadgeCount: 0,
    _notificationCount: 0,
    _currentScreen: 'home',

    // ── Initialization ──────────────────────────
    init() {
        if (!this._bound) {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const screen = item.dataset.screen;
                    if (screen) {
                        // Add press feedback
                        item.style.transform = 'scale(0.92)';
                        setTimeout(() => { item.style.transform = ''; }, 150);
                        // Haptic feedback
                        if (typeof App !== 'undefined') App.haptic();
                        window.location.hash = '#' + screen;
                    }
                });

                // Keyboard accessibility
                item.setAttribute('role', 'tab');
                item.setAttribute('tabindex', '0');
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        item.click();
                    }
                });
            });

            // Set ARIA roles on nav container
            const nav = document.querySelector('.bottom-nav');
            if (nav) {
                nav.setAttribute('role', 'tablist');
                nav.setAttribute('aria-label', 'Main navigation');
            }

            this._bound = true;
        }

        // Activate Lucide icons
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Initial badge update
        this.updateCartBadge();
        this.updateNotificationBadge();
    },

    // ── Set Active Tab ──────────────────────────
    setActive(screen) {
        this._currentScreen = screen;
        document.querySelectorAll('.nav-item').forEach(item => {
            const isActive = item.dataset.screen === screen;
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-selected', isActive ? 'true' : 'false');
            item.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
    },

    // ── Cart Badge ──────────────────────────────
    updateCartBadge() {
        const count = (typeof App !== 'undefined') ? App.getCartCount() : 0;
        this._cartBadgeCount = count;

        // Find the cart nav item
        const cartNavItem = document.querySelector('.nav-item[data-screen="cart"]') ||
                            document.querySelector('.nav-item[data-screen="orders"]');

        if (!cartNavItem) return;

        // Remove existing badge
        const existingBadge = cartNavItem.querySelector('.nav-badge');
        if (existingBadge) existingBadge.remove();

        if (count > 0) {
            const badge = document.createElement('span');
            badge.className = 'nav-badge nav-badge-cart';
            badge.textContent = count > 99 ? '99+' : count;
            badge.setAttribute('aria-label', `${count} items in cart`);

            // Animate badge appearance
            badge.style.animation = 'badgePop 0.3s ease';

            const iconWrap = cartNavItem.querySelector('.nav-icon');
            if (iconWrap) {
                iconWrap.style.position = 'relative';
                iconWrap.appendChild(badge);
            }
        }
    },

    // ── Notification Badge ──────────────────────
    updateNotificationBadge(count) {
        if (count !== undefined) this._notificationCount = count;
        const nCount = this._notificationCount;

        const homeNavItem = document.querySelector('.nav-item[data-screen="home"]');
        if (!homeNavItem) return;

        const existingDot = homeNavItem.querySelector('.nav-notification-dot');
        if (existingDot) existingDot.remove();

        if (nCount > 0) {
            const dot = document.createElement('span');
            dot.className = 'nav-notification-dot';
            dot.setAttribute('aria-label', `${nCount} new notifications`);
            const iconWrap = homeNavItem.querySelector('.nav-icon');
            if (iconWrap) {
                iconWrap.style.position = 'relative';
                iconWrap.appendChild(dot);
            }
        }
    },

    // ── Show/Hide Nav ───────────────────────────
    show() {
        const nav = document.querySelector('.bottom-nav');
        if (nav) {
            nav.style.transform = 'translateY(0)';
            nav.style.opacity = '1';
            nav.style.pointerEvents = 'auto';
        }
    },

    hide() {
        const nav = document.querySelector('.bottom-nav');
        if (nav) {
            nav.style.transform = 'translateY(100%)';
            nav.style.opacity = '0';
            nav.style.pointerEvents = 'none';
        }
    },

    // ── Scroll-aware hide/show ──────────────────
    _lastScrollY: 0,
    _scrollThreshold: 50,

    initScrollBehavior(scrollContainer) {
        if (!scrollContainer) return;
        let ticking = false;

        scrollContainer.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentY = scrollContainer.scrollTop;
                    const delta = currentY - Navbar._lastScrollY;

                    if (delta > Navbar._scrollThreshold && currentY > 100) {
                        Navbar.hide();
                    } else if (delta < -Navbar._scrollThreshold || currentY < 50) {
                        Navbar.show();
                    }

                    Navbar._lastScrollY = currentY;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    },

    // ── Destroy (cleanup for SPA) ───────────────
    destroy() {
        this._bound = false;
        this._cartBadgeCount = 0;
        this._notificationCount = 0;
    }
};
