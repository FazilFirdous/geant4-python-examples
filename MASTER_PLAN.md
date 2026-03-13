# CORA — MASTER PRODUCTION PLAN
## Complete File-by-File, Line-by-Line Audit & Execution Plan

**Total Codebase**: 11,317 lines across 65+ files
**Target**: 25,000+ lines — Production-grade food delivery platform
**Panels**: Customer (4,449 LOC) | Restaurant (1,632 LOC) | Admin (1,506 LOC) | API (3,380 LOC) | DB (350 LOC)

---

## PHASE 1: CORE INFRASTRUCTURE FIXES (Critical — Must-Have)

### 1.1 — Config System (NEW FILE: `api/config/app-config.php`)
- [ ] Create centralized config: app name, version, support phone, UPI IDs, fees, areas, limits
- [ ] Move ALL hardcoded values from JS/PHP into this config
- [ ] Create `GET /api/config` endpoint to serve client-side config
- [ ] **Files**: NEW `api/config/app-config.php`, NEW `api/config/serve-config.php`
- **Lines added**: ~120

### 1.2 — Customer `api.js` Rewrite (86 lines → ~250 lines)
- [ ] Line 2: Replace hardcoded `API_BASE` with dynamic config fetch
- [ ] Line 13: Add request ID tracking for debugging
- [ ] Line 26-30: 401 handler — show re-login dialog instead of silent redirect
- [ ] Line 37-40: Offline error — queue requests for retry when back online
- [ ] Add: Request cancellation (AbortController) for screen navigation
- [ ] Add: Automatic retry with exponential backoff (3 retries)
- [ ] Add: Request deduplication (prevent double-submit)
- [ ] Add: Response caching layer with TTL
- [ ] Add: Rate limiting (client-side throttle per endpoint)
- [ ] Add: Request/response interceptors for logging
- [ ] Add: Network status monitoring with events
- [ ] Add: `api.cancelAll()` method for cleanup
- **Lines modified/added**: ~180

### 1.3 — Customer `app.js` Rewrite (295 lines → ~550 lines)
- [ ] Line 17: Move token from `localStorage` to memory + `httpOnly` cookie support
- [ ] Line 26: Cart persistence — add versioning, corruption detection
- [ ] Line 74-80: Fix auth barrier timing — check auth BEFORE rendering
- [ ] Line 167: Mixed restaurant cart — add proper modal with "Clear cart" vs "Keep current"
- [ ] Line 190-192: Fix `removeFromCart` variable shadowing (`i` used twice)
- [ ] Add: App-level error boundary with crash recovery
- [ ] Add: `prefers-reduced-motion` check — disable animations globally
- [ ] Add: Session timeout (30 min inactive → re-auth prompt)
- [ ] Add: Deep linking support (share restaurant/order links)
- [ ] Add: App state machine (loading → auth → ready → error)
- [ ] Add: Global keyboard shortcut handler
- [ ] Add: Haptic feedback API wrapper (navigator.vibrate)
- [ ] Add: `App.config` populated from server config endpoint
- [ ] Add: Connection quality detection (slow 3G handling)
- [ ] Add: Screen transition animations (slide left/right based on navigation direction)
- [ ] Add: Cart badge on navbar with bounce animation
- [ ] Add: Pull-to-refresh on home screen
- **Lines modified/added**: ~280

### 1.4 — Service Worker Upgrade (`sw.js`: 75 lines → ~200 lines)
- [ ] Line 1: Dynamic version from config instead of hardcoded `cora-v2.1.0`
- [ ] Add: Background sync for failed API requests
- [ ] Add: Push notification handler (order updates)
- [ ] Add: Periodic sync for order status polling
- [ ] Add: Cache strategy per route type (stale-while-revalidate for images)
- [ ] Add: Offline page with cached restaurant data
- [ ] Add: Cache size management (auto-purge old entries)
- [ ] Add: Update notification banner ("New version available — Tap to refresh")
- **Lines modified/added**: ~130

### 1.5 — Database Schema Additions (`schema.sql`: 350 lines → ~550 lines)
- [ ] Add `notifications` table (user_id, type, title, body, data_json, is_read, created_at)
- [ ] Add `user_preferences` table (user_id, language, dietary, notification_settings_json)
- [ ] Add `payment_transactions` table (order_id, transaction_id, gateway, status, amount, gateway_response_json)
- [ ] Add `activity_log` table (user_id, action, entity_type, entity_id, ip_address, user_agent, created_at)
- [ ] Add `app_config` table (key, value, type, description, updated_at)
- [ ] Add `rider_locations` table (delivery_boy_id, latitude, longitude, heading, speed, updated_at)
- [ ] Add `order_status_log` table (order_id, from_status, to_status, changed_by, note, created_at)
- [ ] Add indexes for common queries: orders by date range, settlements by restaurant+period
- [ ] Add CHECK constraints on all monetary fields (amount >= 0)
- [ ] Fix: Remove `firebase_uid` from users table (no Firebase)
- **Lines added**: ~200

---

## PHASE 2: AUTHENTICATION & SECURITY (Critical)

