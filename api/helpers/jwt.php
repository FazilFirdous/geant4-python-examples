<?php
require_once __DIR__ . '/../config/config.php';

class JWT {
    public static function encode(array $payload): string {
        $header = self::base64url(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload = self::base64url(json_encode($payload));
        $signature = self::base64url(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
        return "$header.$payload.$signature";
    }

    public static function decode(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        [$header, $payload, $signature] = $parts;
        $expected = self::base64url(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));

        if (!hash_equals($expected, $signature)) return null;

        $data = json_decode(self::base64urlDecode($payload), true);
        if (!$data) return null;

        if (isset($data['exp']) && $data['exp'] < time()) return null;

        return $data;
    }

    public static function generate(int $userId, string $role): string {
        $now = time();
        return self::encode([
            'user_id' => $userId,
            'role'    => $role,
            'iat'     => $now,
            'exp'     => $now + (JWT_EXPIRY_DAYS * 86400)
        ]);
    }

    private static function base64url(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64urlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
    }
}
