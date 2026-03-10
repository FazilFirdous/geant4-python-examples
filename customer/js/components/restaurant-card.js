const RestaurantCard = {
    // Gradient backgrounds for cards without images
    _gradients: [
        'linear-gradient(135deg,#D1386C,#8C1D47)',
        'linear-gradient(135deg,#8C1D47,#D1386C)',
        'linear-gradient(135deg,#B22D5B,#6A1040)',
        'linear-gradient(135deg,#C42B5A,#8C1D47)',
    ],

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

        return `
            <div class="restaurant-card ${isClosed ? 'closed' : ''}" onclick="window.location.hash='#restaurant/${r.id}'">
                <div class="restaurant-img-wrap">
                    ${imgHtml}
                    ${r.is_promoted ? `<div class="badge-promoted"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> PROMOTED</div>` : ''}
                    <div class="badge-delivery-time">${clockSvg} ${r.avg_prep_time_minutes || 30} min</div>
                    <div class="badge-distance">${r.area || 'Kulgam'}</div>
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
                        <span class="meta-text">${deliveryFee > 0 ? '₹' + deliveryFee + ' delivery' : 'Free delivery'}</span>
                        <span class="meta-dot"></span>
                        <span class="meta-text">Min ₹${r.min_order_amount || 100}</span>
                    </div>
                </div>
            </div>
        `;
    },

    formatTime(time) {
        if (!time) return '9:00 AM';
        const [h, m] = time.split(':');
        const hour   = parseInt(h);
        const ampm   = hour >= 12 ? 'PM' : 'AM';
        return `${hour % 12 || 12}:${m} ${ampm}`;
    }
};
