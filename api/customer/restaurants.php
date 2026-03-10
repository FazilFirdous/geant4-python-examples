<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    error('Method not allowed', 405);
}

try {
    $db = Database::getConnection();

    $area      = sanitizeString($_GET['area'] ?? '', 100);
    $cuisine   = sanitizeString($_GET['cuisine'] ?? '', 100);
    $search    = sanitizeString($_GET['search'] ?? '', 200);
    $openOnly  = !empty($_GET['open_only']);

    $conditions = ["r.is_active = 1"];
    $params = [];

    if ($area) {
        $conditions[] = "r.area = ?";
        $params[] = $area;
    }

    if ($cuisine) {
        $conditions[] = "FIND_IN_SET(?, r.cuisine_tags) > 0";
        $params[] = $cuisine;
    }

    if ($search) {
        $conditions[] = "MATCH(r.name, r.cuisine_tags, r.description) AGAINST(? IN BOOLEAN MODE)";
        $params[] = $search . '*';
    }

    if ($openOnly) {
        $conditions[] = "r.is_open = 1";
    }

    $where = implode(' AND ', $conditions);

    $sql = "
        SELECT
            r.id, r.name, r.description, r.cuisine_tags,
            r.cover_image, r.logo_image, r.area, r.full_address,
            r.rating, r.total_reviews, r.total_orders,
            r.min_order_amount, r.avg_prep_time_minutes,
            r.is_open, r.opens_at, r.closes_at,
            r.is_promoted, r.accepts_delivery, r.accepts_pickup,
            COALESCE(af.delivery_fee, dc.base_fee) AS delivery_fee
        FROM restaurants r
        LEFT JOIN area_fees af ON af.area_name = r.area
        CROSS JOIN (SELECT base_fee FROM delivery_config LIMIT 1) dc
        WHERE $where
        ORDER BY r.is_promoted DESC, r.rating DESC, r.total_orders DESC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $restaurants = $stmt->fetchAll();

    success($restaurants, 'Restaurants retrieved');

} catch (PDOException $e) {
    error_log("Restaurants list error: " . $e->getMessage());
    error('Failed to load restaurants', 500);
}
