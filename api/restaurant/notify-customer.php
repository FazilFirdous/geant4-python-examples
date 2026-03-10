<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

try {
    $user  = getAuthUser('restaurant_owner');
    $input = getJsonInput();
    required($input, ['order_id', 'type']);

    $orderId = sanitizeInt($input['order_id'] ?? 0, 1);
    $type    = sanitizeString($input['type'] ?? '', 30);
    $message = sanitizeString($input['message'] ?? '', 500);

    if (!in_array($type, ['pickup_request', 'delay_notice'])) {
        error('Invalid notification type', 422);
    }

    $db   = Database::getConnection();
    $stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);

    $stmt = $db->prepare("SELECT id, customer_id FROM orders WHERE id = ? AND restaurant_id = ?");
    $stmt->execute([$orderId, $restaurant['id']]);
    $order = $stmt->fetch();
    if (!$order) error('Order not found', 404);

    // Store notification in orders table note
    $note = match($type) {
        'pickup_request' => $message ?: 'Your order is ready! Our delivery partner is currently unavailable. Would you like to pick it up?',
        'delay_notice'   => $message ?: 'Your order is ready but delivery may be delayed by ~15-20 minutes. We are finding a delivery partner for you.',
        default          => $message
    };

    $deliveryStatus = $type === 'pickup_request' ? 'no_rider' : 'no_rider';
    $db->prepare("UPDATE orders SET customer_note_delivery=?, delivery_status=? WHERE id=?")
       ->execute([$note, $deliveryStatus, $orderId]);

    success(null, 'Customer notification sent');

} catch (PDOException $e) {
    error_log("Notify customer error: " . $e->getMessage());
    error('Failed to send notification', 500);
}
