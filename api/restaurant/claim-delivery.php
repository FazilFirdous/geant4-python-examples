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
    $poolId       = sanitizeInt($input['pool_id'] ?? 0, 1);
    $deliveryBoyId = sanitizeInt($input['delivery_boy_id'] ?? 0, 1);

    if (!$poolId || !$deliveryBoyId) error('Pool ID and delivery boy ID required', 422);

    $db = Database::getConnection();

    $stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);

    // Verify delivery boy belongs to this restaurant
    $stmt = $db->prepare("SELECT id FROM delivery_boys WHERE id = ? AND restaurant_id = ? AND is_active = 1 AND is_available = 1");
    $stmt->execute([$deliveryBoyId, $restaurant['id']]);
    if (!$stmt->fetch()) error('Delivery boy not available', 400);

    // Claim the pool delivery
    $stmt = $db->prepare("
        UPDATE public_delivery_pool SET status='claimed', claimed_by=?
        WHERE id = ? AND status = 'open' AND (expires_at IS NULL OR expires_at > NOW())
    ");
    $stmt->execute([$deliveryBoyId, $poolId]);

    if ($db->rowCount() === 0) {
        error('This delivery is no longer available', 409);
    }

    // Get order id and assign
    $stmt = $db->prepare("SELECT order_id FROM public_delivery_pool WHERE id = ?");
    $stmt->execute([$poolId]);
    $pool = $stmt->fetch();

    $db->prepare("UPDATE orders SET delivery_boy_id=?, delivery_status='assigned' WHERE id=?")
       ->execute([$deliveryBoyId, $pool['order_id']]);

    success(null, 'Delivery claimed successfully');

} catch (PDOException $e) {
    error_log("Claim delivery error: " . $e->getMessage());
    error('Failed to claim delivery', 500);
}
