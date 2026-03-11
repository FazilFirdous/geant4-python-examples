<?php
/**
 * CORA Demo Login — no OTP, no Firebase
 * POST { phone: "+919876543210", role: "customer|restaurant_owner|admin" }
 * Returns { success: true, data: { token, user } }
 */
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error('Method not allowed', 405);
}

try {
    $body  = json_decode(file_get_contents('php://input'), true) ?? [];
    $phone = trim($body['phone'] ?? '');
    $role  = trim($body['role']  ?? 'customer');

    if (empty($phone)) {
        error('Phone number is required', 422);
    }

    // Normalise phone: strip non-digits except leading +
    $phone = preg_replace('/[^\d+]/', '', $phone);
    if (!str_starts_with($phone, '+')) {
        $phone = '+91' . ltrim($phone, '0');
    }

    $allowedRoles = ['customer', 'restaurant_owner', 'admin'];
    if (!in_array($role, $allowedRoles)) {
        $role = 'customer';
    }

    $db = Database::getConnection();

    // Find existing user by phone
    $stmt = $db->prepare("SELECT id, phone, name, email, role, avatar_url, is_active FROM users WHERE phone = ?");
    $stmt->execute([$phone]);
    $user = $stmt->fetch();

    if (!$user) {
        // Create new user
        $name = match($role) {
            'admin'            => 'Cora Admin',
            'restaurant_owner' => 'Restaurant Owner',
            default            => 'Guest User',
        };
        $stmt = $db->prepare("INSERT INTO users (phone, name, role, is_active) VALUES (?, ?, ?, 1)");
        $stmt->execute([$phone, $name, $role]);
        $userId = $db->lastInsertId();

        $stmt = $db->prepare("SELECT id, phone, name, email, role, avatar_url, is_active FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
    } else {
        if (!$user['is_active']) {
            error('Account has been deactivated', 403);
        }
        // Update role if escalating (only for demo)
        if (DEMO_MODE && $user['role'] !== $role) {
            $stmt = $db->prepare("UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([$role, $user['id']]);
            $user['role'] = $role;
        }
    }

    $token  = JWT::generate($user['id'], $user['role']);
    $expiry = date('Y-m-d H:i:s', time() + (JWT_EXPIRY_DAYS * 86400));

    $stmt = $db->prepare("UPDATE users SET jwt_token = ?, token_expiry = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$token, $expiry, $user['id']]);

    success([
        'token' => $token,
        'user'  => $user,
    ], 'Login successful');

} catch (PDOException $e) {
    error_log("demo-login error: " . $e->getMessage());
    error('Login failed — database error', 500);
} catch (Throwable $e) {
    error_log("demo-login exception: " . $e->getMessage());
    error('Login failed', 500);
}
