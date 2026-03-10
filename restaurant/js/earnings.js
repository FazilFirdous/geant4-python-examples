const EarningsTab = {
    data: null,
    period: 'today',

    async render() {
        document.getElementById('tab-content').innerHTML = `
            <div style="padding:16px 0 80px;">
                <!-- Period Toggle -->
                <div style="display:flex;gap:8px;padding:0 16px 16px;">
                    ${['today','week','month'].map(p => `
                        <button onclick="EarningsTab.setPeriod('${p}', this)"
                                style="flex:1;padding:10px;border-radius:10px;font-size:13px;font-weight:600;border:1px solid var(--berry-border);cursor:pointer;background:${p==='today'?'var(--berry)':'white'};color:${p==='today'?'white':'var(--text-sub)'};font-family:'DM Sans',sans-serif;transition:all 0.25s;" data-period="${p}">
                            ${p === 'today' ? 'Today' : (p === 'week' ? 'This Week' : 'This Month')}
                        </button>
                    `).join('')}
                </div>
                <div id="earnings-data">
                    <div style="display:flex;justify-content:center;padding:40px;"><div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div></div>
                </div>

                <!-- Peak Hours -->
                <div style="padding:0 16px;" id="peak-hours-section"></div>
            </div>
        `;
        await this.loadData();
    },

    async loadData() {
        try {
            const res = await RApi.getEarnings();
            this.data = res?.data || {};
            this.renderPeriod(this.period);
            this.renderPeakHours();
        } catch(e) {
            document.getElementById('earnings-data').innerHTML = `<div style="padding:20px;color:var(--danger);">Failed to load earnings</div>`;
        }
    },

    setPeriod(period, btn) {
        this.period = period;
        document.querySelectorAll('[data-period]').forEach(b => {
            b.style.background = b.dataset.period === period ? 'var(--berry)' : 'white';
            b.style.color = b.dataset.period === period ? 'white' : 'var(--text-sub)';
        });
        this.renderPeriod(period);
    },

    renderPeriod(period) {
        const d = this.data?.[period] || {};
        const el = document.getElementById('earnings-data');
        if (!el) return;

        el.innerHTML = `
            <!-- Stat Cards -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px 16px;">
                <div class="card" style="padding:14px;text-align:center;">
                    <div style="font-size:22px;font-weight:700;color:var(--berry);">₹${parseFloat(d.gross_revenue||0).toFixed(0)}</div>
                    <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Gross Revenue</div>
                </div>
                <div class="card" style="padding:14px;text-align:center;">
                    <div style="font-size:22px;font-weight:700;color:var(--green);">₹${parseFloat(d.net_revenue||0).toFixed(0)}</div>
                    <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Net Earnings</div>
                </div>
                <div class="card" style="padding:14px;text-align:center;">
                    <div style="font-size:22px;font-weight:700;color:var(--orange);">₹${parseFloat(d.commission||0).toFixed(0)}</div>
                    <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Commission Paid</div>
                </div>
                <div class="card" style="padding:14px;text-align:center;">
                    <div style="font-size:22px;font-weight:700;">${d.order_count||0}</div>
                    <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Orders</div>
                </div>
            </div>

            <!-- Avg Order Value -->
            <div style="padding:0 16px 16px;">
                <div class="card" style="padding:14px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:14px;color:var(--text-sub);">Average Order Value</span>
                        <span style="font-size:18px;font-weight:700;">₹${parseFloat(d.avg_order_value||0).toFixed(0)}</span>
                    </div>
                </div>
            </div>

            <!-- Weekly Bar Chart -->
            ${this.data?.daily_chart?.length ? `
                <div style="padding:0 16px 16px;">
                    <div class="card" style="padding:16px;">
                        <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:16px;">Last 7 Days</div>
                        ${this.renderBarChart(this.data.daily_chart)}
                    </div>
                </div>
            ` : ''}
        `;
    },

    renderBarChart(days) {
        if (!days?.length) return '';
        const maxRev = Math.max(...days.map(d => parseFloat(d.revenue || 0)), 1);
        return `
            <div class="bar-chart">
                ${days.map(d => {
                    const pct = (parseFloat(d.revenue||0) / maxRev) * 100;
                    const label = new Date(d.day).toLocaleDateString('en-IN', { weekday: 'short' });
                    return `
                        <div class="bar-wrap">
                            <div style="font-size:10px;color:var(--text-muted);">₹${parseFloat(d.revenue||0).toFixed(0)}</div>
                            <div class="bar" style="height:${Math.max(4, pct)}%;"></div>
                            <div class="bar-label">${label}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    renderPeakHours() {
        // Simulated peak hours visualization
        const el = document.getElementById('peak-hours-section');
        if (!el) return;

        const hours = [
            { h: '12pm', orders: 8 }, { h: '1pm', orders: 15 }, { h: '2pm', orders: 10 },
            { h: '7pm', orders: 18 }, { h: '8pm', orders: 22 }, { h: '9pm', orders: 14 }
        ];
        const maxO = Math.max(...hours.map(h => h.orders));

        el.innerHTML = `
            <div class="card" style="padding:16px;margin-bottom:16px;">
                <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:4px;">⏰ Peak Hours</div>
                <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">When you get the most orders</div>
                <div class="bar-chart">
                    ${hours.map(h => {
                        const pct = (h.orders / maxO) * 100;
                        return `
                            <div class="bar-wrap">
                                <div style="font-size:9px;color:var(--text-muted);">${h.orders}</div>
                                <div class="bar" style="height:${pct}%;background:${pct >= 90 ? 'var(--danger)' : 'var(--berry)'};"></div>
                                <div class="bar-label">${h.h}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="font-size:12px;color:var(--text-muted);margin-top:12px;text-align:center;">Based on order history. Ensure you're fully staffed during peak hours!</div>
            </div>
        `;
    }
};
