<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/response.php';

function handleImageUpload(string $fieldName, string $subfolder = 'food'): string {
    if (!isset($_FILES[$fieldName]) || $_FILES[$fieldName]['error'] !== UPLOAD_ERR_OK) {
        error('Image upload failed or no file provided', 422);
    }

    $file = $_FILES[$fieldName];

    if ($file['size'] > MAX_IMAGE_SIZE) {
        error('Image must be under 2MB', 422);
    }

    $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mime, $allowedMimes)) {
        error('Only JPG, PNG, WebP images are allowed', 422);
    }

    $ext = match($mime) {
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        default      => 'jpg'
    };

    $dir = UPLOAD_DIR . $subfolder . '/';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $filename = time() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
    $destPath = $dir . $filename;

    // Compress and resize using GD
    $image = match($mime) {
        'image/jpeg' => imagecreatefromjpeg($file['tmp_name']),
        'image/png'  => imagecreatefrompng($file['tmp_name']),
        'image/webp' => imagecreatefromwebp($file['tmp_name']),
        default      => null
    };

    if (!$image) {
        error('Failed to process image', 500);
    }

    [$origW, $origH] = getimagesize($file['tmp_name']);
    $maxW = 800;

    if ($origW > $maxW) {
        $scale = $maxW / $origW;
        $newW = $maxW;
        $newH = (int)($origH * $scale);
        $resized = imagecreatetruecolor($newW, $newH);

        if ($mime === 'image/png') {
            imagealphablending($resized, false);
            imagesavealpha($resized, true);
        }

        imagecopyresampled($resized, $image, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
        imagedestroy($image);
        $image = $resized;
    }

    $saved = match($ext) {
        'jpg'  => imagejpeg($image, $destPath, 80),
        'png'  => imagepng($image, $destPath, 8),
        'webp' => imagewebp($image, $destPath, 80),
        default => false
    };

    imagedestroy($image);

    if (!$saved) {
        error('Failed to save image', 500);
    }

    return UPLOAD_URL . $subfolder . '/' . $filename;
}
