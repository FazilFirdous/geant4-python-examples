<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    handleGetOrder();
} elseif ($method === 'POST') {
    handlePlaceOrder();
} else {
    error('Method not allowed', 405);
}

function handleGetOrder(): void {
    $user = getAuthUser();
    $id   = sanitizeInt($_GET['id'] ?? 0, 1);
    if (!$id) error('Order ID required', 422);

    $db = Database::getConnection();
    $stmt = $db->prepare("
        SELECT o.*, r.name AS restaurant_name, r.full_address AS restaurant_address,
               r.phone AS restaurant_phone, r.cover_image AS restaurant_image,
               a.full_address AS delivery_address, a.landmark, a.area AS delivery_area,
               db.name AS delivery_boy_name, db.phone AS delivery_boy_phone,
               u.name AS customer_name
        FROM orders o
        JOIN restaurants r ON r.id = o.restaurant_id
        LEFT JOIN addresses a ON a.id = o.address_id
        LEFT JOIN delivery_boys db ON db.id = o.delivery_boy_id
        JOIN users u ON u.id = o.customer_id
        WHERE o.id = ? AND o.customer_id = ?
    ");
    $stmt->execute([$id, $user['id']]);
    $order = $stmt->fetch();

    if (!$order) error('Order not found', 404);

    $stmt = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
    $stmt->execute([$id]);
    $order['items'] = $stmt->fetchAll();

    success($order, 'Order retrieved');
}

function handlePlaceOrder(): void {
    $user = getAuthUser('customer');
    $input = getJsonInput();

    required($input, ['restaurant_id', 'items', 'order_type', 'payment_method']);

    $restaurantId       = sanitizeInt($input['restaurant_id'] ?? 0, 1);
    $orderType          = $input['order_type'] ?? 'delivery';
    $paymentMethod      = $input['payment_method'] ?? 'cod';
    $addressId          = sanitizeInt($input['address_id'] ?? 0);
    $couponCode         = sanitizeString($input['coupon_code'] ?? '', 50);
    $specialInstructions = sanitizeString($input['special_instructions'] ?? '', 500);
    $items              = $input['items'] ?? [];

    if (!validEnum($orderType, ['delivery', 'pickup'])) error('Invalid order type', 422);
    if (!validEnum($paymentMethod, ['cod', 'upi'])) error('Invalid payment method', 422);
    if ($orderType === 'delivery' && !$addressId) error('Delivery address required', 422);
    if (empty($items)) error('No items in order', 422);

    $db = Database::getConnection();

    // Validate restaurant
    $stmt = $db->prepare("SELECT * FROM restaurants WHERE id = ? AND is_active = 1");
    $stmt->execute([$restaurantId]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);
    if (!$restaurant['is_open']) error('Restaurant is currently closed', 400);
    if ($orderType === 'delivery' && !$restaurant['accepts_delivery']) error('This restaurant does not accept delivery orders', 400);
    if ($orderType === 'pickup' && !$restaurant['accepts_pickup']) error('This restaurant does not accept pickup orders', 400);

    // Validate address
    if ($addressId) {
        $stmt = $db->prepare("SELECT * FROM addresses WHERE id = ? AND user_id = ?");
        $stmt->execute([$addressId, $user['id']]);
        $address = $stmt->fetch();
        if (!$address) error('Address not found', 404);
    }

    // Calculate subtotal
    $subtotal = 0;
    $validatedItems = [];
    foreach ($items as $item) {
        $menuItemId = sanitizeInt($item['menu_item_id'] ?? 0, 1);
        $qty        = sanitizeInt($item['quantity'] ?? 1, 1, 50);
        $notes      = sanitizeString($item['notes'] ?? '', 200);

        $stmt = $db->prepare("SELECT * FROM menu_items WHERE id = ? AND restaurant_id = ? AND is_available = 1");
        $stmt->execute([$menuItemId, $restaurantId]);
        $menuItem = $stmt->fetch();
        if (!$menuItem) error("Item #$menuItemId not available", 400);

        $subtotal += $menuItem['price'] * $qty;
        $validatedItems[] = [
            'menu_item_id' => $menuItemId,
            'name'         => $menuItem['name'],
            'price'        => $menuItem['price'],
            'quantity'     => $qty,
            'notes'        => $notes
        ];
    }

    if ($subtotal < $restaurant['min_order_amount']) {
        error("Minimum order amount is ₹{$restaurant['min_order_amount']}", 400);
    }

    // Delivery fee
    $deliveryFee = 0;
    if ($orderType === 'delivery') {
        $deliveryArea = $address['area'] ?? 'Kulgam Town';
        $stmt = $db->prepare("SELECT delivery_fee FROM area_fees WHERE area_name = ?");
        $stmt->execute([$deliveryArea]);
        $areaFee = $stmt->fetch();

        $stmt2 = $db->prepare("SELECT base_fee, free_delivery_above FROM delivery_config LIMIT 1");
        $stmt2->execute();
        $config = $stmt2->fetch();

        if ($subtotal >= $config['free_delivery_above']) {
            $deliveryFee = 0;
        } else {
            $deliveryFee = $areaFee ? $areaFee['delivery_fee'] : $config['base_fee'];
        }
    }

    $platformFee    = 5.00;
    $discountAmount = 0;
    $couponId       = null;

    // Apply coupon
    if ($couponCode) {
        $stmt = $db->prepare("
            SELECT c.*, (SELECT COUNT(*) FROM coupon_usage cu WHERE cu.coupon_id = c.id AND cu.user_id = ?) AS user_uses
            FROM coupons c
            WHERE c.code = ? AND c.is_active = 1 AND NOW() BETWEEN c.valid_from AND c.valid_until
        ");
        $stmt->execute([$user['id'], $couponCode]);
        $coupon = $stmt->fetch();

        if ($coupon && $coupon['used_count'] < $coupon['usage_limit'] && $coupon['user_uses'] < $coupon['per_user_limit'] && $subtotal >= $coupon['min_order_amount']) {
            if ($coupon['discount_type'] === 'percentage') {
                $discountAmount = ($subtotal * $coupon['discount_value']) / 100;
                if ($coupon['max_discount']) {
                    $discountAmount = min($discountAmount, $coupon['max_discount']);
                }
            } else {
                $discountAmount = min($coupon['discount_value'], $subtotal);
            }
            $couponId = $coupon['id'];
        }
    }

    $totalAmount      = max(0, $subtotal + $deliveryFee + $platformFee - $discountAmount);
    $commissionAmount = ($subtotal * $restaurant['commission_percent']) / 100;

    // Generate order number
    $today = date('Ymd');
    $stmt  = $db->prepare("SELECT COUNT(*) AS cnt FROM orders WHERE DATE(placed_at) = CURDATE()");
    $stmt->execute();
    $cnt   = $stmt->fetch()['cnt'];
    $orderNumber = 'CORA-' . $today . '-' . str_pad($cnt + 1, 4, '0', STR_PAD_LEFT);

    $db->beginTransaction();
    try {
        $stmt = $db->prepare("
            INSERT INTO orders (
                order_number, customer_id, restaurant_id, address_id, order_type,
                payment_method, subtotal, delivery_fee, platform_fee, discount_amount,
                coupon_code, total_amount, commission_amount, special_instructions, estimated_prep_minutes
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ");
        $stmt->execute([
            $orderNumber, $user['id'], $restaurantId,
            $addressId ?: null, $orderType, $paymentMethod,
            $subtotal, $deliveryFee, $platformFee, $discountAmount,
            $couponCode ?: null, $totalAmount, $commissionAmount,
            $specialInstructions ?: null, $restaurant['avg_prep_time_minutes']
        ]);
        $orderId = $db->lastInsertId();

        foreach ($validatedItems as $vi) {
            $stmt = $db->prepare("INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity, special_notes) VALUES (?,?,?,?,?,?)");
            $stmt->execute([$orderId, $vi['menu_item_id'], $vi['name'], $vi['price'], $vi['quantity'], $vi['notes'] ?: null]);
        }

        // Track coupon usage
        if ($couponId) {
            $stmt = $db->prepare("UPDATE coupons SET used_count = used_count + 1 WHERE id = ?");
            $stmt->execute([$couponId]);
            $stmt = $db->prepare("INSERT INTO coupon_usage (coupon_id, user_id, order_id) VALUES (?,?,?)");
            $stmt->execute([$couponId, $user['id'], $orderId]);
        }

        // Update restaurant order count
        $stmt = $db->prepare("UPDATE restaurants SET total_orders = total_orders + 1 WHERE id = ?");
        $stmt->execute([$restaurantId]);

        $db->commit();

        /* Fetch created order + restaurant UPI ID (needed for UPI deep link on client) */
        $stmt = $db->prepare("
            SELECT o.*, r.name AS restaurant_name, r.upi_id AS restaurant_upi_id,
                   r.phone AS restaurant_phone, r.full_address AS restaurant_address
            FROM orders o
            JOIN restaurants r ON r.id = o.restaurant_id
            WHERE o.id = ?
        ");
        $stmt->execute([$orderId]);
        $order = $stmt->fetch();

        $stmt = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $stmt->execute([$orderId]);
        $order['items'] = $stmt->fetchAll();

        success($order, 'Order placed successfully', 201);

    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }
}
