/* ============================================================
   Cora Admin — dashboard.js
   ============================================================ */
const AdminDashboard = {
    async render(container) {
        const res = await AApi.getDashboard();
        if (!res.success) { container.innerHTML = '<p class="empty-state">Failed to load dashboard</p>'; return; }
        const d = res.data;

        container.innerHTML = `
        <div style="padding:16px;">

            <!-- Stat Cards -->
            <div class="stat-grid">
                ${this._stat('📦', 'Orders Today', d.today_orders ?? 0, '')}
                ${this._stat('💰', 'Revenue Today', '₹' + (d.today_revenue ?? 0), '')}
                ${this._stat('🏪', 'Active Restaurants', d.active_restaurants ?? 0, '')}
                ${this._stat('🎫', 'Open Tickets', d.open_tickets ?? 0, d.open_tickets > 0 ? 'color:var(--berry)' : '')}
            </div>

            <!-- Week Chart -->
            <div class="admin-card" style="margin-top:16px;">
                <h3 class="card-title">Orders — Last 7 Days</h3>
                <div class="bar-chart-wrap" id="dash-chart"></div>
            </div>

            <!-- Recent Orders -->
            <div class="admin-card" style="margin-top:16px;">
                <h3 class="card-title">Recent Orders</h3>
                <div class="data-table-wrap">
                    <table class="data-table">
                        <thead><tr><th>Order</th><th>Customer</th><th>Restaurant</th><th>Total</th><th>Status</th></tr></thead>
                        <tbody>
                        ${(d.recent_orders || []).map(o => `
                            <tr>
                                <td><span style="font-weight:600;">${o.order_number}</span></td>
                                <td>${o.customer_name || '—'}</td>
                                <td>${o.restaurant_name || '—'}</td>
                                <td>₹${o.total_amount}</td>
                                <td><span class="badge badge-${o.status}">${o.status}</span></td>
                            </tr>
                        `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>`;

        this._renderChart(d.weekly_chart || []);
    },

    _stat(icon, label, value, style) {
        return `<div class="stat-card"><div class="stat-icon">${icon}</div>
            <div class="stat-value" style="${style}">${value}</div>
            <div class="stat-label">${label}</div></div>`;
    },

    _renderChart(data) {
        const wrap = document.getElementById('dash-chart');
        if (!wrap) return;
        const max = Math.max(...data.map(d => d.count), 1);
        wrap.innerHTML = `<div class="bar-chart">${data.map(d => `
            <div class="bar-col">
                <div class="bar-fill" style="height:${Math.round((d.count / max) * 100)}%;background:var(--berry);"></div>
                <div class="bar-label">${d.label}</div>
                <div class="bar-val">${d.count}</div>
            </div>`).join('')}</div>`;
    }
};
