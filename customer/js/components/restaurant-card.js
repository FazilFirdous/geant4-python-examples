/* ═══════════════════════════════════════
   CORA — Restaurant Card Component
   Production-grade card with favorite heart,
   offer badges, better info layout
   ═══════════════════════════════════════ */
const RestaurantCard = {
    // Gradient backgrounds for cards without images
    _gradients: [
        'linear-gradient(135deg,#D1386C,#8C1D47)',
        'linear-gradient(135deg,#8C1D47,#D1386C)',
        'linear-gradient(135deg,#B22D5B,#6A1040)',
        'linear-gradient(135deg,#C42B5A,#8C1D47)',
    ],

    // ── Render a restaurant card ────────────────
    render(r) {
        const rating      = parseFloat(r.rating) || 0;
        const ratingClass = rating >= 4.5 ? 'high' : (rating > 0 ? 'low' : 'none');
        const isClosed    = !parseInt(r.is_open);
        const deliveryFee = parseFloat(r.delivery_fee) || 0;
        const gradient    = this._gradients[r.id % this._gradients.length] || this._gradients[0];

        const starSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#FFB800" stroke="#FFB800" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
        const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
        const ratingText = rating > 0 ? `${starSvg} ${rating.toFixed(1)}` : 'New';

        const imgHtml = r.cover_image
            ? `<img src="${r.cover_image}" alt="${r.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">`
            : `<div style="width:100%;height:100%;background:${gradient};display:flex;align-items:center;justify-content:center;">
                   <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
               </div>`;

        // Favorite heart
        const isFav = RestaurantCard._isFavorite(r.id);

        // Offer badge
        const offerHtml = r.offer_text ? `
            <div style="position:absolute;bottom:8px;left:8px;right:60px;background:rgba(209,56,108,0.9);color:white;font-size:11px;font-weight:700;padding:4px 8px;border-radius:6px;backdrop-filter:blur(4px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1" style="display:inline;vertical-align:middle;margin-right:2px;"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>
                ${r.offer_text}
            </div>
        ` : '';

        return `
            <div class="restaurant-card ${isClosed ? 'closed' : ''}" onclick="window.location.hash='#restaurant/${r.id}'" role="article" aria-label="${r.name}${isClosed ? ' - Currently closed' : ''}">
                <div class="restaurant-img-wrap">
                    ${imgHtml}
                    ${r.is_promoted ? `<div class="badge-promoted"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> PROMOTED</div>` : ''}
                    <div class="badge-delivery-time">${clockSvg} ${r.avg_prep_time_minutes || 30} min</div>
                    ${offerHtml}
                    <!-- Favorite Heart -->
                    <button onclick="event.stopPropagation();RestaurantCard.toggleFavorite(${r.id}, this)" class="restaurant-fav-btn" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}" style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.35);border:none;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(4px);transition:all 0.2s ease;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${isFav ? 'white' : 'none'}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </button>
                    ${isClosed ? `
                        <div class="restaurant-closed-overlay">
                            <strong>CLOSED</strong>
                            <small>Opens at ${RestaurantCard.formatTime(r.opens_at)}</small>
                        </div>
                    ` : ''}
                </div>
                <div class="restaurant-info">
                    <div class="restaurant-name">${r.name}</div>
                    <div class="restaurant-cuisine">${r.cuisine_tags || 'Multi-cuisine'}</div>
                    <div class="restaurant-meta">
                        <span class="rating-badge ${ratingClass}">${ratingText}</span>
                        ${r.total_reviews ? `<span class="meta-text">(${r.total_reviews})</span>` : ''}
                        <span class="meta-dot"></span>
                        <span class="meta-text">${deliveryFee > 0 ? '₹' + deliveryFee + ' delivery' : '<span style="color:var(--green);font-weight:600;">Free delivery</span>'}</span>
                        <span class="meta-dot"></span>
                        <span class="meta-text">Min ₹${r.min_order_amount || 100}</span>
                    </div>
                </div>
            </div>
        `;
    },

    // ── Format Time ─────────────────────────────
    formatTime(time) {
        if (!time) return '9:00 AM';
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        return `${hour % 12 || 12}:${m} ${ampm}`;
    },

    // ── Favorites Management ────────────────────
    _isFavorite(id) {
        try {
            const favs = JSON.parse(localStorage.getItem('cora_favorites') || '[]');
            return favs.includes(id);
        } catch (e) { return false; }
    },

    toggleFavorite(id, btn) {
        try {
            let favs = JSON.parse(localStorage.getItem('cora_favorites') || '[]');
            const wasFav = favs.includes(id);

            if (wasFav) {
                favs = favs.filter(f => f !== id);
            } else {
                favs.push(id);
            }

            localStorage.setItem('cora_favorites', JSON.stringify(favs));

            // Update heart icon
            if (btn) {
                const svg = btn.querySelector('svg');
                if (svg) svg.setAttribute('fill', wasFav ? 'none' : 'white');

                // Animate
                btn.style.transform = 'scale(1.3)';
                setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
            }

            // Haptic
            if (typeof App !== 'undefined') App.haptic();

            App.showToast(wasFav ? 'Removed from favorites' : 'Added to favorites!', wasFav ? 'info' : 'success');
        } catch (e) {}
    },

    // ── Render Compact Card (for horizontal scroll) ─
    renderCompact(r) {
        const rating = parseFloat(r.rating) || 0;
        const ratingClass = rating >= 4.5 ? 'high' : (rating > 0 ? 'low' : 'none');
        const gradient = this._gradients[r.id % this._gradients.length] || this._gradients[0];

        return `
            <div onclick="window.location.hash='#restaurant/${r.id}'" style="min-width:200px;background:var(--bg-card);border:1px solid var(--berry-border);border-radius:14px;overflow:hidden;cursor:pointer;flex-shrink:0;transition:all 0.2s ease;">
                <div style="height:80px;overflow:hidden;">
                    ${r.cover_image
                        ? `<img src="${r.cover_image}" alt="${r.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">`
                        : `<div style="width:100%;height:100%;background:${gradient};display:flex;align-items:center;justify-content:center;">
                               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
                           </div>`
                    }
                </div>
                <div style="padding:8px 10px;">
                    <div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.name}</div>
                    <div style="display:flex;align-items:center;gap:4px;margin-top:3px;">
                        <span class="rating-badge ${ratingClass}" style="font-size:10px;padding:1px 5px;">${rating > 0 ? rating.toFixed(1) : 'New'}</span>
                        <span style="font-size:11px;color:var(--text-muted);">${r.avg_prep_time_minutes || 30} min</span>
                    </div>
                </div>
            </div>
        `;
    }
};