### 2.1 — Auth System Overhaul
**Files**: `api/auth/demo-login.php`, `api/auth/verify.php`, `api/auth/me.php`, `api/helpers/jwt.php`, `api/helpers/auth.php`

- [ ] `demo-login.php`: Add rate limiting (5 attempts per phone per 15 min)
- [ ] `demo-login.php`: Add phone format validation (E.164)
- [ ] `demo-login.php`: Add IP-based brute force protection
- [ ] `verify.php`: Add OTP generation infrastructure (placeholder for real SMS gateway)
- [ ] `verify.php`: Add OTP expiry (5 minutes)
- [ ] `verify.php`: Add OTP attempt limits (3 wrong = block 30 min)
- [ ] `jwt.php`: Add token refresh endpoint
- [ ] `jwt.php`: Add token blacklisting on logout
- [ ] `jwt.php`: Reduce token expiry from 30 days to 7 days
- [ ] `auth.php`: Add role-based middleware (customer, restaurant, admin, delivery)
- [ ] `auth.php`: Add request logging for audit trail
- [ ] NEW `api/auth/logout.php`: Proper token invalidation
- [ ] NEW `api/auth/refresh.php`: Token refresh without re-login
- [ ] NEW `api/auth/delete-account.php`: GDPR account deletion
- **Lines modified/added**: ~400

### 2.2 — Input Validation System
**File**: `api/helpers/validate.php` (rewrite)

- [ ] Add: `validatePhone($phone)` — E.164 format, country check
- [ ] Add: `validateEmail($email)` — RFC 5322 compliant
- [ ] Add: `validateName($name)` — 2-100 chars, no special chars
- [ ] Add: `validateAddress($address)` — 5-500 chars, no scripts
- [ ] Add: `validateAmount($amount)` — positive decimal, max 99999
- [ ] Add: `validateRating($rating)` — integer 1-5
- [ ] Add: `validateCouponCode($code)` — alphanumeric, 3-20 chars
- [ ] Add: `validateOrderStatus($status)` — enum whitelist
- [ ] Add: `sanitizeHtml($input)` — strip ALL HTML tags
- [ ] Add: `validatePagination($page, $limit)` — positive integers, max 100
- [ ] Add: `validateImageUrl($url)` — whitelist allowed domains
- [ ] Add: `validateSpecialInstructions($text)` — max 500 chars, sanitize
- **Lines modified/added**: ~200

### 2.3 — Security Headers & CORS
**File**: `api/config/config.php`, `api/.htaccess`

- [ ] Add Content-Security-Policy header
- [ ] Add X-Content-Type-Options: nosniff
- [ ] Add X-Frame-Options: DENY
- [ ] Add Referrer-Policy: strict-origin
- [ ] Add Permissions-Policy (disable camera, microphone, etc.)
- [ ] Tighten CORS — only allow specific origins
- [ ] Add rate limiting headers (X-RateLimit-Limit, X-RateLimit-Remaining)
- **Lines modified/added**: ~60

---

## PHASE 3: CUSTOMER PANEL — COMPLETE REWRITE OF KEY SCREENS

### 3.1 — `customer/index.html` Rewrite (138 lines → ~180 lines)
- [ ] Line 38: Add meta description, Open Graph tags for link previews
- [ ] Add: `<meta name="theme-color" content="#D1386C">`
- [ ] Add: Apple touch icons, splash screens for PWA
- [ ] Add: Preconnect to Unsplash, Google Fonts, API server
- [ ] Add: Structured data (JSON-LD) for rich search results
- [ ] Add: `viewport-fit=cover` for notch support
- [ ] Add: Noscript fallback message
- [ ] Add: Loading skeleton directly in HTML (not JS) for faster FCP
- [ ] Add: Offline detection banner in HTML
- [ ] Add: Cookie consent banner placeholder
- [ ] Add: `<div id="notification-banner" role="alert" aria-live="polite">` for push notifications
- **Lines modified/added**: ~50

### 3.2 — `customer/css/app.css` Complete Enhancement (1,553 lines → ~2,400 lines)
- [ ] Add: `@media (prefers-reduced-motion: reduce)` — disable ALL animations
- [ ] Add: `@media (prefers-color-scheme: dark)` — FULL dark mode support
  - Dark background: #1A1A1A
  - Dark cards: #2D2D2D
  - Berry stays vibrant on dark
  - All text colors inverted
  - All shadows adjusted
- [ ] Add: Focus-visible styles for ALL interactive elements (keyboard nav)
- [ ] Add: High contrast mode support
- [ ] Add: Print stylesheet (receipts, order confirmation)
- [ ] Add: Skeleton loading animations for every card type
  - `.skeleton-restaurant-card` (shimmer animation)
  - `.skeleton-menu-item` (shimmer animation)
  - `.skeleton-order-card` (shimmer animation)
  - `.skeleton-text` (shimmer animation)
