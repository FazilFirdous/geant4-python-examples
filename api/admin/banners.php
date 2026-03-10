<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../helpers/upload.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
getAuthUser('admin');
$db = Database::getConnection();

try {
    switch ($method) {
        case 'GET':
            $stmt = $db->prepare("SELECT * FROM promo_banners ORDER BY sort_order ASC");
            $stmt->execute();
            success($stmt->fetchAll(), 'Banners retrieved');
            break;

        case 'POST':
            $title    = sanitizeString($_POST['title'] ?? '', 200);
            $subtitle = sanitizeString($_POST['subtitle'] ?? '', 300);
            $gradient = sanitizeString($_POST['bg_gradient'] ?? 'linear-gradient(135deg, #D1386C, #8C1D47)', 200);
            $coupon   = sanitizeString($_POST['coupon_code'] ?? '', 50);
            $link     = sanitizeString($_POST['link_url'] ?? '', 500);
            $sortOrder = sanitizeInt($_POST['sort_order'] ?? 0);

            if (!$title) error('Banner title required', 422);

            $imageUrl = null;
            if (!empty($_FILES['image'])) {
                $imageUrl = handleImageUpload('image', 'banners');
            }

            $stmt = $db->prepare("INSERT INTO promo_banners (title, subtitle, image_url, link_url, coupon_code, bg_gradient, sort_order) VALUES (?,?,?,?,?,?,?)");
            $stmt->execute([$title, $subtitle ?: null, $imageUrl, $link ?: null, $coupon ?: null, $gradient, $sortOrder]);
            $id = $db->lastInsertId();

            $stmt = $db->prepare("SELECT * FROM promo_banners WHERE id = ?");
            $stmt->execute([$id]);
            success($stmt->fetch(), 'Banner created', 201);
            break;

        case 'PUT':
            $input = getJsonInput();
            $id    = sanitizeInt($input['id'] ?? 0, 1);
            if (!$id) error('Banner ID required', 422);

            $updates = [];
            $params  = [];
            foreach (['title','subtitle','bg_gradient','coupon_code','link_url','sort_order','is_active'] as $f) {
                if (array_key_exists($f, $input)) {
                    $updates[] = "$f = ?";
                    $params[]  = in_array($f, ['sort_order','is_active']) ? sanitizeInt($input[$f]) : sanitizeString($input[$f], 500);
                }
            }
            if (!empty($updates)) {
                $params[] = $id;
                $db->prepare("UPDATE promo_banners SET " . implode(', ', $updates) . " WHERE id = ?")->execute($params);
            }
            success(null, 'Banner updated');
            break;

        case 'DELETE':
            $id = sanitizeInt($_GET['id'] ?? 0, 1);
            if (!$id) error('Banner ID required', 422);
            $db->prepare("DELETE FROM promo_banners WHERE id = ?")->execute([$id]);
            success(null, 'Banner deleted');
            break;

        default:
            error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Admin banners error: " . $e->getMessage());
    error('Failed to process banner', 500);
}
