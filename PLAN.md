# CORA Complete App Plan

## Phase 1: Fix Food Images (Menu Items)
**Problem**: Unsplash URLs are generic/mismatched — a biryani photo shows up for naan, etc.
**Fix**: Use specific, accurately-matched food image URLs for each menu item. Replace every single URL in `api/seed-data.php` with correct food-specific images. Use free image sources like Unsplash/Pexels with descriptive search terms matching the actual dish name.

**Files**: `api/seed-data.php`

---

## Phase 2: Order Success Animation (Berry-themed, Professional)
**Problem**: Current animation is basic — user wants a premium glowing berry-themed celebration.
**Fix**: Completely redesign the order success screen in `cart.js`:
- Animated berry-gradient circle with SVG stroke-draw animation
- Inner checkmark with glow effect using box-shadow in berry colors
- 50+ confetti particles in brand colors with varied sizes and rotation
- Pulsing ring effect with berry gradient
- Smooth fade-in for order details card
- Add subtle haptic feedback (navigator.vibrate)
- Berry-colored particle burst effect radiating from center
- Smooth card slide-up with staggered delay for each info line

**Files**: `customer/js/screens/cart.js`, `customer/css/app.css`

---

## Phase 3: UPI Payment Flow Fix
**Problem**: Payment happens AFTER order placement or fails silently. Promise can hang if modal closed.
**Fix**:
1. UPI modal shows BEFORE order is placed (already partially done, but buggy)
2. Add 5-minute timeout on payment confirmation promise
3. Add "Cancel Payment" button that properly rejects promise
4. Show UPI ID and amount clearly in modal
5. After user clicks "I've Completed Payment" → validate → THEN place order
6. Add payment status indicator on order success screen
7. Handle edge case: modal backdrop click should NOT close (prevent accidental dismiss)
8. Add retry mechanism if UPI app fails to open

**Files**: `customer/js/screens/cart.js`

---

## Phase 4: Geolocation & Address Auto-detect
**Problem**: Address detection needs improvement — area matching is fragile.
**Fix**:
1. Use navigator.geolocation with high accuracy
2. Reverse geocode via Nominatim with proper error handling and fallback
3. Auto-fill address form fields (street, area, landmark)
4. Show detected location on a mini Leaflet map with draggable pin
5. Add "Use Current Location" button with loading state
6. Match detected area to Kulgam delivery zones with fuzzy matching
7. Cache last known location in localStorage

**Files**: `customer/js/screens/cart.js`, `customer/js/screens/profile.js`

---

## Phase 5: Rider Tracking Map
**Problem**: Map shows simulated position, needs better UX.
**Fix**:
1. Show Leaflet map when order status is `picked_up` or `on_the_way`
2. Restaurant marker (berry-colored) and customer marker (green)
3. Animated rider marker with smooth position transitions
4. Simulated route animation between restaurant and customer
5. ETA display based on simulated progress
6. Auto-center map to show all markers
7. Add rider info card overlay on map (name, phone, vehicle)
8. Polyline showing estimated route

**Files**: `customer/js/screens/tracking.js`, `customer/css/app.css`

---

## Phase 6: Remaining Emoji Cleanup & Icon Consistency
**Problem**: Some screens still use text arrows (←, ✕, ▼) instead of Lucide icons.
**Fix**:
- Replace `←` back buttons with `<i data-lucide="arrow-left">` in search.js, support.js
- Replace `✕` close button with `<i data-lucide="x">`
- Replace `▼` dropdown arrow with `<i data-lucide="chevron-down">`
- Replace `🇮🇳` flag in login with SVG Indian flag or text "+91"
- Ensure `lucide.createIcons()` is called after every screen render

**Files**: `customer/js/screens/search.js`, `customer/js/screens/support.js`, `customer/js/screens/home.js`, `customer/index.html`, `customer/js/app.js`

---