- [ ] Add: Pull-to-refresh styles
- [ ] Add: Bottom sheet modal styles (for address picker, payment method)
- [ ] Add: Swipe-to-delete gesture styles (address list)
- [ ] Add: Image zoom modal styles (food photos)
- [ ] Add: Notification badge styles (pulse animation)
- [ ] Add: Progress bar styles (order prep progress)
- [ ] Add: Floating action button styles
- [ ] Add: Chip/tag component styles (cuisine tags, dietary filters)
- [ ] Add: Rating stars component (CSS-only interactive)
- [ ] Add: Tab bar underline animation
- [ ] Add: Tooltip/popover styles
- [ ] Add: Snackbar (dismissible toast) styles
- [ ] Fix: Color contrast — all text passes WCAG AA (4.5:1 ratio)
- [ ] Fix: Font sizes — use `rem` instead of `px` for accessibility
- [ ] Fix: Tap targets — all buttons minimum 44x44px
- [ ] Add: Container queries for responsive menu item layout
- [ ] Add: Smooth color transitions for theme switching
- **Lines added**: ~850

### 3.3 — `customer/js/screens/home.js` Rewrite (170 lines → ~400 lines)
- [ ] Line 40-42: Make greeting time-aware ("Good morning", "Good evening")
- [ ] Line 44-47: Address bar — show actual detected/saved address, not hardcoded "Kulgam Town"
- [ ] Line 82-84: `Promise.all` — show partial results if one promise fails
- [ ] Add: Search suggestions on search bar tap (trending, recent)
- [ ] Add: "Reorder" quick access — show last 3 orders as cards
- [ ] Add: Category filters with icons (Biryani, Pizza, Kashmiri, Desserts, etc.)
- [ ] Add: "Popular near you" section with horizontal scroll
- [ ] Add: "New on CORA" section for recently added restaurants
- [ ] Add: "Offers for you" personalized coupon carousel
- [ ] Add: Pull-to-refresh with loading animation
- [ ] Add: Restaurant skeleton loaders (3 shimmer cards) while loading
- [ ] Add: "Cuisines" grid with icons (8 cuisine types in 2x4 grid)
- [ ] Add: Greeting animation (text slide-in)
- [ ] Add: Location permission prompt if no address saved
- [ ] Add: "No restaurants open" state with next opening time
- [ ] Add: Infinite scroll pagination (load 10, then next 10 on scroll)
- [ ] Add: Sort options (Popular, Rating, Delivery Time, Distance)
- [ ] Add: Recently viewed restaurants
- [ ] Fix: Cache restaurants to localStorage for offline viewing
- **Lines modified/added**: ~250

### 3.4 — `customer/js/screens/restaurant.js` Rewrite (181 lines → ~380 lines)
- [ ] Line 43-45: Restaurant cover image — add parallax scroll effect
- [ ] Line 56-62: Restaurant info — show operating hours, reviews count
- [ ] Add: Photo gallery section (restaurant + food photos in horizontal scroll)
- [ ] Add: Restaurant info sheet (tap for full details — address, hours, reviews)
- [ ] Add: Menu item search within restaurant
- [ ] Add: "Add to favorites" button with heart animation
- [ ] Add: Share restaurant button (Web Share API)
- [ ] Add: Menu item image zoom (tap to enlarge with pan/pinch)
- [ ] Add: Item detail bottom sheet (description, nutrition info, customizations)
- [ ] Add: "Frequently ordered together" suggestions
- [ ] Add: Sticky category tabs with scroll-spy
- [ ] Add: Restaurant reviews section at bottom
- [ ] Add: "Similar restaurants" section
- [ ] Add: Preparation time indicator per item
- [ ] Add: Back-to-top floating button on long menus
- [ ] Fix: Handle restaurant closed mid-browsing (websocket/poll)
- [ ] Fix: Menu category scroll - highlight active category tab
- **Lines modified/added**: ~200

### 3.5 — `customer/js/screens/cart.js` Major Enhancement (691 lines → ~1,100 lines)
- [ ] Line 86: Special instructions — add character counter (max 500)
- [ ] Line 94: Coupon input — add "View all coupons" link
- [ ] Line 179: Delivery fee — fetch from `delivery_config` API, not hardcoded `25`
- [ ] Line 180: Platform fee — fetch from config, not hardcoded `5`
- [ ] Line 234: Address cards — add "Edit" and "Delete" buttons per address
- [ ] Line 272: Geolocation — better UX: show map pin on mini-map during detection
- [ ] Line 312-323: Area dropdown — fetch areas from API, not hardcoded list
- [ ] Line 333-350: Save address — add full validation (required fields, max length)
- [ ] Line 395: Order placement — add order summary review step before confirming
- [ ] Add: Tip for delivery boy section (₹10, ₹20, ₹30, Custom)
- [ ] Add: Scheduled delivery option (date + time picker)
- [ ] Add: Item quantity adjustment directly in cart (current +/- buttons)
- [ ] Add: Item-level special instructions (e.g., "Extra spicy")
- [ ] Add: "Apply coupon" bottom sheet with available coupons list
- [ ] Add: Free delivery progress bar ("Add ₹X more for free delivery")
- [ ] Add: Savings summary ("You're saving ₹X on this order")
- [ ] Add: Bill breakdown tooltip explanations
- [ ] Add: Payment method selection bottom sheet (COD, UPI, future: cards)
- [ ] Add: Order confirmation modal with item review before final submit
- [ ] Add: Repeat/reorder button on past order items
- [ ] Add: Cart item image thumbnails
- [ ] Add: Empty cart state with "Browse restaurants" CTA
- [ ] Add: Cart persistence across sessions (already in localStorage, add sync)
- [ ] Fix: Double-submit prevention (disable button + loading state)
- [ ] Fix: Price recalculation on every cart change (delivery fee may change)
- **Lines modified/added**: ~450

