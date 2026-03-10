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
        $status = sanitizeString($_GET['status'] ?? '', 20);
        $cond   = '1=1';
        $params = [];
        if ($status) {
            $cond     = "st.status = ?";
            $params[] = $status;
        }

        $stmt = $db->prepare("
            SELECT st.*, u.name AS customer_name, u.phone AS customer_phone,
                   o.order_number
            FROM support_tickets st
            JOIN users u ON u.id = st.customer_id
            LEFT JOIN orders o ON o.id = st.order_id
            WHERE $cond
            ORDER BY st.created_at DESC
            LIMIT 100
        ");
        $stmt->execute($params);
        success($stmt->fetchAll(), 'Tickets retrieved');

    } elseif ($method === 'PUT') {
        $input = getJsonInput();
        required($input, ['ticket_id']);

        $ticketId = sanitizeInt($input['ticket_id'] ?? 0, 1);
        $response = sanitizeString($input['admin_response'] ?? '', 2000);
        $status   = sanitizeString($input['status'] ?? 'resolved', 20);

        $resolvedAt = in_array($status, ['resolved', 'closed']) ? 'NOW()' : 'NULL';

        $stmt = $db->prepare("UPDATE support_tickets SET admin_response=?, status=?, resolved_at=IF(status IN ('resolved','closed'), NOW(), NULL) WHERE id=?");
        $stmt->execute([$response ?: null, $status, $ticketId]);

        success(null, 'Ticket updated');

    } else {
        error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Support tickets error: " . $e->getMessage());
    error('Failed to process ticket', 500);
}
