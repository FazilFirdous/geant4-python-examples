<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

try {
    $user = getAuthUser('customer');
    $db   = Database::getConnection();

    $stmt = $db->prepare("
        SELECT o.id, o.order_number, o.status, o.order_type, o.payment_method, o.payment_status,
               o.total_amount, o.placed_at, o.delivered_at, o.cancelled_at,
               r.name AS restaurant_name, r.cover_image AS restaurant_image
        FROM orders o
        JOIN restaurants r ON r.id = o.restaurant_id
        WHERE o.customer_id = ?
        ORDER BY o.placed_at DESC
        LIMIT 50
    ");
    $stmt->execute([$user['id']]);
    $orders = $stmt->fetchAll();

    // Attach items to each order
    foreach ($orders as &$order) {
        $stmt = $db->prepare("SELECT item_name, quantity, item_price FROM order_items WHERE order_id = ?");
        $stmt->execute([$order['id']]);
        $order['items'] = $stmt->fetchAll();
    }

    success($orders, 'Orders retrieved');

} catch (PDOException $e) {
    error_log("Orders history error: " . $e->getMessage());
    error('Failed to load orders', 500);
}
