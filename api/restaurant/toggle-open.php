<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') error('Method not allowed', 405);

try {
    $user = getAuthUser('restaurant_owner');
    $db   = Database::getConnection();

    $stmt = $db->prepare("UPDATE restaurants SET is_open = NOT is_open WHERE owner_id = ?");
    $stmt->execute([$user['id']]);

    $stmt = $db->prepare("SELECT id, name, is_open FROM restaurants WHERE owner_id = ?");
    $stmt->execute([$user['id']]);
    $r = $stmt->fetch();

    success($r, $r['is_open'] ? 'Restaurant is now OPEN' : 'Restaurant is now CLOSED');

} catch (PDOException $e) {
    error_log("Toggle open error: " . $e->getMessage());
    error('Failed to toggle restaurant status', 500);
}
