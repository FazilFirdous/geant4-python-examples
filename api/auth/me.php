<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    error('Method not allowed', 405);
}

try {
    $user = getAuthUser();
    success($user, 'User profile retrieved');
} catch (Exception $e) {
    error_log("Auth me error: " . $e->getMessage());
    error('Failed to get user', 500);
}