### 3.6 — `customer/js/screens/tracking.js` Major Enhancement (374 lines → ~650 lines)
- [ ] Line 19: Polling — use Server-Sent Events (SSE) or WebSocket instead of polling
- [ ] Line 76: Fix incorrect timestamp mapping (on_the_way → picked_up_at)
- [ ] Line 138-156: Map section — full-width map with better controls
- [ ] Line 252-303: Rider tracking — use `rider_locations` table for real GPS updates
- [ ] Add: Live rider location updates every 5 seconds
- [ ] Add: Route polyline from restaurant → rider → customer (use OSRM API)
- [ ] Add: Accurate ETA based on rider speed + distance remaining
- [ ] Add: Rider info card (photo, name, rating, vehicle, phone)
- [ ] Add: Call rider button (tel: link) with safety verification
- [ ] Add: Chat with rider (simple pre-defined messages)
- [ ] Add: Order preparation progress bar (restaurant side updates)
- [ ] Add: Push notification triggers for each status change
- [ ] Add: "Order is taking longer than expected" alert with support CTA
- [ ] Add: Delivery photo proof (rider uploads photo of delivered order)
- [ ] Add: Rating prompt immediately after delivery with haptic feedback
- [ ] Add: Order cancellation option (before restaurant accepts)
- [ ] Add: Refund status tracking (if cancelled/refunded)
- [ ] Add: Timeline expandable details (tap each step for more info)
- [ ] Add: Restaurant contact button
- [ ] Add: Share order status link
- [ ] Fix: Memory leak — clear `_riderInterval` on navigation away
- [ ] Fix: Receipt download as PDF (not print dialog)
- **Lines modified/added**: ~300

### 3.7 — `customer/js/screens/search.js` Enhancement (111 lines → ~280 lines)
- [ ] Add: Recent searches (stored in localStorage, max 10)
- [ ] Add: Trending searches (from API or static)
- [ ] Add: Search by dish name (not just restaurant)
- [ ] Add: Voice search button (Web Speech API)
- [ ] Add: Search results segmented: Restaurants | Dishes | Cuisines
- [ ] Add: Advanced filters bottom sheet:
  - Veg / Non-veg / Both
  - Cuisine type (multi-select)
  - Rating (4+, 3+)
  - Delivery time (under 30 min, under 45 min)
  - Price range
  - Currently open only
- [ ] Add: Sort options: Relevance, Rating, Delivery Time, Price Low→High
- [ ] Add: "No results" state with suggestions
- [ ] Add: Search result count
- [ ] Add: Highlight matching text in results
- [ ] Fix: Debounce improvement — cancel pending searches
- **Lines modified/added**: ~180

### 3.8 — `customer/js/screens/orders.js` Enhancement (116 lines → ~300 lines)
- [ ] Add: Order filtering (Active, Delivered, Cancelled)
- [ ] Add: Date range filter
- [ ] Add: Search within orders
- [ ] Add: Order card — show restaurant image, items summary, delivery time
- [ ] Add: Quick reorder button (one-tap to add all items to cart)
- [ ] Add: Order status badge with color coding
- [ ] Add: "Rate this order" prompt on unreviewed delivered orders
- [ ] Add: Download invoice button
- [ ] Add: Cancel order button (when in placed/accepted status)
- [ ] Add: Help button per order (opens support with order context)
- [ ] Add: Infinite scroll pagination
- [ ] Add: Empty state with "Order your first meal" CTA
- [ ] Add: Order timeline mini-view (collapsed status steps)
- **Lines modified/added**: ~200

### 3.9 — `customer/js/screens/profile.js` Enhancement (135 lines → ~400 lines)
- [ ] Add: Profile photo upload with crop/resize
- [ ] Add: Email verification flow
- [ ] Add: Saved payment methods section
- [ ] Add: Notification preferences (order updates, offers, promotions)
- [ ] Add: Dietary preferences (Veg, Non-veg, Jain, Halal)
- [ ] Add: Language selection (English, Urdu, Kashmiri, Hindi)
- [ ] Add: Address management — full CRUD with map picker
- [ ] Add: Favorite restaurants list
- [ ] Add: Order statistics (total orders, total spent, favorite cuisine)
- [ ] Add: Referral code section with share button
- [ ] Add: Wallet/credits balance
- [ ] Add: Linked accounts section
- [ ] Add: Data privacy section (download data, delete account)
- [ ] Add: App settings (dark mode toggle, notification sounds)
- [ ] Add: About CORA section (version, terms, privacy policy, licenses)
- [ ] Add: Logout confirmation dialog
- [ ] Fix: Line 56-57 — privacy/terms links point to real pages
- [ ] Fix: Profile form validation (email format, name length)
- **Lines modified/added**: ~280

