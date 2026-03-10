<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
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

    $rid = $restaurant['id'];

    $periods = [
        'today' => "DATE(placed_at) = CURDATE()",
        'week'  => "placed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)",
        'month' => "placed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)",
    ];

    $earnings = [];
    foreach ($periods as $period => $condition) {
        $stmt = $db->prepare("
            SELECT
                COUNT(*) AS order_count,
                SUM(subtotal) AS gross_revenue,
                SUM(commission_amount) AS commission,
                SUM(subtotal - commission_amount) AS net_revenue,
                AVG(total_amount) AS avg_order_value
            FROM orders
            WHERE restaurant_id = ? AND status = 'delivered' AND $condition
        ");
        $stmt->execute([$rid]);
        $data = $stmt->fetch();
        $earnings[$period] = [
            'order_count'    => (int)$data['order_count'],
            'gross_revenue'  => round((float)$data['gross_revenue'], 2),
            'commission'     => round((float)$data['commission'], 2),
            'net_revenue'    => round((float)$data['net_revenue'], 2),
            'avg_order_value'=> round((float)$data['avg_order_value'], 2),
        ];
    }

    // Daily breakdown for chart (last 7 days)
    $stmt = $db->prepare("
        SELECT DATE(placed_at) AS day, COUNT(*) AS orders, SUM(subtotal) AS revenue
        FROM orders
        WHERE restaurant_id = ? AND status = 'delivered'
          AND placed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(placed_at)
        ORDER BY day ASC
    ");
    $stmt->execute([$rid]);
    $earnings['daily_chart'] = $stmt->fetchAll();

    success($earnings, 'Earnings retrieved');

} catch (PDOException $e) {
    error_log("Earnings error: " . $e->getMessage());
    error('Failed to load earnings', 500);
}
