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
            <div style="background:var(--berry);color:white;padding:16px 20px;margin:16px;border-radius:14px;display:flex;justify-content:space-between;align-items:center;gap:12px;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                    <span style="font-size:14px;">${msg}</span>
                </div>
                ${retryFn ? `<button onclick="${retryFn}" style="background:white;color:var(--berry);border:none;border-radius:8px;padding:6px 14px;font-weight:700;cursor:pointer;font-size:13px;white-space:nowrap;">Retry</button>` : ''}
            </div>
        `;
    }
};
