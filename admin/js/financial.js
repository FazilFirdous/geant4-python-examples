/* ============================================================
   Cora Admin — financial.js
   ============================================================ */
const AdminFinancial = {
    async render(container) {
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

        container.innerHTML = `<div style="padding:16px;">
            <h2 style="font-family:'Playfair Display',serif;font-size:20px;margin-bottom:16px;">Financial Report</h2>

            <div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;margin-bottom:16px;">
                <div class="form-group" style="margin:0;">
                    <label style="font-size:11px;">From</label>
                    <input type="date" id="fin-from" value="${weekAgo}" style="padding:8px 10px;">
                </div>
                <div class="form-group" style="margin:0;">
                    <label style="font-size:11px;">To</label>
                    <input type="date" id="fin-to" value="${today}" style="padding:8px 10px;">
                </div>
                <button class="btn-primary btn-sm" onclick="AdminFinancial.load()">Load</button>
                <button class="btn-outline btn-sm" onclick="AdminFinancial.exportCSV()">⬇ CSV</button>
            </div>

            <div id="fin-totals" style="margin-bottom:16px;"></div>
            <div id="fin-table"></div>
        </div>`;

        this.load();
    },

    async load() {
        const from = document.getElementById('fin-from').value;
        const to   = document.getElementById('fin-to').value;
        const res  = await AApi.getFinancial(`from=${from}&to=${to}`);

        const totalsWrap = document.getElementById('fin-totals');
        const tableWrap  = document.getElementById('fin-table');
        if (!totalsWrap || !tableWrap) return;
        if (!res.success) { tableWrap.innerHTML = '<p class="empty-state">Failed to load</p>'; return; }

        const { totals, restaurants } = res.data;

        totalsWrap.innerHTML = `<div class="stat-grid">
            ${this._stat('wallet', 'GMV', '₹' + (totals.gmv || 0))}
            ${this._stat('indian-rupee', 'Commission', '₹' + (totals.commission || 0))}
            ${this._stat('bike', 'Delivery Fees', '₹' + (totals.delivery_fees || 0))}
            ${this._stat('package', 'Orders', totals.orders || 0)}
        </div>`;

        if (!restaurants || !restaurants.length) {
            tableWrap.innerHTML = '<p class="empty-state">No data for this period</p>';
            return;
        }

        this._lastData = restaurants;

        tableWrap.innerHTML = `<div class="data-table-wrap"><table class="data-table">
            <thead><tr><th>Restaurant</th><th>Orders</th><th>GMV</th><th>Commission</th><th>Delivery Fees</th><th>Net Payable</th></tr></thead>
            <tbody>${restaurants.map(r => `
            <tr>
                <td><strong>${r.restaurant_name}</strong></td>
                <td>${r.order_count}</td>
                <td>₹${r.gmv}</td>
                <td>₹${r.commission}</td>
                <td>₹${r.delivery_fees}</td>
                <td style="font-weight:600;color:var(--berry);">₹${r.net_payable}</td>
            </tr>`).join('')}
            </tbody></table></div>`;
    },

    exportCSV() {
        if (!this._lastData || !this._lastData.length) { showToast('Load data first'); return; }
        const header = ['Restaurant','Orders','GMV','Commission','Delivery Fees','Net Payable'];
        const rows = this._lastData.map(r =>
            [r.restaurant_name, r.order_count, r.gmv, r.commission, r.delivery_fees, r.net_payable].join(',')
        );
        const csv = [header.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cora_financial_${document.getElementById('fin-from').value}_to_${document.getElementById('fin-to').value}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    },

    _stat(icon, label, value) {
        return `<div class="stat-card"><div class="stat-icon"><i data-lucide="${icon}" style="width:22px;height:22px;color:var(--berry);"></i></div>
            <div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`;
    }
};

/* ============================================================
   AdminSettlement — Weekly Settlement
   ============================================================ */
const AdminSettlement = {
    async render(container) {
        container.innerHTML = `<div style="padding:16px;">
            <h2 style="font-family:'Playfair Display',serif;font-size:20px;margin-bottom:4px;">Weekly Settlement</h2>
            <p style="color:#888;font-size:13px;margin-bottom:16px;">Commission owed by each restaurant for the current week</p>
            <div id="settlement-list"><div class="skel" style="height:80px;border-radius:12px;"></div></div>
        </div>`;
        this._load();
    },

    async _load() {
        const res = await AApi.getSettlement();
        const wrap = document.getElementById('settlement-list');
        if (!wrap) return;
        if (!res.success) { wrap.innerHTML = '<p class="empty-state">Failed to load settlements</p>'; return; }

        const items = res.data;
        if (!items.length) { wrap.innerHTML = '<p class="empty-state">No pending settlements</p>'; return; }

        wrap.innerHTML = items.map(s => `
        <div class="admin-card settlement-card" id="settle-${s.restaurant_id}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
                <div>
                    <h3 style="font-weight:600;font-size:16px;">${s.restaurant_name}</h3>
                    <p style="color:#888;font-size:12px;">${s.order_count} orders · GMV ₹${s.gmv}</p>
                    ${s.settled_at ? `<p style="color:green;font-size:12px;">✓ Settled on ${this._fmt(s.settled_at)}</p>` : ''}
                </div>
                <div style="text-align:right;">
                    <div style="font-size:22px;font-weight:700;color:var(--berry);">₹${s.commission_owed}</div>
                    <div style="font-size:11px;color:#aaa;">commission owed</div>
                </div>
            </div>
            <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
                ${!s.settled_at ? `
                    <button class="btn-success btn-sm" onclick="AdminSettlement.markSettled(${s.restaurant_id}, '${s.restaurant_name}')">
                        ✓ Mark as Settled
                    </button>` : `
                    <button class="btn-outline btn-sm" onclick="AdminSettlement.unsettle(${s.restaurant_id})">
                        Unmark Settled
                    </button>`}
                <button class="btn-outline btn-sm" onclick="Admin.switchTab('financial')">View Details →</button>
            </div>
        </div>`).join('');
    },

    async markSettled(restaurantId, name) {
        if (!confirm(`Mark settlement as paid for ${name}?`)) return;
        const res = await AApi.markSettled({ restaurant_id: restaurantId, settled: 1 });
        if (res.success) { showToast('Settlement marked as paid ✓'); this._load(); }
        else showToast(res.message || 'Error');
    },

    async unsettle(restaurantId) {
        const res = await AApi.markSettled({ restaurant_id: restaurantId, settled: 0 });
        if (res.success) { showToast('Settlement unmarked'); this._load(); }
        else showToast('Error');
    },

    _fmt(dt) {
        if (!dt) return '';
        return new Date(dt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
    }
};
