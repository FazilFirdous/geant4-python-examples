const SearchScreen = {
    searchTimer: null,

    render() {
        App.setScreen(`
            <div>
                <div style="background:linear-gradient(135deg,var(--berry),var(--berry-deep));padding:50px 16px 16px;">
                    <div style="position:relative;z-index:1;">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <button class="screen-back-btn" onclick="history.back()">←</button>
                            <div style="flex:1;background:white;border-radius:12px;display:flex;align-items:center;padding:10px 14px;gap:8px;">
                                <span>🔍</span>
                                <input type="text" id="search-input" placeholder="Search restaurants or dishes..."
                                       style="border:none;outline:none;font-size:14px;width:100%;font-family:'DM Sans',sans-serif;"
                                       autofocus oninput="SearchScreen.onSearch(this.value)">
                                <span id="search-clear" onclick="SearchScreen.clear()" style="cursor:pointer;display:none;color:var(--text-muted);">✕</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Veg Only Toggle -->
                <div style="padding:12px 16px;display:flex;align-items:center;justify-content:space-between;background:white;border-bottom:1px solid var(--berry-border);">
                    <span style="font-size:14px;font-weight:600;color:var(--green);">🥗 Vegetarian Only</span>
                    <div class="toggle-switch" id="search-veg-toggle" onclick="SearchScreen.toggleVeg()"></div>
                </div>

                <div id="search-results" style="padding:16px 16px 80px;">
                    <div class="empty-state">
                        <div class="empty-state-emoji">🔍</div>
                        <h3>Search for food</h3>
                        <p>Type a restaurant name, cuisine, or dish</p>
                    </div>
                </div>
            </div>
        `);

        this._vegOnly = false;
        this._lastQuery = '';
    },

    _vegOnly: false,
    _lastQuery: '',
    _allResults: [],

    toggleVeg() {
        this._vegOnly = !this._vegOnly;
        const toggle = document.getElementById('search-veg-toggle');
        if (toggle) toggle.classList.toggle('on', this._vegOnly);
        if (this._lastQuery) this.onSearch(this._lastQuery);
    },

    onSearch(query) {
        this._lastQuery = query;
        const clearBtn = document.getElementById('search-clear');
        if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';

        clearTimeout(this.searchTimer);
        if (!query.trim()) {
            document.getElementById('search-results').innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-emoji">🔍</div>
                    <h3>Search for food</h3>
                    <p>Type a restaurant name, cuisine, or dish</p>
                </div>
            `;
            return;
        }

        document.getElementById('search-results').innerHTML = Loading.skeleton(3);

        this.searchTimer = setTimeout(() => this.performSearch(query), 400);
    },

    async performSearch(query) {
        try {
            const params = { search: query };
            if (this._vegOnly) params.veg_only = 1;

            const res = await API.getRestaurants(params);
            const restaurants = res.data || [];

            if (!restaurants.length) {
                document.getElementById('search-results').innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-emoji">🍽️</div>
                        <h3>No results found</h3>
                        <p>Try a different search term</p>
                    </div>
                `;
                return;
            }

            document.getElementById('search-results').innerHTML = `
                <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">${restaurants.length} restaurant${restaurants.length > 1 ? 's' : ''} found</div>
                <div style="display:grid;gap:12px;">
                    ${restaurants.map(r => RestaurantCard.render(r)).join('')}
                </div>
            `;

        } catch (e) {
            document.getElementById('search-results').innerHTML = Loading.error(e.message, 'SearchScreen.performSearch()');
        }
    },

    clear() {
        const input = document.getElementById('search-input');
        if (input) { input.value = ''; input.focus(); }
        this.onSearch('');
    }
};
