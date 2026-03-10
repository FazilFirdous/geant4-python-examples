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
    $id    = sanitizeInt($input['id'] ?? 0, 1);
    if (!$id) error('Item ID required', 422);

    $db   = Database::getConnection();
    $stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);

    $stmt = $db->prepare("UPDATE menu_items SET is_available = NOT is_available WHERE id = ? AND restaurant_id = ?");
    $stmt->execute([$id, $restaurant['id']]);

    $stmt = $db->prepare("SELECT id, name, is_available FROM menu_items WHERE id = ?");
    $stmt->execute([$id]);
    $item = $stmt->fetch();

    success($item, $item['is_available'] ? 'Item marked as available' : 'Item marked as unavailable');

} catch (PDOException $e) {
    error_log("Toggle item error: " . $e->getMessage());
    error('Failed to toggle item', 500);
}
