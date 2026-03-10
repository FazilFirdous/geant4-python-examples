<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    error('Method not allowed', 405);
}

try {
    $user = getAuthUser();
    $input = getJsonInput();

    $name  = sanitizeString($input['name'] ?? '', 100);
    $email = sanitizeString($input['email'] ?? '', 150);

    if ($email && !validEmail($email)) {
        error('Invalid email address', 422);
    }

    $db = Database::getConnection();
    $stmt = $db->prepare("UPDATE users SET name = ?, email = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$name ?: null, $email ?: null, $user['id']]);

    $stmt = $db->prepare("SELECT id, phone, name, email, role, avatar_url FROM users WHERE id = ?");
    $stmt->execute([$user['id']]);
    $updated = $stmt->fetch();

    success($updated, 'Profile updated');

} catch (PDOException $e) {
    error_log("Profile update error: " . $e->getMessage());
    error('Failed to update profile', 500);
}