### 3.10 — `customer/js/screens/support.js` Enhancement (162 lines → ~400 lines)
- [ ] Line 4: Replace hardcoded `+919999999999` with config value
- [ ] Add: Real support ticket system (create ticket via API)
- [ ] Add: Order-specific help (auto-attach order details)
- [ ] Add: Live chat interface with message bubbles
- [ ] Add: Ticket history (view past tickets and responses)
- [ ] Add: FAQ section with expandable answers (10+ common questions)
- [ ] Add: Contact methods: Chat, Email, Phone, WhatsApp
- [ ] Add: Issue categories with sub-categories
- [ ] Add: Photo attachment for quality/wrong item issues
- [ ] Add: Estimated response time indicator
- [ ] Add: Satisfaction rating after ticket resolution
- [ ] Add: Emergency escalation button (for safety issues)
- [ ] Fix: Bot messages — replace with AI-powered or at minimum richer FAQ
- **Lines modified/added**: ~260

### 3.11 — `customer/js/components/` Enhancements

**`navbar.js` (24 lines → ~60 lines)**
- [ ] Add: Cart badge with item count
- [ ] Add: Notification dot for unread notifications
- [ ] Add: Active state animation (underline slide)
- [ ] Add: ARIA labels and roles
- [ ] Add: Keyboard navigation support

**`promo-carousel.js` (87 lines → ~140 lines)**
- [ ] Add: Dot pagination indicators
- [ ] Add: Keyboard arrow key navigation
- [ ] Add: Pause on hover/focus
- [ ] Add: Loading state (skeleton)
- [ ] Add: Auto-apply coupon on banner tap
- [ ] Add: Analytics event on banner view/click

**`restaurant-card.js` (64 lines → ~120 lines)**
- [ ] Add: Skeleton loading state
- [ ] Add: Favorite heart icon with toggle
- [ ] Add: Delivery fee indicator
- [ ] Add: "Promoted" badge for promoted restaurants
- [ ] Add: Cuisine tags as chips below name
- [ ] Add: Tap animation (scale + shadow)
- [ ] Add: ARIA attributes (role="link", tabindex)

**`menu-item.js` (112 lines → ~200 lines)**
- [ ] Add: Item image zoom on tap
- [ ] Add: Customization/variants support (size, toppings)
- [ ] Add: Nutrition info tooltip
- [ ] Add: "Bestseller" badge (most ordered)
- [ ] Add: Item unavailable state (greyed out + notification bell)
- [ ] Add: Add-to-cart animation (item flies to cart)
- [ ] Fix: Line 9 — replace inline onerror with addEventListener
- [ ] Fix: String escaping vulnerability in onclick handlers

**`cart-bar.js` (42 lines → ~80 lines)**
- [ ] Add: Expand/collapse cart preview on tap
- [ ] Add: Item count and total display
- [ ] Add: Micro-interaction on item add (bounce)
- [ ] Add: "View cart" text animation
- [ ] Add: Delivery fee in preview

**NEW `notification-card.js` (~60 lines)**
- [ ] Create notification card component for in-app notifications

**NEW `bottom-sheet.js` (~120 lines)**
- [ ] Create reusable bottom sheet modal component
- [ ] Swipe-down to dismiss
- [ ] Backdrop click to close
- [ ] Height variants (quarter, half, full)

**NEW `image-viewer.js` (~80 lines)**
- [ ] Create full-screen image viewer with zoom/pan
- [ ] Swipe gallery support

**Lines added across all components**: ~500

---

## PHASE 4: RESTAURANT PANEL — FULL ENHANCEMENT

