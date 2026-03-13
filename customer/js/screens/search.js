/* ═══════════════════════════════════════
   CORA — Search Screen
   Full-featured search with history, filters,
   popular tags, dish-level results
   ═══════════════════════════════════════ */
const SearchScreen = {
    searchTimer: null,
    _vegOnly: false,
    _lastQuery: '',
    _allResults: [],
    _recentSearches: [],
    _sortBy: 'relevance', // relevance, rating, delivery_time, price_low, price_high
    _MAX_RECENT: 8,

    // ── Popular search tags ─────────────────────
    _popularTags: [
        { label: 'Biryani', icon: 'flame' },
        { label: 'Wazwan', icon: 'beef' },
        { label: 'Burger', icon: 'sandwich' },
        { label: 'Pizza', icon: 'pizza' },
        { label: 'Chai', icon: 'coffee' },
        { label: 'Kebab', icon: 'utensils' },
        { label: 'Momos', icon: 'package' },
        { label: 'Bakery', icon: 'cake' },
        { label: 'Healthy', icon: 'leaf' },
        { label: 'Ice Cream', icon: 'ice-cream-cone' },
    ],

    // ── Render ──────────────────────────────────
    render() {
        this._loadRecentSearches();

        App.setScreen(`
            <div id="search-screen">
                <!-- Search Header -->
                <div style="background:linear-gradient(135deg,var(--berry),var(--berry-deep));padding:50px 16px 16px;">
                    <div style="position:relative;z-index:1;">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <button class="screen-back-btn" onclick="history.back()" aria-label="Go back"><i data-lucide="arrow-left" style="width:20px;height:20px;"></i></button>
                            <div style="flex:1;background:white;border-radius:12px;display:flex;align-items:center;padding:10px 14px;gap:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                                <i data-lucide="search" style="width:16px;height:16px;color:var(--text-muted);flex-shrink:0;"></i>
                                <input type="text" id="search-input" placeholder="Search restaurants or dishes..."
                                       style="border:none;outline:none;font-size:14px;width:100%;font-family:'DM Sans',sans-serif;color:var(--text);"
                                       autofocus oninput="SearchScreen.onSearch(this.value)"
                                       onkeydown="if(event.key==='Enter')SearchScreen.performSearch(this.value)"
                                       aria-label="Search food and restaurants"
                                       autocomplete="off">
                                <span id="search-clear" onclick="SearchScreen.clear()" style="cursor:pointer;display:none;color:var(--text-muted);padding:2px;" aria-label="Clear search"><i data-lucide="x" style="width:16px;height:16px;"></i></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filter Bar -->
                <div class="search-filter-bar" style="padding:10px 16px;display:flex;align-items:center;gap:8px;background:white;border-bottom:1px solid var(--berry-border);overflow-x:auto;scrollbar-width:none;">
                    <!-- Veg Toggle -->
                    <div class="search-filter-chip ${this._vegOnly ? 'active' : ''}" id="search-veg-chip" onclick="SearchScreen.toggleVeg()" style="display:inline-flex;align-items:center;gap:4px;padding:6px 12px;border-radius:20px;border:1.5px solid ${this._vegOnly ? 'var(--green)' : 'var(--berry-border)'};background:${this._vegOnly ? 'var(--green-light)' : 'white'};font-size:12px;font-weight:600;color:${this._vegOnly ? 'var(--green)' : 'var(--text-sub)'};cursor:pointer;white-space:nowrap;transition:all 0.2s ease;">
                        <i data-lucide="leaf" style="width:12px;height:12px;"></i> Veg
                    </div>

                    <!-- Sort Options -->
                    <div class="search-filter-chip" onclick="SearchScreen.cycleSortBy()" id="sort-chip" style="display:inline-flex;align-items:center;gap:4px;padding:6px 12px;border-radius:20px;border:1.5px solid var(--berry-border);background:white;font-size:12px;font-weight:600;color:var(--text-sub);cursor:pointer;white-space:nowrap;transition:all 0.2s ease;">
                        <i data-lucide="arrow-up-down" style="width:12px;height:12px;"></i> <span id="sort-label">Relevance</span>
                    </div>

                    <!-- Open Now Filter -->
                    <div class="search-filter-chip" id="open-now-chip" onclick="SearchScreen.toggleOpenNow()" style="display:inline-flex;align-items:center;gap:4px;padding:6px 12px;border-radius:20px;border:1.5px solid var(--berry-border);background:white;font-size:12px;font-weight:600;color:var(--text-sub);cursor:pointer;white-space:nowrap;transition:all 0.2s ease;">
                        <i data-lucide="clock" style="width:12px;height:12px;"></i> Open Now
                    </div>
                </div>

                <!-- Search Body -->
                <div id="search-results" style="padding:16px 16px 80px;">
                    ${this._renderDefaultState()}
                </div>
            </div>
        `);

        this._openNow = false;
    },

    _openNow: false,

    // ── Default state: recent + popular tags ────
    _renderDefaultState() {
        let html = '';

        // Recent searches
        if (this._recentSearches.length > 0) {
            html += `
                <div style="margin-bottom:20px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <span style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;">Recent Searches</span>
                        <span onclick="SearchScreen.clearRecentSearches()" style="font-size:12px;color:var(--berry);cursor:pointer;font-weight:600;">Clear All</span>
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:8px;">
                        ${this._recentSearches.map(s => `
                            <div onclick="SearchScreen.searchFromHistory('${s.replace(/'/g, "\\'")}')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:20px;background:white;border:1px solid var(--berry-border);cursor:pointer;font-size:13px;color:var(--text-sub);transition:all 0.2s ease;">
                                <i data-lucide="clock" style="width:12px;height:12px;opacity:0.5;"></i>
                                <span>${s}</span>
                                <span onclick="event.stopPropagation();SearchScreen.removeRecentSearch('${s.replace(/'/g, "\\'")}')" style="color:var(--text-muted);cursor:pointer;margin-left:2px;"><i data-lucide="x" style="width:12px;height:12px;"></i></span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Popular searches
        html += `
            <div>
                <span style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;display:block;margin-bottom:10px;">Popular Searches</span>
                <div style="display:flex;flex-wrap:wrap;gap:8px;">
                    ${this._popularTags.map(t => `
                        <div onclick="SearchScreen.searchFromHistory('${t.label}')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:20px;background:var(--berry-light);border:1px solid var(--berry-border);cursor:pointer;font-size:13px;color:var(--berry);font-weight:500;transition:all 0.2s ease;">
                            <i data-lucide="${t.icon}" style="width:14px;height:14px;"></i>
                            ${t.label}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Quick cuisines grid
        html += `
            <div style="margin-top:24px;">
                <span style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;display:block;margin-bottom:12px;">Explore Cuisines</span>
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
                    ${this._renderCuisineGrid()}
                </div>
            </div>
        `;

        return html;
    },

    // ── Cuisine icon grid ───────────────────────
    _renderCuisineGrid() {
        const cuisines = [
            { name: 'Kashmiri', icon: 'beef', color: '#E65100' },
            { name: 'Indian', icon: 'utensils', color: '#D1386C' },
            { name: 'Chinese', icon: 'soup', color: '#F57C00' },
            { name: 'Fast Food', icon: 'zap', color: '#1565C0' },
            { name: 'Mughlai', icon: 'crown', color: '#6A1B9A' },
            { name: 'Street', icon: 'store', color: '#2E7D32' },
            { name: 'Desserts', icon: 'ice-cream-cone', color: '#AD1457' },
            { name: 'Drinks', icon: 'cup-soda', color: '#00838F' },
        ];

        return cuisines.map(c => `
            <div onclick="SearchScreen.searchFromHistory('${c.name}')" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px;border-radius:14px;background:white;border:1px solid var(--berry-border);cursor:pointer;transition:all 0.2s ease;">
                <div style="width:40px;height:40px;border-radius:50%;background:${c.color}15;display:flex;align-items:center;justify-content:center;">
                    <i data-lucide="${c.icon}" style="width:20px;height:20px;color:${c.color};"></i>
                </div>
                <span style="font-size:11px;font-weight:600;color:var(--text-sub);text-align:center;">${c.name}</span>
            </div>
        `).join('');
    },

    // ── Toggle Filters ──────────────────────────
    toggleVeg() {
        this._vegOnly = !this._vegOnly;
        const chip = document.getElementById('search-veg-chip');
        if (chip) {
            chip.style.borderColor = this._vegOnly ? 'var(--green)' : 'var(--berry-border)';
            chip.style.background = this._vegOnly ? 'var(--green-light)' : 'white';
            chip.style.color = this._vegOnly ? 'var(--green)' : 'var(--text-sub)';
        }
        if (this._lastQuery) this.performSearch(this._lastQuery);
    },

    toggleOpenNow() {
        this._openNow = !this._openNow;
        const chip = document.getElementById('open-now-chip');
        if (chip) {
            chip.style.borderColor = this._openNow ? 'var(--berry)' : 'var(--berry-border)';
            chip.style.background = this._openNow ? 'var(--berry-light)' : 'white';
            chip.style.color = this._openNow ? 'var(--berry)' : 'var(--text-sub)';
        }
        if (this._lastQuery) this.performSearch(this._lastQuery);
    },

    cycleSortBy() {
        const sortOptions = ['relevance', 'rating', 'delivery_time', 'price_low', 'price_high'];
        const sortLabels = { relevance: 'Relevance', rating: 'Top Rated', delivery_time: 'Fastest', price_low: 'Price: Low', price_high: 'Price: High' };
        const idx = sortOptions.indexOf(this._sortBy);
        this._sortBy = sortOptions[(idx + 1) % sortOptions.length];

        const label = document.getElementById('sort-label');
        if (label) label.textContent = sortLabels[this._sortBy];

        const chip = document.getElementById('sort-chip');
        if (chip) {
            const isActive = this._sortBy !== 'relevance';
            chip.style.borderColor = isActive ? 'var(--berry)' : 'var(--berry-border)';
            chip.style.background = isActive ? 'var(--berry-light)' : 'white';
            chip.style.color = isActive ? 'var(--berry)' : 'var(--text-sub)';
        }

        if (this._allResults.length > 0) {
            this._renderResults(this._sortResults(this._allResults));
        }
    },

    // ── Sort Results ────────────────────────────
    _sortResults(results) {
        const sorted = [...results];
        switch (this._sortBy) {
            case 'rating':
                sorted.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
                break;
            case 'delivery_time':
                sorted.sort((a, b) => (parseInt(a.avg_prep_time_minutes) || 30) - (parseInt(b.avg_prep_time_minutes) || 30));
                break;
            case 'price_low':
                sorted.sort((a, b) => (parseFloat(a.min_order_amount) || 0) - (parseFloat(b.min_order_amount) || 0));
                break;
            case 'price_high':
                sorted.sort((a, b) => (parseFloat(b.min_order_amount) || 0) - (parseFloat(a.min_order_amount) || 0));
                break;
        }
        return sorted;
    },

    // ── Search Input Handler ────────────────────
    onSearch(query) {
        this._lastQuery = query;
        const clearBtn = document.getElementById('search-clear');
        if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';

        clearTimeout(this.searchTimer);
        if (!query.trim()) {
            document.getElementById('search-results').innerHTML = this._renderDefaultState();
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        document.getElementById('search-results').innerHTML = Loading.skeleton(3);

        this.searchTimer = setTimeout(() => this.performSearch(query), 350);
    },

    // ── Perform Search ──────────────────────────
    async performSearch(query) {
        try {
            const params = { search: query };
            if (this._vegOnly) params.veg_only = 1;

            const res = await API.getRestaurants(params);
            let restaurants = res.data || [];

            // Filter open now
            if (this._openNow) {
                restaurants = restaurants.filter(r => parseInt(r.is_open));
            }

            this._allResults = restaurants;

            // Save to recent searches
            this._addRecentSearch(query.trim());

            if (!restaurants.length) {
                document.getElementById('search-results').innerHTML = `
                    <div class="empty-state" style="margin-top:40px;">
                        <div style="width:70px;height:70px;background:var(--berry-light);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
                            <i data-lucide="search-x" style="width:32px;height:32px;color:var(--berry);"></i>
                        </div>
                        <h3 style="font-family:'Playfair Display',serif;font-size:18px;font-weight:700;">No results found</h3>
                        <p style="font-size:14px;color:var(--text-muted);margin-top:4px;">Try a different search term or check filters</p>
                        <button class="btn-secondary" onclick="SearchScreen.clear()" style="margin-top:12px;padding:8px 20px;font-size:13px;">Clear Search</button>
                    </div>
                `;
                if (typeof lucide !== 'undefined') lucide.createIcons();
                return;
            }

            this._renderResults(this._sortResults(restaurants));

        } catch (e) {
            document.getElementById('search-results').innerHTML = Loading.error(e.message, `SearchScreen.performSearch('${this._lastQuery}')`);
        }
    },

    // ── Render Results ──────────────────────────
    _renderResults(restaurants) {
        const resultsEl = document.getElementById('search-results');
        if (!resultsEl) return;

        resultsEl.innerHTML = `
            <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
                <span>${restaurants.length} restaurant${restaurants.length > 1 ? 's' : ''} found</span>
            </div>
            <div style="display:grid;gap:12px;">
                ${restaurants.map(r => RestaurantCard.render(r)).join('')}
            </div>
        `;

        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    // ── Search from history/tag ─────────────────
    searchFromHistory(query) {
        const input = document.getElementById('search-input');
        if (input) {
            input.value = query;
            input.focus();
        }
        this.onSearch(query);
    },

    // ── Clear Search ────────────────────────────
    clear() {
        const input = document.getElementById('search-input');
        if (input) { input.value = ''; input.focus(); }
        this._lastQuery = '';
        this._allResults = [];
        this.onSearch('');
    },

    // ── Recent Searches Management ──────────────
    _loadRecentSearches() {
        try {
            this._recentSearches = JSON.parse(localStorage.getItem('cora_recent_searches') || '[]');
        } catch (e) {
            this._recentSearches = [];
        }
    },

    _addRecentSearch(query) {
        if (!query || query.length < 2) return;
        this._recentSearches = this._recentSearches.filter(s => s.toLowerCase() !== query.toLowerCase());
        this._recentSearches.unshift(query);
        if (this._recentSearches.length > this._MAX_RECENT) {
            this._recentSearches = this._recentSearches.slice(0, this._MAX_RECENT);
        }
        try {
            localStorage.setItem('cora_recent_searches', JSON.stringify(this._recentSearches));
        } catch (e) {}
    },

    removeRecentSearch(query) {
        this._recentSearches = this._recentSearches.filter(s => s !== query);
        try {
            localStorage.setItem('cora_recent_searches', JSON.stringify(this._recentSearches));
        } catch (e) {}
        // Re-render default state
        if (!this._lastQuery) {
            document.getElementById('search-results').innerHTML = this._renderDefaultState();
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    },

    clearRecentSearches() {
        this._recentSearches = [];
        try { localStorage.removeItem('cora_recent_searches'); } catch (e) {}
        if (!this._lastQuery) {
            document.getElementById('search-results').innerHTML = this._renderDefaultState();
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }
};
