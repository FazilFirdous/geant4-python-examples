<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

setCorsHeaders();
getAuthUser('admin');

$db = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    /* -------------------------------------------------------
       Return current week's settlement summary per restaurant
       ------------------------------------------------------- */
    $weekStart = date('Y-m-d', strtotime('monday this week'));
    $weekEnd   = date('Y-m-d', strtotime('sunday this week'));

    $stmt = $db->prepare("
        SELECT
            r.id            AS restaurant_id,
            r.name          AS restaurant_name,
            r.commission_percent,
            COUNT(o.id)     AS order_count,
            COALESCE(SUM(o.total_amount), 0)    AS gmv,
            COALESCE(SUM(o.total_amount * r.commission_percent / 100), 0) AS commission_owed,
            ws.settled_at
        FROM restaurants r
        LEFT JOIN orders o
               ON o.restaurant_id = r.id
              AND o.status = 'delivered'
              AND DATE(o.placed_at) BETWEEN :week_start AND :week_end
        LEFT JOIN weekly_settlements ws
               ON ws.restaurant_id = r.id
              AND ws.week_start = :week_start2
        WHERE r.is_active = 1
        GROUP BY r.id, r.name, r.commission_percent, ws.settled_at
        ORDER BY commission_owed DESC
    ");
    $stmt->execute([':week_start' => $weekStart, ':week_end' => $weekEnd, ':week_start2' => $weekStart]);
    $rows = $stmt->fetchAll();

    foreach ($rows as &$row) {
        $row['gmv']            = round($row['gmv'], 2);
        $row['commission_owed'] = round($row['commission_owed'], 2);
    }

    success($rows, 'Settlement data');

} elseif ($method === 'POST') {
    /* -------------------------------------------------------
       Mark / unmark a restaurant as settled for current week
       ------------------------------------------------------- */
    $input = getJsonInput();
    $restaurantId = (int)($input['restaurant_id'] ?? 0);
    $settled      = (int)($input['settled'] ?? 1);
    $weekStart    = date('Y-m-d', strtotime('monday this week'));

    if (!$restaurantId) error('restaurant_id required', 422);

    /* Ensure weekly_settlements table exists */
    $db->exec("CREATE TABLE IF NOT EXISTS weekly_settlements (
        id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        restaurant_id   INT UNSIGNED NOT NULL,
        week_start      DATE NOT NULL,
        settled_at      DATETIME NULL,
        settled_by      INT UNSIGNED NULL,
        UNIQUE KEY uq_rest_week (restaurant_id, week_start),
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
    )");

    if ($settled) {
        $stmt = $db->prepare("
            INSERT INTO weekly_settlements (restaurant_id, week_start, settled_at)
            VALUES (:rid, :ws, NOW())
            ON DUPLICATE KEY UPDATE settled_at = NOW()
        ");
        $stmt->execute([':rid' => $restaurantId, ':ws' => $weekStart]);
    } else {
        $stmt = $db->prepare("
            UPDATE weekly_settlements SET settled_at = NULL
            WHERE restaurant_id = :rid AND week_start = :ws
        ");
        $stmt->execute([':rid' => $restaurantId, ':ws' => $weekStart]);
    }

    success(['settled' => $settled], 'Settlement updated');
} else {
    error('Method not allowed', 405);
}
