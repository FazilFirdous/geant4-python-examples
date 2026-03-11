SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ═══ USERS ═══
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(15) NOT NULL UNIQUE,
    name VARCHAR(100) DEFAULT NULL,
    email VARCHAR(150) DEFAULT NULL,
    role ENUM('customer','restaurant_owner','delivery_boy','admin') NOT NULL DEFAULT 'customer',
    firebase_uid VARCHAR(128) DEFAULT NULL,
    jwt_token TEXT DEFAULT NULL,
    token_expiry DATETIME DEFAULT NULL,
    avatar_url VARCHAR(500) DEFAULT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_role (role),
    INDEX idx_firebase (firebase_uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ CUSTOMER ADDRESSES ═══
CREATE TABLE addresses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    label VARCHAR(50) DEFAULT 'Home',
    full_address TEXT NOT NULL,
    landmark VARCHAR(200) DEFAULT NULL,
    area VARCHAR(100) DEFAULT NULL,
    latitude DECIMAL(10,8) DEFAULT NULL,
    longitude DECIMAL(11,8) DEFAULT NULL,
    is_default TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ RESTAURANTS ═══
CREATE TABLE restaurants (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    owner_id INT UNSIGNED DEFAULT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT DEFAULT NULL,
    cuisine_tags VARCHAR(500) DEFAULT NULL,
    phone VARCHAR(15) DEFAULT NULL,
    full_address TEXT DEFAULT NULL,
    area VARCHAR(100) DEFAULT 'Kulgam Town',
    latitude DECIMAL(10,8) DEFAULT NULL,
    longitude DECIMAL(11,8) DEFAULT NULL,
    cover_image VARCHAR(500) DEFAULT NULL,
    logo_image VARCHAR(500) DEFAULT NULL,
    upi_id VARCHAR(100) DEFAULT NULL,
    rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
    total_reviews INT UNSIGNED NOT NULL DEFAULT 0,
    total_orders INT UNSIGNED NOT NULL DEFAULT 0,
    commission_percent DECIMAL(4,2) NOT NULL DEFAULT 12.00,
    min_order_amount INT NOT NULL DEFAULT 100,
    avg_prep_time_minutes INT NOT NULL DEFAULT 30,
    is_open TINYINT(1) NOT NULL DEFAULT 1,
    opens_at TIME DEFAULT '09:00:00',
    closes_at TIME DEFAULT '22:00:00',
    is_promoted TINYINT(1) NOT NULL DEFAULT 0,
    accepts_delivery TINYINT(1) NOT NULL DEFAULT 1,
    accepts_pickup TINYINT(1) NOT NULL DEFAULT 1,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_area (area),
    INDEX idx_active_open (is_active, is_open),
    FULLTEXT idx_search (name, cuisine_tags, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ DELIVERY BOYS (belong to restaurants) ═══
CREATE TABLE delivery_boys (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    restaurant_id INT UNSIGNED NULL DEFAULT NULL,  -- NULL = public pool rider
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    vehicle_type ENUM('bike','scooter','bicycle','walk') DEFAULT 'bike',
    vehicle_number VARCHAR(30) DEFAULT NULL,
    is_available TINYINT(1) NOT NULL DEFAULT 1,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    total_deliveries INT UNSIGNED NOT NULL DEFAULT 0,
    rating DECIMAL(2,1) NOT NULL DEFAULT 5.0,
    per_delivery_pay DECIMAL(6,2) NOT NULL DEFAULT 30.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL,
    INDEX idx_restaurant (restaurant_id),
    INDEX idx_available (restaurant_id, is_available, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ MENU CATEGORIES ═══
CREATE TABLE menu_categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_restaurant (restaurant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ MENU ITEMS ═══
CREATE TABLE menu_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT UNSIGNED NOT NULL,
    category_id INT UNSIGNED DEFAULT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT DEFAULT NULL,
    price DECIMAL(8,2) NOT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    is_veg TINYINT(1) NOT NULL DEFAULT 0,
    is_popular TINYINT(1) NOT NULL DEFAULT 0,
    is_available TINYINT(1) NOT NULL DEFAULT 1,
    prep_time_minutes INT NOT NULL DEFAULT 20,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE SET NULL,
    INDEX idx_restaurant (restaurant_id),
    INDEX idx_available (restaurant_id, is_available),
    FULLTEXT idx_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ ORDERS ═══
CREATE TABLE orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(25) NOT NULL UNIQUE,
    customer_id INT UNSIGNED NOT NULL,
    restaurant_id INT UNSIGNED NOT NULL,
    delivery_boy_id INT UNSIGNED DEFAULT NULL,
    address_id INT UNSIGNED DEFAULT NULL,

    order_type ENUM('delivery','pickup') NOT NULL DEFAULT 'delivery',

    status ENUM('placed','accepted','preparing','ready','picked_up','on_the_way','delivered','cancelled','delivery_issue') NOT NULL DEFAULT 'placed',

    delivery_status ENUM('assigned','public_pool','no_rider','picked_up','on_the_way','delivered') DEFAULT NULL,

    payment_method ENUM('cod','upi') NOT NULL DEFAULT 'cod',
    payment_status ENUM('pending','paid','refunded') NOT NULL DEFAULT 'pending',

    subtotal DECIMAL(8,2) NOT NULL,
    delivery_fee DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    platform_fee DECIMAL(6,2) NOT NULL DEFAULT 5.00,
    discount_amount DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    coupon_code VARCHAR(50) DEFAULT NULL,
    total_amount DECIMAL(8,2) NOT NULL,
    commission_amount DECIMAL(8,2) NOT NULL DEFAULT 0.00,

    special_instructions TEXT DEFAULT NULL,
    customer_note_delivery TEXT DEFAULT NULL,
    restaurant_note TEXT DEFAULT NULL,

    estimated_prep_minutes INT DEFAULT NULL,
    estimated_delivery_minutes INT DEFAULT NULL,

    placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP NULL DEFAULT NULL,
    preparing_at TIMESTAMP NULL DEFAULT NULL,
    ready_at TIMESTAMP NULL DEFAULT NULL,
    picked_up_at TIMESTAMP NULL DEFAULT NULL,
    delivered_at TIMESTAMP NULL DEFAULT NULL,
    cancelled_at TIMESTAMP NULL DEFAULT NULL,
    cancel_reason TEXT DEFAULT NULL,
    cancelled_by ENUM('customer','restaurant','admin') DEFAULT NULL,

    is_scheduled TINYINT(1) NOT NULL DEFAULT 0,
    scheduled_for DATETIME DEFAULT NULL,

    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (delivery_boy_id) REFERENCES delivery_boys(id) ON DELETE SET NULL,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL,
    INDEX idx_customer (customer_id),
    INDEX idx_restaurant_status (restaurant_id, status),
    INDEX idx_delivery_boy (delivery_boy_id),
    INDEX idx_status (status),
    INDEX idx_placed (placed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ ORDER ITEMS ═══
CREATE TABLE order_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    menu_item_id INT UNSIGNED NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    item_price DECIMAL(8,2) NOT NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    special_notes TEXT DEFAULT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
    INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ REVIEWS ═══
CREATE TABLE reviews (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL UNIQUE,
    customer_id INT UNSIGNED NOT NULL,
    restaurant_id INT UNSIGNED NOT NULL,
    food_rating TINYINT NOT NULL CHECK (food_rating BETWEEN 1 AND 5),
    delivery_rating TINYINT DEFAULT NULL CHECK (delivery_rating BETWEEN 1 AND 5),
    comment TEXT DEFAULT NULL,
    restaurant_reply TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    INDEX idx_restaurant (restaurant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ COUPONS ═══
CREATE TABLE coupons (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('percentage','flat') NOT NULL DEFAULT 'percentage',
    discount_value DECIMAL(6,2) NOT NULL,
    max_discount DECIMAL(6,2) DEFAULT NULL,
    min_order_amount DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    usage_limit INT NOT NULL DEFAULT 100,
    used_count INT NOT NULL DEFAULT 0,
    per_user_limit INT NOT NULL DEFAULT 1,
    valid_from DATETIME NOT NULL,
    valid_until DATETIME NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ COUPON USAGE TRACKING ═══
CREATE TABLE coupon_usage (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    coupon_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    order_id INT UNSIGNED NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    UNIQUE KEY unique_user_coupon (coupon_id, user_id, order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ DELIVERY FEE CONFIG ═══
CREATE TABLE delivery_config (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fee_type ENUM('flat','per_area') NOT NULL DEFAULT 'flat',
    base_fee DECIMAL(6,2) NOT NULL DEFAULT 25.00,
    free_delivery_above DECIMAL(8,2) NOT NULL DEFAULT 500.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ AREA-BASED DELIVERY FEES ═══
CREATE TABLE area_fees (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    area_name VARCHAR(100) NOT NULL UNIQUE,
    delivery_fee DECIMAL(6,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ PROMO BANNERS ═══
CREATE TABLE promo_banners (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(300) DEFAULT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    link_url VARCHAR(500) DEFAULT NULL,
    coupon_code VARCHAR(50) DEFAULT NULL,
    bg_gradient VARCHAR(200) DEFAULT 'linear-gradient(135deg, #D1386C, #8C1D47)',
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    valid_until DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ SUPPORT TICKETS ═══
CREATE TABLE support_tickets (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED NOT NULL,
    order_id INT UNSIGNED DEFAULT NULL,
    issue_type ENUM('order_tracking','cancellation','refund','wrong_item','quality','delivery','other') NOT NULL DEFAULT 'other',
    message TEXT NOT NULL,
    status ENUM('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
    admin_response TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ PUBLIC DELIVERY POOL ═══
CREATE TABLE public_delivery_pool (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL UNIQUE,
    restaurant_id INT UNSIGNED NOT NULL,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    offered_pay DECIMAL(6,2) NOT NULL DEFAULT 40.00,
    status ENUM('open','claimed','expired') NOT NULL DEFAULT 'open',
    claimed_by INT UNSIGNED DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (claimed_by) REFERENCES delivery_boys(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_open_orders (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ WEEKLY SETTLEMENTS ═══
CREATE TABLE weekly_settlements (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT UNSIGNED NOT NULL,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    total_orders INT UNSIGNED NOT NULL DEFAULT 0,
    gross_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    commission_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    delivery_fees_collected DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    net_payout DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status ENUM('pending','paid','disputed') NOT NULL DEFAULT 'pending',
    paid_at TIMESTAMP NULL DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    INDEX idx_restaurant_week (restaurant_id, week_start),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══ DEFAULT DATA ═══

INSERT INTO delivery_config (fee_type, base_fee, free_delivery_above) VALUES ('per_area', 25.00, 500.00);

INSERT INTO area_fees (area_name, delivery_fee) VALUES
('Kulgam Town', 25.00), ('Qaimoh', 35.00), ('Yaripora', 40.00),
('DH Pora', 45.00), ('Devsar', 50.00), ('Frisal', 40.00);

INSERT INTO coupons (code, discount_type, discount_value, max_discount, min_order_amount, usage_limit, per_user_limit, valid_from, valid_until)
VALUES ('KULGAM50', 'percentage', 50.00, 150.00, 199.00, 1000, 1, NOW(), DATE_ADD(NOW(), INTERVAL 6 MONTH));

INSERT INTO promo_banners (title, subtitle, coupon_code, bg_gradient, sort_order) VALUES
('50% OFF', 'Your first order — Use code KULGAM50', 'KULGAM50', 'linear-gradient(135deg, #D1386C, #8C1D47)', 1),
('Free Delivery', 'On orders above ₹499 — No code needed', NULL, 'linear-gradient(135deg, #1DB954, #0D7A3A)', 2),
('Wazwan Festival', 'Flat ₹100 off on all Wazwan dishes', NULL, 'linear-gradient(135deg, #4A00E0, #8E2DE2)', 3);

-- Create admin user (UPDATE phone number before deploying)
INSERT INTO users (phone, name, role) VALUES ('+919999999999', 'Fazil - Admin', 'admin');

SET FOREIGN_KEY_CHECKS = 1;
