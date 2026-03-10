<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$user   = getAuthUser('restaurant_owner');
$db     = Database::getConnection();

$stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
$stmt->execute([$user['id']]);
$restaurant = $stmt->fetch();
if (!$restaurant) error('Restaurant not found', 404);

try {
    if ($method === 'GET') {
        // View open pool deliveries (for delivery boys to claim)
        $stmt = $db->prepare("
            SELECT pdp.*, r.name AS restaurant_name, o.total_amount
            FROM public_delivery_pool pdp
            JOIN restaurants r ON r.id = pdp.restaurant_id
            JOIN orders o ON o.id = pdp.order_id
            WHERE pdp.status = 'open' AND (pdp.expires_at IS NULL OR pdp.expires_at > NOW())
            ORDER BY pdp.created_at DESC
        ");
        $stmt->execute();
        success($stmt->fetchAll(), 'Public pool orders retrieved');

    } elseif ($method === 'POST') {
        $input   = getJsonInput();
        $orderId = sanitizeInt($input['order_id'] ?? 0, 1);
        $pay     = sanitizeFloat($input['offered_pay'] ?? 40.00);
        if (!$orderId) error('Order ID required', 422);

        // Verify order belongs to restaurant
        $stmt = $db->prepare("SELECT o.*, a.full_address AS del_address, r.full_address AS pick_address
            FROM orders o
            LEFT JOIN addresses a ON a.id = o.address_id
            JOIN restaurants r ON r.id = o.restaurant_id
            WHERE o.id = ? AND o.restaurant_id = ?");
        $stmt->execute([$orderId, $restaurant['id']]);
        $order = $stmt->fetch();
        if (!$order) error('Order not found', 404);

        $expires = date('Y-m-d H:i:s', time() + 900); // 15 minutes

        $stmt = $db->prepare("
            INSERT INTO public_delivery_pool (order_id, restaurant_id, pickup_address, delivery_address, offered_pay, expires_at)
            VALUES (?,?,?,?,?,?)
            ON DUPLICATE KEY UPDATE status='open', expires_at=?, offered_pay=?
        ");
        $stmt->execute([
            $orderId, $restaurant['id'],
            $order['pick_address'] ?? 'Restaurant Address',
            $order['del_address'] ?? 'Customer Address',
            $pay, $expires, $expires, $pay
        ]);

        // Update order delivery status
        $db->prepare("UPDATE orders SET delivery_status='public_pool' WHERE id=?")->execute([$orderId]);

        success(null, 'Order posted to public delivery pool');

    } else {
        error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Public pool error: " . $e->getMessage());
    error('Failed to process pool request', 500);
}
