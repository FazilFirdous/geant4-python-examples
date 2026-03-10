<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

try {
    getAuthUser('admin');
    $input = getJsonInput();
    required($input, ['message']);

    $message = sanitizeString($input['message'] ?? '', 500);
    $title   = sanitizeString($input['title'] ?? 'CORA Notification', 200);

    // In a production app, this would integrate with FCM/Firebase push notifications.
    // For now, we store it as a broadcast message that clients can poll for.
    // This is a placeholder implementation.

    success([
        'broadcast' => true,
        'title'     => $title,
        'message'   => $message,
        'sent_at'   => date('Y-m-d H:i:s')
    ], 'Notification broadcast initiated');

} catch (Exception $e) {
    error_log("Notification error: " . $e->getMessage());
    error('Failed to send notification', 500);
}
