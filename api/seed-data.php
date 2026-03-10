<?php
/**
 * CORA Seed Data
 * Visit this URL in a browser to insert sample restaurants, menu items, and users.
 * Safe to run multiple times — uses INSERT IGNORE / ON DUPLICATE KEY UPDATE.
 */
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/helpers/response.php';

setCorsHeaders();

try {
    $db = Database::getConnection();

    $log = [];

    // ── 1. Ensure delivery_config exists ──────────────────────
    $db->exec("INSERT IGNORE INTO delivery_config (id, base_fee, per_km_fee, free_above) VALUES (1, 30, 5, 300)");
    $log[] = 'delivery_config: ensured';

    // ── 2. Admin user ─────────────────────────────────────────
    $stmt = $db->prepare("
        INSERT INTO users (phone, name, role, is_active)
        VALUES ('+919999900003', 'Fazil Admin', 'admin', 1)
        ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role)
    ");
    $stmt->execute();
    $log[] = 'admin user: seeded';

    // ── 3. Restaurants ────────────────────────────────────────
    $restaurants = [
        [
            'name'             => 'Kashmir Wazwan House',
            'description'      => 'Authentic Kashmiri Wazwan cuisine from the heart of the valley',
            'cuisine_tags'     => 'Kashmiri, Wazwan, Traditional',
            'area'             => 'Kulgam Town',
            'full_address'     => 'Main Market, Kulgam Town, J&K',
            'rating'           => 4.7,
            'total_reviews'    => 142,
            'min_order_amount' => 150,
            'avg_prep_time'    => 30,
            'commission'       => 12,
            'is_promoted'      => 1,
            'is_open'          => 1,
            'upi_id'           => 'wazwanhouse@upi',
            'phone'            => '+919999900002',
        ],
        [
            'name'             => 'Royal Bakery & Café',
            'description'      => 'Fresh baked goods, cakes, pastries and great coffee',
            'cuisine_tags'     => 'Bakery, Cakes, Pastries, Coffee',
            'area'             => 'Kulgam Town',
            'full_address'     => 'Station Road, Kulgam Town, J&K',
            'rating'           => 4.5,
            'total_reviews'    => 89,
            'min_order_amount' => 100,
            'avg_prep_time'    => 15,
            'commission'       => 12,
            'is_promoted'      => 0,
            'is_open'          => 1,
            'upi_id'           => 'royalbakery@upi',
            'phone'            => '+919999900010',
        ],
        [
            'name'             => 'Al-Kareem Fast Food',
            'description'      => 'Best burgers, shawarmas and rolls in Kulgam',
            'cuisine_tags'     => 'Burgers, Shawarma, Rolls, Fries',
            'area'             => 'Kulgam Town',
            'full_address'     => 'Bypass Road, Kulgam Town, J&K',
            'rating'           => 4.3,
            'total_reviews'    => 67,
            'min_order_amount' => 120,
            'avg_prep_time'    => 20,
            'commission'       => 12,
            'is_promoted'      => 0,
            'is_open'          => 1,
            'upi_id'           => 'alkareem@upi',
            'phone'            => '+919999900011',
        ],
        [
            'name'             => 'Chai Shai Corner',
            'description'      => 'Traditional Kashmiri Noon Chai and light snacks',
            'cuisine_tags'     => 'Tea, Chai, Snacks, Sandwiches',
            'area'             => 'Kulgam Town',
            'full_address'     => 'Near Bus Stand, Kulgam Town, J&K',
            'rating'           => 4.1,
            'total_reviews'    => 34,
            'min_order_amount' => 50,
            'avg_prep_time'    => 10,
            'commission'       => 10,
            'is_promoted'      => 0,
            'is_open'          => 0,
            'opens_at'         => '08:00:00',
            'upi_id'           => 'chaishai@upi',
            'phone'            => '+919999900012',
        ],
    ];

    $restaurantIds = [];
    foreach ($restaurants as $r) {
        $stmt = $db->prepare("
            INSERT INTO restaurants
                (name, description, cuisine_tags, area, full_address, rating, total_reviews,
                 min_order_amount, avg_prep_time_minutes, commission_percent,
                 is_promoted, is_open, opens_at, upi_id, phone, is_active, accepts_delivery, accepts_pickup)
            VALUES
                (?, ?, ?, ?, ?, ?, ?,
                 ?, ?, ?,
                 ?, ?, ?, ?, ?, 1, 1, 1)
            ON DUPLICATE KEY UPDATE
                rating           = VALUES(rating),
                total_reviews    = VALUES(total_reviews),
                is_open          = VALUES(is_open),
                is_promoted      = VALUES(is_promoted)
        ");
        $stmt->execute([
            $r['name'], $r['description'], $r['cuisine_tags'], $r['area'], $r['full_address'],
            $r['rating'], $r['total_reviews'],
            $r['min_order_amount'], $r['avg_prep_time'], $r['commission'],
            $r['is_promoted'], $r['is_open'],
            $r['opens_at'] ?? '09:00:00',
            $r['upi_id'], $r['phone'],
        ]);

        // Get ID (whether inserted or existing)
        $idStmt = $db->prepare("SELECT id FROM restaurants WHERE name = ? LIMIT 1");
        $idStmt->execute([$r['name']]);
        $restaurantIds[$r['name']] = $idStmt->fetchColumn();
    }
    $log[] = 'restaurants: ' . count($restaurantIds) . ' seeded';

    // ── 4. Restaurant owner user ──────────────────────────────
    $r1Id = $restaurantIds['Kashmir Wazwan House'] ?? null;
    if ($r1Id) {
        $stmt = $db->prepare("
            INSERT INTO users (phone, name, role, restaurant_id, is_active)
            VALUES ('+919999900002', 'Wazwan House Owner', 'restaurant_owner', ?, 1)
            ON DUPLICATE KEY UPDATE restaurant_id = VALUES(restaurant_id), role = VALUES(role)
        ");
        $stmt->execute([$r1Id]);
        $log[] = 'restaurant owner: seeded';
    }

    // ── 5. Menu items ─────────────────────────────────────────
    $menuItems = [
        // Kashmir Wazwan House
        'Kashmir Wazwan House' => [
            ['Rogan Josh',        'Tender mutton in aromatic Kashmiri spices', 320, 0, 1],
            ['Gushtaba',          'Minced mutton balls in creamy yogurt gravy', 350, 0, 1],
            ['Dum Aloo',          'Baby potatoes in spiced Kashmiri gravy', 180, 1, 1],
            ['Kashmiri Naan',     'Traditional Kashmiri bread', 60, 1, 0],
            ['Tabak Maaz',        'Crispy fried ribs — Wazwan classic', 280, 0, 1],
            ['Noon Chai',         'Traditional pink salt tea', 40, 1, 0],
            ['Haak Saag',         'Kashmiri greens cooked in mustard oil', 150, 1, 0],
            ['Phirni',            'Rice pudding topped with saffron & pistachios', 80, 1, 0],
        ],
        // Royal Bakery & Café
        'Royal Bakery & Café' => [
            ['Chocolate Cake Slice', 'Rich dark chocolate layer cake', 120, 1, 1],
            ['Chicken Patty',        'Flaky pastry with spiced chicken filling', 60, 0, 0],
            ['Veg Sandwich',         'Toasted sandwich with fresh veggies & chutney', 80, 1, 0],
            ['Coffee',               'Freshly brewed hot coffee', 50, 1, 0],
            ['Kashmiri Cookies',     'Traditional dry fruit & cardamom cookies', 40, 1, 1],
        ],
        // Al-Kareem Fast Food
        'Al-Kareem Fast Food' => [
            ['Chicken Burger',   'Crispy chicken patty with lettuce & mayo', 150, 0, 1],
            ['Shawarma Roll',    'Classic chicken shawarma with garlic sauce', 120, 0, 1],
            ['Fries',            'Crispy golden fries with dipping sauce', 80, 1, 0],
            ['Cold Drink',       'Chilled soft drink — 500ml', 40, 1, 0],
        ],
        // Chai Shai Corner
        'Chai Shai Corner' => [
            ['Noon Chai',       'Traditional Kashmiri pink salt tea', 30, 1, 1],
            ['Samosa',          'Crispy fried samosa with mint chutney', 20, 1, 0],
            ['Bread Omelette',  'Egg omelette on buttered bread', 50, 0, 0],
        ],
    ];

    $menuCount = 0;
    foreach ($menuItems as $restName => $items) {
        $restId = $restaurantIds[$restName] ?? null;
        if (!$restId) continue;
        foreach ($items as [$name, $desc, $price, $isVeg, $isPopular]) {
            $stmt = $db->prepare("
                INSERT INTO menu_items (restaurant_id, name, description, price, is_veg, is_popular, is_available, category)
                VALUES (?, ?, ?, ?, ?, ?, 1, 'Main')
                ON DUPLICATE KEY UPDATE price = VALUES(price), is_popular = VALUES(is_popular)
            ");
            $stmt->execute([$restId, $name, $desc, $price, $isVeg, $isPopular]);
            $menuCount++;
        }
    }
    $log[] = "menu items: $menuCount seeded";

    // ── 6. Sample banners ─────────────────────────────────────
    $banners = [
        ['Welcome to Cora!',        'Kulgam\'s first food delivery app',  'linear-gradient(135deg,#D1386C,#8C1D47)', null, 1],
        ['Authentic Wazwan',        'Order now from Kashmir Wazwan House', 'linear-gradient(135deg,#8C1D47,#C42B5A)', null, 2],
        ['Fresh Bakery Every Day',  'Royal Bakery — baked fresh each morning', 'linear-gradient(135deg,#B22D5B,#6A1040)', null, 3],
    ];
    foreach ($banners as [$title, $subtitle, $gradient, $coupon, $sort]) {
        $stmt = $db->prepare("
            INSERT INTO promo_banners (title, subtitle, bg_gradient, coupon_code, sort_order, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
            ON DUPLICATE KEY UPDATE subtitle = VALUES(subtitle)
        ");
        $stmt->execute([$title, $subtitle, $gradient, $coupon, $sort]);
    }
    $log[] = 'banners: ' . count($banners) . ' seeded';

    echo json_encode([
        'success' => true,
        'message' => 'Seed data inserted successfully',
        'log'     => $log,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Seed failed: ' . $e->getMessage(),
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage(),
    ]);
}
