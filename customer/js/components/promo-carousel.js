const PromoCarousel = {
    current: 0,
    slides: [],
    autoTimer: null,
    touchStartX: 0,
    container: null,

    init(slides, containerId) {
        this.slides  = slides;
        this.current = 0;
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.render();
        this.startAuto();
        this.bindTouch();
    },

    render() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="carousel-container">
                <div class="carousel-track" id="carousel-track" style="display:flex;transition:transform 0.6s ease;">
                    ${this.slides.map((s, i) => `
                        <div class="carousel-slide" onclick="${s.coupon_code ? `PromoCarousel.applyCoupon('${s.coupon_code}')` : ''}"
                             style="min-width:100%;position:relative;height:140px;border-radius:16px;overflow:hidden;cursor:pointer;display:flex;align-items:flex-end;padding:16px;">
                            <div style="position:absolute;inset:0;background:${s.bg_gradient || 'linear-gradient(135deg, #D1386C, #8C1D47)'};${s.image_url ? `background-image:url(${s.image_url});background-size:cover;` : ''}"></div>
                            <div style="position:absolute;inset:0;background:linear-gradient(to right,rgba(0,0,0,0.6),transparent 60%);"></div>
                            <div style="position:relative;z-index:1;color:white;">
                                <div style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;line-height:1.2;">${s.title}</div>
                                ${s.subtitle ? `<div style="font-size:12px;opacity:0.9;margin-top:2px;">${s.subtitle}</div>` : ''}
                                ${s.coupon_code ? `<button style="margin-top:8px;background:white;color:var(--berry);border:none;border-radius:8px;padding:5px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;">USE ${s.coupon_code}</button>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="carousel-dots" id="carousel-dots">
                ${this.slides.map((_, i) => `<div class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="PromoCarousel.goTo(${i})"></div>`).join('')}
            </div>
        `;
    },

    goTo(index) {
        this.current = (index + this.slides.length) % this.slides.length;
        const track = document.getElementById('carousel-track');
        if (track) track.style.transform = `translateX(-${this.current * 100}%)`;

        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.current);
        });
    },

    next() { this.goTo(this.current + 1); },
    prev() { this.goTo(this.current - 1); },

    startAuto() {
        this.stopAuto();
        if (this.slides.length > 1) {
            this.autoTimer = setInterval(() => this.next(), 4000);
        }
    },

    stopAuto() {
        if (this.autoTimer) clearInterval(this.autoTimer);
    },

    bindTouch() {
        if (!this.container) return;
        this.container.addEventListener('touchstart', e => {
            this.touchStartX = e.touches[0].clientX;
            this.stopAuto();
        }, { passive: true });

        this.container.addEventListener('touchend', e => {
            const diff = this.touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                diff > 0 ? this.next() : this.prev();
            }
            this.startAuto();
        }, { passive: true });
    },

    applyCoupon(code) {
        navigator.clipboard?.writeText(code).catch(() => {});
        App.showToast(`Coupon ${code} copied! Apply at checkout.`, 'success');
    }
};
