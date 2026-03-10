<?php
require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/response.php';
require_once __DIR__ . '/../config/database.php';

function getAuthUser(string ...$requiredRoles): array {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
        error('Authentication required', 401);
    }

    $token = substr($authHeader, 7);
    $payload = JWT::decode($token);

    if (!$payload) {
        error('Invalid or expired token', 401);
    }

    if (!empty($requiredRoles) && !in_array($payload['role'], $requiredRoles)) {
        error('Access denied', 403);
    }

    // Verify user exists and is active
    $db = Database::getConnection();
    $stmt = $db->prepare("SELECT id, phone, name, email, role, avatar_url, is_active FROM users WHERE id = ?");
    $stmt->execute([$payload['user_id']]);
    $user = $stmt->fetch();

    if (!$user || !$user['is_active']) {
        error('Account not found or deactivated', 401);
    }

    return $user;
}

function optionalAuth(): ?array {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
        return null;
    }

    $token = substr($authHeader, 7);
    $payload = JWT::decode($token);
    if (!$payload) return null;

    $db = Database::getConnection();
    $stmt = $db->prepare("SELECT id, phone, name, email, role, avatar_url, is_active FROM users WHERE id = ?");
    $stmt->execute([$payload['user_id']]);
    $user = $stmt->fetch();

    return ($user && $user['is_active']) ? $user : null;
}
