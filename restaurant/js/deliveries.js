const DeliveriesTab = {
    async render() {
        document.getElementById('tab-content').innerHTML = `
            <div style="padding:16px 0 80px;" id="deliveries-content">
                <div style="display:flex;justify-content:center;padding:40px;"><div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div></div>
            </div>
        `;
        await this.loadData();
    },

    async loadData() {
        try {
            const [boysRes, poolRes] = await Promise.all([
                RApi.getDeliveryBoys(),
                RApi.getPublicPool()
            ]);

            const boys   = boysRes?.data || [];
            const pool   = poolRes?.data || [];

            document.getElementById('deliveries-content').innerHTML = `
                <!-- My Delivery Boys -->
                <div style="padding:0 16px 12px;">
                    <h3 style="font-family:'Playfair Display',serif;font-size:18px;font-weight:700;margin-bottom:12px;">My Delivery Boys</h3>
                    ${boys.length ? boys.map(b => this.boyCardHtml(b)).join('') : `
                        <div style="text-align:center;padding:20px;color:var(--text-muted);font-size:14px;">
                            No delivery boys assigned yet. Contact admin to add delivery boys.
                        </div>
                    `}
                </div>

                <!-- Active Deliveries -->
                <div style="padding:0 16px 12px;">
                    <h3 style="font-family:'Playfair Display',serif;font-size:18px;font-weight:700;margin-bottom:12px;">Active Deliveries</h3>
                    <div id="active-deliveries-list">
                        <div style="text-align:center;padding:20px;color:var(--text-muted);font-size:14px;">Loading deliveries...</div>
                    </div>
                </div>

                <!-- Public Pool -->
                <div style="padding:0 16px 12px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <h3 style="font-family:'Playfair Display',serif;font-size:18px;font-weight:700;">Public Pool</h3>
                        <button class="btn-secondary" style="padding:8px 12px;font-size:12px;" onclick="DeliveriesTab.loadData()">↻ Refresh</button>
                    </div>
                    ${pool.length ? pool.map(p => this.poolCardHtml(p, boys)).join('') : `
                        <div style="text-align:center;padding:20px;color:var(--text-muted);font-size:14px;">
                            No public deliveries available right now.
                        </div>
                    `}
                </div>
            `;

            // Load active deliveries
            this.loadActiveDeliveries();

        } catch(e) {
            document.getElementById('deliveries-content').innerHTML = `<div style="padding:20px;color:var(--danger);">Failed to load delivery data</div>`;
        }
    },

    async loadActiveDeliveries() {
        try {
            const res = await RApi.getOrders('picked_up');
            const res2 = await RApi.getOrders('on_the_way');
            const active = [...(res?.data || []), ...(res2?.data || [])];
            const el = document.getElementById('active-deliveries-list');
            if (!el) return;

            if (!active.length) {
                el.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:14px;">No active deliveries</div>`;
                return;
            }

            el.innerHTML = active.map(o => `
                <div class="card" style="margin-bottom:10px;padding:14px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div>
                            <div style="font-weight:700;">#${o.order_number}</div>
                            <div style="font-size:12px;color:var(--text-muted);">${o.customer_name}</div>
                        </div>
                        <span class="status-badge status-${o.status}">${o.status?.replace('_',' ')}</span>
                    </div>
                    ${o.delivery_address ? `<div style="font-size:12px;color:var(--text-sub);margin-top:6px;">${o.delivery_address}</div>` : ''}
                    ${o.delivery_boy_name ? `<div style="font-size:12px;color:var(--text-sub);margin-top:4px;">${o.delivery_boy_name}</div>` : ''}
                </div>
            `).join('');
        } catch(e) {}
    },

    boyCardHtml(b) {
        const statusColor  = b.is_available ? 'var(--green)' : 'var(--orange)';
        const statusLabel  = b.is_available ? 'Available' : 'Unavailable';

        return `
            <div class="card" style="margin-bottom:10px;padding:14px;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="width:46px;height:46px;background:var(--berry-light);border-radius:50%;display:flex;align-items:center;justify-content:center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--berry)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
                    </div>
                    <div style="flex:1;">
                        <div style="font-weight:700;font-size:15px;">${b.name}</div>
                        <div style="font-size:12px;color:var(--text-muted);">${b.vehicle_type} · ${b.phone}</div>
                        <div style="font-size:11px;color:${statusColor};font-weight:600;margin-top:2px;">● ${statusLabel}</div>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
                        <div class="toggle-switch ${b.is_available ? 'on' : ''}" onclick="DeliveriesTab.toggleBoy(${b.id}, this)"></div>
                        <div style="font-size:11px;color:var(--text-muted);">${b.total_deliveries} deliveries</div>
                    </div>
                </div>
            </div>
        `;
    },

    poolCardHtml(p, boys) {
        const availBoys = boys.filter(b => b.is_available);
        const boyOptions = availBoys.map(b => `<option value="${b.id}">${b.name}</option>`).join('');

        return `
            <div class="card" style="margin-bottom:10px;padding:14px;border-left:4px solid var(--berry);">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                    <div>
                        <div style="font-weight:700;">${p.restaurant_name}</div>
                        <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">Pay: <strong>₹${p.offered_pay}</strong></div>
                    </div>
                    <span style="background:var(--green-light);color:var(--green);padding:3px 10px;border-radius:10px;font-size:12px;font-weight:700;">OPEN</span>
                </div>
                <div style="font-size:12px;color:var(--text-sub);margin-bottom:4px;">Pickup: ${p.pickup_address}</div>
                <div style="font-size:12px;color:var(--text-sub);margin-bottom:12px;">Deliver: ${p.delivery_address}</div>
                ${availBoys.length ? `
                    <div style="display:flex;gap:8px;align-items:center;">
                        <select id="boy-select-${p.id}" style="flex:1;background:white;border:1.5px solid var(--berry-border);border-radius:10px;padding:8px 10px;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;">
                            <option value="">Select delivery boy</option>
                            ${boyOptions}
                        </select>
                        <button class="btn-success" style="padding:8px 14px;font-size:13px;" onclick="DeliveriesTab.claimPool(${p.id})">Claim</button>
                    </div>
                ` : `<div style="font-size:12px;color:var(--orange);">No available delivery boys. Mark one as available first.</div>`}
            </div>
        `;
    },

    async toggleBoy(id, toggleEl) {
        try {
            const res = await RApi.toggleBoyStatus(id);
            if (res?.success) {
                const isAvail = res.data.is_available;
                toggleEl.classList.toggle('on', !!isAvail);
                Dashboard.showToast(isAvail ? 'Delivery boy available' : 'Delivery boy unavailable', 'info');
            }
        } catch(e) { Dashboard.showToast('Failed to toggle', 'error'); }
    },

    async claimPool(poolId) {
        const boySelect = document.getElementById(`boy-select-${poolId}`);
        const boyId = boySelect?.value;
        if (!boyId) { Dashboard.showToast('Select a delivery boy first', 'error'); return; }

        try {
            const res = await RApi.claimDelivery({ pool_id: poolId, delivery_boy_id: boyId });
            if (res?.success) {
                Dashboard.showToast('Delivery claimed!', 'success');
                await this.loadData();
            } else {
                throw new Error(res?.message);
            }
        } catch(e) { Dashboard.showToast(e.message || 'Failed to claim', 'error'); }
    }
};
