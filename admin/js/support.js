/* ============================================================
   Cora Admin — support.js
   ============================================================ */
const AdminSupport = {
    _tickets: [],

    async render(container) {
        container.innerHTML = `<div style="padding:16px;">
            <h2 style="font-family:'Playfair Display',serif;font-size:20px;margin-bottom:16px;">Support Tickets</h2>

            <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
                ${['all','open','in_progress','resolved'].map(s => `
                    <button class="filter-pill ${s==='all'?'active':''}" data-filter="${s}"
                        onclick="AdminSupport.filter('${s}', this)">${s}</button>
                `).join('')}
            </div>

            <div id="ticket-list"><div class="skel" style="height:60px;border-radius:12px;"></div></div>
        </div>
        <div id="ticket-modal" class="modal-overlay" style="display:none;"></div>`;

        this._load('all');
    },

    async _load(statusFilter) {
        const res = await AApi.getTickets();
        const wrap = document.getElementById('ticket-list');
        if (!wrap) return;
        if (!res.success) { wrap.innerHTML = '<p class="empty-state">Failed to load tickets</p>'; return; }

        this._tickets = res.data;
        const filtered = statusFilter === 'all' ? this._tickets : this._tickets.filter(t => t.status === statusFilter);

        if (!filtered.length) { wrap.innerHTML = '<p class="empty-state">No tickets found</p>'; return; }

        wrap.innerHTML = filtered.map(t => `
        <div class="admin-card ticket-card" style="margin-bottom:12px;${t.status === 'open' ? 'border-left:4px solid var(--berry);' : ''}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap;">
                <div>
                    <span class="badge badge-${t.status === 'open' ? 'preparing' : t.status === 'resolved' ? 'delivered' : 'confirmed'}">${t.status}</span>
                    <span style="font-size:12px;color:#888;margin-left:8px;">#${t.id} · ${this._fmt(t.created_at)}</span>
                </div>
                <div style="font-size:12px;color:#888;">${t.customer_name || 'Unknown'} · ${t.customer_phone || ''}</div>
            </div>
            <p style="margin:8px 0 4px;font-weight:600;">${t.subject || 'Support Request'}</p>
            <p style="color:#666;font-size:13px;">${this._trunc(t.message, 120)}</p>
            ${t.order_number ? `<p style="font-size:12px;color:#999;margin-top:4px;">Order: ${t.order_number}</p>` : ''}
            ${t.admin_response ? `<div style="margin-top:8px;padding:8px;background:#f9f9f9;border-radius:8px;font-size:13px;color:#555;"><strong>Your reply:</strong> ${t.admin_response}</div>` : ''}
            <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn-primary btn-sm" onclick="AdminSupport.respond(${t.id})">Reply</button>
                ${t.status !== 'resolved' ? `<button class="btn-success btn-sm" onclick="AdminSupport.resolve(${t.id})">✓ Resolve</button>` : ''}
                ${t.customer_phone ? `<a class="btn-wa btn-sm" href="https://wa.me/${t.customer_phone.replace('+','')}?text=Hi%20${encodeURIComponent(t.customer_name || '')}%2C%20this%20is%20Cora%20support%20regarding%20ticket%20%23${t.id}" target="_blank">WhatsApp</a>` : ''}
            </div>
        </div>`).join('');
    },

    filter(status, btn) {
        document.querySelectorAll('.filter-pill').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        this._load(status);
    },

    respond(id) {
        const t = this._tickets.find(x => x.id === id);
        if (!t) return;
        const modal = document.getElementById('ticket-modal');
        modal.style.display = 'flex';
        modal.innerHTML = `<div class="modal-box">
            <div class="modal-header"><h3>Reply to Ticket #${id}</h3><button class="modal-close" onclick="AdminSupport.closeModal()">✕</button></div>
            <div style="padding:20px;">
                <div style="background:#f9f9f9;padding:12px;border-radius:8px;margin-bottom:16px;font-size:13px;">
                    <strong>${t.subject}</strong><br><span style="color:#666;">${t.message}</span>
                </div>
                <div class="form-group"><label>Your Response</label><textarea id="ticket-reply" rows="4" placeholder="Type your response...">${t.admin_response || ''}</textarea></div>
                <div style="display:flex;gap:8px;margin-top:8px;">
                    <button class="btn-primary" onclick="AdminSupport.submitReply(${id}, false)">Send Reply</button>
                    <button class="btn-success" onclick="AdminSupport.submitReply(${id}, true)">Send & Resolve</button>
                </div>
            </div>
        </div>`;
    },

    async submitReply(id, resolve) {
        const reply = document.getElementById('ticket-reply').value.trim();
        if (!reply) { showToast('Enter a response'); return; }
        const res = await AApi.updateTicket({
            id,
            admin_response: reply,
            status: resolve ? 'resolved' : 'in_progress'
        });
        if (res.success) {
            showToast(resolve ? 'Ticket resolved!' : 'Reply sent!');
            this.closeModal();
            this._load('all');
        } else {
            showToast(res.message || 'Error');
        }
    },

    async resolve(id) {
        const res = await AApi.updateTicket({ id, status: 'resolved' });
        if (res.success) { showToast('Ticket resolved'); this._load('all'); }
        else showToast('Error');
    },

    closeModal() {
        const m = document.getElementById('ticket-modal');
        if (m) m.style.display = 'none';
    },

    _fmt(dt) {
        if (!dt) return '';
        return new Date(dt).toLocaleDateString('en-IN', { day:'2-digit', month:'short' }) + ' ' +
               new Date(dt).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
    },

    _trunc(str, n) {
        if (!str) return '';
        return str.length > n ? str.slice(0, n) + '…' : str;
    }
};
