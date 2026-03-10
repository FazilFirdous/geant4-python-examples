<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

try {
    $user  = getAuthUser('customer');
    $input = getJsonInput();

    required($input, ['order_id', 'food_rating']);

    $orderId       = sanitizeInt($input['order_id'] ?? 0, 1);
    $foodRating    = sanitizeInt($input['food_rating'] ?? 0, 1, 5);
    $deliveryRating = isset($input['delivery_rating']) ? sanitizeInt($input['delivery_rating'], 1, 5) : null;
    $comment       = sanitizeString($input['comment'] ?? '', 1000);

    $db = Database::getConnection();

    // Verify order belongs to user and is delivered
    $stmt = $db->prepare("SELECT * FROM orders WHERE id = ? AND customer_id = ? AND status = 'delivered'");
    $stmt->execute([$orderId, $user['id']]);
    $order = $stmt->fetch();

    if (!$order) error('Order not found or not eligible for review', 404);

    // Check not already reviewed
    $stmt = $db->prepare("SELECT id FROM reviews WHERE order_id = ?");
    $stmt->execute([$orderId]);
    if ($stmt->fetch()) error('Order already reviewed', 409);

    $stmt = $db->prepare("
        INSERT INTO reviews (order_id, customer_id, restaurant_id, food_rating, delivery_rating, comment)
        VALUES (?,?,?,?,?,?)
    ");
    $stmt->execute([$orderId, $user['id'], $order['restaurant_id'], $foodRating, $deliveryRating, $comment ?: null]);

    // Update restaurant rating
    $stmt = $db->prepare("
        UPDATE restaurants r
        SET r.rating = (
            SELECT ROUND(AVG(food_rating), 1) FROM reviews WHERE restaurant_id = r.id
        ), r.total_reviews = (
            SELECT COUNT(*) FROM reviews WHERE restaurant_id = r.id
        )
        WHERE r.id = ?
    ");
    $stmt->execute([$order['restaurant_id']]);

    success(null, 'Review submitted, thank you!');

} catch (PDOException $e) {
    error_log("Review error: " . $e->getMessage());
    error('Failed to submit review', 500);
}
