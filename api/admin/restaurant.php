<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../helpers/upload.php';
require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
getAuthUser('admin');
$db = Database::getConnection();

try {
    if ($method === 'POST') {
        // Create restaurant + owner user
        $name     = sanitizeString($_POST['name'] ?? '', 200);
        $phone    = sanitizeString($_POST['owner_phone'] ?? '', 15);
        $area     = sanitizeString($_POST['area'] ?? 'Kulgam Town', 100);
        $address  = sanitizeString($_POST['full_address'] ?? '', 500);
        $cuisine  = sanitizeString($_POST['cuisine_tags'] ?? '', 500);
        $desc     = sanitizeString($_POST['description'] ?? '', 2000);
        $upi      = sanitizeString($_POST['upi_id'] ?? '', 100);
        $comm     = sanitizeFloat($_POST['commission_percent'] ?? 12.00);
        $minOrder = sanitizeInt($_POST['min_order_amount'] ?? 100);
        $prepTime = sanitizeInt($_POST['avg_prep_time_minutes'] ?? 30);
        $ownerName = sanitizeString($_POST['owner_name'] ?? '', 100);

        if (!$name) error('Restaurant name required', 422);
        if (!$phone || !validPhone($phone)) error('Valid owner phone required', 422);

        // Create or find owner user
        $stmt = $db->prepare("SELECT id FROM users WHERE phone = ?");
        $stmt->execute([$phone]);
        $owner = $stmt->fetch();

        if (!$owner) {
            $stmt = $db->prepare("INSERT INTO users (phone, name, role) VALUES (?,?,'restaurant_owner')");
            $stmt->execute([$phone, $ownerName ?: null]);
            $ownerId = $db->lastInsertId();
        } else {
            $ownerId = $owner['id'];
            $db->prepare("UPDATE users SET role='restaurant_owner' WHERE id=?")->execute([$ownerId]);
        }

        $coverImage = null;
        if (!empty($_FILES['cover_image'])) {
            $coverImage = handleImageUpload('cover_image', 'restaurants');
        }

        $stmt = $db->prepare("
            INSERT INTO restaurants (owner_id, name, description, cuisine_tags, area, full_address, upi_id, commission_percent, min_order_amount, avg_prep_time_minutes, cover_image)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
        ");
        $stmt->execute([$ownerId, $name, $desc ?: null, $cuisine ?: null, $area, $address ?: null, $upi ?: null, $comm, $minOrder, $prepTime, $coverImage]);
        $rid = $db->lastInsertId();

        $stmt = $db->prepare("SELECT r.*, u.phone AS owner_phone, u.name AS owner_name FROM restaurants r JOIN users u ON u.id = r.owner_id WHERE r.id = ?");
        $stmt->execute([$rid]);
        success($stmt->fetch(), 'Restaurant created', 201);

    } elseif ($method === 'PUT') {
        $input = getJsonInput();
        $id    = sanitizeInt($input['id'] ?? 0, 1);
        if (!$id) error('Restaurant ID required', 422);

        $fields  = ['name','description','cuisine_tags','area','full_address','upi_id','commission_percent',
                    'min_order_amount','avg_prep_time_minutes','is_open','is_active','is_promoted','accepts_delivery','accepts_pickup','opens_at','closes_at'];
        $updates = [];
        $params  = [];

        foreach ($fields as $f) {
            if (array_key_exists($f, $input)) {
                $updates[] = "$f = ?";
                $params[]  = match($f) {
                    'commission_percent' => sanitizeFloat($input[$f]),
                    'min_order_amount','avg_prep_time_minutes','is_open','is_active','is_promoted','accepts_delivery','accepts_pickup' => sanitizeInt($input[$f]),
                    default => sanitizeString($input[$f], 500)
                };
            }
        }

        if (empty($updates)) error('Nothing to update', 422);
        $params[] = $id;
        $db->prepare("UPDATE restaurants SET " . implode(', ', $updates) . ", updated_at = NOW() WHERE id = ?")->execute($params);
        success(null, 'Restaurant updated');

    } else {
        error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Admin restaurant error: " . $e->getMessage());
    error('Failed to process restaurant', 500);
}
