<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../helpers/upload.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$user   = getAuthUser('restaurant_owner');
$db     = Database::getConnection();

$stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
$stmt->execute([$user['id']]);
$restaurant = $stmt->fetch();
if (!$restaurant) error('Restaurant not found', 404);
$rid = $restaurant['id'];

try {
    switch ($method) {
        case 'POST':
            $name        = sanitizeString($_POST['name'] ?? '', 200);
            $description = sanitizeString($_POST['description'] ?? '', 1000);
            $price       = sanitizeFloat($_POST['price'] ?? 0);
            $categoryId  = sanitizeInt($_POST['category_id'] ?? 0);
            $isVeg       = !empty($_POST['is_veg']) ? 1 : 0;
            $isPopular   = !empty($_POST['is_popular']) ? 1 : 0;
            $prepTime    = sanitizeInt($_POST['prep_time_minutes'] ?? 20, 1, 120);

            if (!$name) error('Item name required', 422);
            if ($price <= 0) error('Valid price required', 422);

            $imageUrl = null;
            if (!empty($_FILES['image'])) {
                $imageUrl = handleImageUpload('image', 'food');
            }

            $stmt = $db->prepare("
                INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, is_veg, is_popular, prep_time_minutes)
                VALUES (?,?,?,?,?,?,?,?,?)
            ");
            $stmt->execute([$rid, $categoryId ?: null, $name, $description ?: null, $price, $imageUrl, $isVeg, $isPopular, $prepTime]);
            $id = $db->lastInsertId();

            $stmt = $db->prepare("SELECT * FROM menu_items WHERE id = ?");
            $stmt->execute([$id]);
            success($stmt->fetch(), 'Menu item added', 201);
            break;

        case 'PUT':
            $input      = getJsonInput();
            $id         = sanitizeInt($input['id'] ?? 0, 1);
            if (!$id) error('Item ID required', 422);

            $stmt = $db->prepare("SELECT id FROM menu_items WHERE id = ? AND restaurant_id = ?");
            $stmt->execute([$id, $rid]);
            if (!$stmt->fetch()) error('Item not found', 404);

            $updates = [];
            $params  = [];
            $fields  = ['name', 'description', 'price', 'category_id', 'is_veg', 'is_popular', 'prep_time_minutes', 'is_available'];
            foreach ($fields as $f) {
                if (isset($input[$f])) {
                    $updates[] = "$f = ?";
                    $params[]  = match($f) {
                        'name'        => sanitizeString($input[$f], 200),
                        'description' => sanitizeString($input[$f], 1000),
                        'price'       => sanitizeFloat($input[$f]),
                        default       => sanitizeInt($input[$f])
                    };
                }
            }

            if (empty($updates)) error('Nothing to update', 422);
            $params[] = $id;
            $db->prepare("UPDATE menu_items SET " . implode(', ', $updates) . " WHERE id = ?")->execute($params);
            success(null, 'Item updated');
            break;

        case 'DELETE':
            $id = sanitizeInt($_GET['id'] ?? 0, 1);
            if (!$id) error('Item ID required', 422);

            $stmt = $db->prepare("DELETE FROM menu_items WHERE id = ? AND restaurant_id = ?");
            $stmt->execute([$id, $rid]);
            success(null, 'Item deleted');
            break;

        default:
            error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Menu item error: " . $e->getMessage());
    error('Failed to process menu item', 500);
}
