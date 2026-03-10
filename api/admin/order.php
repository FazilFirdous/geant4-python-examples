<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') error('Method not allowed', 405);

try {
    getAuthUser('admin');
    $input = getJsonInput();

    required($input, ['order_id', 'action']);

    $orderId = sanitizeInt($input['order_id'] ?? 0, 1);
    $action  = sanitizeString($input['action'] ?? '', 30);
    $reason  = sanitizeString($input['reason'] ?? '', 500);

    $db   = Database::getConnection();
    $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->execute([$orderId]);
    $order = $stmt->fetch();
    if (!$order) error('Order not found', 404);

    switch ($action) {
        case 'cancel':
            $db->prepare("UPDATE orders SET status='cancelled', cancelled_at=NOW(), cancel_reason=?, cancelled_by='admin' WHERE id=?")
               ->execute([$reason ?: 'Cancelled by admin', $orderId]);
            break;

        case 'refund':
            $db->prepare("UPDATE orders SET payment_status='refunded' WHERE id=?")
               ->execute([$orderId]);
            break;

        case 'mark_delivered':
            $db->prepare("UPDATE orders SET status='delivered', delivered_at=NOW() WHERE id=?")
               ->execute([$orderId]);
            break;

        case 'reassign':
            $deliveryBoyId = sanitizeInt($input['delivery_boy_id'] ?? 0, 1);
            if (!$deliveryBoyId) error('Delivery boy ID required', 422);
            $db->prepare("UPDATE orders SET delivery_boy_id=? WHERE id=?")->execute([$deliveryBoyId, $orderId]);
            break;

        default:
            error('Unknown action', 422);
    }

    success(null, 'Order updated');

} catch (PDOException $e) {
    error_log("Admin order action error: " . $e->getMessage());
    error('Failed to update order', 500);
}
