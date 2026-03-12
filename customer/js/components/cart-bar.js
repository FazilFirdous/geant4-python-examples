/* ═══════════════════════════════════════
   CORA — Floating Cart Bar
   Sticky bottom bar showing cart summary
   ═══════════════════════════════════════ */
const CartBar = {
    el: null,
    _visible: false,
    _lastCount: 0,

    // ── Update / Create Bar ─────────────────────
    update() {
        this.el = document.getElementById('cart-bar');
        const count = App.getCartCount();
        const total = App.getCartTotal();

        if (count === 0) {
            this._hide();
            this._lastCount = 0;
            return;
        }

        const shouldAnimate = count !== this._lastCount;
        this._lastCount = count;

        if (!this.el) {
            const bar = document.createElement('div');
            bar.id = 'cart-bar';
            bar.className = 'cart-bar';
            bar.setAttribute('role', 'status');
            bar.setAttribute('aria-live', 'polite');
            bar.setAttribute('aria-label', `Cart: ${count} items, total ₹${total.toFixed(0)}`);
            bar.innerHTML = this._html(count, total);
            bar.addEventListener('click', () => { window.location.hash = '#cart'; });
            document.getElementById('app').appendChild(bar);
            this.el = bar;
            this._visible = true;
        } else {
            this.el.style.display = 'flex';
            this.el.innerHTML = this._html(count, total);
            this.el.setAttribute('aria-label', `Cart: ${count} items, total ₹${total.toFixed(0)}`);
            this.el.onclick = () => { window.location.hash = '#cart'; };
            this._visible = true;

            // Bounce animation on count change
            if (shouldAnimate) {
                this.el.style.animation = 'none';
                this.el.offsetHeight; // force reflow
                this.el.style.animation = 'cartBounce 0.4s ease';
            }
        }

        // Update navbar cart badge too
        if (typeof Navbar !== 'undefined') Navbar.updateCartBadge();
    },

    // ── Hide Bar ────────────────────────────────
    _hide() {
        if (!this.el) this.el = document.getElementById('cart-bar');
        if (this.el) {
            this.el.style.animation = 'slideDown 0.3s ease forwards';
            setTimeout(() => {
                if (this.el) this.el.style.display = 'none';
            }, 300);
        }
        this._visible = false;
    },

    // ── Render HTML ─────────────────────────────
    _html(count, total) {
        const name = App.cart[0]?.restaurantName || '';
        const escapedName = (typeof App !== 'undefined' && App._escapeHtml)
            ? App._escapeHtml(name) : name;

        return `
            <div class="cart-bar-left">
                <div class="cart-count-badge" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--berry)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                </div>
                <div>
                    <div class="cart-bar-text">${count} item${count > 1 ? 's' : ''}</div>
                    <div style="font-size:11px;color:rgba(255,255,255,0.8);max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapedName}</div>
                </div>
            </div>
            <div class="cart-bar-right" style="display:flex;align-items:center;gap:6px;">
                <div class="cart-bar-amount">₹${total.toFixed(0)}</div>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
        `;
    },

    // ── Destroy (cleanup) ───────────────────────
    destroy() {
        if (this.el) {
            this.el.remove();
            this.el = null;
        }
        this._visible = false;
        this._lastCount = 0;
    }
};