## Phase 7: Restaurant Panel Enhancements
**Problem**: Restaurant dashboard needs more features for real use.
**Fix**:
1. **Analytics tab**: Daily/weekly/monthly order charts, revenue breakdown, popular items
2. **Menu management**: Edit existing items (not just add/delete), reorder categories, bulk toggle availability
3. **Order sound alert**: Audio notification for new orders (using Web Audio API)
4. **Prep time estimation**: Auto-suggest prep time based on order size
5. **Quick actions**: One-tap "Mark all ready", "Close shop", "Open shop"
6. **Revenue card**: Today's earnings, pending settlements, commission deducted
7. **Order history**: Searchable/filterable past orders with export

**Files**: `restaurant/js/orders.js`, `restaurant/js/menu.js`, `restaurant/js/app.js`, new `restaurant/js/analytics.js`

---

## Phase 8: Admin Panel Enhancements
**Problem**: Admin needs more control and visibility.
**Fix**:
1. **User management**: View/edit/deactivate users, see order history per user
2. **Delivery boy management**: Add/remove riders, view performance stats
3. **Coupon management**: Create/edit/delete coupons with usage analytics
4. **Settlement processing**: Mark settlements as paid, generate reports
5. **Area/zone management**: Add/edit delivery areas and fees
6. **System stats dashboard**: Real-time order count, active users, revenue charts
7. **Notification center**: Send push notifications to users/restaurants
8. **Export functionality**: CSV/PDF export for financial reports and orders

**Files**: `admin/js/dashboard.js`, `admin/js/orders.js`, `admin/js/restaurants.js`, new `admin/js/users.js`, `admin/js/financial.js`, `admin/js/coupons.js`

---

## Phase 9: Security Fixes
**Problem**: Several XSS and injection vulnerabilities.
**Fix**:
1. Replace `innerHTML` with `textContent` for user-generated content (coupon messages, order notes)
2. Sanitize all API response data before DOM insertion
3. Fix address selector XSS vulnerability in cart.js
4. Add CSRF token to API calls
5. Validate all form inputs client-side before submission
6. Escape special characters in dynamically generated HTML

**Files**: `customer/js/screens/cart.js`, `customer/js/api.js`

---

## Phase 10: PWA & Offline Enhancements
**Problem**: Service worker is basic, offline experience is poor.
**Fix**:
1. Cache restaurant data and menu for offline browsing
2. Show cached data with "Offline" banner when network unavailable
3. Queue orders placed offline and submit when back online
4. Add install prompt for PWA (beforeinstallprompt)
5. Bump service worker cache version
6. Add proper app manifest icons

**Files**: `customer/sw.js`, `customer/js/app.js`, `customer/manifest.json`

---

## Phase 11: UI/UX Polish
**Problem**: Several small UI issues that make the app feel incomplete.
**Fix**:
1. Add pull-to-refresh on home screen
2. Add skeleton loading states for all data fetches
3. Smooth page transitions between screens
4. Add haptic feedback on button presses (navigator.vibrate)
5. Improve toast notifications with slide-in animation
6. Add empty state illustrations (SVG) for all empty screens
7. Fix all `lucide.createIcons()` calls to run after dynamic content insertion
8. Add scroll-to-top on screen navigation
9. Add image lazy loading with blur-up placeholder
10. Consistent border-radius, shadows, and spacing across all cards

**Files**: `customer/css/app.css`, `customer/js/app.js`, various screen files

---

## Phase 12: Final Testing & Commit
1. Verify all screens render without errors
2. Test complete order flow: browse → add to cart → checkout → UPI → success → track
3. Test restaurant panel: receive order → accept → prepare → ready → assign rider
4. Test admin panel: view dashboard → manage restaurants → view orders
5. Verify no remaining emojis in any file
6. Commit and push all changes

---

## Execution Order
Phases 1-6 are **critical** (user's main complaints).
Phases 7-8 add **professional features**.
Phases 9-11 add **polish and security**.
Phase 12 is **final verification**.
