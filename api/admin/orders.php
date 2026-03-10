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

    $status       = sanitizeString($_GET['status'] ?? '', 30);
    $restaurantId = sanitizeInt($_GET['restaurant_id'] ?? 0);
    $search       = sanitizeString($_GET['search'] ?? '', 100);
    $dateFrom     = sanitizeString($_GET['date_from'] ?? '', 10);
    $dateTo       = sanitizeString($_GET['date_to'] ?? '', 10);
    $page         = sanitizeInt($_GET['page'] ?? 1, 1);
    $limit        = 50;
    $offset       = ($page - 1) * $limit;

    $conditions = ['1=1'];
    $params     = [];

    if ($status) {
        $conditions[] = "o.status = ?";
        $params[]     = $status;
    }
    if ($restaurantId) {
        $conditions[] = "o.restaurant_id = ?";
        $params[]     = $restaurantId;
    }
    if ($search) {
        $conditions[] = "(o.order_number LIKE ? OR u.phone LIKE ? OR u.name LIKE ?)";
        $like = "%$search%";
        array_push($params, $like, $like, $like);
    }
    if ($dateFrom) {
        $conditions[] = "DATE(o.placed_at) >= ?";
        $params[]     = $dateFrom;
    }
    if ($dateTo) {
        $conditions[] = "DATE(o.placed_at) <= ?";
        $params[]     = $dateTo;
    }

    $where = implode(' AND ', $conditions);

    $stmt = $db->prepare("
        SELECT o.id, o.order_number, o.status, o.order_type, o.payment_method, o.payment_status,
               o.subtotal, o.total_amount, o.commission_amount, o.placed_at, o.delivered_at,
               r.name AS restaurant_name, u.name AS customer_name, u.phone AS customer_phone
        FROM orders o
        JOIN restaurants r ON r.id = o.restaurant_id
        JOIN users u ON u.id = o.customer_id
        WHERE $where
        ORDER BY o.placed_at DESC
        LIMIT $limit OFFSET $offset
    ");
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

    $stmt = $db->prepare("SELECT COUNT(*) AS total FROM orders o JOIN users u ON u.id = o.customer_id WHERE $where");
    $stmt->execute($params);
    $total = $stmt->fetch()['total'];

    success(['orders' => $orders, 'total' => (int)$total, 'page' => $page, 'limit' => $limit], 'Orders retrieved');

} catch (PDOException $e) {
    error_log("Admin orders error: " . $e->getMessage());
    error('Failed to load orders', 500);
}
