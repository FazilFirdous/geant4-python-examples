<?php
function setCorsHeaders(): void {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Content-Type: application/json; charset=utf-8');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function success(mixed $data = null, string $message = 'Success', int $code = 200): void {
    http_response_code($code);
    echo json_encode(['success' => true, 'data' => $data, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function error(string $message = 'Error', int $code = 400, mixed $data = null): void {
    http_response_code($code);
    echo json_encode(['success' => false, 'data' => $data, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function getInput(): array {
    $body = file_get_contents('php://input');
    $data = json_decode($body, true) ?? [];
    return array_merge($_GET, $_POST, $data);
}

function getJsonInput(): array {
    $body = file_get_contents('php://input');
    return json_decode($body, true) ?? [];
}
