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
        SELECT db.id, db.name, db.phone, db.vehicle_type, db.vehicle_number,
               db.is_available, db.is_active, db.total_deliveries, db.rating, db.per_delivery_pay,
               (SELECT COUNT(*) FROM orders o WHERE o.delivery_boy_id = db.id AND o.status IN ('picked_up','on_the_way')) AS active_deliveries
        FROM delivery_boys db
        WHERE db.restaurant_id = ?
        ORDER BY db.is_available DESC, db.name ASC
    ");
    $stmt->execute([$restaurant['id']]);
    success($stmt->fetchAll(), 'Delivery boys retrieved');

} catch (PDOException $e) {
    error_log("Delivery boys error: " . $e->getMessage());
    error('Failed to load delivery boys', 500);
}
