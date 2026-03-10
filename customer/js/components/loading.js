const Loading = {
    skeleton(count = 3) {
        return Array(count).fill(0).map(() => `
            <div class="skeleton-card">
                <div class="skeleton skeleton-img"></div>
                <div style="padding:4px 0 10px;">
                    <div class="skeleton skeleton-line"></div>
                    <div class="skeleton skeleton-line-sm"></div>
                    <div class="skeleton skeleton-line-sm" style="width:40%;margin-top:4px;"></div>
                </div>
            </div>
        `).join('');
    },

    spinner(text = 'Loading...') {
        return `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;gap:16px;">
                <div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div>
                <p style="color:var(--text-muted);font-size:14px;">${text}</p>
            </div>
        `;
    },

    error(msg = 'Something went wrong', retryFn = null) {
        return `
            <div style="background:var(--danger);color:white;padding:16px;margin:16px;border-radius:12px;display:flex;justify-content:space-between;align-items:center;">
                <span>⚠️ ${msg}</span>
                ${retryFn ? `<button onclick="${retryFn}" style="background:white;color:var(--danger);border:none;border-radius:8px;padding:6px 12px;font-weight:700;cursor:pointer;">Retry</button>` : ''}
            </div>
        `;
    }
};
