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
            SELECT db.id, db.name, db.phone, db.vehicle_type, db.vehicle_number,
                   db.is_available, db.is_active, db.total_deliveries, db.rating, db.per_delivery_pay,
                   r.name AS restaurant_name, r.id AS restaurant_id
            FROM delivery_boys db
            LEFT JOIN restaurants r ON r.id = db.restaurant_id
            ORDER BY r.name, db.name
        ");
        $stmt->execute();
        success($stmt->fetchAll(), 'Delivery boys retrieved');

    } elseif ($method === 'POST') {
        $input = getJsonInput();
        required($input, ['name', 'phone']);

        $restaurantId = !empty($input['restaurant_id']) ? sanitizeInt($input['restaurant_id'], 1) : null;
        $name         = sanitizeString($input['name'] ?? '', 100);
        $phone        = sanitizeString($input['phone'] ?? '', 15);
        $vehicle      = sanitizeString($input['vehicle_type'] ?? 'bike', 20);
        $vehicleNum   = sanitizeString($input['vehicle_number'] ?? '', 30);
        $pay          = sanitizeFloat($input['per_delivery_pay'] ?? 30.00);

        if (!validPhone($phone)) error('Valid phone required', 422);

        // Create or find delivery boy user account
        $stmt = $db->prepare("SELECT id FROM users WHERE phone = ?");
        $stmt->execute([$phone]);
        $user = $stmt->fetch();

        if (!$user) {
            $stmt = $db->prepare("INSERT INTO users (phone, name, role) VALUES (?,?,'delivery_boy')");
            $stmt->execute([$phone, $name]);
            $userId = $db->lastInsertId();
        } else {
            $userId = $user['id'];
        }

        $stmt = $db->prepare("
            INSERT INTO delivery_boys (user_id, restaurant_id, name, phone, vehicle_type, vehicle_number, per_delivery_pay)
            VALUES (?,?,?,?,?,?,?)
        ");
        $stmt->execute([$userId, $restaurantId, $name, $phone, $vehicle, $vehicleNum ?: null, $pay]);
        $id = $db->lastInsertId();

        $stmt = $db->prepare("SELECT db.*, r.name AS restaurant_name FROM delivery_boys db LEFT JOIN restaurants r ON r.id = db.restaurant_id WHERE db.id = ?");
        $stmt->execute([$id]);
        success($stmt->fetch(), 'Delivery boy added', 201);

    } elseif ($method === 'PUT') {
        $input = getJsonInput();
        $id    = sanitizeInt($input['id'] ?? 0, 1);
        if (!$id) error('id required', 422);

        $fields = [];
        $params = [];
        if (isset($input['is_active'])) {
            $fields[] = 'is_active = ?';
            $params[]  = (int)$input['is_active'];
        }
        if (isset($input['is_available'])) {
            $fields[] = 'is_available = ?';
            $params[]  = (int)$input['is_available'];
        }
        if (isset($input['per_delivery_pay'])) {
            $fields[] = 'per_delivery_pay = ?';
            $params[]  = sanitizeFloat($input['per_delivery_pay']);
        }
        if (empty($fields)) error('Nothing to update', 422);

        $params[] = $id;
        $stmt = $db->prepare("UPDATE delivery_boys SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($params);
        success(['updated' => $stmt->rowCount()], 'Delivery boy updated');

    } else {
        error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Admin delivery boys error: " . $e->getMessage());
    error('Failed to process delivery boy', 500);
}
