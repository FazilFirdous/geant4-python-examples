/* ═══ Cora Restaurant — Deliveries Tab (Production) ═══ */

const DeliveriesTab = {
    boys: [],
    pool: [],
    activeDeliveries: [],

    /* ── Render ── */
    async render() {
        document.getElementById('tab-content').innerHTML = `
            <div class="deliveries-container" id="deliveries-content">
                <div class="tab-loading">
                    <div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div>
                </div>
            </div>
        `;
        await this.loadData();
    },

    /* ── Data ── */
    async loadData() {
        try {
            const [boysRes, poolRes] = await Promise.all([
                RApi.getDeliveryBoys(),
                RApi.getPublicPool()
            ]);

            this.boys = boysRes?.data || [];
            this.pool = poolRes?.data || [];

            this._renderContent();
            await this._loadActiveDeliveries();
        } catch(e) {
            document.getElementById('deliveries-content').innerHTML = `
                <div class="orders-error">
                    <p>Failed to load delivery data</p>
                    <button class="btn-secondary" style="padding:8px 16px;font-size:13px;" onclick="DeliveriesTab.loadData()">Retry</button>
                </div>`;
        }
    },

    _renderContent() {
        const availCount = this.boys.filter(b => b.is_available).length;

        document.getElementById('deliveries-content').innerHTML = `
            <!-- Summary Stats -->
            <div class="delivery-stats-bar">
                <div class="delivery-stat">
                    <div class="delivery-stat-value">${this.boys.length}</div>
                    <div class="delivery-stat-label">Total Riders</div>
                </div>
                <div class="delivery-stat">
                    <div class="delivery-stat-value" style="color:var(--green);">${availCount}</div>
                    <div class="delivery-stat-label">Available</div>
                </div>
                <div class="delivery-stat">
                    <div class="delivery-stat-value" style="color:var(--orange);">${this.boys.length - availCount}</div>
                    <div class="delivery-stat-label">Busy/Off</div>
                </div>
                <div class="delivery-stat">
                    <div class="delivery-stat-value" style="color:var(--berry);">${this.pool.length}</div>
                    <div class="delivery-stat-label">Pool Jobs</div>
                </div>
            </div>

            <!-- My Delivery Boys -->
            <div class="delivery-section">
                <div class="delivery-section-header">
                    <h3 class="section-title">My Delivery Boys</h3>
                    <span class="section-count">${this.boys.length}</span>
                </div>
                ${this.boys.length ? this.boys.map(b => this._boyCardHtml(b)).join('') : `
                    <div class="delivery-empty">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
                        <p>No delivery boys assigned yet</p>
                        <span>Contact admin to add delivery boys to your restaurant</span>
                    </div>
                `}
            </div>

            <!-- Active Deliveries -->
            <div class="delivery-section">
                <div class="delivery-section-header">
                    <h3 class="section-title">Active Deliveries</h3>
                    <div class="active-pulse"></div>
                </div>
                <div id="active-deliveries-list">
                    <div style="text-align:center;padding:12px;color:var(--text-muted);font-size:13px;">Loading...</div>
                </div>
            </div>

            <!-- Public Pool -->
            <div class="delivery-section">
                <div class="delivery-section-header">
                    <h3 class="section-title">Public Pool</h3>
                    <button class="btn-icon" onclick="DeliveriesTab.loadData()" title="Refresh" aria-label="Refresh pool">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                    </button>
                </div>
                ${this.pool.length ? this.pool.map(p => this._poolCardHtml(p)).join('') : `
                    <div class="delivery-empty">
                        <p>No public deliveries available</p>
                        <span>Freelance delivery jobs will appear here</span>
                    </div>
                `}
            </div>
        `;
    },

    /* ── Active Deliveries ── */
    async _loadActiveDeliveries() {
        try {
            const [res1, res2] = await Promise.all([
                RApi.getOrders('picked_up'),
                RApi.getOrders('on_the_way')
            ]);
            this.activeDeliveries = [...(res1?.data || []), ...(res2?.data || [])];
            const el = document.getElementById('active-deliveries-list');
            if (!el) return;

            if (!this.activeDeliveries.length) {
                el.innerHTML = `<div class="delivery-empty" style="padding:16px;"><p>No active deliveries right now</p></div>`;
                return;
            }

            el.innerHTML = this.activeDeliveries.map(o => `
                <div class="active-delivery-card" role="article">
                    <div class="active-delivery-header">
                        <div>
                            <div class="active-delivery-order">#${o.order_number}</div>
                            <div class="active-delivery-customer">${o.customer_name || 'Customer'}</div>
                        </div>
                        <span class="status-badge status-${o.status}">${(o.status || '').replace(/_/g, ' ')}</span>
                    </div>

                    <!-- Delivery Timeline -->
                    <div class="delivery-timeline">
                        <div class="timeline-step ${['picked_up','on_the_way','delivered'].includes(o.status) ? 'done' : ''}">
                            <div class="timeline-dot"></div>
                            <span>Picked up</span>
                        </div>
                        <div class="timeline-line ${['on_the_way','delivered'].includes(o.status) ? 'done' : ''}"></div>
                        <div class="timeline-step ${['on_the_way','delivered'].includes(o.status) ? 'done' : ''}">
                            <div class="timeline-dot"></div>
                            <span>On the way</span>
                        </div>
                        <div class="timeline-line ${o.status === 'delivered' ? 'done' : ''}"></div>
                        <div class="timeline-step ${o.status === 'delivered' ? 'done' : ''}">
                            <div class="timeline-dot"></div>
                            <span>Delivered</span>
                        </div>
                    </div>

                    ${o.delivery_address ? `<div class="active-delivery-address">${o.delivery_address}</div>` : ''}

                    <div class="active-delivery-footer">
                        ${o.delivery_boy_name ? `
                            <div class="active-delivery-rider">
                                <div class="rider-mini-avatar">${o.delivery_boy_name[0]}</div>
                                <span>${o.delivery_boy_name}</span>
                            </div>
                        ` : ''}
                        <div class="active-delivery-amount">₹${parseFloat(o.total_amount || 0).toFixed(0)}</div>
                    </div>
                </div>
            `).join('');
        } catch(e) {
            const el = document.getElementById('active-deliveries-list');
            if (el) el.innerHTML = '<div class="delivery-empty"><p>Could not load active deliveries</p></div>';
        }
    },

    /* ── Delivery Boy Card ── */
    _boyCardHtml(b) {
        const isAvail = b.is_available;
        const totalDeliveries = b.total_deliveries || 0;

        return `
            <div class="delivery-boy-card ${isAvail ? '' : 'unavailable'}" id="boy-card-${b.id}">
                <div class="delivery-boy-main">
                    <div class="delivery-boy-avatar ${isAvail ? 'available' : ''}">
                        ${b.name ? b.name[0].toUpperCase() : 'R'}
                    </div>
                    <div class="delivery-boy-info">
                        <div class="delivery-boy-name">${b.name}</div>
                        <div class="delivery-boy-details">${b.vehicle_type || 'Bike'} · ${b.phone || ''}</div>
                        <div class="delivery-boy-stats">
                            <span class="boy-status-dot ${isAvail ? 'available' : 'busy'}"></span>
                            ${isAvail ? 'Available' : 'Unavailable'}
                            <span class="boy-stat-sep">·</span>
                            ${totalDeliveries} deliveries
                        </div>
                    </div>
                </div>
                <div class="delivery-boy-actions">
                    <div class="toggle-switch ${isAvail ? 'on' : ''}"
                        onclick="DeliveriesTab.toggleBoy(${b.id}, this)"
                        role="switch" aria-checked="${!!isAvail}" aria-label="Toggle ${b.name} availability"
                        tabindex="0"></div>
                </div>
            </div>
        `;
    },

    /* ── Pool Card ── */
    _poolCardHtml(p) {
        const availBoys = this.boys.filter(b => b.is_available);
        const boyOptions = availBoys.map(b => `<option value="${b.id}">${b.name}</option>`).join('');

        return `
            <div class="pool-card">
                <div class="pool-card-accent"></div>
                <div class="pool-card-body">
                    <div class="pool-card-header">
                        <div>
                            <div class="pool-restaurant-name">${p.restaurant_name}</div>
                            <div class="pool-pay">Pay: <strong>₹${p.offered_pay}</strong></div>
                        </div>
                        <span class="pool-status-badge">OPEN</span>
                    </div>
                    <div class="pool-addresses">
                        <div class="pool-address-row">
                            <span class="pool-address-label">Pickup</span>
                            <span>${p.pickup_address || 'Restaurant'}</span>
                        </div>
                        <div class="pool-address-row">
                            <span class="pool-address-label">Deliver</span>
                            <span>${p.delivery_address || 'Customer address'}</span>
                        </div>
                    </div>
                    ${availBoys.length ? `
                        <div class="pool-claim-row">
                            <select id="boy-select-${p.id}" class="pool-boy-select" aria-label="Select delivery boy">
                                <option value="">Select rider</option>
                                ${boyOptions}
                            </select>
                            <button class="btn-success" style="padding:8px 16px;font-size:13px;" onclick="DeliveriesTab.claimPool(${p.id})">Claim</button>
                        </div>
                    ` : `
                        <div class="pool-no-boys">No available riders — mark a rider as available first</div>
                    `}
                </div>
            </div>
        `;
    },

    /* ── Actions ── */
    async toggleBoy(id, toggleEl) {
        try {
            const res = await RApi.toggleBoyStatus(id);
            if (res?.success) {
                const isAvail = res.data.is_available;
                toggleEl.classList.toggle('on', !!isAvail);
                toggleEl.setAttribute('aria-checked', !!isAvail);

                // Update local data
                const boy = this.boys.find(b => b.id === id);
                if (boy) boy.is_available = isAvail;

                // Update card styling
                const card = document.getElementById(`boy-card-${id}`);
                if (card) card.classList.toggle('unavailable', !isAvail);

                Dashboard.showToast(isAvail ? 'Rider marked available' : 'Rider marked unavailable', 'info');
            }
        } catch(e) { Dashboard.showToast('Failed to toggle rider status', 'error'); }
    },

    async claimPool(poolId) {
        const boySelect = document.getElementById(`boy-select-${poolId}`);
        const boyId = boySelect?.value;
        if (!boyId) { Dashboard.showToast('Select a delivery boy first', 'error'); return; }

        const boyName = boySelect.options[boySelect.selectedIndex]?.text || 'Rider';

        try {
            const res = await RApi.claimDelivery({ pool_id: poolId, delivery_boy_id: boyId });
            if (res?.success) {
                Dashboard.showToast(`${boyName} claimed the delivery!`, 'success');
                await this.loadData();
            } else {
                throw new Error(res?.message);
            }
        } catch(e) { Dashboard.showToast(e.message || 'Failed to claim delivery', 'error'); }
    }
};
