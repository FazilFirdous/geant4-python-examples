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
        $stmt = $db->prepare("
            SELECT c.*, (SELECT COUNT(*) FROM coupon_usage cu WHERE cu.coupon_id = c.id) AS total_uses
            FROM coupons c
            ORDER BY c.created_at DESC
        ");
        $stmt->execute();
        success($stmt->fetchAll(), 'Coupons retrieved');

    } elseif ($method === 'POST') {
        $input = getJsonInput();
        required($input, ['code', 'discount_type', 'discount_value', 'valid_from', 'valid_until']);

        $code        = strtoupper(sanitizeString($input['code'] ?? '', 50));
        $type        = sanitizeString($input['discount_type'] ?? 'percentage', 20);
        $value       = sanitizeFloat($input['discount_value'] ?? 0);
        $maxDiscount = isset($input['max_discount']) ? sanitizeFloat($input['max_discount']) : null;
        $minOrder    = sanitizeFloat($input['min_order_amount'] ?? 0);
        $limit       = sanitizeInt($input['usage_limit'] ?? 100);
        $perUser     = sanitizeInt($input['per_user_limit'] ?? 1);
        $validFrom   = sanitizeString($input['valid_from'] ?? '', 20);
        $validUntil  = sanitizeString($input['valid_until'] ?? '', 20);

        if (!validEnum($type, ['percentage', 'flat'])) error('Invalid discount type', 422);

        $stmt = $db->prepare("
            INSERT INTO coupons (code, discount_type, discount_value, max_discount, min_order_amount, usage_limit, per_user_limit, valid_from, valid_until)
            VALUES (?,?,?,?,?,?,?,?,?)
        ");
        $stmt->execute([$code, $type, $value, $maxDiscount, $minOrder, $limit, $perUser, $validFrom, $validUntil]);
        $id = $db->lastInsertId();

        $stmt = $db->prepare("SELECT * FROM coupons WHERE id = ?");
        $stmt->execute([$id]);
        success($stmt->fetch(), 'Coupon created', 201);

    } elseif ($method === 'PUT') {
        $input = getJsonInput();
        $id    = sanitizeInt($input['id'] ?? 0, 1);
        if (!$id) error('Coupon ID required', 422);

        $isActive = sanitizeInt($input['is_active'] ?? 1, 0, 1);
        $db->prepare("UPDATE coupons SET is_active = ? WHERE id = ?")->execute([$isActive, $id]);
        success(null, $isActive ? 'Coupon activated' : 'Coupon deactivated');

    } else {
        error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    if ($e->getCode() == 23000) error('Coupon code already exists', 409);
    error_log("Admin coupons error: " . $e->getMessage());
    error('Failed to process coupon', 500);
}
