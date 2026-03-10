<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

try {
    $user = getAuthUser('restaurant_owner');
    $db   = Database::getConnection();

    $stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);

    $stmt = $db->prepare("
        SELECT rv.*, u.name AS customer_name, o.order_number
        FROM reviews rv
        JOIN users u ON u.id = rv.customer_id
        JOIN orders o ON o.id = rv.order_id
        WHERE rv.restaurant_id = ?
        ORDER BY rv.created_at DESC
        LIMIT 50
    ");
    $stmt->execute([$restaurant['id']]);
    success($stmt->fetchAll(), 'Reviews retrieved');

} catch (PDOException $e) {
    error_log("Reviews error: " . $e->getMessage());
    error('Failed to load reviews', 500);
}