### 4.1 — `restaurant/js/app.js` Enhancement (192 lines → ~300 lines)
- [ ] Add: Sound settings (mute/unmute, volume, custom sounds)
- [ ] Add: Desktop notification support (Notification API)
- [ ] Add: Auto-refresh on reconnect
- [ ] Add: Multiple beep patterns (new order vs status change)
- [ ] Add: Dashboard stats on header (today's orders, revenue)
- [ ] Add: Quick toggle for open/closed with confirmation

### 4.2 — `restaurant/js/orders.js` Enhancement (407 lines → ~700 lines)
- [ ] Add: Bulk order actions (accept all, print all new)
- [ ] Add: Order preparation timer with alarm
- [ ] Add: One-tap status advance (Placed→Accepted→Preparing→Ready)
- [ ] Add: Order detail expandable view (items, customer info, notes)
- [ ] Add: Print order slip (thermal printer format)
- [ ] Add: Reject order with reason selection
- [ ] Add: Estimated prep time adjustment per order
- [ ] Add: Customer contact button (masked phone)
- [ ] Add: Delivery assignment from order detail
- [ ] Add: Order history search
- [ ] Add: Real-time order count badges per status
- [ ] Add: Sound + desktop notification for each new order
- [ ] Add: Auto-accept option (for trusted restaurants)

### 4.3 — `restaurant/js/menu.js` Enhancement (232 lines → ~500 lines)
- [ ] Add: Edit menu item (inline editing)
- [ ] Add: Add new menu item with image upload
- [ ] Add: Delete menu item with confirmation
- [ ] Add: Drag-and-drop category/item reordering
- [ ] Add: Bulk toggle (mark all in category as unavailable)
- [ ] Add: Item stock management (limited stock count)
- [ ] Add: Item clone/duplicate
- [ ] Add: Category add/edit/delete
- [ ] Add: Price history tracking
- [ ] Add: Popular items highlight
- [ ] Add: Menu item analytics (order count, revenue per item)
- [ ] Add: Seasonal/time-based availability
- [ ] Add: Item variants/customizations editor (size, extras)

### 4.4 — `restaurant/js/earnings.js` Enhancement (147 lines → ~350 lines)
- [ ] Add: Revenue chart (line chart, daily/weekly/monthly)
- [ ] Add: Order volume chart
- [ ] Add: Average order value trend
- [ ] Add: Top selling items list with revenue breakdown
- [ ] Add: Commission breakdown
- [ ] Add: Settlement history with payout dates
- [ ] Add: Export to CSV (daily/weekly/monthly report)
- [ ] Add: Comparison (this week vs last week)
- [ ] Add: Revenue by order type (delivery vs pickup)
- [ ] Add: Customer repeat rate

### 4.5 — `restaurant/js/deliveries.js` Enhancement (266 lines → ~450 lines)
- [ ] Add: Delivery boy live location on map
- [ ] Add: Assign specific delivery to specific rider
- [ ] Add: Delivery boy performance ratings
- [ ] Add: Delivery time tracking (average, fastest, slowest)
- [ ] Add: Public pool management (post to pool, track claims)
- [ ] Add: Delivery zone map visualization
- [ ] Add: Rider shift management

### 4.6 — `restaurant/js/settings.js` Enhancement (220 lines → ~400 lines)
- [ ] Add: Restaurant profile photo/cover image upload
- [ ] Add: Operating hours editor (per day of week)
- [ ] Add: Holiday schedule (mark dates as closed)
- [ ] Add: Auto-close when all items marked unavailable
- [ ] Add: Notification preferences (email, SMS, push)
- [ ] Add: UPI ID management
- [ ] Add: Staff management (add sub-users with permissions)
- [ ] Add: Restaurant description/cuisine tags editor
- [ ] Add: Minimum order amount adjustment
- [ ] Add: Delivery area/radius settings

### 4.7 — NEW `restaurant/js/analytics.js` (~300 lines)
- [ ] Create full analytics dashboard
- [ ] Order heatmap (hourly, daily)
- [ ] Revenue trend (7/30/90 day)
- [ ] Top items chart
- [ ] Customer demographics (new vs returning)
- [ ] Average prep time vs target
- [ ] Rejection rate tracking
- [ ] Rating trend

### 4.8 — NEW `restaurant/js/reviews.js` (~200 lines)
- [ ] List all customer reviews
- [ ] Reply to reviews
- [ ] Filter by rating, date
- [ ] Average rating breakdown (5-star, 4-star, etc.)
- [ ] Flag inappropriate reviews

**Total Restaurant Panel Lines Added**: ~2,000

---

## PHASE 5: ADMIN PANEL — FULL ENHANCEMENT

### 5.1 — `admin/js/dashboard.js` Enhancement (187 lines → ~400 lines)
- [ ] Add: Real-time stats with auto-refresh
- [ ] Add: Revenue chart (line/bar, daily/weekly/monthly)
- [ ] Add: Orders chart (volume, by status)
- [ ] Add: Top restaurants ranking
- [ ] Add: Active riders count
- [ ] Add: System alerts (high cancellation rate, slow delivery, etc.)
- [ ] Add: Recent activity feed (latest orders, new users, issues)
- [ ] Add: Quick actions (toggle restaurant, ban user, approve rider)
- [ ] Add: Platform health metrics (uptime, API response times)

### 5.2 — `admin/js/orders.js` Enhancement (124 lines → ~350 lines)
- [ ] Add: Advanced order filtering (status, date range, restaurant, area, payment method)
- [ ] Add: Order detail modal with full info
- [ ] Add: Manual status override with reason
- [ ] Add: Refund processing from order detail
- [ ] Add: Order reassignment (change delivery boy)
- [ ] Add: Fraud detection flags
- [ ] Add: Export orders to CSV/Excel
- [ ] Add: Order statistics summary bar
- [ ] Add: Bulk actions (cancel, refund)

### 5.3 — `admin/js/restaurants.js` Enhancement (145 lines → ~400 lines)
- [ ] Add: Restaurant detail page with full management
- [ ] Add: Menu management per restaurant
- [ ] Add: Commission rate adjustment
- [ ] Add: Restaurant activation/deactivation with notification
- [ ] Add: Restaurant performance metrics
- [ ] Add: Owner contact information
- [ ] Add: Settlement history per restaurant
- [ ] Add: Restaurant verification workflow
- [ ] Add: Featured/promoted restaurant management
- [ ] Add: Bulk restaurant operations

### 5.4 — `admin/js/financial.js` Enhancement (141 lines → ~400 lines)
- [ ] Add: Revenue breakdown (gross, commission, delivery fees, net)
- [ ] Add: Settlement processing workflow (calculate → review → approve → pay)
- [ ] Add: Settlement dispute resolution
- [ ] Add: Export financial reports
- [ ] Add: Tax report generation
- [ ] Add: Payment method breakdown (COD vs UPI)
- [ ] Add: Delivery fee configuration management
- [ ] Add: Coupon cost analysis
- [ ] Add: Financial forecasting (based on trends)
- [ ] Add: Per-restaurant financial drilldown

### 5.5 — `admin/js/coupons.js` Enhancement (96 lines → ~300 lines)
- [ ] Add: Coupon analytics (usage rate, revenue impact)
- [ ] Add: Coupon scheduling (active from/until)
- [ ] Add: Restaurant-specific coupons
- [ ] Add: First-order coupons
- [ ] Add: User-segment targeting
- [ ] Add: Coupon budget limits
- [ ] Add: A/B testing support
- [ ] Add: Referral coupon generation
- [ ] Add: Bulk coupon creation

### 5.6 — NEW `admin/js/users.js` (~300 lines)
- [ ] User list with search, filter, pagination
- [ ] User detail (orders, spending, addresses, activity)
- [ ] User ban/unban with reason
- [ ] User role management
- [ ] User impersonation (for debugging)
- [ ] User communications (send notification)
- [ ] Export user data
- [ ] User segments/cohorts

### 5.7 — NEW `admin/js/notifications.js` (~200 lines)
- [ ] Send push notifications to all/segment
- [ ] Notification templates
- [ ] Notification history
- [ ] A/B testing for notification copy
- [ ] Schedule notifications

### 5.8 — NEW `admin/js/reports.js` (~250 lines)
- [ ] Daily/weekly/monthly summary reports
- [ ] Restaurant performance reports
- [ ] Delivery performance reports
- [ ] Customer insights reports
- [ ] Revenue reports
- [ ] Export to PDF/CSV

### 5.9 — NEW `admin/js/settings.js` (~150 lines)
- [ ] Platform settings (name, logo, colors)
- [ ] Delivery configuration
- [ ] Payment gateway settings
- [ ] SMS gateway settings
- [ ] Area management
- [ ] Fee structure management

**Total Admin Panel Lines Added**: ~2,500

---

## PHASE 6: API BACKEND — COMPLETE ENHANCEMENT

### 6.1 — Customer API Enhancements
- [ ] `customer/restaurants.php` — Add sort, filter, pagination, cuisine filter, search
- [ ] `customer/restaurant.php` — Add reviews, photos, similar restaurants
- [ ] `customer/order.php` — Add scheduled delivery, tip, validation, payment verification
- [ ] `customer/orders.php` — Add pagination, filter, search
- [ ] `customer/addresses.php` — Add update, delete, set default, geocode validation
- [ ] `customer/review.php` — Add photo upload, delivery rating
- [ ] NEW `customer/favorites.php` — Add/remove/list favorite restaurants
- [ ] NEW `customer/notifications.php` — Get/mark-read notifications
- [ ] NEW `customer/wallet.php` — Balance, transactions, add money
- [ ] NEW `customer/referral.php` — Generate code, track referrals

### 6.2 — Restaurant API Enhancements
- [ ] `restaurant/menu.php` — Add create, update, delete items
- [ ] `restaurant/menu-item.php` — Add image upload, variants
- [ ] `restaurant/orders.php` — Add pagination, advanced filters
- [ ] `restaurant/earnings.php` — Add daily breakdown, top items, trends
- [ ] NEW `restaurant/analytics.php` — Full analytics data
- [ ] NEW `restaurant/reviews.php` enhancement — Add reply, filter
- [ ] NEW `restaurant/settings.php` — Hours, profile, preferences
- [ ] NEW `restaurant/staff.php` — Sub-user management

### 6.3 — Admin API Enhancements
- [ ] `admin/dashboard.php` — Add real-time stats, trends
- [ ] `admin/orders.php` — Add advanced filters, export
- [ ] `admin/restaurants.php` — Add metrics, bulk operations
- [ ] `admin/financial.php` — Add detailed breakdown, export
- [ ] NEW `admin/users.php` — Full user management
- [ ] NEW `admin/reports.php` — Report generation
- [ ] NEW `admin/notifications.php` — Push notification management
- [ ] NEW `admin/settings.php` — Platform configuration
- [ ] NEW `admin/activity-log.php` — Audit trail

### 6.4 — New Shared APIs
- [ ] NEW `api/config/serve-config.php` — Client config endpoint
- [ ] NEW `api/helpers/rate-limiter.php` — Redis/file-based rate limiting
- [ ] NEW `api/helpers/logger.php` — Structured logging
- [ ] NEW `api/helpers/notification.php` — Push notification sender
- [ ] NEW `api/helpers/sms.php` — SMS gateway wrapper
- [ ] NEW `api/helpers/email.php` — Email template sender
- [ ] NEW `api/helpers/geocode.php` — Server-side geocoding
- [ ] NEW `api/helpers/payment.php` — Payment gateway abstraction

**Total API Lines Added**: ~3,000

---

## PHASE 7: ACCESSIBILITY (A11Y) — FULL COMPLIANCE

### 7.1 — ARIA Labels (across all files)
- [ ] All icon-only buttons: add `aria-label`
- [ ] All modals: add `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- [ ] All nav: add `role="navigation"`, `aria-label`
- [ ] All forms: add proper `<label>` associations
- [ ] All status changes: add `aria-live="polite"` regions
- [ ] All interactive elements: add `tabindex` and keyboard handlers
- [ ] Cart quantity: `aria-label="quantity"`, `aria-valuemin`, `aria-valuemax`
- [ ] Rating stars: `role="radiogroup"`, each star `role="radio"`

### 7.2 — Keyboard Navigation (across all files)
- [ ] Tab order follows visual order
- [ ] Enter/Space activates all clickable elements
- [ ] Escape closes modals and dropdowns
- [ ] Arrow keys navigate within groups (carousel, menu tabs, stars)
- [ ] Focus trap in modals
- [ ] Skip-to-content link at top of page

### 7.3 — Screen Reader Support
- [ ] All images have descriptive alt text
- [ ] Decorative images have `alt=""`
- [ ] All status/state changes announced
- [ ] Price changes announced
- [ ] Toast notifications use `role="alert"`
- [ ] Page title updates on navigation

---

## PHASE 8: PERFORMANCE OPTIMIZATION

### 8.1 — Image Optimization
- [ ] Add responsive images with `srcset` and `sizes`
- [ ] Use WebP format with JPEG fallback
- [ ] Implement intersection observer for lazy loading
- [ ] Add blur-up placeholder technique (tiny base64 → full image)
- [ ] Preload above-the-fold images

### 8.2 — Code Optimization
- [ ] Minify all JS files for production
- [ ] Minify CSS
- [ ] Add critical CSS inline in HTML
- [ ] Defer non-critical JS
- [ ] Tree-shake unused Lucide icons
- [ ] Bundle common utilities

### 8.3 — Network Optimization
- [ ] Add API response compression (gzip/brotli)
- [ ] Implement stale-while-revalidate caching
- [ ] Preload next-screen data on hover/focus
- [ ] Bundle multiple API calls into single request where possible
- [ ] Add CDN for static assets

---

## PHASE 9: TESTING & QUALITY

### 9.1 — Error Monitoring
- [ ] Add client-side error tracking (window.onerror, unhandledrejection)
- [ ] Add API error logging with stack traces
- [ ] Add performance monitoring (Core Web Vitals)
- [ ] Add user session recording capability

### 9.2 — Data Validation
- [ ] Server-side validation on ALL endpoints
- [ ] Client-side validation on ALL forms
- [ ] API response schema validation
- [ ] SQL injection prevention audit (all endpoints)
- [ ] XSS prevention audit (all output)

---

## LINE COUNT SUMMARY

| Area | Current | Target | Lines Added |
|------|---------|--------|-------------|
| Customer JS (screens) | 1,874 | ~4,300 | ~2,400 |
| Customer JS (components) | 364 | ~860 | ~500 |
| Customer JS (core) | 381 | ~800 | ~420 |
| Customer CSS | 1,553 | ~2,400 | ~850 |
| Customer HTML + SW | 213 | ~380 | ~180 |
| Restaurant JS | 1,410 | ~3,400 | ~2,000 |
| Admin JS | 1,309 | ~3,800 | ~2,500 |
| API PHP | 3,380 | ~6,400 | ~3,000 |
| Database SQL | 350 | ~550 | ~200 |
| New Files | 0 | ~1,000 | ~1,000 |
| **TOTAL** | **11,317** | **~24,500** | **~13,050** |

---

## EXECUTION ORDER

**Week 1 — Foundation (Phases 1-2)**
1. Config system + API rewrite + App.js rewrite
2. Auth overhaul + Validation system + Security headers
3. Database schema additions
4. Service worker upgrade

**Week 2 — Customer Panel (Phase 3)**
5. CSS complete enhancement (dark mode, skeletons, a11y)
6. Home screen rewrite
7. Restaurant screen rewrite
8. Cart screen major enhancement
9. Tracking screen enhancement
10. Search, Orders, Profile, Support screens

**Week 3 — Business Panels (Phases 4-5)**
11. Restaurant orders + menu enhancements
12. Restaurant analytics + earnings + settings
13. Admin dashboard + orders + restaurants
14. Admin financial + coupons + users
15. Admin reports + notifications + settings

**Week 4 — Backend + Polish (Phases 6-9)**
16. Customer API enhancements
17. Restaurant + Admin API enhancements
18. Shared API infrastructure
19. Accessibility pass
20. Performance optimization + testing

---

**This plan covers 153+ identified issues, adds 13,000+ lines of production code, and transforms CORA from a demo into a real, deployable food delivery platform.**
