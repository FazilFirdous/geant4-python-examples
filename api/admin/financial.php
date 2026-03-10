<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

try {
    getAuthUser('admin');
    $db = Database::getConnection();

    $dateFrom = sanitizeString($_GET['date_from'] ?? date('Y-m-01'), 10);
    $dateTo   = sanitizeString($_GET['date_to'] ?? date('Y-m-d'), 10);

    // Per-restaurant commission report
    $stmt = $db->prepare("
        SELECT r.id, r.name, r.area, r.commission_percent,
               COUNT(o.id) AS order_count,
               COALESCE(SUM(o.subtotal),0) AS gross_revenue,
               COALESCE(SUM(o.commission_amount),0) AS commission_earned,
               COALESCE(SUM(o.delivery_fee),0) AS delivery_fees,
               COALESCE(SUM(o.total_amount),0) AS gmv
        FROM restaurants r
        LEFT JOIN orders o ON o.restaurant_id = r.id
            AND o.status = 'delivered'
            AND DATE(o.placed_at) BETWEEN ? AND ?
        WHERE r.is_active = 1
        GROUP BY r.id
        ORDER BY commission_earned DESC
    ");
    $stmt->execute([$dateFrom, $dateTo]);
    $perRestaurant = $stmt->fetchAll();

    // Totals
    $stmt = $db->prepare("
        SELECT
            COUNT(*) AS total_orders,
            COALESCE(SUM(total_amount),0) AS total_gmv,
            COALESCE(SUM(commission_amount),0) AS total_commission,
            COALESCE(SUM(delivery_fee),0) AS total_delivery_fees,
            COALESCE(SUM(platform_fee),0) AS total_platform_fees
        FROM orders
        WHERE status = 'delivered' AND DATE(placed_at) BETWEEN ? AND ?
    ");
    $stmt->execute([$dateFrom, $dateTo]);
    $totals = $stmt->fetch();

    success([
        'date_from'      => $dateFrom,
        'date_to'        => $dateTo,
        'totals'         => $totals,
        'per_restaurant' => $perRestaurant
    ], 'Financial report retrieved');

} catch (PDOException $e) {
    error_log("Admin financial error: " . $e->getMessage());
    error('Failed to load financial report', 500);
}
