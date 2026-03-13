/* ═══ Cora Admin — Support Tickets (Production) ═══ */

const AdminSupport = {
    _tickets: [],
    _currentFilter: 'all',

    async render(container) {
        container.innerHTML = `<div class="admin-page">
            <div class="page-header">
                <h2 class="page-title">Support Tickets</h2>
                <button class="btn-outline btn-sm" onclick="AdminSupport._load('${this._currentFilter}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                    Refresh
                </button>
            </div>

            <!-- Stats -->
            <div id="support-stats" class="mini-stats-row"></div>

            <!-- Filters -->
            <div class="filter-row">
                ${['all', 'open', 'in_progress', 'resolved'].map(s => `
                    <button class="filter-pill ${s === this._currentFilter ? 'active' : ''}" data-filter="${s}"
                        onclick="AdminSupport.filter('${s}', this)">${s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}</button>
                `).join('')}
            </div>

            <!-- Ticket List -->
            <div id="ticket-list"><div class="skel" style="height:60px;border-radius:12px;"></div></div>
        </div>
        <div id="ticket-modal" class="modal-overlay" style="display:none;"></div>`;

        this._load(this._currentFilter);
    },

    async _load(statusFilter) {
        try {
            const res = await AApi.getTickets();
            if (!res?.success) { document.getElementById('ticket-list').innerHTML = '<div class="empty-state"><p>Failed to load tickets</p></div>'; return; }

            this._tickets = res.data || [];
            this._currentFilter = statusFilter;

            // Stats
            const statsEl = document.getElementById('support-stats');
            if (statsEl) {
                const open = this._tickets.filter(t => t.status === 'open').length;
                const inProg = this._tickets.filter(t => t.status === 'in_progress').length;
                const resolved = this._tickets.filter(t => t.status === 'resolved').length;
                statsEl.innerHTML = `
                    <div class="mini-stat"><span class="mini-stat-value">${this._tickets.length}</span><span class="mini-stat-label">Total</span></div>
                    <div class="mini-stat"><span class="mini-stat-value" style="color:var(--danger);">${open}</span><span class="mini-stat-label">Open</span></div>
                    <div class="mini-stat"><span class="mini-stat-value" style="color:var(--orange);">${inProg}</span><span class="mini-stat-label">In Progress</span></div>
                    <div class="mini-stat"><span class="mini-stat-value" style="color:var(--green);">${resolved}</span><span class="mini-stat-label">Resolved</span></div>
                `;
            }

            const filtered = statusFilter === 'all' ? this._tickets : this._tickets.filter(t => t.status === statusFilter);
            const wrap = document.getElementById('ticket-list');
            if (!wrap) return;

            if (!filtered.length) {
                wrap.innerHTML = '<div class="empty-state"><p>No tickets found</p></div>';
                return;
            }

            wrap.innerHTML = filtered.map(t => `
            <div class="admin-card ticket-card ${t.status === 'open' ? 'ticket-urgent' : ''}" style="margin-bottom:12px;">
                <div class="ticket-header">
                    <div class="ticket-header-left">
                        <span class="badge badge-${t.status === 'open' ? 'placed' : t.status === 'resolved' ? 'delivered' : 'accepted'}">${(t.status || '').replace(/_/g, ' ')}</span>
                        <span class="ticket-id">#${t.id}</span>
                        <span class="ticket-date">${formatDate(t.created_at)}</span>
                    </div>
                    <div class="ticket-customer">${t.customer_name || 'Unknown'} · ${t.customer_phone || ''}</div>
                </div>

                <div class="ticket-body">
                    <p class="ticket-subject">${t.subject || 'Support Request'}</p>
                    <p class="ticket-message">${this._trunc(t.message, 150)}</p>
                    ${t.order_number ? `<p class="ticket-order">Order: ${t.order_number}</p>` : ''}
                </div>

                ${t.admin_response ? `
                    <div class="ticket-reply-box">
                        <strong>Your reply:</strong> ${t.admin_response}
                    </div>
                ` : ''}

                <div class="ticket-actions">
                    <button class="btn-primary btn-sm" onclick="AdminSupport.respond(${t.id})">
                        ${t.admin_response ? 'Update Reply' : 'Reply'}
                    </button>
                    ${t.status !== 'resolved' ? `
                        <button class="btn-success btn-sm" onclick="AdminSupport.resolve(${t.id})">✓ Resolve</button>
                    ` : ''}
                    ${t.customer_phone ? `
                        <a class="btn-wa btn-sm" href="https://wa.me/${(t.customer_phone || '').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(t.customer_name || '')}%2C%20this%20is%20Cora%20support%20regarding%20ticket%20%23${t.id}" target="_blank" rel="noopener">WhatsApp</a>
                    ` : ''}
                </div>
            </div>`).join('');
        } catch (e) {
            document.getElementById('ticket-list').innerHTML = '<div class="empty-state"><p>Error loading tickets</p></div>';
        }
    },

    filter(status, btn) {
        document.querySelectorAll('.filter-pill').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        this._currentFilter = status;
        this._load(status);
    },

    respond(id) {
        const t = this._tickets.find(x => x.id === id);
        if (!t) return;

        Admin.showModal('ticket-modal', {
            title: `Reply to Ticket #${id}`,
            content: `
                <div class="ticket-context">
                    <strong>${t.subject || 'Support Request'}</strong>
                    <p>${t.message || ''}</p>
                    ${t.order_number ? `<span class="ticket-order">Order: ${t.order_number}</span>` : ''}
                </div>
                <div class="form-group">
                    <label>Your Response</label>
                    <textarea id="ticket-reply" rows="4" placeholder="Type your response..." maxlength="1000">${t.admin_response || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Quick Replies</label>
                    <div class="quick-replies">
                        ${['We are looking into this.', 'Your refund has been processed.', 'Please try placing the order again.', 'We apologize for the inconvenience.'].map(q =>
                            `<button class="quick-reply-chip" onclick="document.getElementById('ticket-reply').value='${q}'">${q.slice(0, 30)}...</button>`
                        ).join('')}
                    </div>
                </div>
            `,
            actions: [
                { label: 'Send Reply', class: 'btn-primary btn-sm', action: 'send', onClick: (modal) => this.submitReply(id, false, modal) },
                { label: 'Send & Resolve', class: 'btn-success btn-sm', action: 'resolve', onClick: (modal) => this.submitReply(id, true, modal) }
            ]
        });
    },

    async submitReply(id, resolve, modal) {
        const reply = document.getElementById('ticket-reply')?.value.trim();
        if (!reply) { showToast('Enter a response', 'error'); return; }

        try {
            const res = await AApi.updateTicket({
                id,
                admin_response: reply,
                status: resolve ? 'resolved' : 'in_progress'
            });
            if (res?.success) {
                showToast(resolve ? 'Ticket resolved!' : 'Reply sent!', 'success');
                if (modal) modal.style.display = 'none';
                this._load(this._currentFilter);
            } else showToast(res?.message || 'Error', 'error');
        } catch (e) { showToast('Failed to send reply', 'error'); }
    },

    async resolve(id) {
        Admin.showModal('resolve-confirm', {
            title: 'Resolve Ticket',
            content: '<p>Mark this ticket as resolved?</p>',
            actions: [
                { label: 'Resolve', class: 'btn-success btn-sm', action: 'resolve', onClick: async (modal) => {
                    modal.style.display = 'none';
                    try {
                        const res = await AApi.updateTicket({ id, status: 'resolved' });
                        if (res?.success) { showToast('Ticket resolved', 'success'); this._load(this._currentFilter); }
                        else showToast('Error', 'error');
                    } catch (e) { showToast('Failed to resolve', 'error'); }
                }},
                { label: 'Cancel', class: 'btn-outline btn-sm', action: 'cancel', onClick: (m) => { m.style.display = 'none'; }}
            ]
        });
    },

    _trunc(str, n) {
        if (!str) return '';
        return str.length > n ? str.slice(0, n) + '…' : str;
    }
};
