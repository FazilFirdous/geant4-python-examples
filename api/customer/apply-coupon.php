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
    required($input, ['code', 'subtotal']);

    $code     = strtoupper(sanitizeString($input['code'] ?? '', 50));
    $subtotal = sanitizeFloat($input['subtotal'] ?? 0);

    $db   = Database::getConnection();
    $stmt = $db->prepare("
        SELECT c.*, (
            SELECT COUNT(*) FROM coupon_usage cu WHERE cu.coupon_id = c.id AND cu.user_id = ?
        ) AS user_uses
        FROM coupons c
        WHERE c.code = ? AND c.is_active = 1 AND NOW() BETWEEN c.valid_from AND c.valid_until
    ");
    $stmt->execute([$user['id'], $code]);
    $coupon = $stmt->fetch();

    if (!$coupon) error('Invalid or expired coupon code', 400);
    if ($coupon['used_count'] >= $coupon['usage_limit']) error('Coupon usage limit reached', 400);
    if ($coupon['user_uses'] >= $coupon['per_user_limit']) error('You have already used this coupon', 400);
    if ($subtotal < $coupon['min_order_amount']) error("Minimum order amount ₹{$coupon['min_order_amount']} required for this coupon", 400);

    $discount = 0;
    if ($coupon['discount_type'] === 'percentage') {
        $discount = ($subtotal * $coupon['discount_value']) / 100;
        if ($coupon['max_discount']) {
            $discount = min($discount, $coupon['max_discount']);
        }
    } else {
        $discount = min($coupon['discount_value'], $subtotal);
    }

    success([
        'discount'       => round($discount, 2),
        'coupon_code'    => $coupon['code'],
        'discount_type'  => $coupon['discount_type'],
        'discount_value' => $coupon['discount_value']
    ], "Coupon applied! You save ₹" . round($discount, 2));

} catch (PDOException $e) {
    error_log("Coupon error: " . $e->getMessage());
    error('Failed to apply coupon', 500);
}
