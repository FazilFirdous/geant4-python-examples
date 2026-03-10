const SupportScreen = {
    messages: [],
    currentOrderId: null,
    ADMIN_WHATSAPP: '+919999999999', // Update with actual admin number

    render() {
        this.messages = [];
        App.setScreen(`
            <div style="display:flex;flex-direction:column;height:100%;">
                <div class="screen-header">
                    <div style="position:relative;z-index:1;">
                        <h2 style="color:white;font-family:'Playfair Display',serif;font-size:24px;font-weight:700;">Help & Support</h2>
                        <p style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:2px;">We're here to help! 💬</p>
                    </div>
                </div>

                <div id="chat-area" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:4px;padding-bottom:100px;">
                </div>
            </div>
        `);

        this.addBotMessage(`Hi ${App.user?.name?.split(' ')[0] || 'there'}! 👋 How can I help you today?`);
        setTimeout(() => this.showMainMenu(), 600);
    },

    addBotMessage(msg) {
        const el = document.createElement('div');
        el.className = 'chat-bubble bot';
        el.innerHTML = msg;
        document.getElementById('chat-area')?.appendChild(el);
        this.scrollToBottom();
    },

    addUserMessage(msg) {
        const el = document.createElement('div');
        el.className = 'chat-bubble user';
        el.textContent = msg;
        document.getElementById('chat-area')?.appendChild(el);
        this.scrollToBottom();
    },

    addActions(actions) {
        const el = document.createElement('div');
        el.className = 'chat-actions';
        el.id = 'chat-actions-' + Date.now();
        el.innerHTML = actions.map(a => `
            <button class="chat-action-btn" onclick="SupportScreen.handleAction('${a.id}', '${a.label.replace(/'/g, "\\'")}')">
                ${a.label}
            </button>
        `).join('');
        document.getElementById('chat-area')?.appendChild(el);
        this.scrollToBottom();
    },

    scrollToBottom() {
        const el = document.getElementById('chat-area');
        if (el) el.scrollTop = el.scrollHeight;
    },

    showMainMenu() {
        this.addActions([
            { id: 'track_order',     label: '📦 Track my order' },
            { id: 'wrong_item',      label: '❌ Wrong/missing item' },
            { id: 'refund',          label: '💰 Refund request' },
            { id: 'cancel_order',    label: '🚫 Cancel order' },
            { id: 'quality',         label: '😕 Food quality issue' },
            { id: 'delivery_delay',  label: '⏰ Delivery delay' },
            { id: 'talk_to_human',   label: '💬 Talk to support team' },
        ]);
    },

    handleAction(id, label) {
        // Disable all action buttons
        document.querySelectorAll('.chat-action-btn').forEach(btn => btn.disabled = true);
        this.addUserMessage(label);

        const handlers = {
            track_order:    () => this.handleTrackOrder(),
            wrong_item:     () => this.handleWrongItem(),
            refund:         () => this.handleRefund(),
            cancel_order:   () => this.handleCancelOrder(),
            quality:        () => this.handleQuality(),
            delivery_delay: () => this.handleDelay(),
            talk_to_human:  () => this.escalateToHuman(),
            back_menu:      () => { this.addBotMessage('Back to main menu:'); this.showMainMenu(); },
        };

        const fn = handlers[id];
        if (fn) setTimeout(fn, 400);
    },

    handleTrackOrder() {
        this.addBotMessage('Please provide your order number, or I can show your latest order.');
        this.addActions([
            { id: 'show_latest', label: '📋 Show latest order' },
            { id: 'back_menu',   label: '← Back' }
        ]);
    },

    handleWrongItem() {
        this.addBotMessage('Sorry about that! For wrong or missing items, we\'ll process a refund for the affected items within 3-5 business days.');
        this.addActions([
            { id: 'talk_to_human', label: '📞 Contact support for refund' },
            { id: 'back_menu',     label: '← Back' }
        ]);
    },

    handleRefund() {
        this.addBotMessage('Refund requests are processed within 3-5 business days. Here\'s our refund policy:\n\n• Wrong item: Full refund/replacement\n• Missing items: Refund for missing items\n• Quality issue: Review with photo\n• Cancelled before accepted: Full refund');
        this.addActions([
            { id: 'talk_to_human', label: '📞 Raise a refund request' },
            { id: 'back_menu',     label: '← Back' }
        ]);
    },

    handleCancelOrder() {
        this.addBotMessage('Orders can be cancelled before the restaurant accepts them. After acceptance, cancellation may not be possible.\n\nWould you like to proceed?');
        this.addActions([
            { id: 'talk_to_human', label: '📞 Cancel my order' },
            { id: 'back_menu',     label: '← Back' }
        ]);
    },

    handleQuality() {
        this.addBotMessage('We\'re sorry about the quality issue. Please take a photo of the food and contact our support team. We\'ll resolve this as quickly as possible.');
        this.addActions([
            { id: 'talk_to_human', label: '📸 Report quality issue' },
            { id: 'back_menu',     label: '← Back' }
        ]);
    },

    handleDelay() {
        this.addBotMessage('We apologize for the delay! Delivery times can be affected by traffic and distance. If your order is 30+ minutes late, you\'re eligible for ₹50 credit.');
        this.addActions([
            { id: 'talk_to_human', label: '📞 Get ₹50 credit for delay' },
            { id: 'back_menu',     label: '← Back' }
        ]);
    },

    async escalateToHuman() {
        this.addBotMessage('Connecting you to our support team via WhatsApp...');

        // Build conversation history for WhatsApp
        const messages = Array.from(document.querySelectorAll('.chat-bubble')).map(el => {
            const isBot  = el.classList.contains('bot');
            return `${isBot ? '🤖 Bot' : '👤 Customer'}: ${el.textContent.trim()}`;
        }).join('\n');

        const user    = App.user;
        const ticket  = `*CORA Support Request*\n\n*Customer:* ${user?.name || 'Unknown'}\n*Phone:* ${user?.phone || 'N/A'}\n\n*Conversation:*\n${messages}\n\n_Sent from CORA Support Chatbot_`;
        const waURL   = `https://wa.me/${this.ADMIN_WHATSAPP.replace(/\D/g,'')}?text=${encodeURIComponent(ticket)}`;

        setTimeout(() => {
            this.addBotMessage(`
                ✅ Our support team will help you!<br><br>
                <a href="${waURL}" target="_blank" style="display:inline-block;background:#25D366;color:white;padding:10px 20px;border-radius:10px;text-decoration:none;font-weight:700;margin-top:8px;">
                    💬 Open WhatsApp Support
                </a>
            `);
        }, 1000);
    }
};
