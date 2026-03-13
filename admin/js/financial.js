/* ═══ Cora Admin — Financial Report (Production) ═══ */

const AdminFinancial = {
    _lastData: null,

    async render(container) {
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

        container.innerHTML = `<div class="admin-page">
            <div class="page-header">
                <h2 class="page-title">Financial Report</h2>
            </div>

            <!-- Date Range -->
            <div class="date-range-bar">
                <div class="form-group" style="margin:0;flex:1;">
                    <label style="font-size:11px;">From</label>
                    <input type="date" id="fin-from" value="${weekAgo}">
                </div>
                <div class="form-group" style="margin:0;flex:1;">
                    <label style="font-size:11px;">To</label>
                    <input type="date" id="fin-to" value="${today}">
                </div>
                <button class="btn-primary btn-sm" onclick="AdminFinancial.load()" style="align-self:flex-end;">Load</button>
                <button class="btn-outline btn-sm" onclick="AdminFinancial.exportCSV()" style="align-self:flex-end;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    CSV
                </button>
            </div>

            <!-- Totals -->
            <div id="fin-totals" style="margin-bottom:16px;"></div>

            <!-- Restaurant Breakdown -->
            <div id="fin-table"></div>
        </div>`;

        this.load();
    },

    async load() {
        try {
            const from = document.getElementById('fin-from')?.value;
            const to = document.getElementById('fin-to')?.value;
            const res = await AApi.getFinancial(`from=${from}&to=${to}`);

            const totalsWrap = document.getElementById('fin-totals');
            const tableWrap = document.getElementById('fin-table');
            if (!totalsWrap || !tableWrap) return;

            if (!res?.success) { tableWrap.innerHTML = '<div class="empty-state"><p>Failed to load financial data</p></div>'; return; }

            const { totals, restaurants } = res.data;

            totalsWrap.innerHTML = `<div class="stat-grid">
                ${this._stat('wallet', 'GMV', formatCurrency(totals?.gmv), 'font-size:20px;')}
                ${this._stat('indian-rupee', 'Commission', formatCurrency(totals?.commission), 'color:var(--berry);font-size:20px;')}
                ${this._stat('bike', 'Delivery Fees', formatCurrency(totals?.delivery_fees), 'font-size:20px;')}
                ${this._stat('package', 'Orders', totals?.orders || 0, 'font-size:20px;')}
            </div>`;

            if (!restaurants?.length) {
                tableWrap.innerHTML = '<div class="empty-state"><p>No data for this period</p></div>';
                return;
            }

            this._lastData = restaurants;

            const maxGMV = Math.max(...restaurants.map(r => parseFloat(r.gmv || 0)), 1);

            tableWrap.innerHTML = `
                <div class="admin-card" style="padding:16px;">
                    <h3 class="card-title">Restaurant Breakdown</h3>
                    <div class="data-table-wrap">
                        <table class="data-table">
                            <thead><tr><th>Restaurant</th><th>Orders</th><th>GMV</th><th>Commission</th><th>Delivery</th><th>Net Payable</th></tr></thead>
                            <tbody>${restaurants.map(r => {
                                const gmvPct = (parseFloat(r.gmv || 0) / maxGMV * 100).toFixed(0);
                                return `
                                <tr>
                                    <td>
                                        <strong>${r.restaurant_name}</strong>
                                        <div class="gmv-bar-mini"><div style="width:${gmvPct}%;"></div></div>
                                    </td>
                                    <td>${r.order_count}</td>
                                    <td>₹${parseFloat(r.gmv).toFixed(0)}</td>
                                    <td style="color:var(--berry);">₹${parseFloat(r.commission).toFixed(0)}</td>
                                    <td>₹${parseFloat(r.delivery_fees || 0).toFixed(0)}</td>
                                    <td style="font-weight:700;">₹${parseFloat(r.net_payable).toFixed(0)}</td>
                                </tr>`;
                            }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>`;
        } catch (e) {
            document.getElementById('fin-table').innerHTML = '<div class="empty-state"><p>Error loading data</p></div>';
        }
    },

    exportCSV() {
        if (!this._lastData?.length) { showToast('Load data first', 'error'); return; }
        const header = ['Restaurant', 'Orders', 'GMV', 'Commission', 'Delivery Fees', 'Net Payable'];
        const rows = this._lastData.map(r =>
            [r.restaurant_name, r.order_count, r.gmv, r.commission, r.delivery_fees, r.net_payable].join(',')
        );
        const csv = [header.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cora_financial_${document.getElementById('fin-from')?.value}_to_${document.getElementById('fin-to')?.value}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Report downloaded', 'success');
    },

    _stat(icon, label, value, style = '') {
        return `<div class="stat-card"><div class="stat-icon"><i data-lucide="${icon}" style="width:20px;height:20px;color:var(--berry);"></i></div>
            <div class="stat-value" style="${style}">${value}</div><div class="stat-label">${label}</div></div>`;
    }
};

/* ═══ Settlement Tab ═══ */
const AdminSettlement = {
    async render(container) {
        container.innerHTML = `<div class="admin-page">
            <div class="page-header">
                <h2 class="page-title">Weekly Settlement</h2>
            </div>
            <p style="color:var(--text-muted);font-size:13px;margin-bottom:16px;">Commission owed by each restaurant for the current period</p>
            <div id="settlement-list"><div class="skel" style="height:80px;border-radius:12px;"></div></div>
        </div>`;
        this._load();
    },

    async _load() {
        try {
            const res = await AApi.getSettlement();
            const wrap = document.getElementById('settlement-list');
            if (!wrap) return;
            if (!res?.success) { wrap.innerHTML = '<div class="empty-state"><p>Failed to load settlements</p></div>'; return; }

            const items = res.data || [];
            if (!items.length) { wrap.innerHTML = '<div class="empty-state"><p>No pending settlements</p></div>'; return; }

            const totalOwed = items.filter(s => !s.settled_at).reduce((sum, s) => sum + parseFloat(s.commission_owed || 0), 0);

            wrap.innerHTML = `
                ${totalOwed > 0 ? `
                    <div class="settlement-total-banner">
                        <span>Total Outstanding</span>
                        <strong>₹${totalOwed.toFixed(0)}</strong>
                    </div>
                ` : ''}
                ${items.map(s => `
                <div class="admin-card settlement-card ${s.settled_at ? 'settled' : ''}" id="settle-${s.restaurant_id}">
                    <div class="settlement-card-main">
                        <div>
                            <h3 class="settlement-name">${s.restaurant_name}</h3>
                            <p class="settlement-meta">${s.order_count} orders · GMV ₹${parseFloat(s.gmv || 0).toFixed(0)}</p>
                            ${s.settled_at ? `<p class="settlement-settled">✓ Settled on ${this._fmt(s.settled_at)}</p>` : ''}
                        </div>
                        <div class="settlement-amount-col">
                            <div class="settlement-amount">₹${parseFloat(s.commission_owed || 0).toFixed(0)}</div>
                            <div class="settlement-amount-label">commission</div>
                        </div>
                    </div>
                    <div class="settlement-actions">
                        ${!s.settled_at ? `
                            <button class="btn-success btn-sm" onclick="AdminSettlement.markSettled(${s.restaurant_id}, '${(s.restaurant_name || '').replace(/'/g, "\\'")}')">
                                ✓ Mark Settled
                            </button>` : `
                            <button class="btn-outline btn-sm" onclick="AdminSettlement.unsettle(${s.restaurant_id})">
                                Unmark
                            </button>`}
                        <button class="btn-outline btn-sm" onclick="Admin.switchTab('financial')">Details</button>
                    </div>
                </div>
            `).join('')}`;
        } catch (e) {
            document.getElementById('settlement-list').innerHTML = '<div class="empty-state"><p>Error loading settlements</p></div>';
        }
    },

    async markSettled(restaurantId, name) {
        Admin.showModal('settle-confirm', {
            title: 'Confirm Settlement',
            content: `<p>Mark settlement as <strong>paid</strong> for <strong>${name}</strong>?</p>`,
            actions: [
                { label: 'Confirm Paid', class: 'btn-success btn-sm', action: 'confirm', onClick: async (modal) => {
                    modal.style.display = 'none';
                    try {
                        const res = await AApi.markSettled({ restaurant_id: restaurantId, settled: 1 });
                        if (res?.success) { showToast('Settlement marked as paid ✓', 'success'); this._load(); }
                        else showToast(res?.message || 'Error', 'error');
                    } catch (e) { showToast('Failed to update', 'error'); }
                }},
                { label: 'Cancel', class: 'btn-outline btn-sm', action: 'cancel', onClick: (m) => { m.style.display = 'none'; }}
            ]
        });
    },

    async unsettle(restaurantId) {
        try {
            const res = await AApi.markSettled({ restaurant_id: restaurantId, settled: 0 });
            if (res?.success) { showToast('Settlement unmarked', 'info'); this._load(); }
            else showToast('Error', 'error');
        } catch (e) { showToast('Failed to update', 'error'); }
    },

    _fmt(dt) {
        if (!dt) return '';
        return new Date(dt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }
};
