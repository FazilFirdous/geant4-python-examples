<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    error('Method not allowed', 405);
}

$id = sanitizeInt($_GET['id'] ?? 0, 1);
if (!$id) {
    error('Restaurant ID required', 422);
}

try {
    $db = Database::getConnection();

    $stmt = $db->prepare("
        SELECT
            r.id, r.name, r.description, r.cuisine_tags,
            r.cover_image, r.logo_image, r.area, r.full_address,
            r.phone, r.upi_id,
            r.rating, r.total_reviews, r.total_orders,
            r.min_order_amount, r.avg_prep_time_minutes,
            r.is_open, r.opens_at, r.closes_at,
            r.is_promoted, r.accepts_delivery, r.accepts_pickup,
            COALESCE(af.delivery_fee, dc.base_fee) AS delivery_fee
        FROM restaurants r
        LEFT JOIN area_fees af ON af.area_name = r.area
        CROSS JOIN (SELECT base_fee FROM delivery_config LIMIT 1) dc
        WHERE r.id = ? AND r.is_active = 1
    ");
    $stmt->execute([$id]);
    $restaurant = $stmt->fetch();

    if (!$restaurant) {
        error('Restaurant not found', 404);
    }

    // Get menu categories with items
    $stmt = $db->prepare("
        SELECT id, name, sort_order
        FROM menu_categories
        WHERE restaurant_id = ? AND is_active = 1
        ORDER BY sort_order ASC
    ");
    $stmt->execute([$id]);
    $categories = $stmt->fetchAll();

    // Get all menu items
    $stmt = $db->prepare("
        SELECT id, category_id, name, description, price, image_url,
               is_veg, is_popular, is_available, prep_time_minutes, sort_order
        FROM menu_items
        WHERE restaurant_id = ? AND is_available = 1
        ORDER BY category_id, sort_order ASC
    ");
    $stmt->execute([$id]);
    $items = $stmt->fetchAll();

    // Group items by category
    $itemsByCategory = [];
    $uncategorized = [];
    foreach ($items as $item) {
        if ($item['category_id']) {
            $itemsByCategory[$item['category_id']][] = $item;
        } else {
            $uncategorized[] = $item;
        }
    }

    $menu = [];
    foreach ($categories as $cat) {
        $menu[] = [
            'id'    => $cat['id'],
            'name'  => $cat['name'],
            'items' => $itemsByCategory[$cat['id']] ?? []
        ];
    }

    if ($uncategorized) {
        $menu[] = ['id' => null, 'name' => 'Other', 'items' => $uncategorized];
    }

    // Recent reviews
    $stmt = $db->prepare("
        SELECT rv.food_rating, rv.delivery_rating, rv.comment, rv.created_at,
               u.name AS customer_name
        FROM reviews rv
        JOIN users u ON u.id = rv.customer_id
        WHERE rv.restaurant_id = ?
        ORDER BY rv.created_at DESC
        LIMIT 5
    ");
    $stmt->execute([$id]);
    $reviews = $stmt->fetchAll();

    success([
        'restaurant' => $restaurant,
        'menu'       => $menu,
        'reviews'    => $reviews
    ], 'Restaurant loaded');

} catch (PDOException $e) {
    error_log("Restaurant detail error: " . $e->getMessage());
    error('Failed to load restaurant', 500);
}
