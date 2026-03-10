<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
getAuthUser('admin');
$db = Database::getConnection();

try {
    if ($method === 'GET') {
        $stmt = $db->prepare("SELECT * FROM delivery_config LIMIT 1");
        $stmt->execute();
        $config = $stmt->fetch();

        $stmt = $db->prepare("SELECT * FROM area_fees ORDER BY area_name ASC");
        $stmt->execute();
        $areaFees = $stmt->fetchAll();

        success(['config' => $config, 'area_fees' => $areaFees], 'Config retrieved');

    } elseif ($method === 'PUT') {
        $input = getJsonInput();

        if (isset($input['fee_type'])) {
            $feeType         = sanitizeString($input['fee_type'], 10);
            $baseFee         = sanitizeFloat($input['base_fee'] ?? 25);
            $freeDeliveryAbove = sanitizeFloat($input['free_delivery_above'] ?? 500);

            $db->prepare("UPDATE delivery_config SET fee_type=?, base_fee=?, free_delivery_above=? WHERE id=1")
               ->execute([$feeType, $baseFee, $freeDeliveryAbove]);
        }

        // Update area fees
        if (!empty($input['area_fees']) && is_array($input['area_fees'])) {
            foreach ($input['area_fees'] as $af) {
                $areaName = sanitizeString($af['area_name'] ?? '', 100);
                $fee      = sanitizeFloat($af['delivery_fee'] ?? 25);
                if ($areaName) {
                    $db->prepare("INSERT INTO area_fees (area_name, delivery_fee) VALUES (?,?) ON DUPLICATE KEY UPDATE delivery_fee=?")
                       ->execute([$areaName, $fee, $fee]);
                }
            }
        }

        success(null, 'Delivery config updated');

    } else {
        error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Delivery config error: " . $e->getMessage());
    error('Failed to process config', 500);
}
