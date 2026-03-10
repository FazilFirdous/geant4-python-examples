<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

try {
    $user = getAuthUser('restaurant_owner');
    $db   = Database::getConnection();

    $stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);

    $rid = $restaurant['id'];

    $stmt = $db->prepare("SELECT * FROM menu_categories WHERE restaurant_id = ? ORDER BY sort_order ASC");
    $stmt->execute([$rid]);
    $categories = $stmt->fetchAll();

    $stmt = $db->prepare("SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY category_id, sort_order ASC");
    $stmt->execute([$rid]);
    $items = $stmt->fetchAll();

    $itemsByCategory = [];
    foreach ($items as $item) {
        $itemsByCategory[$item['category_id'] ?? 0][] = $item;
    }

    $menu = [];
    foreach ($categories as $cat) {
        $cat['items'] = $itemsByCategory[$cat['id']] ?? [];
        $menu[] = $cat;
    }

    if (!empty($itemsByCategory[0])) {
        $menu[] = ['id' => null, 'name' => 'Uncategorized', 'items' => $itemsByCategory[0]];
    }

    success($menu, 'Menu retrieved');

} catch (PDOException $e) {
    error_log("Menu error: " . $e->getMessage());
    error('Failed to load menu', 500);
}
