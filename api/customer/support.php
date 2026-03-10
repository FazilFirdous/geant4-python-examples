<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

setCorsHeaders();

$db     = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $user   = getAuthUser('customer');
    $userId = $user['user_id'];

    $stmt = $db->prepare("
        SELECT st.*, o.order_number
        FROM support_tickets st
        LEFT JOIN orders o ON o.id = st.order_id
        WHERE st.user_id = :uid
        ORDER BY st.created_at DESC
        LIMIT 20
    ");
    $stmt->execute([':uid' => $userId]);
    success($stmt->fetchAll(), 'Tickets');

} elseif ($method === 'POST') {
    /* Allow optional auth — chatbot can submit without token */
    $user   = optionalAuth();
    $input  = getJsonInput();

    $subject  = trim($input['subject']  ?? '');
    $message  = trim($input['message']  ?? '');
    $orderId  = !empty($input['order_id'])  ? (int)$input['order_id']  : null;
    $category = trim($input['category'] ?? 'general');
    $phone    = trim($input['phone']    ?? '');
    $name     = trim($input['name']     ?? '');

    if (!$subject || !$message) error('subject and message required', 422);

    $userId = $user ? $user['user_id'] : null;

    /* If no user but phone provided, look up user */
    if (!$userId && $phone) {
        $stmt = $db->prepare("SELECT id FROM users WHERE phone = :p LIMIT 1");
        $stmt->execute([':p' => $phone]);
        $row = $stmt->fetch();
        if ($row) $userId = $row['id'];
    }

    $stmt = $db->prepare("
        INSERT INTO support_tickets (user_id, order_id, subject, message, category, status, created_at)
        VALUES (:uid, :oid, :sub, :msg, :cat, 'open', NOW())
    ");
    $stmt->execute([
        ':uid' => $userId,
        ':oid' => $orderId,
        ':sub' => $subject,
        ':msg' => $message,
        ':cat' => $category
    ]);

    success(['ticket_id' => $db->lastInsertId()], 'Ticket submitted');

} else {
    error('Method not allowed', 405);
}
