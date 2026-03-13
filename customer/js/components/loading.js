/* ═══════════════════════════════════════
   CORA — Loading States & Skeletons
   Production-grade loading components
   ═══════════════════════════════════════ */
const Loading = {
    // ── Restaurant Card Skeleton ─────────────────
    skeleton(count = 3) {
        return Array(count).fill(0).map(() => `
            <div class="skeleton-card" aria-hidden="true">
                <div class="skeleton skeleton-img"></div>
                <div style="padding:4px 0 10px;">
                    <div class="skeleton skeleton-line"></div>
                    <div class="skeleton skeleton-line-sm"></div>
                    <div class="skeleton skeleton-line-sm" style="width:40%;margin-top:4px;"></div>
                </div>
            </div>
        `).join('');
    },

    // ── Menu Item Skeleton ───────────────────────
    menuSkeleton(count = 4) {
        return Array(count).fill(0).map(() => `
            <div class="skeleton-menu-item" aria-hidden="true" style="display:flex;gap:12px;padding:14px 16px;border-bottom:1px solid var(--berry-border);">
                <div style="flex:1;">
                    <div class="skeleton" style="height:12px;width:60%;margin-bottom:8px;border-radius:4px;"></div>
                    <div class="skeleton" style="height:10px;width:90%;margin-bottom:6px;border-radius:4px;"></div>
                    <div class="skeleton" style="height:10px;width:40%;margin-bottom:10px;border-radius:4px;"></div>
                    <div class="skeleton" style="height:14px;width:50px;border-radius:4px;"></div>
                </div>
                <div class="skeleton" style="width:90px;height:90px;border-radius:12px;flex-shrink:0;"></div>
            </div>
        `).join('');
    },

    // ── Order Card Skeleton ──────────────────────
    orderSkeleton(count = 3) {
        return Array(count).fill(0).map(() => `
            <div class="skeleton-order" aria-hidden="true" style="background:white;border:1px solid var(--berry-border);border-radius:16px;padding:16px;margin:8px 16px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                    <div style="flex:1;">
                        <div class="skeleton" style="height:14px;width:60%;margin-bottom:6px;border-radius:4px;"></div>
                        <div class="skeleton" style="height:10px;width:40%;border-radius:4px;"></div>
                    </div>
                    <div class="skeleton" style="height:22px;width:80px;border-radius:12px;"></div>
                </div>
                <div class="skeleton" style="height:10px;width:80%;margin-bottom:10px;border-radius:4px;"></div>
                <div style="display:flex;justify-content:space-between;">
                    <div class="skeleton" style="height:16px;width:60px;border-radius:4px;"></div>
                    <div class="skeleton" style="height:10px;width:50px;border-radius:4px;"></div>
                </div>
            </div>
        `).join('');
    },

    // ── Profile Section Skeleton ─────────────────
    profileSkeleton() {
        return `
            <div aria-hidden="true" style="padding:16px;">
                <div class="skeleton" style="height:72px;width:72px;border-radius:50%;margin:0 auto 12px;"></div>
                <div class="skeleton" style="height:18px;width:120px;margin:0 auto 6px;border-radius:4px;"></div>
                <div class="skeleton" style="height:12px;width:90px;margin:0 auto;border-radius:4px;"></div>
            </div>
        `;
    },

    // ── Carousel Skeleton ────────────────────────
    carouselSkeleton() {
        return `
            <div aria-hidden="true" style="padding:0;">
                <div class="skeleton" style="height:140px;border-radius:16px;"></div>
                <div style="display:flex;gap:6px;justify-content:center;margin-top:10px;">
                    <div class="skeleton" style="width:20px;height:6px;border-radius:3px;"></div>
                    <div class="skeleton" style="width:6px;height:6px;border-radius:3px;"></div>
                    <div class="skeleton" style="width:6px;height:6px;border-radius:3px;"></div>
                </div>
            </div>
        `;
    },

    // ── Centered Spinner ─────────────────────────
    spinner(text = 'Loading...') {
        return `
            <div class="loading-state" role="status" aria-live="polite" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;gap:16px;">
                <div class="loading-spinner-ring">
                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="17" fill="none" stroke="var(--berry-border)" stroke-width="3"/>
                        <circle cx="20" cy="20" r="17" fill="none" stroke="var(--berry)" stroke-width="3"
                                stroke-dasharray="80 107" stroke-linecap="round">
                            <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.8s" repeatCount="indefinite"/>
                        </circle>
                    </svg>
                </div>
                <p style="color:var(--text-muted);font-size:14px;" aria-label="${text}">${text}</p>
            </div>
        `;
    },

    // ── Inline Spinner (for buttons) ─────────────
    inlineSpinner(size = 16, color = 'white') {
        return `<svg class="inline-spinner" width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="animation:spin 0.8s linear infinite;">
            <circle cx="12" cy="12" r="10" fill="none" stroke="${color}" stroke-width="3" opacity="0.3"/>
            <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
        </svg>`;
    },

    // ── Dots Loader ──────────────────────────────
    dots(text = '') {
        return `
            <div class="loading-dots-state" role="status" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:20px;">
                <div class="loading-dots">
                    <span class="loading-dot" style="animation-delay:0s;"></span>
                    <span class="loading-dot" style="animation-delay:0.15s;"></span>
                    <span class="loading-dot" style="animation-delay:0.3s;"></span>
                </div>
                ${text ? `<span style="color:var(--text-muted);font-size:13px;">${text}</span>` : ''}
            </div>
        `;
    },

    // ── Error State ──────────────────────────────
    error(msg = 'Something went wrong', retryFn = null) {
        const escapedMsg = (typeof App !== 'undefined' && App._escapeHtml)
            ? App._escapeHtml(msg) : msg;
        return `
            <div class="error-state" role="alert" style="background:var(--berry);color:white;padding:16px 20px;margin:16px;border-radius:14px;display:flex;justify-content:space-between;align-items:center;gap:12px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                    <span style="font-size:14px;line-height:1.4;">${escapedMsg}</span>
                </div>
                ${retryFn ? `<button onclick="${retryFn}" class="error-retry-btn" style="background:white;color:var(--berry);border:none;border-radius:8px;padding:8px 16px;font-weight:700;cursor:pointer;font-size:13px;white-space:nowrap;font-family:'DM Sans',sans-serif;transition:all 0.2s ease;" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform=''">Retry</button>` : ''}
            </div>
        `;
    },

    // ── Network Offline State ────────────────────
    offline() {
        return `
            <div class="offline-state" role="alert" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 32px;text-align:center;gap:16px;">
                <div style="width:80px;height:80px;background:var(--berry-light);border-radius:50%;display:flex;align-items:center;justify-content:center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--berry)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                </div>
                <h3 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--text);">You're Offline</h3>
                <p style="font-size:14px;color:var(--text-muted);max-width:250px;">Please check your internet connection and try again.</p>
                <button class="btn-primary" onclick="location.reload()" style="margin-top:8px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
                    Try Again
                </button>
            </div>
        `;
    },

    // ── Empty State (generic) ────────────────────
    empty(options = {}) {
        const {
            icon = 'package',
            title = 'Nothing here yet',
            subtitle = '',
            actionText = '',
            actionFn = '',
            iconColor = 'var(--berry)',
            iconBg = 'var(--berry-light)',
        } = options;

        return `
            <div class="empty-state" style="margin-top:30px;">
                <div style="width:80px;height:80px;background:${iconBg};border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
                    <i data-lucide="${icon}" style="width:36px;height:36px;color:${iconColor};"></i>
                </div>
                <h3 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--text);">${title}</h3>
                ${subtitle ? `<p style="font-size:14px;color:var(--text-muted);max-width:260px;margin-top:4px;">${subtitle}</p>` : ''}
                ${actionText ? `<button class="btn-primary" onclick="${actionFn}" style="margin-top:16px;">${actionText}</button>` : ''}
            </div>
        `;
    },

    // ── Full Page Loader Overlay ─────────────────
    overlay(text = 'Processing...') {
        return `
            <div class="loading-overlay" role="status" aria-live="assertive" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(4px);">
                <div style="background:white;border-radius:20px;padding:32px 40px;display:flex;flex-direction:column;align-items:center;gap:16px;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
                    <div class="loading-spinner-ring">
                        <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="24" cy="24" r="20" fill="none" stroke="var(--berry-border)" stroke-width="3"/>
                            <circle cx="24" cy="24" r="20" fill="none" stroke="var(--berry)" stroke-width="3"
                                    stroke-dasharray="94 126" stroke-linecap="round">
                                <animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="0.8s" repeatCount="indefinite"/>
                            </circle>
                        </svg>
                    </div>
                    <p style="font-size:15px;font-weight:600;color:var(--text);">${text}</p>
                </div>
            </div>
        `;
    },

    // ── Show/Hide Full-screen Overlay ────────────
    showOverlay(text = 'Processing...') {
        let overlay = document.getElementById('cora-loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'cora-loading-overlay';
            document.body.appendChild(overlay);
        }
        overlay.innerHTML = this.overlay(text);
        overlay.style.display = 'block';
    },

    hideOverlay() {
        const overlay = document.getElementById('cora-loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                overlay.style.display = 'none';
                overlay.style.opacity = '1';
            }, 300);
        }
    },

    // ── Pull to Refresh Indicator ────────────────
    pullToRefreshIndicator(progress = 0) {
        const rotation = Math.min(progress * 360, 360);
        return `
            <div class="ptr-indicator" style="display:flex;align-items:center;justify-content:center;padding:16px;transition:all 0.3s ease;">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="transform:rotate(${rotation}deg);transition:transform 0.1s linear;">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" fill="none" stroke="var(--berry)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 3v5h-5" fill="none" stroke="var(--berry)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        `;
    },

    // ── Shimmer Line (for inline use) ────────────
    shimmerLine(width = '100%', height = '14px') {
        return `<div class="skeleton" style="height:${height};width:${width};border-radius:4px;" aria-hidden="true"></div>`;
    }
};
