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
    $id    = sanitizeInt($input['delivery_boy_id'] ?? 0, 1);
    if (!$id) error('Delivery boy ID required', 422);

    $db   = Database::getConnection();
    $stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);

    $stmt = $db->prepare("UPDATE delivery_boys SET is_available = NOT is_available WHERE id = ? AND restaurant_id = ?");
    $stmt->execute([$id, $restaurant['id']]);

    $stmt = $db->prepare("SELECT id, name, is_available FROM delivery_boys WHERE id = ?");
    $stmt->execute([$id]);
    $boy  = $stmt->fetch();

    success($boy, $boy['is_available'] ? 'Marked as available' : 'Marked as unavailable');

} catch (PDOException $e) {
    error_log("Delivery boy status error: " . $e->getMessage());
    error('Failed to update status', 500);
}
