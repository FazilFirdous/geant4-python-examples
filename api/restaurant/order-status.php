<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') error('Method not allowed', 405);

try {
    $user  = getAuthUser('restaurant_owner');
    $input = getJsonInput();

    required($input, ['order_id', 'status']);

    $orderId = sanitizeInt($input['order_id'] ?? 0, 1);
    $status  = sanitizeString($input['status'] ?? '', 30);
    $note    = sanitizeString($input['note'] ?? '', 500);
    $deliveryBoyId = sanitizeInt($input['delivery_boy_id'] ?? 0);

    $validStatuses = ['accepted','preparing','ready','picked_up','on_the_way','delivered','cancelled','delivery_issue'];
    if (!validEnum($status, $validStatuses)) error('Invalid status', 422);

    $db = Database::getConnection();

    $stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);

    $stmt = $db->prepare("SELECT * FROM orders WHERE id = ? AND restaurant_id = ?");
    $stmt->execute([$orderId, $restaurant['id']]);
    $order = $stmt->fetch();
    if (!$order) error('Order not found', 404);

    $updates    = ["status = ?", "restaurant_note = ?"];
    $params     = [$status, $note ?: null];

    $timestamps = [
        'accepted'       => 'accepted_at',
        'preparing'      => 'preparing_at',
        'ready'          => 'ready_at',
        'picked_up'      => 'picked_up_at',
        'delivered'      => 'delivered_at',
        'cancelled'      => 'cancelled_at',
    ];

    if (isset($timestamps[$status])) {
        $updates[] = $timestamps[$status] . " = NOW()";
    }

    if ($status === 'cancelled') {
        $updates[] = "cancel_reason = ?";
        $updates[] = "cancelled_by = 'restaurant'";
        $params[]  = $note ?: 'Cancelled by restaurant';
    }

    if ($deliveryBoyId) {
        $stmt = $db->prepare("SELECT id FROM delivery_boys WHERE id = ? AND restaurant_id = ? AND is_active = 1");
        $stmt->execute([$deliveryBoyId, $restaurant['id']]);
        if ($stmt->fetch()) {
            $updates[] = "delivery_boy_id = ?";
            $updates[] = "delivery_status = 'assigned'";
            $params[]  = $deliveryBoyId;
        }
    }

    $params[] = $orderId;
    $sql = "UPDATE orders SET " . implode(', ', $updates) . " WHERE id = ?";
    $db->prepare($sql)->execute($params);

    success(null, 'Order status updated');

} catch (PDOException $e) {
    error_log("Order status error: " . $e->getMessage());
    error('Failed to update order status', 500);
}
