<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'cora_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('JWT_SECRET', 'cora-kulgam-secret-key-change-before-production-2024');
define('UPLOAD_DIR', __DIR__ . '/../../uploads/');
define('UPLOAD_URL', '/cora/uploads/');
define('MAX_IMAGE_SIZE', 2 * 1024 * 1024); // 2MB
define('APP_NAME', 'CORA');
define('APP_VERSION', '1.0.0');
define('JWT_EXPIRY_DAYS', 90);
define('ERROR_LOG', __DIR__ . '/../../logs/error.log');
define('DEMO_MODE', true);
