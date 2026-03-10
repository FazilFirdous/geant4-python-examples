const CartBar = {
    el: null,

    update() {
        this.el = document.getElementById('cart-bar');
        const count = App.getCartCount();
        const total = App.getCartTotal();

        if (count === 0) {
            if (this.el) this.el.style.display = 'none';
            return;
        }

        if (!this.el) {
            const bar = document.createElement('div');
            bar.id = 'cart-bar';
            bar.className = 'cart-bar';
            bar.innerHTML = this.html(count, total);
            bar.addEventListener('click', () => { window.location.hash = '#cart'; });
            document.getElementById('app').appendChild(bar);
            this.el = bar;
        } else {
            this.el.style.display = 'flex';
            this.el.innerHTML = this.html(count, total);
            this.el.onclick = () => { window.location.hash = '#cart'; };
        }
    },

    html(count, total) {
        const name = App.cart[0]?.restaurantName || '';
        return `
            <div class="cart-bar-left">
                <div class="cart-count-badge">${count}</div>
                <div>
                    <div class="cart-bar-text">${count} item${count > 1 ? 's' : ''}</div>
                    <div style="font-size:11px;color:rgba(255,255,255,0.8);">${name}</div>
                </div>
            </div>
            <div class="cart-bar-amount">₹${total.toFixed(0)} →</div>
        `;
    }
};
