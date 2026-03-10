<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

try {
    getAuthUser('admin');
    $db = Database::getConnection();

    $stats = [];

    // Today's orders
    $stmt = $db->prepare("SELECT COUNT(*) AS cnt, COALESCE(SUM(total_amount),0) AS rev, COALESCE(SUM(commission_amount),0) AS comm FROM orders WHERE DATE(placed_at) = CURDATE()");
    $stmt->execute();
    $today = $stmt->fetch();
    $stats['today_orders']     = (int)$today['cnt'];
    $stats['today_revenue']    = (float)$today['rev'];
    $stats['today_commission'] = (float)$today['comm'];

    // Week orders
    $stmt = $db->prepare("SELECT COUNT(*) AS cnt, COALESCE(SUM(total_amount),0) AS rev FROM orders WHERE placed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)");
    $stmt->execute();
    $week = $stmt->fetch();
    $stats['week_orders']  = (int)$week['cnt'];
    $stats['week_revenue'] = (float)$week['rev'];

    // Month
    $stmt = $db->prepare("SELECT COUNT(*) AS cnt, COALESCE(SUM(total_amount),0) AS rev, COALESCE(SUM(commission_amount),0) AS comm FROM orders WHERE placed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)");
    $stmt->execute();
    $month = $stmt->fetch();
    $stats['month_orders']     = (int)$month['cnt'];
    $stats['month_revenue']    = (float)$month['rev'];
    $stats['month_commission'] = (float)$month['comm'];

    // Active restaurants
    $stmt = $db->prepare("SELECT COUNT(*) AS cnt FROM restaurants WHERE is_active = 1");
    $stmt->execute();
    $stats['active_restaurants'] = (int)$stmt->fetch()['cnt'];

    // Pending orders
    $stmt = $db->prepare("SELECT COUNT(*) AS cnt FROM orders WHERE status IN ('placed','accepted','preparing')");
    $stmt->execute();
    $stats['pending_orders'] = (int)$stmt->fetch()['cnt'];

    // Open support tickets
    $stmt = $db->prepare("SELECT COUNT(*) AS cnt FROM support_tickets WHERE status IN ('open','in_progress')");
    $stmt->execute();
    $stats['open_tickets'] = (int)$stmt->fetch()['cnt'];

    // Weekly chart
    $stmt = $db->prepare("
        SELECT DATE(placed_at) AS day, COUNT(*) AS orders, COALESCE(SUM(total_amount),0) AS revenue
        FROM orders
        WHERE placed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(placed_at)
        ORDER BY day ASC
    ");
    $stmt->execute();
    $stats['weekly_chart'] = $stmt->fetchAll();

    // Recent 10 orders
    $stmt = $db->prepare("
        SELECT o.id, o.order_number, o.status, o.total_amount, o.placed_at, o.payment_method,
               r.name AS restaurant_name, u.name AS customer_name
        FROM orders o
        JOIN restaurants r ON r.id = o.restaurant_id
        JOIN users u ON u.id = o.customer_id
        ORDER BY o.placed_at DESC
        LIMIT 10
    ");
    $stmt->execute();
    $stats['recent_orders'] = $stmt->fetchAll();

    success($stats, 'Dashboard loaded');

} catch (PDOException $e) {
    error_log("Admin dashboard error: " . $e->getMessage());
    error('Failed to load dashboard', 500);
}
