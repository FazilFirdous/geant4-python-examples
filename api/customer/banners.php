<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

try {
    $db   = Database::getConnection();
    $stmt = $db->prepare("
        SELECT id, title, subtitle, image_url, link_url, coupon_code, bg_gradient
        FROM promo_banners
        WHERE is_active = 1 AND (valid_until IS NULL OR valid_until > NOW())
        ORDER BY sort_order ASC
    ");
    $stmt->execute();
    success($stmt->fetchAll(), 'Banners retrieved');
} catch (PDOException $e) {
    error_log("Banners error: " . $e->getMessage());
    error('Failed to load banners', 500);
}
