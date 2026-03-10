<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error('Method not allowed', 405);
}

try {
    $input = getJsonInput();
    required($input, ['phone', 'firebase_uid']);

    $phone = sanitizeString($input['phone'] ?? '', 15);
    $firebaseUid = sanitizeString($input['firebase_uid'] ?? '', 128);
    $name = sanitizeString($input['name'] ?? '', 100);

    if (!validPhone($phone)) {
        error('Invalid phone number format', 422);
    }

    $db = Database::getConnection();

    // Find or create user
    $stmt = $db->prepare("SELECT id, phone, name, email, role, avatar_url, is_active FROM users WHERE phone = ?");
    $stmt->execute([$phone]);
    $user = $stmt->fetch();

    if (!$user) {
        // Create new customer
        $stmt = $db->prepare("INSERT INTO users (phone, name, firebase_uid, role) VALUES (?, ?, ?, 'customer')");
        $stmt->execute([$phone, $name ?: null, $firebaseUid]);
        $userId = $db->lastInsertId();

        $stmt = $db->prepare("SELECT id, phone, name, email, role, avatar_url, is_active FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
    } else {
        if (!$user['is_active']) {
            error('Account has been deactivated', 403);
        }
        // Update firebase uid if needed
        $stmt = $db->prepare("UPDATE users SET firebase_uid = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$firebaseUid, $user['id']]);
    }

    $token = JWT::generate($user['id'], $user['role']);
    $expiry = date('Y-m-d H:i:s', time() + (JWT_EXPIRY_DAYS * 86400));

    $stmt = $db->prepare("UPDATE users SET jwt_token = ?, token_expiry = ? WHERE id = ?");
    $stmt->execute([$token, $expiry, $user['id']]);

    success([
        'token' => $token,
        'user'  => $user
    ], 'Login successful');

} catch (PDOException $e) {
    error_log("Auth verify error: " . $e->getMessage());
    error('Authentication failed', 500);
}
