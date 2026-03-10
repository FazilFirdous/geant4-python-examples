<?php
function required(array $data, array $fields): void {
    foreach ($fields as $field) {
        if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
            error("Field '$field' is required", 422);
        }
    }
}

function sanitizeString(?string $str, int $maxLen = 500): string {
    if ($str === null) return '';
    return mb_substr(strip_tags(trim($str)), 0, $maxLen);
}

function sanitizeInt(mixed $val, int $min = 0, int $max = PHP_INT_MAX): int {
    $v = (int) $val;
    return max($min, min($max, $v));
}

function sanitizeFloat(mixed $val, float $min = 0): float {
    $v = (float) $val;
    return max($min, $v);
}

function validPhone(string $phone): bool {
    return (bool) preg_match('/^\+?[0-9]{10,15}$/', $phone);
}

function validEmail(string $email): bool {
    return (bool) filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validEnum(mixed $value, array $allowed): bool {
    return in_array($value, $allowed, true);
}
