<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

try {
    $user  = getAuthUser('restaurant_owner');
    $input = getJsonInput();
    required($input, ['review_id', 'reply']);

    $reviewId = sanitizeInt($input['review_id'] ?? 0, 1);
    $reply    = sanitizeString($input['reply'] ?? '', 500);

    $db   = Database::getConnection();
    $stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);

    $stmt = $db->prepare("UPDATE reviews SET restaurant_reply = ? WHERE id = ? AND restaurant_id = ?");
    $stmt->execute([$reply, $reviewId, $restaurant['id']]);

    success(null, 'Reply posted');

} catch (PDOException $e) {
    error_log("Review reply error: " . $e->getMessage());
    error('Failed to post reply', 500);
}
