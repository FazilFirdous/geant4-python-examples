/* ═══ Cora Admin — Dashboard (Production) ═══ */

const AdminDashboard = {
    data: null,

    async render(container) {
        try {
            const res = await AApi.getDashboard();
            if (!res?.success) { container.innerHTML = '<div class="empty-state"><p>Failed to load dashboard</p><button class="btn-primary btn-sm" onclick="Admin.switchTab(\'dashboard\')">Retry</button></div>'; return; }
            this.data = res.data;
            const d = this.data;

            container.innerHTML = `
            <div class="admin-page">
                <!-- Welcome Banner -->
                <div class="dashboard-banner">
                    <div>
                        <h2 class="dashboard-greeting">${this._greeting()}</h2>
                        <p class="dashboard-subtitle">Here's your business overview</p>
                    </div>
                    <div class="dashboard-date">${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                </div>

                <!-- Quick Stats -->
                <div class="stat-grid">
                    ${this._stat('package', 'Orders Today', d.today_orders ?? 0, '')}
                    ${this._stat('indian-rupee', 'Revenue Today', '₹' + parseFloat(d.today_revenue ?? 0).toFixed(0), 'color:var(--green);')}
                    ${this._stat('store', 'Active Restaurants', d.active_restaurants ?? 0, '')}
                    ${this._stat('ticket', 'Open Tickets', d.open_tickets ?? 0, (d.open_tickets > 0 ? 'color:var(--danger);' : ''))}
                </div>

                <!-- Additional Stats Row -->
                <div class="stat-grid" style="margin-top:12px;">
                    ${this._stat('users', 'Total Users', d.total_users ?? 0, '')}
                    ${this._stat('bike', 'Active Riders', d.active_riders ?? 0, '')}
                    ${this._stat('percent', 'Commission Today', '₹' + parseFloat(d.today_commission ?? 0).toFixed(0), 'color:var(--berry);')}
                    ${this._stat('trending-up', 'Avg Order Value', '₹' + parseFloat(d.avg_order_value ?? 0).toFixed(0), '')}
                </div>

                <!-- Week Chart -->
                <div class="admin-card" style="margin-top:16px;">
                    <div class="card-header-row">
                        <h3 class="card-title">Orders — Last 7 Days</h3>
                        <span class="card-subtitle">${(d.weekly_chart || []).reduce((s, c) => s + (c.count || 0), 0)} total</span>
                    </div>
                    <div class="bar-chart-wrap" id="dash-chart"></div>
                </div>

                <!-- Recent Orders -->
                <div class="admin-card" style="margin-top:16px;">
                    <div class="card-header-row">
                        <h3 class="card-title">Recent Orders</h3>
                        <button class="btn-link" onclick="Admin.switchTab('orders')">View All →</button>
                    </div>
                    ${(d.recent_orders || []).length ? `
                        <div class="data-table-wrap">
                            <table class="data-table">
                                <thead><tr><th>Order</th><th>Customer</th><th>Restaurant</th><th>Total</th><th>Status</th></tr></thead>
                                <tbody>
                                ${(d.recent_orders || []).slice(0, 8).map(o => `
                                    <tr>
                                        <td><strong>${o.order_number}</strong></td>
                                        <td>${o.customer_name || '—'}</td>
                                        <td>${o.restaurant_name || '—'}</td>
                                        <td>₹${parseFloat(o.total_amount).toFixed(0)}</td>
                                        <td><span class="badge badge-${o.status}">${o.status}</span></td>
                                    </tr>
                                `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : '<div class="empty-state" style="padding:20px;"><p>No recent orders</p></div>'}
                </div>

                <!-- Quick Actions -->
                <div class="admin-card" style="margin-top:16px;">
                    <h3 class="card-title">Quick Actions</h3>
                    <div class="quick-actions-grid">
                        <button class="quick-action-btn" onclick="Admin.switchTab('restaurants')">
                            <div class="qa-icon" style="background:var(--berry-light);color:var(--berry);"><i data-lucide="store" style="width:18px;height:18px;"></i></div>
                            <span>Restaurants</span>
                        </button>
                        <button class="quick-action-btn" onclick="Admin.switchTab('delivery')">
                            <div class="qa-icon" style="background:var(--green-light);color:var(--green);"><i data-lucide="bike" style="width:18px;height:18px;"></i></div>
                            <span>Delivery</span>
                        </button>
                        <button class="quick-action-btn" onclick="Admin.switchTab('coupons')">
                            <div class="qa-icon" style="background:#FFF3E0;color:var(--orange);"><i data-lucide="ticket" style="width:18px;height:18px;"></i></div>
                            <span>Coupons</span>
                        </button>
                        <button class="quick-action-btn" onclick="Admin.switchTab('settlement')">
                            <div class="qa-icon" style="background:#E3F2FD;color:#1565C0;"><i data-lucide="wallet" style="width:18px;height:18px;"></i></div>
                            <span>Settlement</span>
                        </button>
                        <button class="quick-action-btn" onclick="Admin.toggleDarkMode()">
                            <div class="qa-icon" style="background:#F3E5F5;color:#6A1B9A;"><i data-lucide="moon" style="width:18px;height:18px;"></i></div>
                            <span>Dark Mode</span>
                        </button>
                        <button class="quick-action-btn" onclick="AdminAuth.logout()">
                            <div class="qa-icon" style="background:#FFEBEE;color:var(--danger);"><i data-lucide="log-out" style="width:18px;height:18px;"></i></div>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                <!-- Version -->
                <div class="admin-version">CORA Admin v${Admin.VERSION}</div>
            </div>`;

            this._renderChart(d.weekly_chart || []);
        } catch (e) {
            container.innerHTML = '<div class="empty-state"><p>Error loading dashboard</p></div>';
        }
    },

    _greeting() {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    },

    _stat(icon, label, value, style) {
        return `<div class="stat-card">
            <div class="stat-icon"><i data-lucide="${icon}" style="width:20px;height:20px;color:var(--berry);"></i></div>
            <div class="stat-value" style="${style}">${value}</div>
            <div class="stat-label">${label}</div>
        </div>`;
    },

    _renderChart(data) {
        const wrap = document.getElementById('dash-chart');
        if (!wrap || !data.length) return;
        const max = Math.max(...data.map(d => d.count || 0), 1);
        const today = new Date().toLocaleDateString('en-IN', { weekday: 'short' });

        wrap.innerHTML = `<div class="bar-chart">${data.map(d => {
            const isToday = d.label === today;
            const pct = Math.round(((d.count || 0) / max) * 100);
            return `
                <div class="bar-col ${isToday ? 'today' : ''}">
                    <div class="bar-val">${d.count || 0}</div>
                    <div class="bar-fill" style="height:${Math.max(4, pct)}%;${isToday ? 'background:var(--green);' : 'background:var(--berry);'}"></div>
                    <div class="bar-label">${d.label}</div>
                </div>`;
        }).join('')}</div>`;
    }
};
