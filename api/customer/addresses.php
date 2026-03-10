<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$user   = getAuthUser('customer');
$db     = Database::getConnection();

try {
    switch ($method) {
        case 'GET':
            $stmt = $db->prepare("SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC");
            $stmt->execute([$user['id']]);
            success($stmt->fetchAll(), 'Addresses retrieved');
            break;

        case 'POST':
            $input = getJsonInput();
            required($input, ['full_address']);
            $label       = sanitizeString($input['label'] ?? 'Home', 50);
            $fullAddress = sanitizeString($input['full_address'], 500);
            $landmark    = sanitizeString($input['landmark'] ?? '', 200);
            $area        = sanitizeString($input['area'] ?? '', 100);
            $isDefault   = !empty($input['is_default']) ? 1 : 0;

            if ($isDefault) {
                $db->prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?")->execute([$user['id']]);
            }

            $stmt = $db->prepare("INSERT INTO addresses (user_id, label, full_address, landmark, area, is_default) VALUES (?,?,?,?,?,?)");
            $stmt->execute([$user['id'], $label, $fullAddress, $landmark ?: null, $area ?: null, $isDefault]);
            $id = $db->lastInsertId();

            $stmt = $db->prepare("SELECT * FROM addresses WHERE id = ?");
            $stmt->execute([$id]);
            success($stmt->fetch(), 'Address added', 201);
            break;

        case 'PUT':
            $input = getJsonInput();
            $id    = sanitizeInt($input['id'] ?? 0, 1);
            if (!$id) error('Address ID required', 422);

            $stmt = $db->prepare("SELECT id FROM addresses WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $user['id']]);
            if (!$stmt->fetch()) error('Address not found', 404);

            $label       = sanitizeString($input['label'] ?? 'Home', 50);
            $fullAddress = sanitizeString($input['full_address'] ?? '', 500);
            $landmark    = sanitizeString($input['landmark'] ?? '', 200);
            $area        = sanitizeString($input['area'] ?? '', 100);
            $isDefault   = !empty($input['is_default']) ? 1 : 0;

            if ($isDefault) {
                $db->prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?")->execute([$user['id']]);
            }

            $stmt = $db->prepare("UPDATE addresses SET label=?, full_address=?, landmark=?, area=?, is_default=? WHERE id=?");
            $stmt->execute([$label, $fullAddress, $landmark ?: null, $area ?: null, $isDefault, $id]);
            success(null, 'Address updated');
            break;

        case 'DELETE':
            $id = sanitizeInt($_GET['id'] ?? 0, 1);
            if (!$id) error('Address ID required', 422);

            $stmt = $db->prepare("DELETE FROM addresses WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $user['id']]);
            success(null, 'Address deleted');
            break;

        default:
            error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Address error: " . $e->getMessage());
    error('Failed to process address', 500);
}
