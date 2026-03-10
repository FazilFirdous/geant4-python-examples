<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

try {
    $user = getAuthUser('restaurant_owner');
    $db   = Database::getConnection();

    // Get restaurant owned by this user
    $stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? AND is_active = 1 LIMIT 1");
    $stmt->execute([$user['id']]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);

    $restaurantId = $restaurant['id'];
    $status       = $_GET['status'] ?? '';

    $validStatuses = ['placed','accepted','preparing','ready','picked_up','on_the_way','delivered','cancelled','delivery_issue'];
    $conditions    = ["o.restaurant_id = ?"];
    $params        = [$restaurantId];

    if ($status && validEnum($status, $validStatuses)) {
        $conditions[] = "o.status = ?";
        $params[]     = $status;
    } else {
        // Default: active orders
        $conditions[] = "o.status NOT IN ('delivered','cancelled')";
    }

    $where = implode(' AND ', $conditions);

    $stmt = $db->prepare("
        SELECT o.id, o.order_number, o.status, o.delivery_status, o.order_type,
               o.payment_method, o.payment_status, o.total_amount, o.subtotal,
               o.placed_at, o.accepted_at, o.preparing_at, o.ready_at,
               o.special_instructions, o.estimated_prep_minutes,
               u.name AS customer_name, u.phone AS customer_phone,
               a.full_address AS delivery_address, a.landmark, a.area AS delivery_area,
               db.name AS delivery_boy_name, db.phone AS delivery_boy_phone
        FROM orders o
        JOIN users u ON u.id = o.customer_id
        LEFT JOIN addresses a ON a.id = o.address_id
        LEFT JOIN delivery_boys db ON db.id = o.delivery_boy_id
        WHERE $where
        ORDER BY o.placed_at DESC
        LIMIT 100
    ");
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

    foreach ($orders as &$order) {
        $stmt2 = $db->prepare("SELECT item_name, quantity, item_price, special_notes FROM order_items WHERE order_id = ?");
        $stmt2->execute([$order['id']]);
        $order['items'] = $stmt2->fetchAll();
    }

    success($orders, 'Orders retrieved');

} catch (PDOException $e) {
    error_log("Restaurant orders error: " . $e->getMessage());
    error('Failed to load orders', 500);
}
