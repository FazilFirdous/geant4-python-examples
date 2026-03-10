<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
getAuthUser('admin');
$db = Database::getConnection();

try {
    if ($method === 'GET') {
        $stmt = $db->prepare("
            SELECT r.id, r.name, r.area, r.cuisine_tags, r.phone, r.full_address,
                   r.rating, r.total_reviews, r.total_orders, r.commission_percent,
                   r.is_open, r.is_active, r.is_promoted, r.accepts_delivery, r.accepts_pickup,
                   r.cover_image, r.upi_id, r.min_order_amount, r.avg_prep_time_minutes,
                   r.opens_at, r.closes_at, r.created_at,
                   u.phone AS owner_phone, u.name AS owner_name,
                   COALESCE(SUM(o.total_amount),0) AS total_revenue,
                   COALESCE(SUM(o.commission_amount),0) AS total_commission
            FROM restaurants r
            LEFT JOIN users u ON u.id = r.owner_id
            LEFT JOIN orders o ON o.restaurant_id = r.id AND o.status = 'delivered'
            GROUP BY r.id
            ORDER BY r.is_active DESC, r.total_orders DESC
        ");
        $stmt->execute();
        success($stmt->fetchAll(), 'Restaurants retrieved');

    } else {
        error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Admin restaurants error: " . $e->getMessage());
    error('Failed to load restaurants', 500);
}
