<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    error('Method not allowed', 405);
}

try {
    $user = getAuthUser();

    // Include restaurant info for restaurant owners
    if ($user['role'] === 'restaurant_owner') {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT id, name, is_open, rating, total_reviews, total_orders, cover_image FROM restaurants WHERE owner_id = ? AND is_active = 1 LIMIT 1");
        $stmt->execute([$user['id']]);
        $restaurant = $stmt->fetch();
        if ($restaurant) {
            $user['restaurant'] = $restaurant;
        }
    }

    success($user, 'User profile retrieved');
} catch (Exception $e) {
    error_log("Auth me error: " . $e->getMessage());
    error('Failed to get user', 500);
}
