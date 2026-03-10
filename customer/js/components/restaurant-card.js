const RestaurantCard = {
    render(r) {
        const rating     = parseFloat(r.rating) || 0;
        const ratingClass = rating >= 4.5 ? 'high' : (rating > 0 ? 'low' : 'none');
        const ratingText  = rating > 0 ? `⭐ ${rating.toFixed(1)}` : 'New';
        const isClosed    = !r.is_open;
        const deliveryFee = parseFloat(r.delivery_fee) || 0;
        const imgHtml = r.cover_image
            ? `<img src="${r.cover_image}" alt="${r.name}" loading="lazy">`
            : `<div class="restaurant-img-placeholder">🍽️</div>`;

        return `
            <div class="restaurant-card ${isClosed ? 'closed' : ''}" onclick="window.location.hash='#restaurant/${r.id}'">
                <div class="restaurant-img-wrap">
                    ${imgHtml}
                    ${r.is_promoted ? '<div class="badge-promoted">⚡ PROMOTED</div>' : ''}
                    <div class="badge-delivery-time">⏱ ${r.avg_prep_time_minutes || 30} min</div>
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
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${m} ${ampm}`;
    }
};
