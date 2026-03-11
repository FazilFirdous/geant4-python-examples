<?php
/**
 * CORA Seed Data — Complete
 * Inserts 8 restaurants with 100+ menu items, 10 users, 5 delivery boys,
 * 8 promo banners, and 4 coupons.
 * Safe to run multiple times — uses INSERT IGNORE / ON DUPLICATE KEY UPDATE.
 */
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/helpers/response.php';

setCorsHeaders();

try {
    $db = Database::getConnection();
    $log = [];

    // ── 1. Delivery config ──────────────────────────────────────
    $db->exec("INSERT IGNORE INTO delivery_config (id, fee_type, base_fee, free_delivery_above) VALUES (1, 'per_area', 25.00, 500.00)");
    $log[] = 'delivery_config: ensured';

    // ── 2. Area fees ────────────────────────────────────────────
    $areas = [
        ['Kulgam Town', 25], ['Qaimoh', 35], ['Yaripora', 40],
        ['DH Pora', 45], ['Devsar', 50], ['Frisal', 40],
        ['Nandimarg', 45], ['Pahloo', 50],
    ];
    foreach ($areas as [$area, $fee]) {
        $db->prepare("INSERT IGNORE INTO area_fees (area_name, delivery_fee) VALUES (?, ?)")->execute([$area, $fee]);
    }
    $log[] = 'area_fees: ' . count($areas) . ' areas';

    // ── 3. Users (10 accounts) ──────────────────────────────────
    $users = [
        ['+919999900001', 'Fazil Admin',        'admin'],
        ['+919999900002', 'Wazwan House Owner',  'restaurant_owner'],
        ['+919999900003', 'Bakery Owner',        'restaurant_owner'],
        ['+919999900004', 'FastFood Owner',      'restaurant_owner'],
        ['+919999900005', 'Chai Corner Owner',   'restaurant_owner'],
        ['+919876543210', 'Aamir Customer',      'customer'],
        ['+919876543211', 'Sara Customer',       'customer'],
        ['+919876543212', 'Rayees Customer',     'customer'],
        ['+919876543213', 'Mehak Customer',      'customer'],
        ['+919876543214', 'Faizan Customer',     'customer'],
    ];
    foreach ($users as [$phone, $name, $role]) {
        $db->prepare("
            INSERT INTO users (phone, name, role, is_active) VALUES (?, ?, ?, 1)
            ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role)
        ")->execute([$phone, $name, $role]);
    }
    $log[] = 'users: ' . count($users) . ' seeded';

    // ── 4. Restaurants (8) ──────────────────────────────────────
    $restaurants = [
        [
            'name' => 'Kashmir Wazwan House',
            'description' => 'Authentic Kashmiri Wazwan cuisine from the heart of the valley. Specializing in traditional multi-course feasts.',
            'cuisine_tags' => 'Kashmiri, Wazwan, Traditional, Non-Veg',
            'area' => 'Kulgam Town', 'full_address' => 'Main Market, Kulgam Town, J&K',
            'phone' => '+919999900002', 'rating' => 4.7, 'total_reviews' => 142, 'total_orders' => 1850,
            'min_order_amount' => 150, 'avg_prep_time' => 30, 'commission' => 12,
            'is_promoted' => 1, 'is_open' => 1, 'upi_id' => 'wazwanhouse@upi',
            'cover_image' => 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600',
        ],
        [
            'name' => 'Royal Bakery & Café',
            'description' => 'Fresh baked goods, cakes, pastries and great coffee every morning.',
            'cuisine_tags' => 'Bakery, Cakes, Pastries, Coffee, Desserts',
            'area' => 'Kulgam Town', 'full_address' => 'Station Road, Kulgam Town, J&K',
            'phone' => '+919999900003', 'rating' => 4.5, 'total_reviews' => 89, 'total_orders' => 1200,
            'min_order_amount' => 100, 'avg_prep_time' => 15, 'commission' => 12,
            'is_promoted' => 0, 'is_open' => 1, 'upi_id' => 'royalbakery@upi',
            'cover_image' => 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600',
        ],
        [
            'name' => 'Al-Kareem Fast Food',
            'description' => 'Best burgers, shawarmas and rolls in Kulgam. Quick bites, big flavors.',
            'cuisine_tags' => 'Burgers, Shawarma, Rolls, Fries, Fast Food',
            'area' => 'Kulgam Town', 'full_address' => 'Bypass Road, Kulgam Town, J&K',
            'phone' => '+919999900004', 'rating' => 4.3, 'total_reviews' => 67, 'total_orders' => 980,
            'min_order_amount' => 120, 'avg_prep_time' => 20, 'commission' => 12,
            'is_promoted' => 0, 'is_open' => 1, 'upi_id' => 'alkareem@upi',
            'cover_image' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
        ],
        [
            'name' => 'Chai Shai Corner',
            'description' => 'Traditional Kashmiri Noon Chai, kehwa, and light snacks all day.',
            'cuisine_tags' => 'Tea, Chai, Snacks, Sandwiches, Kashmiri',
            'area' => 'Kulgam Town', 'full_address' => 'Near Bus Stand, Kulgam Town, J&K',
            'phone' => '+919999900005', 'rating' => 4.1, 'total_reviews' => 34, 'total_orders' => 650,
            'min_order_amount' => 50, 'avg_prep_time' => 10, 'commission' => 10,
            'is_promoted' => 0, 'is_open' => 1, 'upi_id' => 'chaishai@upi',
            'cover_image' => 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600',
        ],
        [
            'name' => 'Mughal Darbar',
            'description' => 'Premium Mughlai & Kashmiri cuisine. Biryanis, kebabs, and royal curries.',
            'cuisine_tags' => 'Mughlai, Biryani, Kebabs, North Indian',
            'area' => 'Qaimoh', 'full_address' => 'Main Chowk, Qaimoh, Kulgam, J&K',
            'phone' => '+919999900006', 'rating' => 4.6, 'total_reviews' => 112, 'total_orders' => 1400,
            'min_order_amount' => 200, 'avg_prep_time' => 35, 'commission' => 12,
            'is_promoted' => 1, 'is_open' => 1, 'upi_id' => 'mughaldarbar@upi',
            'cover_image' => 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
        ],
        [
            'name' => 'Pizza Planet',
            'description' => 'Wood-fired pizzas, pastas, and Italian flavors right in Kulgam.',
            'cuisine_tags' => 'Pizza, Pasta, Italian, Cheesy',
            'area' => 'Kulgam Town', 'full_address' => 'College Road, Kulgam Town, J&K',
            'phone' => '+919999900007', 'rating' => 4.4, 'total_reviews' => 78, 'total_orders' => 920,
            'min_order_amount' => 150, 'avg_prep_time' => 25, 'commission' => 12,
            'is_promoted' => 0, 'is_open' => 1, 'upi_id' => 'pizzaplanet@upi',
            'cover_image' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',
        ],
        [
            'name' => 'Zaika-e-Kashmir',
            'description' => 'Home-style Kashmiri food cooked with love. Dum Aloo, Rajma, Haak and more.',
            'cuisine_tags' => 'Kashmiri, Home Style, Vegetarian, Thali',
            'area' => 'DH Pora', 'full_address' => 'Near Masjid, DH Pora, Kulgam, J&K',
            'phone' => '+919999900008', 'rating' => 4.2, 'total_reviews' => 45, 'total_orders' => 580,
            'min_order_amount' => 100, 'avg_prep_time' => 25, 'commission' => 10,
            'is_promoted' => 0, 'is_open' => 1, 'upi_id' => 'zaikakashmir@upi',
            'cover_image' => 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600',
        ],
        [
            'name' => 'Frost & Cream',
            'description' => 'Premium ice creams, shakes, sundaes & frozen desserts.',
            'cuisine_tags' => 'Ice Cream, Shakes, Desserts, Frozen',
            'area' => 'Kulgam Town', 'full_address' => 'Mall Road, Kulgam Town, J&K',
            'phone' => '+919999900009', 'rating' => 4.5, 'total_reviews' => 56, 'total_orders' => 730,
            'min_order_amount' => 80, 'avg_prep_time' => 10, 'commission' => 15,
            'is_promoted' => 0, 'is_open' => 1, 'upi_id' => 'frostcream@upi',
            'cover_image' => 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600',
        ],
    ];

    $restaurantIds = [];
    foreach ($restaurants as $r) {
        $stmt = $db->prepare("
            INSERT INTO restaurants
                (name, description, cuisine_tags, area, full_address, phone,
                 rating, total_reviews, total_orders,
                 min_order_amount, avg_prep_time_minutes, commission_percent,
                 is_promoted, is_open, upi_id, cover_image,
                 is_active, accepts_delivery, accepts_pickup)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 1)
            ON DUPLICATE KEY UPDATE
                description     = VALUES(description),
                rating          = VALUES(rating),
                total_reviews   = VALUES(total_reviews),
                total_orders    = VALUES(total_orders),
                is_open         = VALUES(is_open),
                is_promoted     = VALUES(is_promoted),
                cover_image     = VALUES(cover_image)
        ");
        $stmt->execute([
            $r['name'], $r['description'], $r['cuisine_tags'], $r['area'], $r['full_address'], $r['phone'],
            $r['rating'], $r['total_reviews'], $r['total_orders'],
            $r['min_order_amount'], $r['avg_prep_time'], $r['commission'],
            $r['is_promoted'], $r['is_open'], $r['upi_id'], $r['cover_image'],
        ]);

        $idStmt = $db->prepare("SELECT id FROM restaurants WHERE name = ? LIMIT 1");
        $idStmt->execute([$r['name']]);
        $restaurantIds[$r['name']] = $idStmt->fetchColumn();
    }
    $log[] = 'restaurants: ' . count($restaurantIds) . ' seeded';

    // Link restaurant owners
    $ownerMap = [
        'Kashmir Wazwan House' => '+919999900002',
        'Royal Bakery & Café'  => '+919999900003',
        'Al-Kareem Fast Food'  => '+919999900004',
        'Chai Shai Corner'     => '+919999900005',
    ];
    foreach ($ownerMap as $restName => $ownerPhone) {
        $restId = $restaurantIds[$restName] ?? null;
        if ($restId) {
            $ownerId = $db->prepare("SELECT id FROM users WHERE phone = ? LIMIT 1");
            $ownerId->execute([$ownerPhone]);
            $uid = $ownerId->fetchColumn();
            if ($uid) {
                $db->prepare("UPDATE restaurants SET owner_id = ? WHERE id = ?")->execute([$uid, $restId]);
            }
        }
    }
    $log[] = 'restaurant owners: linked';

    // ── 5. Menu categories & items (100+) ───────────────────────
    $menuData = [
        'Kashmir Wazwan House' => [
            'Wazwan Specials' => [
                ['Rogan Josh', 'Tender mutton in aromatic Kashmiri spices with fennel & dry ginger', 320, 0, 1, 25, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=400'],
                ['Gushtaba', 'Minced mutton balls in creamy yogurt gravy — the grand finale of Wazwan', 350, 0, 1, 30, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400'],
                ['Tabak Maaz', 'Crispy fried lamb ribs marinated in Kashmiri spices', 280, 0, 1, 20, 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400'],
                ['Yakhni', 'Mutton in aromatic yogurt-saffron curry', 300, 0, 0, 25, 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400'],
                ['Aab Gosht', 'Milk-based mutton curry with cardamom', 290, 0, 0, 25, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400'],
            ],
            'Vegetarian' => [
                ['Dum Aloo', 'Baby potatoes in spiced Kashmiri red gravy', 180, 1, 1, 20, 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400'],
                ['Haak Saag', 'Kashmiri collard greens in mustard oil', 150, 1, 0, 15, 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400'],
                ['Nadru Yakhni', 'Lotus stem in yogurt gravy', 200, 1, 0, 20, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400'],
                ['Chaman Kaliya', 'Paneer in turmeric-saffron gravy', 220, 1, 0, 20, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'],
            ],
            'Breads & Rice' => [
                ['Kashmiri Naan', 'Traditional tandoori bread', 60, 1, 0, 8, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400'],
                ['Sheermal', 'Sweet saffron-flavored bread', 70, 1, 0, 10, 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400'],
                ['Steamed Rice', 'Fragrant basmati rice', 80, 1, 0, 10, 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400'],
                ['Mutton Pulao', 'Kashmiri spiced rice with mutton pieces', 250, 0, 1, 25, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400'],
            ],
            'Desserts & Drinks' => [
                ['Phirni', 'Rice pudding with saffron, cardamom & pistachios', 80, 1, 0, 10, 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400'],
                ['Noon Chai', 'Traditional pink salt tea with cream', 40, 1, 0, 8, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'],
                ['Kehwa', 'Kashmiri green tea with saffron & almonds', 50, 1, 0, 8, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400'],
            ],
        ],
        'Royal Bakery & Café' => [
            'Cakes & Pastries' => [
                ['Chocolate Cake Slice', 'Rich dark chocolate layer cake with ganache', 120, 1, 1, 5, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'],
                ['Red Velvet Slice', 'Classic red velvet with cream cheese frosting', 130, 1, 1, 5, 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=400'],
                ['Pineapple Pastry', 'Fluffy sponge with pineapple cream', 70, 1, 0, 5, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'],
                ['Honey Cake', 'Layered honey cake with walnuts', 100, 1, 0, 5, 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400'],
                ['Brownie', 'Fudgy dark chocolate brownie', 90, 1, 0, 5, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400'],
            ],
            'Savory Bakes' => [
                ['Chicken Patty', 'Flaky pastry with spiced chicken filling', 60, 0, 1, 10, 'https://images.unsplash.com/photo-1604917877934-07d8d248d396?w=400'],
                ['Paneer Puff', 'Crispy puff pastry with paneer stuffing', 55, 1, 0, 10, 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400'],
                ['Veg Pizza Bun', 'Soft bun topped with veggies & cheese', 50, 1, 0, 10, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400'],
                ['Chicken Roll', 'Stuffed chicken bread roll', 65, 0, 0, 10, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400'],
            ],
            'Sandwiches & Wraps' => [
                ['Veg Sandwich', 'Toasted sandwich with fresh veggies & chutney', 80, 1, 0, 10, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400'],
                ['Chicken Club Sandwich', 'Triple-decker with grilled chicken', 120, 0, 0, 12, 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=400'],
                ['Paneer Wrap', 'Spiced paneer in a soft tortilla', 100, 1, 0, 10, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400'],
            ],
            'Beverages' => [
                ['Coffee', 'Freshly brewed hot coffee', 50, 1, 0, 5, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'],
                ['Cold Coffee', 'Iced coffee with cream', 70, 1, 0, 5, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'],
                ['Hot Chocolate', 'Rich Belgian hot chocolate', 80, 1, 0, 5, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400'],
                ['Fresh Juice', 'Seasonal fresh fruit juice', 60, 1, 0, 5, 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400'],
            ],
            'Cookies & Biscuits' => [
                ['Kashmiri Cookies', 'Dry fruit & cardamom cookies', 40, 1, 1, 5, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'],
                ['Choco Chip Cookies', 'Chocolate chip butter cookies (6 pcs)', 60, 1, 0, 5, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400'],
            ],
        ],
        'Al-Kareem Fast Food' => [
            'Burgers' => [
                ['Chicken Burger', 'Crispy chicken patty with lettuce & mayo', 150, 0, 1, 12, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'],
                ['Zinger Burger', 'Spicy fried chicken burger with jalapeños', 180, 0, 1, 12, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400'],
                ['Veg Burger', 'Crunchy veggie patty with cheese', 120, 1, 0, 12, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400'],
                ['Double Chicken Burger', 'Two patties, double cheese', 220, 0, 0, 15, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400'],
            ],
            'Shawarma & Rolls' => [
                ['Shawarma Roll', 'Classic chicken shawarma with garlic sauce', 120, 0, 1, 10, 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400'],
                ['Paneer Shawarma', 'Grilled paneer shawarma wrap', 110, 1, 0, 10, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400'],
                ['Chicken Tikka Roll', 'Smoky tandoori chicken in rumali roti', 130, 0, 0, 10, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400'],
            ],
            'Sides & Snacks' => [
                ['Fries', 'Crispy golden fries with dipping sauce', 80, 1, 0, 8, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400'],
                ['Loaded Fries', 'Fries with cheese sauce & jalapeños', 120, 1, 0, 10, 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400'],
                ['Chicken Nuggets', '8 pcs crispy chicken nuggets', 140, 0, 0, 10, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400'],
                ['Onion Rings', 'Crispy battered onion rings', 90, 1, 0, 8, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400'],
            ],
            'Beverages' => [
                ['Cold Drink', 'Chilled soft drink — 500ml', 40, 1, 0, 2, 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400'],
                ['Fresh Lime Soda', 'Sweet or salty lime soda', 50, 1, 0, 3, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400'],
                ['Oreo Shake', 'Thick Oreo milkshake', 100, 1, 0, 5, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400'],
            ],
        ],
        'Chai Shai Corner' => [
            'Tea & Chai' => [
                ['Noon Chai', 'Traditional Kashmiri pink salt tea', 30, 1, 1, 8, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'],
                ['Kehwa', 'Kashmiri saffron green tea', 40, 1, 0, 8, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400'],
                ['Masala Chai', 'Spiced Indian milk tea', 25, 1, 0, 5, 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400'],
                ['Sulaimani Tea', 'Black tea with lemon & honey', 35, 1, 0, 5, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400'],
            ],
            'Snacks' => [
                ['Samosa', 'Crispy fried samosa with mint chutney (2 pcs)', 30, 1, 1, 8, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'],
                ['Bread Omelette', 'Egg omelette on buttered bread', 50, 0, 0, 8, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400'],
                ['Aloo Paratha', 'Stuffed potato paratha with curd', 60, 1, 0, 10, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400'],
                ['Veg Cutlet', 'Mixed vegetable cutlet with sauce', 40, 1, 0, 8, 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400'],
                ['Egg Roll', 'Egg-wrapped roll with onion & chutney', 45, 0, 0, 8, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400'],
            ],
        ],
        'Mughal Darbar' => [
            'Biryani' => [
                ['Chicken Biryani', 'Fragrant basmati rice layered with spiced chicken', 220, 0, 1, 25, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400'],
                ['Mutton Biryani', 'Slow-cooked mutton dum biryani', 280, 0, 1, 30, 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400'],
                ['Veg Biryani', 'Mixed vegetable biryani with saffron', 180, 1, 0, 20, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400'],
                ['Egg Biryani', 'Biryani with boiled eggs & spiced rice', 190, 0, 0, 20, 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400'],
            ],
            'Kebabs' => [
                ['Seekh Kebab', 'Minced mutton kebabs grilled on skewers (4 pcs)', 200, 0, 1, 15, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400'],
                ['Chicken Tikka', 'Tandoori chicken tikka pieces (8 pcs)', 180, 0, 1, 15, 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400'],
                ['Paneer Tikka', 'Grilled paneer with bell peppers (8 pcs)', 160, 1, 0, 15, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400'],
                ['Reshmi Kebab', 'Creamy minced chicken kebabs', 190, 0, 0, 15, 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400'],
            ],
            'Curries' => [
                ['Butter Chicken', 'Tandoori chicken in rich tomato-butter gravy', 240, 0, 1, 20, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400'],
                ['Mutton Korma', 'Mutton in creamy cashew & onion gravy', 280, 0, 0, 25, 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400'],
                ['Dal Makhani', 'Creamy black lentils slow-cooked overnight', 160, 1, 0, 20, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400'],
                ['Kadhai Paneer', 'Paneer with bell peppers in spiced gravy', 200, 1, 0, 18, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'],
            ],
            'Breads' => [
                ['Garlic Naan', 'Butter garlic tandoori naan', 50, 1, 0, 8, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400'],
                ['Butter Roti', 'Soft whole wheat bread with butter', 30, 1, 0, 5, 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400'],
                ['Laccha Paratha', 'Layered flaky paratha', 45, 1, 0, 8, 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400'],
            ],
        ],
        'Pizza Planet' => [
            'Pizzas' => [
                ['Margherita', 'Classic tomato sauce, mozzarella & fresh basil', 199, 1, 1, 20, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'],
                ['Chicken Tikka Pizza', 'Tandoori chicken, onion, capsicum, mozzarella', 299, 0, 1, 22, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'],
                ['Paneer Makhani Pizza', 'Paneer, onion, tomato in makhani sauce', 279, 1, 0, 22, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'],
                ['BBQ Chicken Pizza', 'Smoky BBQ chicken with jalapeños & corn', 319, 0, 0, 22, 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400'],
                ['Veggie Supreme', 'Loaded with mushroom, olive, capsicum, onion', 259, 1, 0, 22, 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400'],
            ],
            'Pasta' => [
                ['Penne Arrabiata', 'Penne in spicy tomato sauce', 179, 1, 0, 15, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400'],
                ['Chicken Alfredo', 'Creamy white sauce pasta with chicken', 219, 0, 0, 15, 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400'],
                ['Mac & Cheese', 'Cheesy macaroni baked golden', 189, 1, 0, 15, 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=400'],
            ],
            'Sides' => [
                ['Garlic Bread', 'Toasted garlic bread with herbs (4 pcs)', 99, 1, 0, 8, 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400'],
                ['Cheesy Dip Sticks', 'Mozzarella sticks with marinara', 129, 1, 0, 10, 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400'],
                ['Chicken Wings', 'Spicy buffalo chicken wings (6 pcs)', 169, 0, 0, 12, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400'],
            ],
            'Beverages' => [
                ['Iced Tea', 'Lemon iced tea — 300ml', 60, 1, 0, 3, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'],
                ['Pepsi', 'Chilled Pepsi — 500ml', 40, 1, 0, 2, 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400'],
            ],
        ],
        'Zaika-e-Kashmir' => [
            'Kashmiri Thali' => [
                ['Veg Thali', 'Rice, dal, 2 sabzi, roti, raita & salad', 150, 1, 1, 20, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400'],
                ['Non-Veg Thali', 'Rice, mutton curry, dal, roti, raita & salad', 220, 0, 1, 25, 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400'],
            ],
            'Kashmiri Curries' => [
                ['Rajma Chawal', 'Kashmiri rajma with steamed rice', 120, 1, 1, 15, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400'],
                ['Dum Aloo Kashmiri', 'Spicy baby potato curry Kashmiri style', 140, 1, 0, 18, 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400'],
                ['Lyodur Tschaman', 'Kashmiri paneer in turmeric gravy', 160, 1, 0, 18, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'],
                ['Matar Paneer', 'Peas & paneer in tomato gravy', 150, 1, 0, 15, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400'],
            ],
            'Rice & Breads' => [
                ['Steamed Rice', 'Basmati steamed rice', 60, 1, 0, 8, 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400'],
                ['Kashmiri Pulao', 'Sweet saffron rice with dry fruits', 120, 1, 0, 15, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400'],
                ['Tandoori Roti', 'Whole wheat tandoori bread', 25, 1, 0, 5, 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400'],
            ],
            'Salads & Sides' => [
                ['Green Salad', 'Fresh cucumber, tomato & onion salad', 40, 1, 0, 5, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'],
                ['Raita', 'Cool yogurt with mint & cucumber', 30, 1, 0, 3, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'],
            ],
        ],
        'Frost & Cream' => [
            'Ice Cream Scoops' => [
                ['Vanilla Scoop', 'Classic Madagascar vanilla bean ice cream', 60, 1, 0, 3, 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=400'],
                ['Chocolate Scoop', 'Rich Belgian chocolate ice cream', 60, 1, 0, 3, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'],
                ['Strawberry Scoop', 'Fresh strawberry ice cream', 60, 1, 0, 3, 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400'],
                ['Kesar Pista', 'Saffron & pistachio ice cream — desi favorite', 80, 1, 1, 3, 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400'],
                ['Mango Scoop', 'Alphonso mango ice cream (seasonal)', 70, 1, 0, 3, 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=400'],
            ],
            'Sundaes' => [
                ['Chocolate Fudge Sundae', 'Chocolate ice cream, hot fudge, whipped cream', 150, 1, 1, 5, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'],
                ['Butterscotch Sundae', 'Butterscotch ice cream with caramel & nuts', 140, 1, 0, 5, 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=400'],
                ['Fruit Royale', 'Mixed fruit sundae with vanilla ice cream', 130, 1, 0, 5, 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400'],
            ],
            'Shakes' => [
                ['Chocolate Shake', 'Thick chocolate milkshake', 100, 1, 1, 5, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400'],
                ['Oreo Shake', 'Creamy Oreo cookie milkshake', 110, 1, 0, 5, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400'],
                ['Strawberry Shake', 'Fresh strawberry milkshake', 100, 1, 0, 5, 'https://images.unsplash.com/photo-1553787499-6f9133860278?w=400'],
                ['Mango Shake', 'Thick mango milkshake (seasonal)', 90, 1, 0, 5, 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400'],
                ['Cold Coffee Shake', 'Coffee milkshake with ice cream', 110, 1, 0, 5, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'],
            ],
            'Frozen Treats' => [
                ['Kulfi Stick', 'Traditional malai kulfi on a stick', 50, 1, 0, 2, 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400'],
                ['Ice Cream Sandwich', 'Vanilla ice cream in chocolate cookies', 70, 1, 0, 3, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'],
                ['Popsicle', 'Fruit popsicle — mango or orange', 30, 1, 0, 2, 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400'],
            ],
        ],
    ];

    $menuCount = 0;
    $catCount = 0;
    foreach ($menuData as $restName => $categories) {
        $restId = $restaurantIds[$restName] ?? null;
        if (!$restId) continue;

        $catSort = 0;
        foreach ($categories as $catName => $items) {
            $catSort++;
            // Insert category
            $db->prepare("
                INSERT INTO menu_categories (restaurant_id, name, sort_order, is_active)
                VALUES (?, ?, ?, 1)
                ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order)
            ")->execute([$restId, $catName, $catSort]);
            $catCount++;

            // Get category ID
            $catStmt = $db->prepare("SELECT id FROM menu_categories WHERE restaurant_id = ? AND name = ? LIMIT 1");
            $catStmt->execute([$restId, $catName]);
            $catId = $catStmt->fetchColumn();

            $itemSort = 0;
            foreach ($items as [$name, $desc, $price, $isVeg, $isPopular, $prepTime, $imageUrl]) {
                $itemSort++;
                $db->prepare("
                    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_veg, is_popular, is_available, prep_time_minutes, sort_order, image_url)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        price      = VALUES(price),
                        is_popular = VALUES(is_popular),
                        category_id = VALUES(category_id),
                        description = VALUES(description),
                        image_url  = VALUES(image_url)
                ")->execute([$restId, $catId, $name, $desc, $price, $isVeg, $isPopular, $prepTime, $itemSort, $imageUrl]);
                $menuCount++;
            }
        }
    }
    $log[] = "menu_categories: $catCount seeded";
    $log[] = "menu_items: $menuCount seeded";

    // ── 6. Delivery boys (5) ────────────────────────────────────
    $deliveryUsers = [
        ['+919000000001', 'Shabir Rider',  'bike',    'JK-01-AB-1234'],
        ['+919000000002', 'Tariq Rider',   'scooter', 'JK-01-CD-5678'],
        ['+919000000003', 'Bilal Rider',   'bike',    'JK-01-EF-9012'],
        ['+919000000004', 'Zahoor Rider',  'bicycle', null],
        ['+919000000005', 'Mudasir Rider', 'bike',    'JK-01-GH-3456'],
    ];
    foreach ($deliveryUsers as [$phone, $name, $vehicle, $vNumber]) {
        // Create user
        $db->prepare("
            INSERT INTO users (phone, name, role, is_active) VALUES (?, ?, 'delivery_boy', 1)
            ON DUPLICATE KEY UPDATE name = VALUES(name), role = 'delivery_boy'
        ")->execute([$phone, $name]);

        $uid = $db->prepare("SELECT id FROM users WHERE phone = ? LIMIT 1");
        $uid->execute([$phone]);
        $userId = $uid->fetchColumn();

        if ($userId) {
            $db->prepare("
                INSERT INTO delivery_boys (user_id, name, phone, vehicle_type, vehicle_number, is_available, is_active)
                VALUES (?, ?, ?, ?, ?, 1, 1)
                ON DUPLICATE KEY UPDATE vehicle_type = VALUES(vehicle_type), vehicle_number = VALUES(vehicle_number)
            ")->execute([$userId, $name, $phone, $vehicle, $vNumber]);
        }
    }
    $log[] = 'delivery_boys: ' . count($deliveryUsers) . ' seeded';

    // ── 7. Addresses for demo customers ─────────────────────────
    $demoAddresses = [
        ['+919876543210', 'Home', 'House 14, Lane 3, Main Market', 'Near Jamia Masjid', 'Kulgam Town'],
        ['+919876543210', 'Office', 'DC Office Complex, Room 12', 'Government Building', 'Kulgam Town'],
        ['+919876543211', 'Home', 'Street 2, Qaimoh Main Road', 'Near Post Office', 'Qaimoh'],
        ['+919876543212', 'Home', 'Village Yaripora, Near School', null, 'Yaripora'],
    ];
    foreach ($demoAddresses as [$phone, $label, $address, $landmark, $area]) {
        $uid = $db->prepare("SELECT id FROM users WHERE phone = ? LIMIT 1");
        $uid->execute([$phone]);
        $userId = $uid->fetchColumn();
        if ($userId) {
            $db->prepare("
                INSERT IGNORE INTO addresses (user_id, label, full_address, landmark, area, is_default)
                VALUES (?, ?, ?, ?, ?, 1)
            ")->execute([$userId, $label, $address, $landmark, $area]);
        }
    }
    $log[] = 'addresses: ' . count($demoAddresses) . ' seeded';

    // ── 8. Promo banners (8) ────────────────────────────────────
    $db->exec("DELETE FROM promo_banners"); // Clear old banners
    $banners = [
        ['50% OFF First Order', 'Use code KULGAM50 — max ₹150 off', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', 'KULGAM50', 'linear-gradient(135deg, #D1386C, #8C1D47)', 1],
        ['Free Delivery', 'On orders above ₹499 — no code needed', 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600', null, 'linear-gradient(135deg, #1DB954, #0D7A3A)', 2],
        ['Wazwan Festival', 'Flat ₹100 off on Wazwan dishes — WAZWAN100', 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600', 'WAZWAN100', 'linear-gradient(135deg, #4A00E0, #8E2DE2)', 3],
        ['New: Mughal Darbar', 'Premium Mughlai cuisine now on CORA', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600', null, 'linear-gradient(135deg, #FF6B35, #D63384)', 4],
        ['Pizza Planet Launch', 'Wood-fired pizzas — 20% OFF this week', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', 'PIZZA20', 'linear-gradient(135deg, #E65100, #FF9800)', 5],
        ['Summer Shakes', 'Cool down with Frost & Cream shakes', 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600', null, 'linear-gradient(135deg, #00BCD4, #009688)', 6],
        ['Weekend Special', 'Get 15% off on weekends — WEEKEND15', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', 'WEEKEND15', 'linear-gradient(135deg, #7B1FA2, #E040FB)', 7],
        ['Refer & Earn', 'Invite friends, both get ₹50 off', 'https://images.unsplash.com/photo-1543353071-087092ec169a?w=600', null, 'linear-gradient(135deg, #1565C0, #42A5F5)', 8],
    ];
    foreach ($banners as [$title, $subtitle, $image, $coupon, $gradient, $sort]) {
        $db->prepare("
            INSERT INTO promo_banners (title, subtitle, image_url, coupon_code, bg_gradient, sort_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, 1)
        ")->execute([$title, $subtitle, $image, $coupon, $gradient, $sort]);
    }
    $log[] = 'banners: ' . count($banners) . ' seeded';

    // ── 9. Coupons (4) ──────────────────────────────────────────
    $db->exec("DELETE FROM coupon_usage"); // Clear usage before coupons
    $db->exec("DELETE FROM coupons");      // Clear old coupons
    $coupons = [
        ['KULGAM50', 'percentage', 50, 150, 199, 1000, 1],
        ['WAZWAN100', 'flat', 100, null, 300, 500, 2],
        ['PIZZA20', 'percentage', 20, 100, 199, 200, 1],
        ['WEEKEND15', 'percentage', 15, 75, 149, 500, 3],
    ];
    foreach ($coupons as [$code, $type, $value, $maxDisc, $minOrder, $limit, $perUser]) {
        $db->prepare("
            INSERT INTO coupons (code, discount_type, discount_value, max_discount, min_order_amount, usage_limit, per_user_limit, valid_from, valid_until, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 6 MONTH), 1)
        ")->execute([$code, $type, $value, $maxDisc, $minOrder, $limit, $perUser]);
    }
    $log[] = 'coupons: ' . count($coupons) . ' seeded';

    // ── Response ────────────────────────────────────────────────
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
