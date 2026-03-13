/* ═══ Cora Restaurant — Earnings Tab (Production) ═══ */

const EarningsTab = {
    data: null,
    period: 'today',

    /* ── Render ── */
    async render() {
        document.getElementById('tab-content').innerHTML = `
            <div class="earnings-container">
                <!-- Period Toggle -->
                <div class="earnings-period-bar">
                    ${['today', 'week', 'month'].map(p => `
                        <button class="period-btn ${p === this.period ? 'active' : ''}"
                                onclick="EarningsTab.setPeriod('${p}', this)" data-period="${p}"
                                role="tab" aria-selected="${p === this.period}">
                            ${p === 'today' ? 'Today' : (p === 'week' ? 'This Week' : 'This Month')}
                        </button>
                    `).join('')}
                </div>

                <!-- Quick Stats Banner -->
                <div id="earnings-summary" class="earnings-summary"></div>

                <!-- Stat Cards -->
                <div id="earnings-data">
                    <div class="tab-loading">
                        <div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div>
                    </div>
                </div>

                <!-- Weekly Bar Chart -->
                <div id="earnings-chart"></div>

                <!-- Peak Hours -->
                <div id="peak-hours-section"></div>

                <!-- Export -->
                <div class="earnings-export-bar">
                    <button class="btn-secondary" style="padding:10px 16px;font-size:13px;width:100%;" onclick="EarningsTab.exportCSV()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        Export Earnings Report (CSV)
                    </button>
                </div>
            </div>
        `;
        await this.loadData();
    },

    /* ── Data ── */
    async loadData() {
        try {
            const res = await RApi.getEarnings();
            this.data = res?.data || {};
            this._renderSummary();
            this.renderPeriod(this.period);
            this._renderChart();
            this._renderPeakHours();
        } catch(e) {
            document.getElementById('earnings-data').innerHTML = `
                <div class="orders-error">
                    <p>Failed to load earnings data</p>
                    <button class="btn-secondary" style="padding:8px 16px;font-size:13px;" onclick="EarningsTab.loadData()">Retry</button>
                </div>`;
        }
    },

    setPeriod(period, btn) {
        this.period = period;
        document.querySelectorAll('.period-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.period === period);
            b.setAttribute('aria-selected', b.dataset.period === period);
        });
        this.renderPeriod(period);
    },

    /* ── Summary Banner ── */
    _renderSummary() {
        const el = document.getElementById('earnings-summary');
        if (!el) return;

        const todayData = this.data?.today || {};
        const weekData = this.data?.week || {};
        const todayRev = parseFloat(todayData.gross_revenue || 0);
        const weekAvg = weekData.order_count ? parseFloat(weekData.gross_revenue || 0) / 7 : 0;
        const trend = weekAvg > 0 ? ((todayRev - weekAvg) / weekAvg * 100).toFixed(0) : 0;
        const trendUp = trend >= 0;

        el.innerHTML = `
            <div class="earnings-summary-card">
                <div class="earnings-summary-label">Today's Revenue</div>
                <div class="earnings-summary-amount">₹${todayRev.toFixed(0)}</div>
                <div class="earnings-trend ${trendUp ? 'up' : 'down'}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        ${trendUp ? '<path d="m18 15-6-6-6 6"/>' : '<path d="m6 9 6 6 6-6"/>'}
                    </svg>
                    ${Math.abs(trend)}% vs weekly avg
                </div>
            </div>
        `;
    },

    /* ── Period Data ── */
    renderPeriod(period) {
        const d = this.data?.[period] || {};
        const el = document.getElementById('earnings-data');
        if (!el) return;

        const cards = [
            { label: 'Gross Revenue', value: `₹${parseFloat(d.gross_revenue||0).toFixed(0)}`, color: 'var(--berry)', icon: 'trending-up' },
            { label: 'Net Earnings',  value: `₹${parseFloat(d.net_revenue||0).toFixed(0)}`,   color: 'var(--green)', icon: 'wallet' },
            { label: 'Commission',    value: `₹${parseFloat(d.commission||0).toFixed(0)}`,     color: 'var(--orange)', icon: 'percent' },
            { label: 'Orders',        value: d.order_count || 0,                                color: 'var(--text)',  icon: 'shopping-bag' },
        ];

        el.innerHTML = `
            <!-- Stat Cards Grid -->
            <div class="earnings-grid">
                ${cards.map(c => `
                    <div class="earnings-stat-card">
                        <div class="earnings-stat-value" style="color:${c.color};">${c.value}</div>
                        <div class="earnings-stat-label">${c.label}</div>
                    </div>
                `).join('')}
            </div>

            <!-- Additional Stats -->
            <div class="earnings-detail-cards">
                <div class="card" style="padding:14px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span class="earnings-detail-label">Average Order Value</span>
                        <span class="earnings-detail-value">₹${parseFloat(d.avg_order_value||0).toFixed(0)}</span>
                    </div>
                </div>
                ${d.delivery_earnings !== undefined ? `
                    <div class="card" style="padding:14px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span class="earnings-detail-label">Delivery Fees Collected</span>
                            <span class="earnings-detail-value">₹${parseFloat(d.delivery_earnings||0).toFixed(0)}</span>
                        </div>
                    </div>
                ` : ''}
                ${d.cancelled_amount !== undefined ? `
                    <div class="card" style="padding:14px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span class="earnings-detail-label">Lost to Cancellations</span>
                            <span class="earnings-detail-value" style="color:var(--danger);">₹${parseFloat(d.cancelled_amount||0).toFixed(0)}</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    },

    /* ── Bar Chart ── */
    _renderChart() {
        const el = document.getElementById('earnings-chart');
        if (!el) return;

        const days = this.data?.daily_chart;
        if (!days?.length) { el.innerHTML = ''; return; }

        const maxRev = Math.max(...days.map(d => parseFloat(d.revenue || 0)), 1);
        const totalWeek = days.reduce((s, d) => s + parseFloat(d.revenue || 0), 0);

        el.innerHTML = `
            <div class="earnings-chart-card card">
                <div class="chart-header">
                    <div>
                        <div class="chart-title">Last 7 Days</div>
                        <div class="chart-subtitle">Total: ₹${totalWeek.toFixed(0)}</div>
                    </div>
                </div>
                <div class="bar-chart">
                    ${days.map(d => {
                        const rev = parseFloat(d.revenue || 0);
                        const pct = (rev / maxRev) * 100;
                        const label = new Date(d.day).toLocaleDateString('en-IN', { weekday: 'short' });
                        const isToday = new Date(d.day).toDateString() === new Date().toDateString();
                        return `
                            <div class="bar-wrap ${isToday ? 'today' : ''}" title="${label}: ₹${rev.toFixed(0)}">
                                <div class="bar-value">₹${rev.toFixed(0)}</div>
                                <div class="bar" style="height:${Math.max(4, pct)}%;${isToday ? 'background:var(--green);' : ''}"></div>
                                <div class="bar-label">${label}${isToday ? ' ★' : ''}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    /* ── Peak Hours ── */
    _renderPeakHours() {
        const el = document.getElementById('peak-hours-section');
        if (!el) return;

        const hours = this.data?.peak_hours || [
            { h: '12pm', orders: 8 },  { h: '1pm', orders: 15 }, { h: '2pm', orders: 10 },
            { h: '7pm', orders: 18 },  { h: '8pm', orders: 22 }, { h: '9pm', orders: 14 }
        ];
        const maxO = Math.max(...hours.map(h => h.orders), 1);

        el.innerHTML = `
            <div class="card earnings-chart-card">
                <div class="chart-header">
                    <div>
                        <div class="chart-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--berry)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            Peak Hours
                        </div>
                        <div class="chart-subtitle">When you get the most orders</div>
                    </div>
                </div>
                <div class="bar-chart">
                    ${hours.map(h => {
                        const pct = (h.orders / maxO) * 100;
                        const isPeak = pct >= 85;
                        return `
                            <div class="bar-wrap" title="${h.h}: ${h.orders} orders">
                                <div class="bar-value" style="font-size:9px;">${h.orders}</div>
                                <div class="bar" style="height:${pct}%;${isPeak ? 'background:var(--danger);' : ''}"></div>
                                <div class="bar-label">${h.h}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="peak-hours-tip">Ensure full staffing during peak hours for faster service!</div>
            </div>
        `;
    },

    /* ── Export ── */
    exportCSV() {
        const d = this.data;
        if (!d) { Dashboard.showToast('No data to export', 'error'); return; }

        const rows = [
            ['Period', 'Gross Revenue', 'Net Earnings', 'Commission', 'Orders', 'Avg Order Value'],
            ['Today', d.today?.gross_revenue||0, d.today?.net_revenue||0, d.today?.commission||0, d.today?.order_count||0, d.today?.avg_order_value||0],
            ['This Week', d.week?.gross_revenue||0, d.week?.net_revenue||0, d.week?.commission||0, d.week?.order_count||0, d.week?.avg_order_value||0],
            ['This Month', d.month?.gross_revenue||0, d.month?.net_revenue||0, d.month?.commission||0, d.month?.order_count||0, d.month?.avg_order_value||0],
        ];

        if (d.daily_chart?.length) {
            rows.push([]);
            rows.push(['Date', 'Revenue', 'Orders']);
            d.daily_chart.forEach(day => {
                rows.push([day.day, day.revenue || 0, day.orders || 0]);
            });
        }

        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cora-earnings-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        Dashboard.showToast('Earnings report downloaded', 'success');
    }
};
