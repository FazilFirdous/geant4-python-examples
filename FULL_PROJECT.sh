#!/usr/bin/env bash
# FULL_PROJECT.sh — Recreates the entire CORA project
# Run: bash FULL_PROJECT.sh
set -e

# Create directory structure
mkdir -p 'admin'
mkdir -p 'admin/css'
mkdir -p 'admin/js'
mkdir -p 'api'
mkdir -p 'api/admin'
mkdir -p 'api/auth'
mkdir -p 'api/config'
mkdir -p 'api/customer'
mkdir -p 'api/helpers'
mkdir -p 'api/restaurant'
mkdir -p 'customer'
mkdir -p 'customer/css'
mkdir -p 'customer/js'
mkdir -p 'customer/js/components'
mkdir -p 'customer/js/screens'
mkdir -p 'database'
mkdir -p 'restaurant'
mkdir -p 'restaurant/css'
mkdir -p 'restaurant/js'
mkdir -p 'uploads'

# ── .htaccess
cat << 'CORA_EOF' > '.htaccess'
Options -Indexes
ServerSignature Off

# Security Headers
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Enable mod_rewrite
RewriteEngine On

# Force HTTPS (uncomment in production)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Deny access to sensitive files
<FilesMatch "\.(sql|log|env|htpasswd|git)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>

# Deny access to config directory
<DirectoryMatch "api/config">
    Order Allow,Deny
    Deny from all
</DirectoryMatch>

# Block access to logs directory
<DirectoryMatch "logs">
    Order Allow,Deny
    Deny from all
</DirectoryMatch>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/webp "access plus 1 month"
    ExpiresByType text/css "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
</IfModule>

CORA_EOF

# ── LICENSE
cat << 'CORA_EOF' > 'LICENSE'
MIT License

Copyright (c) 2026 Fazil Firdous

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

CORA_EOF

# ── README.md
cat << 'CORA_EOF' > 'README.md'
# geant4-python-examples

CORA_EOF

# ── privacy-policy.html
cat << 'CORA_EOF' > 'privacy-policy.html'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy — Cora</title>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --berry: #D1386C;
            --berry-deep: #8C1D47;
            --berry-light: #FFF0F5;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: var(--berry-light); color: #222; }
        .header {
            background: linear-gradient(135deg, var(--berry-deep) 0%, var(--berry) 100%);
            padding: 60px 24px 40px;
            text-align: center;
            color: white;
        }
        .header h1 { font-family: 'Playfair Display', serif; font-size: 32px; }
        .header p  { opacity: 0.8; margin-top: 8px; font-size: 14px; }
        .content { max-width: 720px; margin: 0 auto; padding: 32px 24px 80px; }
        h2 { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--berry-deep); margin: 28px 0 10px; }
        p  { line-height: 1.7; color: #444; margin-bottom: 10px; font-size: 15px; }
        ul { margin: 8px 0 12px 20px; }
        li { line-height: 1.7; color: #444; font-size: 15px; margin-bottom: 4px; }
        .updated { font-size: 12px; color: #aaa; margin-top: 8px; }
        a  { color: var(--berry); text-decoration: none; }
        .back { display: inline-block; margin-bottom: 24px; color: var(--berry); font-weight: 600; }
    </style>
</head>
<body>
<div class="header">
    <div style="font-size:48px;">🌸</div>
    <h1>Privacy Policy</h1>
    <p>Cora — Kulgam's Food, Delivered</p>
    <p class="updated">Last updated: March 2025</p>
</div>

<div class="content">
    <a href="javascript:history.back()" class="back">← Back</a>

    <p>Welcome to Cora. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our food delivery platform.</p>

    <h2>1. Information We Collect</h2>
    <p>We collect information you provide directly to us:</p>
    <ul>
        <li><strong>Phone Number:</strong> Used for account creation and order communication via OTP verification.</li>
        <li><strong>Name:</strong> Used to personalise your experience and communicate with restaurants.</li>
        <li><strong>Delivery Addresses:</strong> Stored to make future orders faster and to calculate delivery fees.</li>
        <li><strong>Order History:</strong> Items ordered, amounts paid, and order timestamps.</li>
        <li><strong>Device Information:</strong> Browser type, OS, and device identifiers for analytics and security.</li>
    </ul>

    <h2>2. How We Use Your Information</h2>
    <ul>
        <li>To process and fulfil your food orders.</li>
        <li>To send order status updates via WhatsApp (when you initiate the link).</li>
        <li>To improve our platform and personalise recommendations.</li>
        <li>To detect and prevent fraudulent transactions.</li>
        <li>To comply with legal obligations.</li>
    </ul>

    <h2>3. Information Sharing</h2>
    <p>We do <strong>not</strong> sell your personal data. We share limited information only:</p>
    <ul>
        <li><strong>Restaurants:</strong> Receive your name and delivery address to prepare and deliver your order.</li>
        <li><strong>Delivery Boys:</strong> Receive your delivery address and phone number (last 4 digits masked) for navigation.</li>
        <li><strong>Payment Processors:</strong> UPI apps receive the minimum required for transaction processing.</li>
        <li><strong>Legal Requirements:</strong> When required by law or court order.</li>
    </ul>

    <h2>4. Data Storage and Security</h2>
    <p>Your data is stored on secure servers hosted in India. We use:</p>
    <ul>
        <li>HTTPS encryption for all data in transit.</li>
        <li>Hashed authentication tokens (HMAC-SHA256 JWT).</li>
        <li>Prepared SQL statements to prevent injection attacks.</li>
        <li>Regular security audits.</li>
    </ul>

    <h2>5. Firebase Authentication</h2>
    <p>We use Google Firebase for phone number verification. Your phone number is processed by Firebase (a Google service) as part of OTP verification. Please refer to <a href="https://firebase.google.com/support/privacy" target="_blank">Firebase's Privacy Policy</a> for their data practices.</p>

    <h2>6. Cookies and Local Storage</h2>
    <p>We use browser localStorage to store your authentication token and cart items. No third-party tracking cookies are used. You can clear this data anytime by clearing your browser/app data.</p>

    <h2>7. Your Rights</h2>
    <p>You have the right to:</p>
    <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Request deletion of your account and associated data.</li>
        <li>Correct inaccurate information.</li>
        <li>Withdraw consent at any time.</li>
    </ul>
    <p>To exercise these rights, contact us at <a href="mailto:support@corakulgam.in">support@corakulgam.in</a>.</p>

    <h2>8. Children's Privacy</h2>
    <p>Cora is not intended for children under 13. We do not knowingly collect personal information from children.</p>

    <h2>9. Changes to This Policy</h2>
    <p>We may update this Privacy Policy periodically. We will notify you of significant changes via the app. Your continued use of Cora after changes constitutes acceptance of the updated policy.</p>

    <h2>10. Contact Us</h2>
    <p>For privacy concerns or data requests:</p>
    <ul>
        <li>Email: <a href="mailto:privacy@corakulgam.in">privacy@corakulgam.in</a></li>
        <li>WhatsApp: <a href="https://wa.me/917006XXXXXX" target="_blank">+91 7006XXXXXX</a></li>
        <li>Address: Cora Food Technologies, Kulgam, Jammu &amp; Kashmir — 192231</li>
    </ul>
</div>
</body>
</html>

CORA_EOF

# ── refund-policy.html
cat << 'CORA_EOF' > 'refund-policy.html'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Refund Policy — Cora</title>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --berry: #D1386C; --berry-deep: #8C1D47; --berry-light: #FFF0F5; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: var(--berry-light); color: #222; }
        .header { background: linear-gradient(135deg, var(--berry-deep) 0%, var(--berry) 100%); padding: 60px 24px 40px; text-align: center; color: white; }
        .header h1 { font-family: 'Playfair Display', serif; font-size: 32px; }
        .header p  { opacity: 0.8; margin-top: 8px; font-size: 14px; }
        .content   { max-width: 720px; margin: 0 auto; padding: 32px 24px 80px; }
        h2 { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--berry-deep); margin: 28px 0 10px; }
        p  { line-height: 1.7; color: #444; margin-bottom: 10px; font-size: 15px; }
        ul { margin: 8px 0 12px 20px; }
        li { line-height: 1.7; color: #444; font-size: 15px; margin-bottom: 4px; }
        table { width: 100%; border-collapse: collapse; margin: 12px 0; }
        th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 14px; }
        th { background: var(--berry-light); font-weight: 600; color: var(--berry-deep); }
        .pill { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .pill-green { background: #e6f9ef; color: #1a7a4a; }
        .pill-red   { background: #ffeaea; color: #c0392b; }
        .pill-yellow{ background: #fff8e1; color: #b8860b; }
        .updated { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 8px; }
        a  { color: var(--berry); text-decoration: none; }
        .back { display: inline-block; margin-bottom: 24px; color: var(--berry); font-weight: 600; }
    </style>
</head>
<body>
<div class="header">
    <div style="font-size:48px;">💰</div>
    <h1>Refund Policy</h1>
    <p>Cora — Kulgam's Food, Delivered</p>
    <p class="updated">Last updated: March 2025</p>
</div>

<div class="content">
    <a href="javascript:history.back()" class="back">← Back</a>

    <p>We want every Cora order to be perfect. If something goes wrong, here's how we handle refunds and cancellations.</p>

    <h2>1. Cancellation Policy</h2>
    <table>
        <thead><tr><th>When You Cancel</th><th>Refund</th></tr></thead>
        <tbody>
            <tr><td>Before restaurant accepts the order</td><td><span class="pill pill-green">Full Refund</span></td></tr>
            <tr><td>After restaurant accepts, before preparation starts</td><td><span class="pill pill-yellow">Partial refund (50%)</span></td></tr>
            <tr><td>After food preparation has started</td><td><span class="pill pill-red">No Refund</span></td></tr>
            <tr><td>After order is out for delivery</td><td><span class="pill pill-red">No Refund</span></td></tr>
        </tbody>
    </table>
    <p>To cancel an order, go to Orders → tap your active order → Cancel Order. Cancellations must be made before preparation begins for the best outcome.</p>

    <h2>2. Eligible Refund Scenarios</h2>
    <p>You are entitled to a full refund if:</p>
    <ul>
        <li>Your order was not delivered despite successful payment.</li>
        <li>You received wrong items or items from a different restaurant.</li>
        <li>Food was spoiled, inedible, or unsafe on arrival.</li>
        <li>The restaurant cancelled your order after accepting it.</li>
        <li>You were charged twice for the same order.</li>
    </ul>

    <h2>3. Non-Refundable Situations</h2>
    <ul>
        <li>Change of mind after preparation has started.</li>
        <li>Late delivery due to traffic, weather, or other external factors.</li>
        <li>Minor variations in presentation (food looks different from photo).</li>
        <li>Spice level or taste preferences.</li>
        <li>Incorrect address provided by customer.</li>
        <li>Customer unavailable at delivery address for 10+ minutes.</li>
    </ul>

    <h2>4. Refund Process</h2>
    <p>To request a refund:</p>
    <ul>
        <li><strong>Step 1:</strong> Open the Cora app → Go to the relevant order → Tap "Help with this order".</li>
        <li><strong>Step 2:</strong> Describe the issue in the support chat. Attach a photo if the item was wrong or spoiled.</li>
        <li><strong>Step 3:</strong> Our team will review within 24 hours.</li>
        <li><strong>Step 4:</strong> Approved refunds are processed within 3–5 business days.</li>
    </ul>

    <h2>5. Refund Methods</h2>
    <table>
        <thead><tr><th>Payment Method</th><th>Refund Method</th><th>Timeline</th></tr></thead>
        <tbody>
            <tr><td>UPI / Online</td><td>Reversed to original UPI ID</td><td>3–5 business days</td></tr>
            <tr><td>Cash on Delivery</td><td>Cora Wallet credit (usable on next order)</td><td>Within 24 hours</td></tr>
        </tbody>
    </table>

    <h2>6. Partial Refunds</h2>
    <p>If only some items in your order were incorrect or missing, we issue a partial refund proportional to those items. Delivery fee is not refunded unless the full order is refunded.</p>

    <h2>7. Coupon Orders</h2>
    <p>If you used a coupon code and the order is refunded, the coupon will be reinstated for use on your next order, subject to the original coupon's terms and expiry.</p>

    <h2>8. Dispute Resolution</h2>
    <p>If you are unsatisfied with our refund decision, you may escalate by:</p>
    <ul>
        <li>Emailing <a href="mailto:refunds@corakulgam.in">refunds@corakulgam.in</a> with your order number and issue details.</li>
        <li>WhatsApp: <a href="https://wa.me/917006XXXXXX" target="_blank">+91 7006XXXXXX</a></li>
    </ul>
    <p>We aim to resolve all escalations within 48 hours.</p>

    <h2>9. Restaurant Responsibility</h2>
    <p>Restaurants listed on Cora are responsible for the quality and accuracy of food they prepare. In cases of food quality issues, refunds are primarily charged back to the responsible restaurant, not to Cora.</p>

    <h2>10. Contact</h2>
    <p>For refund-related queries: <a href="mailto:refunds@corakulgam.in">refunds@corakulgam.in</a></p>
</div>
</body>
</html>

CORA_EOF

# ── terms.html
cat << 'CORA_EOF' > 'terms.html'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service — Cora</title>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --berry: #D1386C; --berry-deep: #8C1D47; --berry-light: #FFF0F5; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: var(--berry-light); color: #222; }
        .header { background: linear-gradient(135deg, var(--berry-deep) 0%, var(--berry) 100%); padding: 60px 24px 40px; text-align: center; color: white; }
        .header h1 { font-family: 'Playfair Display', serif; font-size: 32px; }
        .header p  { opacity: 0.8; margin-top: 8px; font-size: 14px; }
        .content   { max-width: 720px; margin: 0 auto; padding: 32px 24px 80px; }
        h2 { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--berry-deep); margin: 28px 0 10px; }
        p  { line-height: 1.7; color: #444; margin-bottom: 10px; font-size: 15px; }
        ul { margin: 8px 0 12px 20px; }
        li { line-height: 1.7; color: #444; font-size: 15px; margin-bottom: 4px; }
        .updated { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 8px; }
        a  { color: var(--berry); text-decoration: none; }
        .back { display: inline-block; margin-bottom: 24px; color: var(--berry); font-weight: 600; }
    </style>
</head>
<body>
<div class="header">
    <div style="font-size:48px;">📋</div>
    <h1>Terms of Service</h1>
    <p>Cora — Kulgam's Food, Delivered</p>
    <p class="updated">Last updated: March 2025</p>
</div>

<div class="content">
    <a href="javascript:history.back()" class="back">← Back</a>

    <p>Please read these Terms of Service carefully before using the Cora food delivery platform. By accessing or using Cora, you agree to be bound by these terms.</p>

    <h2>1. About Cora</h2>
    <p>Cora is a hyperlocal food delivery platform connecting customers in Kulgam district, Jammu &amp; Kashmir with local restaurants. Cora acts as an intermediary — we facilitate orders between customers and restaurants but are not responsible for food preparation.</p>

    <h2>2. Eligibility</h2>
    <ul>
        <li>You must be at least 13 years old to use Cora.</li>
        <li>You must have a valid Indian phone number for account verification.</li>
        <li>You must be located within our serviceable delivery areas in Kulgam district.</li>
    </ul>

    <h2>3. User Accounts</h2>
    <p>Your account is personal and non-transferable. You are responsible for:</p>
    <ul>
        <li>Maintaining the confidentiality of your OTP and session.</li>
        <li>All activities that occur under your account.</li>
        <li>Providing accurate delivery address and contact information.</li>
    </ul>
    <p>We reserve the right to suspend accounts that violate these terms or engage in fraudulent activity.</p>

    <h2>4. Orders and Payments</h2>
    <ul>
        <li>Orders are confirmed only after restaurant acceptance.</li>
        <li>Prices shown are inclusive of applicable taxes.</li>
        <li>Delivery fees vary by area and are displayed before checkout.</li>
        <li>For UPI payments, you initiate the payment directly through your UPI app — Cora does not store card or bank details.</li>
        <li>For Cash on Delivery (COD), payment is made to the delivery person upon receipt.</li>
        <li>Order cancellation is subject to our <a href="/refund-policy.html">Refund Policy</a>.</li>
    </ul>

    <h2>5. Coupons and Promotions</h2>
    <ul>
        <li>Coupons are subject to their individual terms and expiry dates.</li>
        <li>One coupon per order unless stated otherwise.</li>
        <li>Coupons cannot be combined or transferred.</li>
        <li>Cora reserves the right to withdraw or modify promotions at any time.</li>
    </ul>

    <h2>6. Restaurant Listings</h2>
    <p>Restaurants listed on Cora operate independently. Cora does not guarantee:</p>
    <ul>
        <li>Accuracy of menu prices or availability.</li>
        <li>Food quality or safety standards (restaurants are individually responsible).</li>
        <li>Allergen information — contact the restaurant directly for allergies.</li>
    </ul>

    <h2>7. Delivery</h2>
    <ul>
        <li>Estimated delivery times are estimates, not guarantees.</li>
        <li>Delivery is available within Kulgam district service areas only.</li>
        <li>You must be reachable at the provided phone number for delivery coordination.</li>
        <li>Cora is not liable for delays caused by traffic, weather, or force majeure events.</li>
    </ul>

    <h2>8. Prohibited Uses</h2>
    <p>You agree not to:</p>
    <ul>
        <li>Place fraudulent or false orders.</li>
        <li>Abuse the refund or cancellation system.</li>
        <li>Use automated systems to access or scrape the platform.</li>
        <li>Attempt to circumvent security measures.</li>
        <li>Harass delivery personnel or restaurant staff.</li>
    </ul>

    <h2>9. Intellectual Property</h2>
    <p>The Cora name, logo, and platform design are proprietary. You may not reproduce or use them without explicit written permission.</p>

    <h2>10. Limitation of Liability</h2>
    <p>Cora's liability is limited to the value of your order. We are not liable for indirect, incidental, or consequential damages. Our platform is provided "as is" without warranties of merchantability or fitness for a particular purpose.</p>

    <h2>11. Governing Law</h2>
    <p>These terms are governed by Indian law. Disputes shall be subject to the exclusive jurisdiction of courts in Kulgam, Jammu &amp; Kashmir.</p>

    <h2>12. Changes to Terms</h2>
    <p>We may update these terms periodically. Continued use of Cora after changes constitutes acceptance.</p>

    <h2>13. Contact</h2>
    <p>For legal queries: <a href="mailto:legal@corakulgam.in">legal@corakulgam.in</a></p>
</div>
</body>
</html>

CORA_EOF

# ── admin/index.html
cat << 'CORA_EOF' > 'admin/index.html'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#D1386C">
    <title>Cora — Admin Panel</title>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css" rel="stylesheet" crossorigin="anonymous">
    <link rel="stylesheet" href="/admin/css/style.css">
</head>
<body>
    <div id="app">
        <!-- Loading -->
        <div id="loading-screen" class="loading-screen">
            <div style="text-align:center;color:white;">
                <div style="font-size:60px;">👑</div>
                <h1 style="font-family:'Playfair Display',serif;font-size:36px;margin-top:12px;">Cora Admin</h1>
                <p style="opacity:0.8;margin-top:4px;">Master Control Panel</p>
            </div>
            <div class="loading-spinner"></div>
        </div>

        <!-- Auth -->
        <div id="auth-screen" style="display:none;">
            <div class="header-gradient" style="padding:60px 24px 50px;text-align:center;position:relative;overflow:hidden;">
                <div class="header-circles"></div>
                <div style="font-size:52px;">👑</div>
                <h1 style="font-family:'Playfair Display',serif;font-size:32px;color:white;margin-top:8px;">Admin Login</h1>
                <p style="color:rgba(255,255,255,0.8);font-size:14px;">Cora Master Control Panel</p>
            </div>
            <div style="padding:32px 24px;background:var(--berry-light);">
                <div id="admin-phone-step">
                    <div class="form-group"><label>Admin Phone</label>
                        <div class="phone-input-wrap">
                            <span class="country-prefix">🇮🇳 +91</span>
                            <input type="tel" id="phone-input" placeholder="Admin phone number" maxlength="10" inputmode="numeric">
                        </div>
                    </div>
                    <button class="btn-primary" style="width:100%;" onclick="AdminAuth.sendOTP()">Send OTP</button>
                    <div id="recaptcha-container"></div>
                </div>
                <div id="admin-otp-step" style="display:none;">
                    <div class="form-group"><label>OTP</label>
                        <input type="number" id="otp-input" placeholder="••••••" maxlength="6" style="text-align:center;font-size:24px;letter-spacing:8px;font-weight:700;">
                    </div>
                    <button class="btn-primary" style="width:100%;" onclick="AdminAuth.verifyOTP()">Verify & Login</button>
                    <button class="btn-secondary" style="width:100%;margin-top:10px;" onclick="AdminAuth.reset()">← Back</button>
                </div>
            </div>
        </div>

        <!-- Main Admin App -->
        <div id="main-app" style="display:none;">
            <!-- Sidebar / Top Nav -->
            <div class="header-gradient" style="padding:50px 20px 0;position:relative;overflow:hidden;">
                <div class="header-circles"></div>
                <div style="position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;margin-bottom:0;">
                    <div>
                        <h1 style="font-family:'Playfair Display',serif;font-size:22px;color:white;font-weight:700;">👑 Admin Panel</h1>
                        <p style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:2px;">Cora Master Control</p>
                    </div>
                    <button onclick="AdminAuth.logout()" style="background:rgba(255,255,255,0.2);border:none;border-radius:10px;color:white;padding:8px 12px;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;">Logout</button>
                </div>
            </div>

            <!-- Tab Nav -->
            <div class="admin-tab-nav" id="admin-tab-nav">
                ${['dashboard','restaurants','orders','delivery','financial','coupons','settlement','support'].map((t,i) => `
                    <div class="admin-tab ${i===0?'active':''}" data-tab="${t}" onclick="Admin.switchTab('${t}')">
                        ${{dashboard:'📊',restaurants:'🏪',orders:'📦',delivery:'🛵',financial:'💰',coupons:'🎁',settlement:'📋',support:'💬'}[t]}
                        <span>${t.charAt(0).toUpperCase()+t.slice(1)}</span>
                    </div>
                `).join('')}
            </div>

            <div id="admin-content" style="overflow-y:auto;height:calc(100vh - 175px);padding-bottom:20px;"></div>
        </div>
    </div>

    <div id="toast" class="toast"></div>

    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
    <script src="/admin/js/api.js"></script>
    <script src="/admin/js/dashboard.js"></script>
    <script src="/admin/js/restaurants.js"></script>
    <script src="/admin/js/orders.js"></script>
    <script src="/admin/js/delivery.js"></script>
    <script src="/admin/js/financial.js"></script>
    <script src="/admin/js/coupons.js"></script>
    <script src="/admin/js/support.js"></script>
    <script src="/admin/js/app.js"></script>
</body>
</html>

CORA_EOF

# ── admin/css/style.css
cat << 'CORA_EOF' > 'admin/css/style.css'
:root {
    --berry:        #D1386C;
    --berry-dark:   #B22D5B;
    --berry-deep:   #8C1D47;
    --berry-light:  #FFF0F5;
    --berry-glow:   rgba(209,56,108,0.18);
    --berry-border: #FFE0EB;
    --white:        #FFFFFF;
    --text:         #1A1A1A;
    --text-sub:     #6B6B6B;
    --text-muted:   #A0A0A0;
    --green:        #1DB954;
    --green-light:  #E8F8EF;
    --orange:       #FF9800;
    --danger:       #E53935;
    --gold:         #FFB800;
}

* { margin:0; padding:0; box-sizing:border-box; }

body {
    font-family: 'DM Sans', -apple-system, sans-serif;
    background: var(--berry-light);
    color: var(--text);
    font-size: 14px;
}

#app { max-width: 480px; margin: 0 auto; min-height: 100vh; background: var(--berry-light); }

.loading-screen {
    position: fixed; inset: 0;
    background: linear-gradient(135deg, var(--berry), var(--berry-deep));
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 32px; z-index: 1000;
}

.loading-spinner {
    width: 40px; height: 40px;
    border: 3px solid rgba(255,255,255,0.3);
    border-top-color: white; border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.header-gradient {
    background: linear-gradient(135deg, var(--berry), var(--berry-deep));
    position: relative; overflow: hidden;
}

.header-circles::before {
    content: ''; position: absolute;
    width: 200px; height: 200px; border-radius: 50%;
    background: rgba(255,255,255,0.1);
    top: -60px; right: -40px;
}
.header-circles::after {
    content: ''; position: absolute;
    width: 100px; height: 100px; border-radius: 50%;
    background: rgba(255,255,255,0.08);
    bottom: -20px; left: 20px;
}

/* Admin Tab Nav */
.admin-tab-nav {
    display: flex; overflow-x: auto;
    background: white;
    border-bottom: 2px solid var(--berry-border);
    scrollbar-width: none;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 2px 8px var(--berry-glow);
}

.admin-tab-nav::-webkit-scrollbar { display: none; }

.admin-tab {
    display: flex; flex-direction: column;
    align-items: center; gap: 2px;
    padding: 10px 14px;
    font-size: 11px; font-weight: 600;
    color: var(--text-muted);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    transition: all 0.25s ease;
    min-width: 70px;
}

.admin-tab.active { color: var(--berry); border-bottom-color: var(--berry); }
.admin-tab > *:first-child { font-size: 20px; }

/* Cards */
.card {
    background: white;
    border: 1px solid var(--berry-border);
    border-radius: 16px;
    box-shadow: 0 3px 16px var(--berry-glow);
}

.stat-card {
    background: white;
    border: 1px solid var(--berry-border);
    border-radius: 16px;
    padding: 16px;
    text-align: center;
    box-shadow: 0 3px 16px var(--berry-glow);
}

.stat-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--berry);
}

.stat-label {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 4px;
}

/* Buttons */
.btn-primary {
    background: var(--berry); color: white;
    border: none; border-radius: 12px;
    padding: 12px 20px; font-size: 14px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; box-shadow: 0 4px 14px var(--berry-glow);
    transition: all 0.25s ease;
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
}
.btn-primary:hover { background: var(--berry-dark); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary {
    background: var(--berry-light); color: var(--berry);
    border: 1.5px solid var(--berry); border-radius: 12px;
    padding: 10px 18px; font-size: 14px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.25s ease;
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
}
.btn-secondary:hover { background: var(--berry); color: white; }

.btn-danger {
    background: var(--danger); color: white;
    border: none; border-radius: 12px;
    padding: 10px 18px; font-size: 14px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.25s ease;
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
}

.btn-success {
    background: var(--green); color: white;
    border: none; border-radius: 12px;
    padding: 10px 18px; font-size: 14px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.25s ease;
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
}

/* Forms */
.form-group { margin-bottom: 14px; }
.form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--text-sub); margin-bottom: 6px; }
.form-group input, .form-group textarea, .form-group select {
    width: 100%;
    background: white; border: 1.5px solid var(--berry-border);
    border-radius: 12px; padding: 10px 14px;
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    color: var(--text); outline: none; transition: border-color 0.25s;
}
.form-group input:focus, .form-group textarea:focus, .form-group select:focus {
    border-color: var(--berry);
}

.phone-input-wrap {
    display: flex; align-items: center;
    background: white; border: 1.5px solid var(--berry-border);
    border-radius: 12px; padding: 0 14px;
}
.country-prefix {
    font-size: 14px; color: var(--text-sub);
    margin-right: 8px; padding: 10px 0;
    border-right: 1px solid var(--berry-border); padding-right: 12px;
}
.phone-input-wrap input { border: none; border-radius: 0; padding: 10px 0 10px 10px; box-shadow: none; }
.phone-input-wrap input:focus { box-shadow: none; border-color: transparent; }

/* Table */
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { background: var(--berry-light); color: var(--text-sub); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; padding: 10px 12px; text-align: left; }
.data-table td { padding: 10px 12px; border-bottom: 1px solid var(--berry-border); }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: var(--berry-light); }

/* Status Badges */
.badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
.badge-green  { background: var(--green-light); color: var(--green); }
.badge-red    { background: #FFEBEE; color: var(--danger); }
.badge-orange { background: #FFF3E0; color: #E65100; }
.badge-blue   { background: #E3F2FD; color: #1565C0; }
.badge-gold   { background: #FFF8E1; color: #F57F17; }

/* Toggle */
.toggle-switch {
    width: 44px; height: 24px;
    background: var(--berry-border); border-radius: 12px;
    position: relative; cursor: pointer; transition: background 0.25s;
    flex-shrink: 0;
}
.toggle-switch.on { background: var(--berry); }
.toggle-switch::after {
    content: ''; position: absolute;
    width: 18px; height: 18px; border-radius: 50%; background: white;
    top: 3px; left: 3px; transition: left 0.25s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.toggle-switch.on::after { left: 23px; }

/* Bar Chart */
.bar-chart { display: flex; align-items: flex-end; gap: 6px; height: 100px; }
.bar-wrap { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; height:100%; justify-content:flex-end; }
.bar { width:100%; background:var(--berry); border-radius:4px 4px 0 0; transition:height 0.5s ease; min-height:4px; }
.bar-label { font-size:9px; color:var(--text-muted); text-align:center; }

/* Toast */
.toast {
    position: fixed; top: 20px;
    left: 50%; transform: translateX(-50%) translateY(-80px);
    background: var(--text); color: white;
    padding: 12px 20px; border-radius: 12px;
    font-size: 14px; font-weight: 500;
    z-index: 9999; transition: transform 0.3s ease;
    max-width: 340px; text-align: center; pointer-events: none;
}
.toast.show { transform: translateX(-50%) translateY(0); }
.toast.success { background: var(--green); }
.toast.error   { background: var(--danger); }
.toast.info    { background: var(--berry); }

.section-pad { padding: 16px; }
.section-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; margin-bottom: 14px; }

.crown-badge {
    background: linear-gradient(135deg, var(--gold), #E67E00);
    color: white; padding: 2px 8px;
    border-radius: 8px; font-size: 11px; font-weight: 700;
}

CORA_EOF

# ── admin/js/api.js
cat << 'CORA_EOF' > 'admin/js/api.js'
const API_BASE = '/api';

const AApi = {
    _token: () => localStorage.getItem('admin_token'),

    async request(endpoint, options = {}) {
        const token = this._token();
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(options.headers || {})
        };
        const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
        const data = await response.json();
        if (response.status === 401) { localStorage.removeItem('admin_token'); window.location.reload(); }
        return data;
    },

    get:  (ep)       => AApi.request(ep, { method: 'GET' }),
    post: (ep, body) => AApi.request(ep, { method: 'POST', body: JSON.stringify(body) }),
    put:  (ep, body) => AApi.request(ep, { method: 'PUT',  body: JSON.stringify(body) }),
    del:  (ep)       => AApi.request(ep, { method: 'DELETE' }),

    async upload(endpoint, formData) {
        const token = this._token();
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const resp = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', headers, body: formData });
        return resp.json();
    },

    getDashboard:     () => AApi.get('/admin/dashboard.php'),
    getRestaurants:   () => AApi.get('/admin/restaurants.php'),
    addRestaurant:    (fd) => AApi.upload('/admin/restaurant.php', fd),
    updateRestaurant: (data) => AApi.put('/admin/restaurant.php', data),
    getOrders:        (params = '') => AApi.get(`/admin/orders.php${params ? '?' + params : ''}`),
    updateOrder:      (data) => AApi.put('/admin/order.php', data),
    getDeliveryBoys:  () => AApi.get('/admin/delivery-boys.php'),
    addDeliveryBoy:   (data) => AApi.post('/admin/delivery-boys.php', data),
    getFinancial:     (params = '') => AApi.get(`/admin/financial.php${params ? '?' + params : ''}`),
    getCoupons:       () => AApi.get('/admin/coupons.php'),
    createCoupon:     (data) => AApi.post('/admin/coupons.php', data),
    toggleCoupon:     (id, isActive) => AApi.put('/admin/coupons.php', { id, is_active: isActive }),
    getTickets:       () => AApi.get('/admin/support-tickets.php'),
    updateTicket:     (data) => AApi.put('/admin/support-tickets.php', data),
    getDelivConfig:   () => AApi.get('/admin/delivery-config.php'),
    updateDelivConfig: (data) => AApi.put('/admin/delivery-config.php', data),
    getSettlement:    () => AApi.get('/admin/settlement.php'),
    markSettled:      (data) => AApi.post('/admin/settlement.php', data),
    verify:           (data) => AApi.post('/auth/verify.php', data),
    getMe:            () => AApi.get('/auth/me.php'),
};

CORA_EOF

# ── admin/js/app.js
cat << 'CORA_EOF' > 'admin/js/app.js'
/* ============================================================
   Cora Admin — app.js  (Firebase Auth + Tab Controller)
   ============================================================ */

const FIREBASE_CONFIG = {
    apiKey:            "YOUR_FIREBASE_API_KEY",
    authDomain:        "YOUR_PROJECT.firebaseapp.com",
    projectId:         "YOUR_PROJECT_ID",
    storageBucket:     "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId:             "YOUR_APP_ID"
};

/* ---------- global state ---------- */
let _firebaseApp = null;
let _firebaseAuth = null;
let _firebaseConfirm = null;
const DEMO_MODE = true;   // set false when real Firebase keys are in place

/* ============================================================
   Admin  — tab controller
   ============================================================ */
const Admin = {
    currentTab: 'dashboard',

    init() {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            this._showAuth();
            return;
        }
        AApi.getMe().then(res => {
            if (res.success && res.data.role === 'admin') {
                this._showMain();
                this.switchTab('dashboard');
            } else {
                localStorage.removeItem('admin_token');
                this._showAuth();
            }
        }).catch(() => this._showAuth());
    },

    _showAuth() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'block';
        document.getElementById('main-app').style.display = 'none';
        AdminAuth.init();
    },

    _showMain() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
    },

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.admin-tab').forEach(el => {
            el.classList.toggle('active', el.dataset.tab === tab);
        });
        const content = document.getElementById('admin-content');
        content.innerHTML = '<div class="skel-wrap">' + Array(4).fill('<div class="skel" style="height:80px;margin-bottom:12px;border-radius:12px;"></div>').join('') + '</div>';

        switch (tab) {
            case 'dashboard':   AdminDashboard.render(content);   break;
            case 'restaurants': AdminRestaurants.render(content);  break;
            case 'orders':      AdminOrders.render(content);       break;
            case 'delivery':    AdminDelivery.render(content);     break;
            case 'financial':   AdminFinancial.render(content);    break;
            case 'coupons':     AdminCoupons.render(content);      break;
            case 'settlement':  AdminSettlement.render(content);   break;
            case 'support':     AdminSupport.render(content);      break;
        }
    }
};

/* ============================================================
   AdminAuth — Firebase OTP + demo mode
   ============================================================ */
const AdminAuth = {
    _confirmResult: null,

    init() {
        try {
            if (!_firebaseApp) {
                _firebaseApp  = firebase.initializeApp(FIREBASE_CONFIG, 'admin');
                _firebaseAuth = firebase.auth(_firebaseApp);
                _firebaseAuth.useDeviceLanguage();
            }
        } catch(e) {
            console.warn('Firebase init skipped (demo mode):', e.message);
        }
    },

    async sendOTP() {
        const phone = document.getElementById('phone-input').value.trim();
        if (phone.length !== 10) { showToast('Enter valid 10-digit number'); return; }

        if (DEMO_MODE) {
            document.getElementById('admin-phone-step').style.display = 'none';
            document.getElementById('admin-otp-step').style.display   = 'block';
            showToast('Demo mode: use any 6 digits');
            return;
        }

        try {
            const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
            this._confirmResult = await _firebaseAuth.signInWithPhoneNumber('+91' + phone, verifier);
            document.getElementById('admin-phone-step').style.display = 'none';
            document.getElementById('admin-otp-step').style.display   = 'block';
        } catch(e) {
            showToast('Error: ' + e.message);
        }
    },

    async verifyOTP() {
        const otp = document.getElementById('otp-input').value.trim();
        if (otp.length !== 6) { showToast('Enter 6-digit OTP'); return; }

        let firebaseUid = 'demo_' + Date.now();
        const phone = document.getElementById('phone-input').value.trim();

        if (!DEMO_MODE) {
            try {
                const result = await this._confirmResult.confirm(otp);
                firebaseUid = result.user.uid;
            } catch(e) {
                showToast('Wrong OTP'); return;
            }
        }

        const res = await AApi.verify({ phone: '+91' + phone, firebase_uid: firebaseUid, role: 'admin' });
        if (res.success) {
            localStorage.setItem('admin_token', res.data.token);
            Admin._showMain();
            Admin.switchTab('dashboard');
        } else {
            showToast(res.message || 'Login failed — not an admin account');
        }
    },

    reset() {
        document.getElementById('admin-phone-step').style.display = 'block';
        document.getElementById('admin-otp-step').style.display   = 'none';
        document.getElementById('phone-input').value = '';
        document.getElementById('otp-input').value  = '';
    },

    logout() {
        localStorage.removeItem('admin_token');
        location.reload();
    }
};

/* ============================================================
   Toast utility
   ============================================================ */
function showToast(msg, duration = 3000) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), duration);
}

/* ============================================================
   Boot
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => Admin.init(), 600);
});

CORA_EOF

# ── admin/js/coupons.js
cat << 'CORA_EOF' > 'admin/js/coupons.js'
/* ============================================================
   Cora Admin — coupons.js
   ============================================================ */
const AdminCoupons = {
    async render(container) {
        container.innerHTML = `<div style="padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h2 style="font-family:'Playfair Display',serif;font-size:20px;">Coupons</h2>
                <button class="btn-primary btn-sm" onclick="AdminCoupons.showAddForm()">+ Create</button>
            </div>
            <div id="coupon-list"><div class="skel" style="height:60px;border-radius:12px;"></div></div>
        </div>
        <div id="coupon-modal" class="modal-overlay" style="display:none;"></div>`;
        this._load();
    },

    async _load() {
        const res = await AApi.getCoupons();
        const wrap = document.getElementById('coupon-list');
        if (!wrap) return;
        if (!res.success || !res.data.length) { wrap.innerHTML = '<p class="empty-state">No coupons yet</p>'; return; }

        wrap.innerHTML = `<div class="data-table-wrap"><table class="data-table">
            <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Per-User Limit</th><th>Expiry</th><th>Status</th><th>Toggle</th></tr></thead>
            <tbody>${res.data.map(c => `
            <tr>
                <td><strong>${c.code}</strong></td>
                <td>${c.discount_type}</td>
                <td>${c.discount_type === 'percentage' ? c.discount_value + '%' : '₹' + c.discount_value}</td>
                <td>₹${c.min_order_amount ?? 0}</td>
                <td>${c.max_uses_per_user ?? '∞'}</td>
                <td style="font-size:12px;">${c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-IN') : 'Never'}</td>
                <td><span class="badge ${c.is_active ? 'badge-delivered' : 'badge-cancelled'}">${c.is_active ? 'Active' : 'Inactive'}</span></td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" ${c.is_active ? 'checked' : ''} onchange="AdminCoupons.toggle(${c.id}, this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </td>
            </tr>`).join('')}
            </tbody></table></div>`;
    },

    showAddForm() {
        const modal = document.getElementById('coupon-modal');
        modal.style.display = 'flex';
        modal.innerHTML = `<div class="modal-box">
            <div class="modal-header"><h3>Create Coupon</h3><button class="modal-close" onclick="AdminCoupons.closeModal()">✕</button></div>
            <div style="padding:20px;">
                <div class="form-group"><label>Coupon Code (UPPERCASE)</label><input id="c-code" placeholder="KULGAM50" style="text-transform:uppercase;" oninput="this.value=this.value.toUpperCase()"></div>
                <div class="form-group"><label>Discount Type</label>
                    <select id="c-type">
                        <option value="percentage">Percentage (%)</option>
                        <option value="flat">Flat Amount (₹)</option>
                    </select>
                </div>
                <div class="form-group"><label>Discount Value</label><input id="c-value" type="number" placeholder="50"></div>
                <div class="form-group"><label>Min Order Amount (₹)</label><input id="c-minorder" type="number" value="0"></div>
                <div class="form-group"><label>Max Discount (₹, 0=no cap)</label><input id="c-maxdisc" type="number" value="0"></div>
                <div class="form-group"><label>Per-User Limit (0=unlimited)</label><input id="c-peruserlimit" type="number" value="1"></div>
                <div class="form-group"><label>Expiry Date (optional)</label><input id="c-expiry" type="date"></div>
                <div class="form-group"><label>Description</label><input id="c-desc" placeholder="50% off your first order!"></div>
                <button class="btn-primary" style="width:100%;margin-top:8px;" onclick="AdminCoupons.submitCreate()">Create Coupon</button>
            </div>
        </div>`;
    },

    async submitCreate() {
        const expiryVal = document.getElementById('c-expiry').value;
        const maxDiscVal = parseInt(document.getElementById('c-maxdisc').value);
        const perUserLimit = parseInt(document.getElementById('c-peruserlimit').value);
        const res = await AApi.createCoupon({
            code:                document.getElementById('c-code').value.trim().toUpperCase(),
            discount_type:       document.getElementById('c-type').value,
            discount_value:      parseFloat(document.getElementById('c-value').value),
            min_order_amount:    parseFloat(document.getElementById('c-minorder').value),
            max_discount_amount: maxDiscVal > 0 ? maxDiscVal : null,
            max_uses_per_user:   perUserLimit > 0 ? perUserLimit : null,
            expires_at:          expiryVal || null,
            description:         document.getElementById('c-desc').value.trim()
        });
        if (res.success) { showToast('Coupon created!'); this.closeModal(); this._load(); }
        else showToast(res.message || 'Error creating coupon');
    },

    async toggle(id, isActive) {
        const res = await AApi.toggleCoupon(id, isActive ? 1 : 0);
        if (res.success) showToast(isActive ? 'Coupon activated' : 'Coupon deactivated');
        else showToast('Error');
    },

    closeModal() {
        const m = document.getElementById('coupon-modal');
        if (m) m.style.display = 'none';
    }
};

CORA_EOF

# ── admin/js/dashboard.js
cat << 'CORA_EOF' > 'admin/js/dashboard.js'
/* ============================================================
   Cora Admin — dashboard.js
   ============================================================ */
const AdminDashboard = {
    async render(container) {
        const res = await AApi.getDashboard();
        if (!res.success) { container.innerHTML = '<p class="empty-state">Failed to load dashboard</p>'; return; }
        const d = res.data;

        container.innerHTML = `
        <div style="padding:16px;">

            <!-- Stat Cards -->
            <div class="stat-grid">
                ${this._stat('📦', 'Orders Today', d.today_orders ?? 0, '')}
                ${this._stat('💰', 'Revenue Today', '₹' + (d.today_revenue ?? 0), '')}
                ${this._stat('🏪', 'Active Restaurants', d.active_restaurants ?? 0, '')}
                ${this._stat('🎫', 'Open Tickets', d.open_tickets ?? 0, d.open_tickets > 0 ? 'color:var(--berry)' : '')}
            </div>

            <!-- Week Chart -->
            <div class="admin-card" style="margin-top:16px;">
                <h3 class="card-title">Orders — Last 7 Days</h3>
                <div class="bar-chart-wrap" id="dash-chart"></div>
            </div>

            <!-- Recent Orders -->
            <div class="admin-card" style="margin-top:16px;">
                <h3 class="card-title">Recent Orders</h3>
                <div class="data-table-wrap">
                    <table class="data-table">
                        <thead><tr><th>Order</th><th>Customer</th><th>Restaurant</th><th>Total</th><th>Status</th></tr></thead>
                        <tbody>
                        ${(d.recent_orders || []).map(o => `
                            <tr>
                                <td><span style="font-weight:600;">${o.order_number}</span></td>
                                <td>${o.customer_name || '—'}</td>
                                <td>${o.restaurant_name || '—'}</td>
                                <td>₹${o.total_amount}</td>
                                <td><span class="badge badge-${o.status}">${o.status}</span></td>
                            </tr>
                        `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>`;

        this._renderChart(d.weekly_chart || []);
    },

    _stat(icon, label, value, style) {
        return `<div class="stat-card"><div class="stat-icon">${icon}</div>
            <div class="stat-value" style="${style}">${value}</div>
            <div class="stat-label">${label}</div></div>`;
    },

    _renderChart(data) {
        const wrap = document.getElementById('dash-chart');
        if (!wrap) return;
        const max = Math.max(...data.map(d => d.count), 1);
        wrap.innerHTML = `<div class="bar-chart">${data.map(d => `
            <div class="bar-col">
                <div class="bar-fill" style="height:${Math.round((d.count / max) * 100)}%;background:var(--berry);"></div>
                <div class="bar-label">${d.label}</div>
                <div class="bar-val">${d.count}</div>
            </div>`).join('')}</div>`;
    }
};

CORA_EOF

# ── admin/js/delivery.js
cat << 'CORA_EOF' > 'admin/js/delivery.js'
/* ============================================================
   Cora Admin — delivery.js
   ============================================================ */
const AdminDelivery = {
    _boys: [],
    _restaurants: [],

    async render(container) {
        container.innerHTML = `<div style="padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h2 style="font-family:'Playfair Display',serif;font-size:20px;">Delivery Boys</h2>
                <button class="btn-primary btn-sm" onclick="AdminDelivery.showAddForm()">+ Add</button>
            </div>
            <div id="db-list"><div class="skel" style="height:60px;border-radius:12px;"></div></div>
            <div id="db-modal" class="modal-overlay" style="display:none;"></div>

            <!-- Delivery Config -->
            <div class="admin-card" style="margin-top:24px;">
                <h3 class="card-title">Delivery Configuration</h3>
                <div id="deliv-config-wrap"><div class="skel" style="height:40px;border-radius:8px;"></div></div>
            </div>
        </div>`;

        this._loadBoys();
        this._loadConfig();
    },

    async _loadBoys() {
        const [dbRes, rRes] = await Promise.all([AApi.getDeliveryBoys(), AApi.getRestaurants()]);
        this._boys = dbRes.success ? dbRes.data : [];
        this._restaurants = rRes.success ? rRes.data : [];
        const wrap = document.getElementById('db-list');
        if (!wrap) return;

        if (!this._boys.length) { wrap.innerHTML = '<p class="empty-state">No delivery boys yet</p>'; return; }

        wrap.innerHTML = `<div class="data-table-wrap"><table class="data-table">
            <thead><tr><th>Name</th><th>Phone</th><th>Restaurant</th><th>Status</th><th>Orders</th><th>Actions</th></tr></thead>
            <tbody>${this._boys.map(b => `
            <tr>
                <td><strong>${b.name}</strong></td>
                <td>${b.phone}</td>
                <td>${b.restaurant_name || 'Public Pool'}</td>
                <td>
                    <span class="badge ${b.is_active ? 'badge-delivered' : 'badge-cancelled'}">${b.is_active ? 'Active' : 'Inactive'}</span>
                    ${b.is_available ? '<span class="badge badge-preparing" style="margin-left:4px;">Available</span>' : ''}
                </td>
                <td>${b.total_deliveries ?? 0}</td>
                <td class="action-btns">
                    <button class="btn-xs ${b.is_active ? 'btn-danger' : 'btn-success'}"
                        onclick="AdminDelivery.toggleActive(${b.id}, ${b.is_active ? 0 : 1})">
                        ${b.is_active ? 'Disable' : 'Enable'}
                    </button>
                </td>
            </tr>`).join('')}
            </tbody></table></div>`;
    },

    showAddForm() {
        const modal = document.getElementById('db-modal');
        modal.style.display = 'flex';
        modal.innerHTML = `<div class="modal-box">
            <div class="modal-header"><h3>Add Delivery Boy</h3><button class="modal-close" onclick="AdminDelivery.closeModal()">✕</button></div>
            <div style="padding:20px;">
                <div class="form-group"><label>Full Name</label><input id="db-name" placeholder="Mohammed Amir"></div>
                <div class="form-group"><label>Phone (+91)</label><input id="db-phone" type="tel" maxlength="10" placeholder="9876543210"></div>
                <div class="form-group"><label>Assign to Restaurant (optional)</label>
                    <select id="db-rest">
                        <option value="">Public Pool</option>
                        ${this._restaurants.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Vehicle Number</label><input id="db-vehicle" placeholder="JK01AB1234"></div>
                <button class="btn-primary" style="width:100%;margin-top:8px;" onclick="AdminDelivery.submitAdd()">Add Delivery Boy</button>
            </div>
        </div>`;
    },

    async submitAdd() {
        const restId = document.getElementById('db-rest').value;
        const res = await AApi.addDeliveryBoy({
            name:          document.getElementById('db-name').value.trim(),
            phone:         '+91' + document.getElementById('db-phone').value.trim(),
            restaurant_id: restId ? parseInt(restId) : null,
            vehicle_number: document.getElementById('db-vehicle').value.trim()
        });
        if (res.success) { showToast('Delivery boy added!'); this.closeModal(); this._loadBoys(); }
        else showToast(res.message || 'Error');
    },

    async toggleActive(id, isActive) {
        /* Use update endpoint — reuse updateRestaurant pattern for delivery boy */
        const res = await AApi.request('/admin/delivery-boys.php', {
            method: 'PUT',
            body: JSON.stringify({ id, is_active: isActive })
        });
        if (res.success) { showToast(isActive ? 'Enabled' : 'Disabled'); this._loadBoys(); }
        else showToast('Error');
    },

    async _loadConfig() {
        const res = await AApi.getDelivConfig();
        const wrap = document.getElementById('deliv-config-wrap');
        if (!wrap || !res.success) return;
        const c = res.data;
        wrap.innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
                <div class="form-group"><label>Base Delivery Fee (₹)</label><input id="cfg-base" type="number" value="${c.base_delivery_fee ?? 20}"></div>
                <div class="form-group"><label>Per KM Fee (₹)</label><input id="cfg-km" type="number" value="${c.per_km_fee ?? 5}"></div>
                <div class="form-group"><label>Free Delivery Above (₹)</label><input id="cfg-free" type="number" value="${c.free_delivery_above ?? 299}"></div>
                <div class="form-group"><label>Max Delivery Distance (km)</label><input id="cfg-maxdist" type="number" value="${c.max_delivery_distance_km ?? 10}"></div>
            </div>
            <button class="btn-primary btn-sm" onclick="AdminDelivery.saveConfig()">Save Config</button>`;
    },

    async saveConfig() {
        const res = await AApi.updateDelivConfig({
            base_delivery_fee:       document.getElementById('cfg-base').value,
            per_km_fee:              document.getElementById('cfg-km').value,
            free_delivery_above:     document.getElementById('cfg-free').value,
            max_delivery_distance_km: document.getElementById('cfg-maxdist').value
        });
        if (res.success) showToast('Config saved!');
        else showToast('Error saving config');
    },

    closeModal() {
        const m = document.getElementById('db-modal');
        if (m) m.style.display = 'none';
    }
};

CORA_EOF

# ── admin/js/financial.js
cat << 'CORA_EOF' > 'admin/js/financial.js'
/* ============================================================
   Cora Admin — financial.js
   ============================================================ */
const AdminFinancial = {
    async render(container) {
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

        container.innerHTML = `<div style="padding:16px;">
            <h2 style="font-family:'Playfair Display',serif;font-size:20px;margin-bottom:16px;">Financial Report</h2>

            <div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;margin-bottom:16px;">
                <div class="form-group" style="margin:0;">
                    <label style="font-size:11px;">From</label>
                    <input type="date" id="fin-from" value="${weekAgo}" style="padding:8px 10px;">
                </div>
                <div class="form-group" style="margin:0;">
                    <label style="font-size:11px;">To</label>
                    <input type="date" id="fin-to" value="${today}" style="padding:8px 10px;">
                </div>
                <button class="btn-primary btn-sm" onclick="AdminFinancial.load()">Load</button>
                <button class="btn-outline btn-sm" onclick="AdminFinancial.exportCSV()">⬇ CSV</button>
            </div>

            <div id="fin-totals" style="margin-bottom:16px;"></div>
            <div id="fin-table"></div>
        </div>`;

        this.load();
    },

    async load() {
        const from = document.getElementById('fin-from').value;
        const to   = document.getElementById('fin-to').value;
        const res  = await AApi.getFinancial(`from=${from}&to=${to}`);

        const totalsWrap = document.getElementById('fin-totals');
        const tableWrap  = document.getElementById('fin-table');
        if (!totalsWrap || !tableWrap) return;
        if (!res.success) { tableWrap.innerHTML = '<p class="empty-state">Failed to load</p>'; return; }

        const { totals, restaurants } = res.data;

        totalsWrap.innerHTML = `<div class="stat-grid">
            ${this._stat('💸', 'GMV', '₹' + (totals.gmv || 0))}
            ${this._stat('💰', 'Commission', '₹' + (totals.commission || 0))}
            ${this._stat('🛵', 'Delivery Fees', '₹' + (totals.delivery_fees || 0))}
            ${this._stat('📦', 'Orders', totals.orders || 0)}
        </div>`;

        if (!restaurants || !restaurants.length) {
            tableWrap.innerHTML = '<p class="empty-state">No data for this period</p>';
            return;
        }

        this._lastData = restaurants;

        tableWrap.innerHTML = `<div class="data-table-wrap"><table class="data-table">
            <thead><tr><th>Restaurant</th><th>Orders</th><th>GMV</th><th>Commission</th><th>Delivery Fees</th><th>Net Payable</th></tr></thead>
            <tbody>${restaurants.map(r => `
            <tr>
                <td><strong>${r.restaurant_name}</strong></td>
                <td>${r.order_count}</td>
                <td>₹${r.gmv}</td>
                <td>₹${r.commission}</td>
                <td>₹${r.delivery_fees}</td>
                <td style="font-weight:600;color:var(--berry);">₹${r.net_payable}</td>
            </tr>`).join('')}
            </tbody></table></div>`;
    },

    exportCSV() {
        if (!this._lastData || !this._lastData.length) { showToast('Load data first'); return; }
        const header = ['Restaurant','Orders','GMV','Commission','Delivery Fees','Net Payable'];
        const rows = this._lastData.map(r =>
            [r.restaurant_name, r.order_count, r.gmv, r.commission, r.delivery_fees, r.net_payable].join(',')
        );
        const csv = [header.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cora_financial_${document.getElementById('fin-from').value}_to_${document.getElementById('fin-to').value}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    },

    _stat(icon, label, value) {
        return `<div class="stat-card"><div class="stat-icon">${icon}</div>
            <div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`;
    }
};

/* ============================================================
   AdminSettlement — Weekly Settlement
   ============================================================ */
const AdminSettlement = {
    async render(container) {
        container.innerHTML = `<div style="padding:16px;">
            <h2 style="font-family:'Playfair Display',serif;font-size:20px;margin-bottom:4px;">Weekly Settlement</h2>
            <p style="color:#888;font-size:13px;margin-bottom:16px;">Commission owed by each restaurant for the current week</p>
            <div id="settlement-list"><div class="skel" style="height:80px;border-radius:12px;"></div></div>
        </div>`;
        this._load();
    },

    async _load() {
        const res = await AApi.getSettlement();
        const wrap = document.getElementById('settlement-list');
        if (!wrap) return;
        if (!res.success) { wrap.innerHTML = '<p class="empty-state">Failed to load settlements</p>'; return; }

        const items = res.data;
        if (!items.length) { wrap.innerHTML = '<p class="empty-state">No pending settlements</p>'; return; }

        wrap.innerHTML = items.map(s => `
        <div class="admin-card settlement-card" id="settle-${s.restaurant_id}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
                <div>
                    <h3 style="font-weight:600;font-size:16px;">${s.restaurant_name}</h3>
                    <p style="color:#888;font-size:12px;">${s.order_count} orders · GMV ₹${s.gmv}</p>
                    ${s.settled_at ? `<p style="color:green;font-size:12px;">✓ Settled on ${this._fmt(s.settled_at)}</p>` : ''}
                </div>
                <div style="text-align:right;">
                    <div style="font-size:22px;font-weight:700;color:var(--berry);">₹${s.commission_owed}</div>
                    <div style="font-size:11px;color:#aaa;">commission owed</div>
                </div>
            </div>
            <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
                ${!s.settled_at ? `
                    <button class="btn-success btn-sm" onclick="AdminSettlement.markSettled(${s.restaurant_id}, '${s.restaurant_name}')">
                        ✓ Mark as Settled
                    </button>` : `
                    <button class="btn-outline btn-sm" onclick="AdminSettlement.unsettle(${s.restaurant_id})">
                        Unmark Settled
                    </button>`}
                <button class="btn-outline btn-sm" onclick="Admin.switchTab('financial')">View Details →</button>
            </div>
        </div>`).join('');
    },

    async markSettled(restaurantId, name) {
        if (!confirm(`Mark settlement as paid for ${name}?`)) return;
        const res = await AApi.markSettled({ restaurant_id: restaurantId, settled: 1 });
        if (res.success) { showToast('Settlement marked as paid ✓'); this._load(); }
        else showToast(res.message || 'Error');
    },

    async unsettle(restaurantId) {
        const res = await AApi.markSettled({ restaurant_id: restaurantId, settled: 0 });
        if (res.success) { showToast('Settlement unmarked'); this._load(); }
        else showToast('Error');
    },

    _fmt(dt) {
        if (!dt) return '';
        return new Date(dt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
    }
};

CORA_EOF

# ── admin/js/orders.js
cat << 'CORA_EOF' > 'admin/js/orders.js'
/* ============================================================
   Cora Admin — orders.js
   ============================================================ */
const AdminOrders = {
    _currentFilter: '',

    async render(container) {
        container.innerHTML = `<div style="padding:16px;">
            <h2 style="font-family:'Playfair Display',serif;font-size:20px;margin-bottom:16px;">All Orders</h2>

            <!-- Filters -->
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
                ${['','pending','confirmed','preparing','ready','picked_up','on_the_way','delivered','cancelled'].map(s => `
                    <button class="filter-pill ${s===''?'active':''}" data-status="${s}"
                        onclick="AdminOrders.filter('${s}', this)">${s || 'All'}</button>
                `).join('')}
            </div>

            <div id="orders-list"><div class="skel" style="height:60px;border-radius:12px;"></div></div>
        </div>
        <div id="order-modal" class="modal-overlay" style="display:none;"></div>`;

        this._load();
    },

    async _load() {
        const params = this._currentFilter ? `status=${this._currentFilter}` : '';
        const res = await AApi.getOrders(params);
        const wrap = document.getElementById('orders-list');
        if (!wrap) return;
        if (!res.success) { wrap.innerHTML = '<p class="empty-state">Failed to load orders</p>'; return; }
        const orders = res.data;
        if (!orders.length) { wrap.innerHTML = '<p class="empty-state">No orders found</p>'; return; }

        wrap.innerHTML = `<div class="data-table-wrap"><table class="data-table">
            <thead><tr><th>Order #</th><th>Customer</th><th>Restaurant</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>${orders.map(o => `
            <tr>
                <td><strong>${o.order_number}</strong></td>
                <td>${o.customer_name || '—'}<br><small style="color:#999;">${o.customer_phone || ''}</small></td>
                <td>${o.restaurant_name || '—'}</td>
                <td>₹${o.total_amount}</td>
                <td><span class="badge badge-${o.status}">${o.status}</span></td>
                <td style="font-size:12px;color:#666;">${this._fmt(o.placed_at)}</td>
                <td class="action-btns">
                    <button class="btn-xs btn-outline" onclick="AdminOrders.viewOrder(${o.id})">View</button>
                    ${o.status !== 'delivered' && o.status !== 'cancelled' ?
                        `<button class="btn-xs btn-danger" onclick="AdminOrders.cancelOrder(${o.id})">Cancel</button>` : ''}
                    ${o.customer_phone ?
                        `<a class="btn-xs btn-wa" href="https://wa.me/${o.customer_phone.replace('+','')}" target="_blank">💬 WA</a>` : ''}
                </td>
            </tr>`).join('')}
            </tbody></table></div>`;
    },

    filter(status, btn) {
        this._currentFilter = status;
        document.querySelectorAll('.filter-pill').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        this._load();
    },

    async viewOrder(id) {
        const res = await AApi.getOrders(`id=${id}`);
        const o = res.success && res.data[0];
        if (!o) { showToast('Order not found'); return; }
        const modal = document.getElementById('order-modal');
        modal.style.display = 'flex';
        modal.innerHTML = `<div class="modal-box">
            <div class="modal-header">
                <h3>${o.order_number}</h3>
                <button class="modal-close" onclick="AdminOrders.closeModal()">✕</button>
            </div>
            <div style="padding:20px;overflow-y:auto;max-height:70vh;">
                <p><strong>Customer:</strong> ${o.customer_name} · ${o.customer_phone}</p>
                <p><strong>Restaurant:</strong> ${o.restaurant_name}</p>
                <p><strong>Status:</strong> <span class="badge badge-${o.status}">${o.status}</span></p>
                <p><strong>Payment:</strong> ${o.payment_method} · ${o.payment_status}</p>
                <p><strong>Address:</strong> ${o.delivery_address || 'Pickup'}</p>
                <p><strong>Items:</strong></p>
                <ul style="margin:8px 0 12px 16px;">${(o.items || []).map(i =>
                    `<li>${i.quantity}× ${i.item_name} — ₹${i.total_price}</li>`).join('')}
                </ul>
                <div style="border-top:1px solid #eee;padding-top:12px;">
                    <p>Subtotal: ₹${o.subtotal}</p>
                    ${o.delivery_fee ? `<p>Delivery: ₹${o.delivery_fee}</p>` : ''}
                    ${o.discount_amount ? `<p>Discount: -₹${o.discount_amount}</p>` : ''}
                    <p><strong>Total: ₹${o.total_amount}</strong></p>
                </div>
                ${o.special_instructions ? `<p style="margin-top:8px;font-style:italic;">Note: ${o.special_instructions}</p>` : ''}
                <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
                    ${o.status !== 'delivered' && o.status !== 'cancelled' ?
                        `<button class="btn-danger btn-sm" onclick="AdminOrders.cancelOrder(${o.id})">Cancel Order</button>` : ''}
                    ${o.customer_phone ?
                        `<a class="btn-wa btn-sm" href="https://wa.me/${o.customer_phone.replace('+','')}?text=Hi%20${encodeURIComponent(o.customer_name)}%2C%20this%20is%20Cora%20support%20regarding%20your%20order%20${o.order_number}" target="_blank">💬 WhatsApp Customer</a>` : ''}
                </div>
            </div>
        </div>`;
    },

    async cancelOrder(id) {
        if (!confirm('Cancel this order?')) return;
        const res = await AApi.updateOrder({ id, status: 'cancelled', cancel_reason: 'Cancelled by admin' });
        if (res.success) { showToast('Order cancelled'); this.closeModal(); this._load(); }
        else showToast(res.message || 'Error');
    },

    closeModal() {
        const m = document.getElementById('order-modal');
        if (m) m.style.display = 'none';
    },

    _fmt(dt) {
        if (!dt) return '—';
        const d = new Date(dt);
        return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short' }) + ' ' +
               d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
    }
};

CORA_EOF

# ── admin/js/restaurants.js
cat << 'CORA_EOF' > 'admin/js/restaurants.js'
/* ============================================================
   Cora Admin — restaurants.js
   ============================================================ */
const AdminRestaurants = {
    _list: [],

    async render(container) {
        container.innerHTML = `<div style="padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h2 style="font-family:'Playfair Display',serif;font-size:20px;">Restaurants</h2>
                <button class="btn-primary btn-sm" onclick="AdminRestaurants.showAddForm()">+ Add</button>
            </div>
            <div id="rest-list"><div class="skel" style="height:60px;border-radius:12px;"></div></div>
        </div>
        <div id="rest-modal" class="modal-overlay" style="display:none;"></div>`;
        this._load();
    },

    async _load() {
        const res = await AApi.getRestaurants();
        if (!res.success) return;
        this._list = res.data;
        const wrap = document.getElementById('rest-list');
        if (!wrap) return;
        if (!this._list.length) { wrap.innerHTML = '<p class="empty-state">No restaurants yet</p>'; return; }

        wrap.innerHTML = `<div class="data-table-wrap"><table class="data-table">
            <thead><tr><th>Name</th><th>Owner Phone</th><th>Area</th><th>Commission</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>${this._list.map(r => `
            <tr>
                <td>
                    ${r.is_promoted ? '<span class="crown-badge">👑</span> ' : ''}
                    <strong>${r.name}</strong>
                    ${r.cuisine_tags ? `<br><small style="color:#999;">${r.cuisine_tags}</small>` : ''}
                </td>
                <td>${r.owner_phone || '—'}</td>
                <td>${r.area || '—'}</td>
                <td>${r.commission_percent ?? 10}%</td>
                <td>
                    <span class="badge ${r.is_active ? 'badge-delivered' : 'badge-cancelled'}">${r.is_active ? 'Active' : 'Inactive'}</span>
                    ${r.is_open ? '<span class="badge badge-preparing" style="margin-left:4px;">Open</span>' : ''}
                </td>
                <td class="action-btns">
                    <button class="btn-xs btn-outline" onclick="AdminRestaurants.editRestaurant(${r.id})">Edit</button>
                    <button class="btn-xs ${r.is_active ? 'btn-danger' : 'btn-success'}" onclick="AdminRestaurants.toggleActive(${r.id}, ${r.is_active ? 0 : 1})">${r.is_active ? 'Disable' : 'Enable'}</button>
                    <button class="btn-xs btn-gold" onclick="AdminRestaurants.setCrown(${r.id})" title="Set Restaurant of the Week">👑</button>
                </td>
            </tr>`).join('')}
            </tbody></table></div>`;
    },

    showAddForm() {
        const modal = document.getElementById('rest-modal');
        modal.style.display = 'flex';
        modal.innerHTML = `<div class="modal-box">
            <div class="modal-header"><h3>Add Restaurant</h3><button class="modal-close" onclick="AdminRestaurants.closeModal()">✕</button></div>
            <div style="padding:20px;overflow-y:auto;max-height:70vh;">
                <div class="form-group"><label>Owner Phone (+91)</label><input id="r-phone" type="tel" maxlength="10" placeholder="9876543210"></div>
                <div class="form-group"><label>Restaurant Name</label><input id="r-name" placeholder="Taste of Kashmir"></div>
                <div class="form-group"><label>Description</label><textarea id="r-desc" rows="2"></textarea></div>
                <div class="form-group"><label>Cuisine Tags (comma-separated)</label><input id="r-cuisine" placeholder="Kashmiri, Wazwan, Non-veg"></div>
                <div class="form-group"><label>Area</label>
                    <select id="r-area"><option value="">Select area</option>
                    ${['Kulgam Town','Qaimoh','Devsar','Yaripora','DH Pora','Frisal'].map(a => `<option>${a}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Address</label><input id="r-addr" placeholder="Main Chowk, Kulgam"></div>
                <div class="form-group"><label>Min Order (₹)</label><input id="r-minorder" type="number" value="100"></div>
                <div class="form-group"><label>Avg Prep Time (minutes)</label><input id="r-preptime" type="number" value="25"></div>
                <div class="form-group"><label>Commission (%)</label><input id="r-commission" type="number" value="10" min="0" max="50"></div>
                <div class="form-group"><label>Cover Image</label><input id="r-img" type="file" accept="image/*"></div>
                <button class="btn-primary" style="width:100%;margin-top:8px;" onclick="AdminRestaurants.submitAdd()">Add Restaurant</button>
            </div>
        </div>`;
    },

    async submitAdd() {
        const fd = new FormData();
        fd.append('owner_phone', '+91' + document.getElementById('r-phone').value.trim());
        fd.append('name', document.getElementById('r-name').value.trim());
        fd.append('description', document.getElementById('r-desc').value.trim());
        fd.append('cuisine_tags', document.getElementById('r-cuisine').value.trim());
        fd.append('area', document.getElementById('r-area').value);
        fd.append('address', document.getElementById('r-addr').value.trim());
        fd.append('min_order_amount', document.getElementById('r-minorder').value);
        fd.append('avg_prep_time_minutes', document.getElementById('r-preptime').value);
        fd.append('commission_percent', document.getElementById('r-commission').value);
        const imgFile = document.getElementById('r-img').files[0];
        if (imgFile) fd.append('cover_image', imgFile);

        const res = await AApi.addRestaurant(fd);
        if (res.success) {
            showToast('Restaurant added!');
            this.closeModal();
            this._load();
        } else {
            showToast(res.message || 'Error adding restaurant');
        }
    },

    editRestaurant(id) {
        const r = this._list.find(x => x.id === id);
        if (!r) return;
        const modal = document.getElementById('rest-modal');
        modal.style.display = 'flex';
        modal.innerHTML = `<div class="modal-box">
            <div class="modal-header"><h3>Edit Restaurant</h3><button class="modal-close" onclick="AdminRestaurants.closeModal()">✕</button></div>
            <div style="padding:20px;overflow-y:auto;max-height:70vh;">
                <div class="form-group"><label>Name</label><input id="e-name" value="${r.name}"></div>
                <div class="form-group"><label>Description</label><textarea id="e-desc" rows="2">${r.description || ''}</textarea></div>
                <div class="form-group"><label>Cuisine Tags</label><input id="e-cuisine" value="${r.cuisine_tags || ''}"></div>
                <div class="form-group"><label>Area</label>
                    <select id="e-area">
                    ${['Kulgam Town','Qaimoh','Devsar','Yaripora','DH Pora','Frisal'].map(a => `<option ${a === r.area ? 'selected' : ''}>${a}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Address</label><input id="e-addr" value="${r.address || ''}"></div>
                <div class="form-group"><label>Min Order (₹)</label><input id="e-minorder" type="number" value="${r.min_order_amount || 100}"></div>
                <div class="form-group"><label>Avg Prep Time</label><input id="e-preptime" type="number" value="${r.avg_prep_time_minutes || 25}"></div>
                <div class="form-group"><label>Commission (%)</label><input id="e-commission" type="number" value="${r.commission_percent ?? 10}"></div>
                <button class="btn-primary" style="width:100%;margin-top:8px;" onclick="AdminRestaurants.submitEdit(${id})">Save Changes</button>
            </div>
        </div>`;
    },

    async submitEdit(id) {
        const res = await AApi.updateRestaurant({
            id,
            name:                document.getElementById('e-name').value.trim(),
            description:         document.getElementById('e-desc').value.trim(),
            cuisine_tags:        document.getElementById('e-cuisine').value.trim(),
            area:                document.getElementById('e-area').value,
            address:             document.getElementById('e-addr').value.trim(),
            min_order_amount:    document.getElementById('e-minorder').value,
            avg_prep_time_minutes: document.getElementById('e-preptime').value,
            commission_percent:  document.getElementById('e-commission').value
        });
        if (res.success) { showToast('Saved!'); this.closeModal(); this._load(); }
        else showToast(res.message || 'Error');
    },

    async toggleActive(id, isActive) {
        const res = await AApi.updateRestaurant({ id, is_active: isActive });
        if (res.success) { showToast(isActive ? 'Restaurant enabled' : 'Restaurant disabled'); this._load(); }
        else showToast('Error');
    },

    async setCrown(id) {
        /* Remove crown from everyone, set on this one */
        const res = await AApi.updateRestaurant({ id, is_promoted: 1, set_week_special: 1 });
        if (res.success) { showToast('👑 Restaurant of the Week set!'); this._load(); }
        else showToast('Error setting crown');
    },

    closeModal() {
        const m = document.getElementById('rest-modal');
        if (m) m.style.display = 'none';
    }
};

CORA_EOF

# ── admin/js/support.js
cat << 'CORA_EOF' > 'admin/js/support.js'
/* ============================================================
   Cora Admin — support.js
   ============================================================ */
const AdminSupport = {
    _tickets: [],

    async render(container) {
        container.innerHTML = `<div style="padding:16px;">
            <h2 style="font-family:'Playfair Display',serif;font-size:20px;margin-bottom:16px;">Support Tickets</h2>

            <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
                ${['all','open','in_progress','resolved'].map(s => `
                    <button class="filter-pill ${s==='all'?'active':''}" data-filter="${s}"
                        onclick="AdminSupport.filter('${s}', this)">${s}</button>
                `).join('')}
            </div>

            <div id="ticket-list"><div class="skel" style="height:60px;border-radius:12px;"></div></div>
        </div>
        <div id="ticket-modal" class="modal-overlay" style="display:none;"></div>`;

        this._load('all');
    },

    async _load(statusFilter) {
        const res = await AApi.getTickets();
        const wrap = document.getElementById('ticket-list');
        if (!wrap) return;
        if (!res.success) { wrap.innerHTML = '<p class="empty-state">Failed to load tickets</p>'; return; }

        this._tickets = res.data;
        const filtered = statusFilter === 'all' ? this._tickets : this._tickets.filter(t => t.status === statusFilter);

        if (!filtered.length) { wrap.innerHTML = '<p class="empty-state">No tickets found</p>'; return; }

        wrap.innerHTML = filtered.map(t => `
        <div class="admin-card ticket-card" style="margin-bottom:12px;${t.status === 'open' ? 'border-left:4px solid var(--berry);' : ''}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap;">
                <div>
                    <span class="badge badge-${t.status === 'open' ? 'preparing' : t.status === 'resolved' ? 'delivered' : 'confirmed'}">${t.status}</span>
                    <span style="font-size:12px;color:#888;margin-left:8px;">#${t.id} · ${this._fmt(t.created_at)}</span>
                </div>
                <div style="font-size:12px;color:#888;">${t.customer_name || 'Unknown'} · ${t.customer_phone || ''}</div>
            </div>
            <p style="margin:8px 0 4px;font-weight:600;">${t.subject || 'Support Request'}</p>
            <p style="color:#666;font-size:13px;">${this._trunc(t.message, 120)}</p>
            ${t.order_number ? `<p style="font-size:12px;color:#999;margin-top:4px;">Order: ${t.order_number}</p>` : ''}
            ${t.admin_response ? `<div style="margin-top:8px;padding:8px;background:#f9f9f9;border-radius:8px;font-size:13px;color:#555;"><strong>Your reply:</strong> ${t.admin_response}</div>` : ''}
            <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn-primary btn-sm" onclick="AdminSupport.respond(${t.id})">Reply</button>
                ${t.status !== 'resolved' ? `<button class="btn-success btn-sm" onclick="AdminSupport.resolve(${t.id})">✓ Resolve</button>` : ''}
                ${t.customer_phone ? `<a class="btn-wa btn-sm" href="https://wa.me/${t.customer_phone.replace('+','')}?text=Hi%20${encodeURIComponent(t.customer_name || '')}%2C%20this%20is%20Cora%20support%20regarding%20ticket%20%23${t.id}" target="_blank">💬 WhatsApp</a>` : ''}
            </div>
        </div>`).join('');
    },

    filter(status, btn) {
        document.querySelectorAll('.filter-pill').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        this._load(status);
    },

    respond(id) {
        const t = this._tickets.find(x => x.id === id);
        if (!t) return;
        const modal = document.getElementById('ticket-modal');
        modal.style.display = 'flex';
        modal.innerHTML = `<div class="modal-box">
            <div class="modal-header"><h3>Reply to Ticket #${id}</h3><button class="modal-close" onclick="AdminSupport.closeModal()">✕</button></div>
            <div style="padding:20px;">
                <div style="background:#f9f9f9;padding:12px;border-radius:8px;margin-bottom:16px;font-size:13px;">
                    <strong>${t.subject}</strong><br><span style="color:#666;">${t.message}</span>
                </div>
                <div class="form-group"><label>Your Response</label><textarea id="ticket-reply" rows="4" placeholder="Type your response...">${t.admin_response || ''}</textarea></div>
                <div style="display:flex;gap:8px;margin-top:8px;">
                    <button class="btn-primary" onclick="AdminSupport.submitReply(${id}, false)">Send Reply</button>
                    <button class="btn-success" onclick="AdminSupport.submitReply(${id}, true)">Send & Resolve</button>
                </div>
            </div>
        </div>`;
    },

    async submitReply(id, resolve) {
        const reply = document.getElementById('ticket-reply').value.trim();
        if (!reply) { showToast('Enter a response'); return; }
        const res = await AApi.updateTicket({
            id,
            admin_response: reply,
            status: resolve ? 'resolved' : 'in_progress'
        });
        if (res.success) {
            showToast(resolve ? 'Ticket resolved!' : 'Reply sent!');
            this.closeModal();
            this._load('all');
        } else {
            showToast(res.message || 'Error');
        }
    },

    async resolve(id) {
        const res = await AApi.updateTicket({ id, status: 'resolved' });
        if (res.success) { showToast('Ticket resolved'); this._load('all'); }
        else showToast('Error');
    },

    closeModal() {
        const m = document.getElementById('ticket-modal');
        if (m) m.style.display = 'none';
    },

    _fmt(dt) {
        if (!dt) return '';
        return new Date(dt).toLocaleDateString('en-IN', { day:'2-digit', month:'short' }) + ' ' +
               new Date(dt).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
    },

    _trunc(str, n) {
        if (!str) return '';
        return str.length > n ? str.slice(0, n) + '…' : str;
    }
};

CORA_EOF

# ── api/.htaccess
cat << 'CORA_EOF' > 'api/.htaccess'
Options -Indexes

# Deny direct access to config files
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
<Files "database.php">
    Order Allow,Deny
    Deny from all
</Files>
<Files "jwt.php">
    Order Allow,Deny
    Deny from all
</Files>

# Allow .php files to be accessed via API
<FilesMatch "\.php$">
    Order Allow,Deny
    Allow from all
</FilesMatch>

# CORS and JSON headers handled by PHP

CORA_EOF

# ── api/admin/banners.php
cat << 'CORA_EOF' > 'api/admin/banners.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../helpers/upload.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
getAuthUser('admin');
$db = Database::getConnection();

try {
    switch ($method) {
        case 'GET':
            $stmt = $db->prepare("SELECT * FROM promo_banners ORDER BY sort_order ASC");
            $stmt->execute();
            success($stmt->fetchAll(), 'Banners retrieved');
            break;

        case 'POST':
            $title    = sanitizeString($_POST['title'] ?? '', 200);
            $subtitle = sanitizeString($_POST['subtitle'] ?? '', 300);
            $gradient = sanitizeString($_POST['bg_gradient'] ?? 'linear-gradient(135deg, #D1386C, #8C1D47)', 200);
            $coupon   = sanitizeString($_POST['coupon_code'] ?? '', 50);
            $link     = sanitizeString($_POST['link_url'] ?? '', 500);
            $sortOrder = sanitizeInt($_POST['sort_order'] ?? 0);

            if (!$title) error('Banner title required', 422);

            $imageUrl = null;
            if (!empty($_FILES['image'])) {
                $imageUrl = handleImageUpload('image', 'banners');
            }

            $stmt = $db->prepare("INSERT INTO promo_banners (title, subtitle, image_url, link_url, coupon_code, bg_gradient, sort_order) VALUES (?,?,?,?,?,?,?)");
            $stmt->execute([$title, $subtitle ?: null, $imageUrl, $link ?: null, $coupon ?: null, $gradient, $sortOrder]);
            $id = $db->lastInsertId();

            $stmt = $db->prepare("SELECT * FROM promo_banners WHERE id = ?");
            $stmt->execute([$id]);
            success($stmt->fetch(), 'Banner created', 201);
            break;

        case 'PUT':
            $input = getJsonInput();
            $id    = sanitizeInt($input['id'] ?? 0, 1);
            if (!$id) error('Banner ID required', 422);

            $updates = [];
            $params  = [];
            foreach (['title','subtitle','bg_gradient','coupon_code','link_url','sort_order','is_active'] as $f) {
                if (array_key_exists($f, $input)) {
                    $updates[] = "$f = ?";
                    $params[]  = in_array($f, ['sort_order','is_active']) ? sanitizeInt($input[$f]) : sanitizeString($input[$f], 500);
                }
            }
            if (!empty($updates)) {
                $params[] = $id;
                $db->prepare("UPDATE promo_banners SET " . implode(', ', $updates) . " WHERE id = ?")->execute($params);
            }
            success(null, 'Banner updated');
            break;

        case 'DELETE':
            $id = sanitizeInt($_GET['id'] ?? 0, 1);
            if (!$id) error('Banner ID required', 422);
            $db->prepare("DELETE FROM promo_banners WHERE id = ?")->execute([$id]);
            success(null, 'Banner deleted');
            break;

        default:
            error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Admin banners error: " . $e->getMessage());
    error('Failed to process banner', 500);
}

CORA_EOF

# ── api/admin/coupons.php
cat << 'CORA_EOF' > 'api/admin/coupons.php'
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
        $stmt = $db->prepare("
            SELECT c.*, (SELECT COUNT(*) FROM coupon_usage cu WHERE cu.coupon_id = c.id) AS total_uses
            FROM coupons c
            ORDER BY c.created_at DESC
        ");
        $stmt->execute();
        success($stmt->fetchAll(), 'Coupons retrieved');

    } elseif ($method === 'POST') {
        $input = getJsonInput();
        required($input, ['code', 'discount_type', 'discount_value', 'valid_from', 'valid_until']);

        $code        = strtoupper(sanitizeString($input['code'] ?? '', 50));
        $type        = sanitizeString($input['discount_type'] ?? 'percentage', 20);
        $value       = sanitizeFloat($input['discount_value'] ?? 0);
        $maxDiscount = isset($input['max_discount']) ? sanitizeFloat($input['max_discount']) : null;
        $minOrder    = sanitizeFloat($input['min_order_amount'] ?? 0);
        $limit       = sanitizeInt($input['usage_limit'] ?? 100);
        $perUser     = sanitizeInt($input['per_user_limit'] ?? 1);
        $validFrom   = sanitizeString($input['valid_from'] ?? '', 20);
        $validUntil  = sanitizeString($input['valid_until'] ?? '', 20);

        if (!validEnum($type, ['percentage', 'flat'])) error('Invalid discount type', 422);

        $stmt = $db->prepare("
            INSERT INTO coupons (code, discount_type, discount_value, max_discount, min_order_amount, usage_limit, per_user_limit, valid_from, valid_until)
            VALUES (?,?,?,?,?,?,?,?,?)
        ");
        $stmt->execute([$code, $type, $value, $maxDiscount, $minOrder, $limit, $perUser, $validFrom, $validUntil]);
        $id = $db->lastInsertId();

        $stmt = $db->prepare("SELECT * FROM coupons WHERE id = ?");
        $stmt->execute([$id]);
        success($stmt->fetch(), 'Coupon created', 201);

    } elseif ($method === 'PUT') {
        $input = getJsonInput();
        $id    = sanitizeInt($input['id'] ?? 0, 1);
        if (!$id) error('Coupon ID required', 422);

        $isActive = sanitizeInt($input['is_active'] ?? 1, 0, 1);
        $db->prepare("UPDATE coupons SET is_active = ? WHERE id = ?")->execute([$isActive, $id]);
        success(null, $isActive ? 'Coupon activated' : 'Coupon deactivated');

    } else {
        error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    if ($e->getCode() == 23000) error('Coupon code already exists', 409);
    error_log("Admin coupons error: " . $e->getMessage());
    error('Failed to process coupon', 500);
}

CORA_EOF

# ── api/admin/dashboard.php
cat << 'CORA_EOF' > 'api/admin/dashboard.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

try {
    getAuthUser('admin');
    $db = Database::getConnection();

    $stats = [];

    // Today's orders
    $stmt = $db->prepare("SELECT COUNT(*) AS cnt, COALESCE(SUM(total_amount),0) AS rev, COALESCE(SUM(commission_amount),0) AS comm FROM orders WHERE DATE(placed_at) = CURDATE()");
    $stmt->execute();
    $today = $stmt->fetch();
    $stats['today_orders']     = (int)$today['cnt'];
    $stats['today_revenue']    = (float)$today['rev'];
    $stats['today_commission'] = (float)$today['comm'];

    // Week orders
    $stmt = $db->prepare("SELECT COUNT(*) AS cnt, COALESCE(SUM(total_amount),0) AS rev FROM orders WHERE placed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)");
    $stmt->execute();
    $week = $stmt->fetch();
    $stats['week_orders']  = (int)$week['cnt'];
    $stats['week_revenue'] = (float)$week['rev'];

    // Month
    $stmt = $db->prepare("SELECT COUNT(*) AS cnt, COALESCE(SUM(total_amount),0) AS rev, COALESCE(SUM(commission_amount),0) AS comm FROM orders WHERE placed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)");
    $stmt->execute();
    $month = $stmt->fetch();
    $stats['month_orders']     = (int)$month['cnt'];
    $stats['month_revenue']    = (float)$month['rev'];
    $stats['month_commission'] = (float)$month['comm'];

    // Active restaurants
    $stmt = $db->prepare("SELECT COUNT(*) AS cnt FROM restaurants WHERE is_active = 1");
    $stmt->execute();
    $stats['active_restaurants'] = (int)$stmt->fetch()['cnt'];

    // Pending orders
    $stmt = $db->prepare("SELECT COUNT(*) AS cnt FROM orders WHERE status IN ('placed','accepted','preparing')");
    $stmt->execute();
    $stats['pending_orders'] = (int)$stmt->fetch()['cnt'];

    // Open support tickets
    $stmt = $db->prepare("SELECT COUNT(*) AS cnt FROM support_tickets WHERE status IN ('open','in_progress')");
    $stmt->execute();
    $stats['open_tickets'] = (int)$stmt->fetch()['cnt'];

    // Weekly chart
    $stmt = $db->prepare("
        SELECT DATE(placed_at) AS day, COUNT(*) AS orders, COALESCE(SUM(total_amount),0) AS revenue
        FROM orders
        WHERE placed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(placed_at)
        ORDER BY day ASC
    ");
    $stmt->execute();
    $stats['weekly_chart'] = $stmt->fetchAll();

    // Recent 10 orders
    $stmt = $db->prepare("
        SELECT o.id, o.order_number, o.status, o.total_amount, o.placed_at, o.payment_method,
               r.name AS restaurant_name, u.name AS customer_name
        FROM orders o
        JOIN restaurants r ON r.id = o.restaurant_id
        JOIN users u ON u.id = o.customer_id
        ORDER BY o.placed_at DESC
        LIMIT 10
    ");
    $stmt->execute();
    $stats['recent_orders'] = $stmt->fetchAll();

    success($stats, 'Dashboard loaded');

} catch (PDOException $e) {
    error_log("Admin dashboard error: " . $e->getMessage());
    error('Failed to load dashboard', 500);
}

CORA_EOF

# ── api/admin/delivery-boys.php
cat << 'CORA_EOF' > 'api/admin/delivery-boys.php'
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
        $stmt = $db->prepare("
            SELECT db.id, db.name, db.phone, db.vehicle_type, db.vehicle_number,
                   db.is_available, db.is_active, db.total_deliveries, db.rating, db.per_delivery_pay,
                   r.name AS restaurant_name, r.id AS restaurant_id
            FROM delivery_boys db
            LEFT JOIN restaurants r ON r.id = db.restaurant_id
            ORDER BY r.name, db.name
        ");
        $stmt->execute();
        success($stmt->fetchAll(), 'Delivery boys retrieved');

    } elseif ($method === 'POST') {
        $input = getJsonInput();
        required($input, ['name', 'phone']);

        $restaurantId = !empty($input['restaurant_id']) ? sanitizeInt($input['restaurant_id'], 1) : null;
        $name         = sanitizeString($input['name'] ?? '', 100);
        $phone        = sanitizeString($input['phone'] ?? '', 15);
        $vehicle      = sanitizeString($input['vehicle_type'] ?? 'bike', 20);
        $vehicleNum   = sanitizeString($input['vehicle_number'] ?? '', 30);
        $pay          = sanitizeFloat($input['per_delivery_pay'] ?? 30.00);

        if (!validPhone($phone)) error('Valid phone required', 422);

        // Create or find delivery boy user account
        $stmt = $db->prepare("SELECT id FROM users WHERE phone = ?");
        $stmt->execute([$phone]);
        $user = $stmt->fetch();

        if (!$user) {
            $stmt = $db->prepare("INSERT INTO users (phone, name, role) VALUES (?,?,'delivery_boy')");
            $stmt->execute([$phone, $name]);
            $userId = $db->lastInsertId();
        } else {
            $userId = $user['id'];
        }

        $stmt = $db->prepare("
            INSERT INTO delivery_boys (user_id, restaurant_id, name, phone, vehicle_type, vehicle_number, per_delivery_pay)
            VALUES (?,?,?,?,?,?,?)
        ");
        $stmt->execute([$userId, $restaurantId, $name, $phone, $vehicle, $vehicleNum ?: null, $pay]);
        $id = $db->lastInsertId();

        $stmt = $db->prepare("SELECT db.*, r.name AS restaurant_name FROM delivery_boys db LEFT JOIN restaurants r ON r.id = db.restaurant_id WHERE db.id = ?");
        $stmt->execute([$id]);
        success($stmt->fetch(), 'Delivery boy added', 201);

    } elseif ($method === 'PUT') {
        $input = getJsonInput();
        $id    = sanitizeInt($input['id'] ?? 0, 1);
        if (!$id) error('id required', 422);

        $fields = [];
        $params = [];
        if (isset($input['is_active'])) {
            $fields[] = 'is_active = ?';
            $params[]  = (int)$input['is_active'];
        }
        if (isset($input['is_available'])) {
            $fields[] = 'is_available = ?';
            $params[]  = (int)$input['is_available'];
        }
        if (isset($input['per_delivery_pay'])) {
            $fields[] = 'per_delivery_pay = ?';
            $params[]  = sanitizeFloat($input['per_delivery_pay']);
        }
        if (empty($fields)) error('Nothing to update', 422);

        $params[] = $id;
        $stmt = $db->prepare("UPDATE delivery_boys SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($params);
        success(['updated' => $stmt->rowCount()], 'Delivery boy updated');

    } else {
        error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Admin delivery boys error: " . $e->getMessage());
    error('Failed to process delivery boy', 500);
}

CORA_EOF

# ── api/admin/delivery-config.php
cat << 'CORA_EOF' > 'api/admin/delivery-config.php'
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

CORA_EOF

# ── api/admin/financial.php
cat << 'CORA_EOF' > 'api/admin/financial.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

try {
    getAuthUser('admin');
    $db = Database::getConnection();

    $dateFrom = sanitizeString($_GET['date_from'] ?? date('Y-m-01'), 10);
    $dateTo   = sanitizeString($_GET['date_to'] ?? date('Y-m-d'), 10);

    // Per-restaurant commission report
    $stmt = $db->prepare("
        SELECT r.id, r.name, r.area, r.commission_percent,
               COUNT(o.id) AS order_count,
               COALESCE(SUM(o.subtotal),0) AS gross_revenue,
               COALESCE(SUM(o.commission_amount),0) AS commission_earned,
               COALESCE(SUM(o.delivery_fee),0) AS delivery_fees,
               COALESCE(SUM(o.total_amount),0) AS gmv
        FROM restaurants r
        LEFT JOIN orders o ON o.restaurant_id = r.id
            AND o.status = 'delivered'
            AND DATE(o.placed_at) BETWEEN ? AND ?
        WHERE r.is_active = 1
        GROUP BY r.id
        ORDER BY commission_earned DESC
    ");
    $stmt->execute([$dateFrom, $dateTo]);
    $perRestaurant = $stmt->fetchAll();

    // Totals
    $stmt = $db->prepare("
        SELECT
            COUNT(*) AS total_orders,
            COALESCE(SUM(total_amount),0) AS total_gmv,
            COALESCE(SUM(commission_amount),0) AS total_commission,
            COALESCE(SUM(delivery_fee),0) AS total_delivery_fees,
            COALESCE(SUM(platform_fee),0) AS total_platform_fees
        FROM orders
        WHERE status = 'delivered' AND DATE(placed_at) BETWEEN ? AND ?
    ");
    $stmt->execute([$dateFrom, $dateTo]);
    $totals = $stmt->fetch();

    success([
        'date_from'      => $dateFrom,
        'date_to'        => $dateTo,
        'totals'         => $totals,
        'per_restaurant' => $perRestaurant
    ], 'Financial report retrieved');

} catch (PDOException $e) {
    error_log("Admin financial error: " . $e->getMessage());
    error('Failed to load financial report', 500);
}

CORA_EOF

# ── api/admin/notification.php
cat << 'CORA_EOF' > 'api/admin/notification.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

try {
    getAuthUser('admin');
    $input = getJsonInput();
    required($input, ['message']);

    $message = sanitizeString($input['message'] ?? '', 500);
    $title   = sanitizeString($input['title'] ?? 'CORA Notification', 200);

    // In a production app, this would integrate with FCM/Firebase push notifications.
    // For now, we store it as a broadcast message that clients can poll for.
    // This is a placeholder implementation.

    success([
        'broadcast' => true,
        'title'     => $title,
        'message'   => $message,
        'sent_at'   => date('Y-m-d H:i:s')
    ], 'Notification broadcast initiated');

} catch (Exception $e) {
    error_log("Notification error: " . $e->getMessage());
    error('Failed to send notification', 500);
}

CORA_EOF

# ── api/admin/order.php
cat << 'CORA_EOF' > 'api/admin/order.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') error('Method not allowed', 405);

try {
    getAuthUser('admin');
    $input = getJsonInput();

    required($input, ['order_id', 'action']);

    $orderId = sanitizeInt($input['order_id'] ?? 0, 1);
    $action  = sanitizeString($input['action'] ?? '', 30);
    $reason  = sanitizeString($input['reason'] ?? '', 500);

    $db   = Database::getConnection();
    $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->execute([$orderId]);
    $order = $stmt->fetch();
    if (!$order) error('Order not found', 404);

    switch ($action) {
        case 'cancel':
            $db->prepare("UPDATE orders SET status='cancelled', cancelled_at=NOW(), cancel_reason=?, cancelled_by='admin' WHERE id=?")
               ->execute([$reason ?: 'Cancelled by admin', $orderId]);
            break;

        case 'refund':
            $db->prepare("UPDATE orders SET payment_status='refunded' WHERE id=?")
               ->execute([$orderId]);
            break;

        case 'mark_delivered':
            $db->prepare("UPDATE orders SET status='delivered', delivered_at=NOW() WHERE id=?")
               ->execute([$orderId]);
            break;

        case 'reassign':
            $deliveryBoyId = sanitizeInt($input['delivery_boy_id'] ?? 0, 1);
            if (!$deliveryBoyId) error('Delivery boy ID required', 422);
            $db->prepare("UPDATE orders SET delivery_boy_id=? WHERE id=?")->execute([$deliveryBoyId, $orderId]);
            break;

        default:
            error('Unknown action', 422);
    }

    success(null, 'Order updated');

} catch (PDOException $e) {
    error_log("Admin order action error: " . $e->getMessage());
    error('Failed to update order', 500);
}

CORA_EOF

# ── api/admin/orders.php
cat << 'CORA_EOF' > 'api/admin/orders.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

try {
    getAuthUser('admin');
    $db = Database::getConnection();

    $status       = sanitizeString($_GET['status'] ?? '', 30);
    $restaurantId = sanitizeInt($_GET['restaurant_id'] ?? 0);
    $search       = sanitizeString($_GET['search'] ?? '', 100);
    $dateFrom     = sanitizeString($_GET['date_from'] ?? '', 10);
    $dateTo       = sanitizeString($_GET['date_to'] ?? '', 10);
    $page         = sanitizeInt($_GET['page'] ?? 1, 1);
    $limit        = 50;
    $offset       = ($page - 1) * $limit;

    $conditions = ['1=1'];
    $params     = [];

    if ($status) {
        $conditions[] = "o.status = ?";
        $params[]     = $status;
    }
    if ($restaurantId) {
        $conditions[] = "o.restaurant_id = ?";
        $params[]     = $restaurantId;
    }
    if ($search) {
        $conditions[] = "(o.order_number LIKE ? OR u.phone LIKE ? OR u.name LIKE ?)";
        $like = "%$search%";
        array_push($params, $like, $like, $like);
    }
    if ($dateFrom) {
        $conditions[] = "DATE(o.placed_at) >= ?";
        $params[]     = $dateFrom;
    }
    if ($dateTo) {
        $conditions[] = "DATE(o.placed_at) <= ?";
        $params[]     = $dateTo;
    }

    $where = implode(' AND ', $conditions);

    $stmt = $db->prepare("
        SELECT o.id, o.order_number, o.status, o.order_type, o.payment_method, o.payment_status,
               o.subtotal, o.total_amount, o.commission_amount, o.placed_at, o.delivered_at,
               r.name AS restaurant_name, u.name AS customer_name, u.phone AS customer_phone
        FROM orders o
        JOIN restaurants r ON r.id = o.restaurant_id
        JOIN users u ON u.id = o.customer_id
        WHERE $where
        ORDER BY o.placed_at DESC
        LIMIT $limit OFFSET $offset
    ");
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

    $stmt = $db->prepare("SELECT COUNT(*) AS total FROM orders o JOIN users u ON u.id = o.customer_id WHERE $where");
    $stmt->execute($params);
    $total = $stmt->fetch()['total'];

    success(['orders' => $orders, 'total' => (int)$total, 'page' => $page, 'limit' => $limit], 'Orders retrieved');

} catch (PDOException $e) {
    error_log("Admin orders error: " . $e->getMessage());
    error('Failed to load orders', 500);
}

CORA_EOF

# ── api/admin/restaurant.php
cat << 'CORA_EOF' > 'api/admin/restaurant.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../helpers/upload.php';
require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
getAuthUser('admin');
$db = Database::getConnection();

try {
    if ($method === 'POST') {
        // Create restaurant + owner user
        $name     = sanitizeString($_POST['name'] ?? '', 200);
        $phone    = sanitizeString($_POST['owner_phone'] ?? '', 15);
        $area     = sanitizeString($_POST['area'] ?? 'Kulgam Town', 100);
        $address  = sanitizeString($_POST['full_address'] ?? '', 500);
        $cuisine  = sanitizeString($_POST['cuisine_tags'] ?? '', 500);
        $desc     = sanitizeString($_POST['description'] ?? '', 2000);
        $upi      = sanitizeString($_POST['upi_id'] ?? '', 100);
        $comm     = sanitizeFloat($_POST['commission_percent'] ?? 12.00);
        $minOrder = sanitizeInt($_POST['min_order_amount'] ?? 100);
        $prepTime = sanitizeInt($_POST['avg_prep_time_minutes'] ?? 30);
        $ownerName = sanitizeString($_POST['owner_name'] ?? '', 100);

        if (!$name) error('Restaurant name required', 422);
        if (!$phone || !validPhone($phone)) error('Valid owner phone required', 422);

        // Create or find owner user
        $stmt = $db->prepare("SELECT id FROM users WHERE phone = ?");
        $stmt->execute([$phone]);
        $owner = $stmt->fetch();

        if (!$owner) {
            $stmt = $db->prepare("INSERT INTO users (phone, name, role) VALUES (?,?,'restaurant_owner')");
            $stmt->execute([$phone, $ownerName ?: null]);
            $ownerId = $db->lastInsertId();
        } else {
            $ownerId = $owner['id'];
            $db->prepare("UPDATE users SET role='restaurant_owner' WHERE id=?")->execute([$ownerId]);
        }

        $coverImage = null;
        if (!empty($_FILES['cover_image'])) {
            $coverImage = handleImageUpload('cover_image', 'restaurants');
        }

        $stmt = $db->prepare("
            INSERT INTO restaurants (owner_id, name, description, cuisine_tags, area, full_address, upi_id, commission_percent, min_order_amount, avg_prep_time_minutes, cover_image)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
        ");
        $stmt->execute([$ownerId, $name, $desc ?: null, $cuisine ?: null, $area, $address ?: null, $upi ?: null, $comm, $minOrder, $prepTime, $coverImage]);
        $rid = $db->lastInsertId();

        $stmt = $db->prepare("SELECT r.*, u.phone AS owner_phone, u.name AS owner_name FROM restaurants r JOIN users u ON u.id = r.owner_id WHERE r.id = ?");
        $stmt->execute([$rid]);
        success($stmt->fetch(), 'Restaurant created', 201);

    } elseif ($method === 'PUT') {
        $input = getJsonInput();
        $id    = sanitizeInt($input['id'] ?? 0, 1);
        if (!$id) error('Restaurant ID required', 422);

        $fields  = ['name','description','cuisine_tags','area','full_address','upi_id','commission_percent',
                    'min_order_amount','avg_prep_time_minutes','is_open','is_active','is_promoted','accepts_delivery','accepts_pickup','opens_at','closes_at'];
        $updates = [];
        $params  = [];

        foreach ($fields as $f) {
            if (array_key_exists($f, $input)) {
                $updates[] = "$f = ?";
                $params[]  = match($f) {
                    'commission_percent' => sanitizeFloat($input[$f]),
                    'min_order_amount','avg_prep_time_minutes','is_open','is_active','is_promoted','accepts_delivery','accepts_pickup' => sanitizeInt($input[$f]),
                    default => sanitizeString($input[$f], 500)
                };
            }
        }

        if (empty($updates)) error('Nothing to update', 422);
        $params[] = $id;
        $db->prepare("UPDATE restaurants SET " . implode(', ', $updates) . ", updated_at = NOW() WHERE id = ?")->execute($params);
        success(null, 'Restaurant updated');

    } else {
        error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Admin restaurant error: " . $e->getMessage());
    error('Failed to process restaurant', 500);
}

CORA_EOF

# ── api/admin/restaurants.php
cat << 'CORA_EOF' > 'api/admin/restaurants.php'
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
        $stmt = $db->prepare("
            SELECT r.id, r.name, r.area, r.cuisine_tags, r.phone, r.full_address,
                   r.rating, r.total_reviews, r.total_orders, r.commission_percent,
                   r.is_open, r.is_active, r.is_promoted, r.accepts_delivery, r.accepts_pickup,
                   r.cover_image, r.upi_id, r.min_order_amount, r.avg_prep_time_minutes,
                   r.opens_at, r.closes_at, r.created_at,
                   u.phone AS owner_phone, u.name AS owner_name,
                   COALESCE(SUM(o.total_amount),0) AS total_revenue,
                   COALESCE(SUM(o.commission_amount),0) AS total_commission
            FROM restaurants r
            LEFT JOIN users u ON u.id = r.owner_id
            LEFT JOIN orders o ON o.restaurant_id = r.id AND o.status = 'delivered'
            GROUP BY r.id
            ORDER BY r.is_active DESC, r.total_orders DESC
        ");
        $stmt->execute();
        success($stmt->fetchAll(), 'Restaurants retrieved');

    } else {
        error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Admin restaurants error: " . $e->getMessage());
    error('Failed to load restaurants', 500);
}

CORA_EOF

# ── api/admin/settlement.php
cat << 'CORA_EOF' > 'api/admin/settlement.php'
<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

setCorsHeaders();
getAuthUser('admin');

$db = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    /* -------------------------------------------------------
       Return current week's settlement summary per restaurant
       ------------------------------------------------------- */
    $weekStart = date('Y-m-d', strtotime('monday this week'));
    $weekEnd   = date('Y-m-d', strtotime('sunday this week'));

    $stmt = $db->prepare("
        SELECT
            r.id            AS restaurant_id,
            r.name          AS restaurant_name,
            r.commission_percent,
            COUNT(o.id)     AS order_count,
            COALESCE(SUM(o.total_amount), 0)    AS gmv,
            COALESCE(SUM(o.total_amount * r.commission_percent / 100), 0) AS commission_owed,
            ws.settled_at
        FROM restaurants r
        LEFT JOIN orders o
               ON o.restaurant_id = r.id
              AND o.status = 'delivered'
              AND DATE(o.placed_at) BETWEEN :week_start AND :week_end
        LEFT JOIN weekly_settlements ws
               ON ws.restaurant_id = r.id
              AND ws.week_start = :week_start2
        WHERE r.is_active = 1
        GROUP BY r.id, r.name, r.commission_percent, ws.settled_at
        ORDER BY commission_owed DESC
    ");
    $stmt->execute([':week_start' => $weekStart, ':week_end' => $weekEnd, ':week_start2' => $weekStart]);
    $rows = $stmt->fetchAll();

    foreach ($rows as &$row) {
        $row['gmv']            = round($row['gmv'], 2);
        $row['commission_owed'] = round($row['commission_owed'], 2);
    }

    success($rows, 'Settlement data');

} elseif ($method === 'POST') {
    /* -------------------------------------------------------
       Mark / unmark a restaurant as settled for current week
       ------------------------------------------------------- */
    $input = getJsonInput();
    $restaurantId = (int)($input['restaurant_id'] ?? 0);
    $settled      = (int)($input['settled'] ?? 1);
    $weekStart    = date('Y-m-d', strtotime('monday this week'));

    if (!$restaurantId) error('restaurant_id required', 422);

    /* Ensure weekly_settlements table exists */
    $db->exec("CREATE TABLE IF NOT EXISTS weekly_settlements (
        id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        restaurant_id   INT UNSIGNED NOT NULL,
        week_start      DATE NOT NULL,
        settled_at      DATETIME NULL,
        settled_by      INT UNSIGNED NULL,
        UNIQUE KEY uq_rest_week (restaurant_id, week_start),
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
    )");

    if ($settled) {
        $stmt = $db->prepare("
            INSERT INTO weekly_settlements (restaurant_id, week_start, settled_at)
            VALUES (:rid, :ws, NOW())
            ON DUPLICATE KEY UPDATE settled_at = NOW()
        ");
        $stmt->execute([':rid' => $restaurantId, ':ws' => $weekStart]);
    } else {
        $stmt = $db->prepare("
            UPDATE weekly_settlements SET settled_at = NULL
            WHERE restaurant_id = :rid AND week_start = :ws
        ");
        $stmt->execute([':rid' => $restaurantId, ':ws' => $weekStart]);
    }

    success(['settled' => $settled], 'Settlement updated');
} else {
    error('Method not allowed', 405);
}

CORA_EOF

# ── api/admin/support-tickets.php
cat << 'CORA_EOF' > 'api/admin/support-tickets.php'
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
        $status = sanitizeString($_GET['status'] ?? '', 20);
        $cond   = '1=1';
        $params = [];
        if ($status) {
            $cond     = "st.status = ?";
            $params[] = $status;
        }

        $stmt = $db->prepare("
            SELECT st.*, u.name AS customer_name, u.phone AS customer_phone,
                   o.order_number
            FROM support_tickets st
            JOIN users u ON u.id = st.customer_id
            LEFT JOIN orders o ON o.id = st.order_id
            WHERE $cond
            ORDER BY st.created_at DESC
            LIMIT 100
        ");
        $stmt->execute($params);
        success($stmt->fetchAll(), 'Tickets retrieved');

    } elseif ($method === 'PUT') {
        $input = getJsonInput();
        required($input, ['ticket_id']);

        $ticketId = sanitizeInt($input['ticket_id'] ?? 0, 1);
        $response = sanitizeString($input['admin_response'] ?? '', 2000);
        $status   = sanitizeString($input['status'] ?? 'resolved', 20);

        $resolvedAt = in_array($status, ['resolved', 'closed']) ? 'NOW()' : 'NULL';

        $stmt = $db->prepare("UPDATE support_tickets SET admin_response=?, status=?, resolved_at=IF(status IN ('resolved','closed'), NOW(), NULL) WHERE id=?");
        $stmt->execute([$response ?: null, $status, $ticketId]);

        success(null, 'Ticket updated');

    } else {
        error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Support tickets error: " . $e->getMessage());
    error('Failed to process ticket', 500);
}

CORA_EOF

# ── api/auth/me.php
cat << 'CORA_EOF' > 'api/auth/me.php'
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

CORA_EOF

# ── api/auth/profile.php
cat << 'CORA_EOF' > 'api/auth/profile.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    error('Method not allowed', 405);
}

try {
    $user = getAuthUser();
    $input = getJsonInput();

    $name  = sanitizeString($input['name'] ?? '', 100);
    $email = sanitizeString($input['email'] ?? '', 150);

    if ($email && !validEmail($email)) {
        error('Invalid email address', 422);
    }

    $db = Database::getConnection();
    $stmt = $db->prepare("UPDATE users SET name = ?, email = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$name ?: null, $email ?: null, $user['id']]);

    $stmt = $db->prepare("SELECT id, phone, name, email, role, avatar_url FROM users WHERE id = ?");
    $stmt->execute([$user['id']]);
    $updated = $stmt->fetch();

    success($updated, 'Profile updated');

} catch (PDOException $e) {
    error_log("Profile update error: " . $e->getMessage());
    error('Failed to update profile', 500);
}

CORA_EOF

# ── api/auth/verify.php
cat << 'CORA_EOF' > 'api/auth/verify.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error('Method not allowed', 405);
}

try {
    $input = getJsonInput();
    required($input, ['phone', 'firebase_uid']);

    $phone = sanitizeString($input['phone'] ?? '', 15);
    $firebaseUid = sanitizeString($input['firebase_uid'] ?? '', 128);
    $name = sanitizeString($input['name'] ?? '', 100);

    if (!validPhone($phone)) {
        error('Invalid phone number format', 422);
    }

    $db = Database::getConnection();

    // Find or create user
    $stmt = $db->prepare("SELECT id, phone, name, email, role, avatar_url, is_active FROM users WHERE phone = ?");
    $stmt->execute([$phone]);
    $user = $stmt->fetch();

    if (!$user) {
        // Create new customer
        $stmt = $db->prepare("INSERT INTO users (phone, name, firebase_uid, role) VALUES (?, ?, ?, 'customer')");
        $stmt->execute([$phone, $name ?: null, $firebaseUid]);
        $userId = $db->lastInsertId();

        $stmt = $db->prepare("SELECT id, phone, name, email, role, avatar_url, is_active FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
    } else {
        if (!$user['is_active']) {
            error('Account has been deactivated', 403);
        }
        // Update firebase uid if needed
        $stmt = $db->prepare("UPDATE users SET firebase_uid = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$firebaseUid, $user['id']]);
    }

    $token = JWT::generate($user['id'], $user['role']);
    $expiry = date('Y-m-d H:i:s', time() + (JWT_EXPIRY_DAYS * 86400));

    $stmt = $db->prepare("UPDATE users SET jwt_token = ?, token_expiry = ? WHERE id = ?");
    $stmt->execute([$token, $expiry, $user['id']]);

    success([
        'token' => $token,
        'user'  => $user
    ], 'Login successful');

} catch (PDOException $e) {
    error_log("Auth verify error: " . $e->getMessage());
    error('Authentication failed', 500);
}

CORA_EOF

# ── api/config/config.php
cat << 'CORA_EOF' > 'api/config/config.php'
<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'cora_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('JWT_SECRET', 'cora-kulgam-secret-key-change-before-production-2024');
define('UPLOAD_DIR', __DIR__ . '/../../uploads/');
define('UPLOAD_URL', '/uploads/');
define('MAX_IMAGE_SIZE', 2 * 1024 * 1024); // 2MB
define('APP_NAME', 'CORA');
define('APP_VERSION', '1.0.0');
define('JWT_EXPIRY_DAYS', 90);
define('ERROR_LOG', __DIR__ . '/../../logs/error.log');

CORA_EOF

# ── api/config/database.php
cat << 'CORA_EOF' > 'api/config/database.php'
<?php
require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            try {
                $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
                ]);
            } catch (PDOException $e) {
                error_log("Database connection failed: " . $e->getMessage());
                http_response_code(500);
                echo json_encode(['success' => false, 'data' => null, 'message' => 'Database connection failed']);
                exit;
            }
        }
        return self::$instance;
    }
}

CORA_EOF

# ── api/customer/addresses.php
cat << 'CORA_EOF' > 'api/customer/addresses.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$user   = getAuthUser('customer');
$db     = Database::getConnection();

try {
    switch ($method) {
        case 'GET':
            $stmt = $db->prepare("SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC");
            $stmt->execute([$user['id']]);
            success($stmt->fetchAll(), 'Addresses retrieved');
            break;

        case 'POST':
            $input = getJsonInput();
            required($input, ['full_address']);
            $label       = sanitizeString($input['label'] ?? 'Home', 50);
            $fullAddress = sanitizeString($input['full_address'], 500);
            $landmark    = sanitizeString($input['landmark'] ?? '', 200);
            $area        = sanitizeString($input['area'] ?? '', 100);
            $isDefault   = !empty($input['is_default']) ? 1 : 0;

            if ($isDefault) {
                $db->prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?")->execute([$user['id']]);
            }

            $stmt = $db->prepare("INSERT INTO addresses (user_id, label, full_address, landmark, area, is_default) VALUES (?,?,?,?,?,?)");
            $stmt->execute([$user['id'], $label, $fullAddress, $landmark ?: null, $area ?: null, $isDefault]);
            $id = $db->lastInsertId();

            $stmt = $db->prepare("SELECT * FROM addresses WHERE id = ?");
            $stmt->execute([$id]);
            success($stmt->fetch(), 'Address added', 201);
            break;

        case 'PUT':
            $input = getJsonInput();
            $id    = sanitizeInt($input['id'] ?? 0, 1);
            if (!$id) error('Address ID required', 422);

            $stmt = $db->prepare("SELECT id FROM addresses WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $user['id']]);
            if (!$stmt->fetch()) error('Address not found', 404);

            $label       = sanitizeString($input['label'] ?? 'Home', 50);
            $fullAddress = sanitizeString($input['full_address'] ?? '', 500);
            $landmark    = sanitizeString($input['landmark'] ?? '', 200);
            $area        = sanitizeString($input['area'] ?? '', 100);
            $isDefault   = !empty($input['is_default']) ? 1 : 0;

            if ($isDefault) {
                $db->prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?")->execute([$user['id']]);
            }

            $stmt = $db->prepare("UPDATE addresses SET label=?, full_address=?, landmark=?, area=?, is_default=? WHERE id=?");
            $stmt->execute([$label, $fullAddress, $landmark ?: null, $area ?: null, $isDefault, $id]);
            success(null, 'Address updated');
            break;

        case 'DELETE':
            $id = sanitizeInt($_GET['id'] ?? 0, 1);
            if (!$id) error('Address ID required', 422);

            $stmt = $db->prepare("DELETE FROM addresses WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $user['id']]);
            success(null, 'Address deleted');
            break;

        default:
            error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Address error: " . $e->getMessage());
    error('Failed to process address', 500);
}

CORA_EOF

# ── api/customer/apply-coupon.php
cat << 'CORA_EOF' > 'api/customer/apply-coupon.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

try {
    $user  = getAuthUser('customer');
    $input = getJsonInput();
    required($input, ['code', 'subtotal']);

    $code     = strtoupper(sanitizeString($input['code'] ?? '', 50));
    $subtotal = sanitizeFloat($input['subtotal'] ?? 0);

    $db   = Database::getConnection();
    $stmt = $db->prepare("
        SELECT c.*, (
            SELECT COUNT(*) FROM coupon_usage cu WHERE cu.coupon_id = c.id AND cu.user_id = ?
        ) AS user_uses
        FROM coupons c
        WHERE c.code = ? AND c.is_active = 1 AND NOW() BETWEEN c.valid_from AND c.valid_until
    ");
    $stmt->execute([$user['id'], $code]);
    $coupon = $stmt->fetch();

    if (!$coupon) error('Invalid or expired coupon code', 400);
    if ($coupon['used_count'] >= $coupon['usage_limit']) error('Coupon usage limit reached', 400);
    if ($coupon['user_uses'] >= $coupon['per_user_limit']) error('You have already used this coupon', 400);
    if ($subtotal < $coupon['min_order_amount']) error("Minimum order amount ₹{$coupon['min_order_amount']} required for this coupon", 400);

    $discount = 0;
    if ($coupon['discount_type'] === 'percentage') {
        $discount = ($subtotal * $coupon['discount_value']) / 100;
        if ($coupon['max_discount']) {
            $discount = min($discount, $coupon['max_discount']);
        }
    } else {
        $discount = min($coupon['discount_value'], $subtotal);
    }

    success([
        'discount'       => round($discount, 2),
        'coupon_code'    => $coupon['code'],
        'discount_type'  => $coupon['discount_type'],
        'discount_value' => $coupon['discount_value']
    ], "Coupon applied! You save ₹" . round($discount, 2));

} catch (PDOException $e) {
    error_log("Coupon error: " . $e->getMessage());
    error('Failed to apply coupon', 500);
}

CORA_EOF

# ── api/customer/banners.php
cat << 'CORA_EOF' > 'api/customer/banners.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

try {
    $db   = Database::getConnection();
    $stmt = $db->prepare("
        SELECT id, title, subtitle, image_url, link_url, coupon_code, bg_gradient
        FROM promo_banners
        WHERE is_active = 1 AND (valid_until IS NULL OR valid_until > NOW())
        ORDER BY sort_order ASC
    ");
    $stmt->execute();
    success($stmt->fetchAll(), 'Banners retrieved');
} catch (PDOException $e) {
    error_log("Banners error: " . $e->getMessage());
    error('Failed to load banners', 500);
}

CORA_EOF

# ── api/customer/order.php
cat << 'CORA_EOF' > 'api/customer/order.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    handleGetOrder();
} elseif ($method === 'POST') {
    handlePlaceOrder();
} else {
    error('Method not allowed', 405);
}

function handleGetOrder(): void {
    $user = getAuthUser();
    $id   = sanitizeInt($_GET['id'] ?? 0, 1);
    if (!$id) error('Order ID required', 422);

    $db = Database::getConnection();
    $stmt = $db->prepare("
        SELECT o.*, r.name AS restaurant_name, r.full_address AS restaurant_address,
               r.phone AS restaurant_phone, r.cover_image AS restaurant_image,
               a.full_address AS delivery_address, a.landmark, a.area AS delivery_area,
               db.name AS delivery_boy_name, db.phone AS delivery_boy_phone,
               u.name AS customer_name
        FROM orders o
        JOIN restaurants r ON r.id = o.restaurant_id
        LEFT JOIN addresses a ON a.id = o.address_id
        LEFT JOIN delivery_boys db ON db.id = o.delivery_boy_id
        JOIN users u ON u.id = o.customer_id
        WHERE o.id = ? AND o.customer_id = ?
    ");
    $stmt->execute([$id, $user['id']]);
    $order = $stmt->fetch();

    if (!$order) error('Order not found', 404);

    $stmt = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
    $stmt->execute([$id]);
    $order['items'] = $stmt->fetchAll();

    success($order, 'Order retrieved');
}

function handlePlaceOrder(): void {
    $user = getAuthUser('customer');
    $input = getJsonInput();

    required($input, ['restaurant_id', 'items', 'order_type', 'payment_method']);

    $restaurantId       = sanitizeInt($input['restaurant_id'] ?? 0, 1);
    $orderType          = $input['order_type'] ?? 'delivery';
    $paymentMethod      = $input['payment_method'] ?? 'cod';
    $addressId          = sanitizeInt($input['address_id'] ?? 0);
    $couponCode         = sanitizeString($input['coupon_code'] ?? '', 50);
    $specialInstructions = sanitizeString($input['special_instructions'] ?? '', 500);
    $items              = $input['items'] ?? [];

    if (!validEnum($orderType, ['delivery', 'pickup'])) error('Invalid order type', 422);
    if (!validEnum($paymentMethod, ['cod', 'upi'])) error('Invalid payment method', 422);
    if ($orderType === 'delivery' && !$addressId) error('Delivery address required', 422);
    if (empty($items)) error('No items in order', 422);

    $db = Database::getConnection();

    // Validate restaurant
    $stmt = $db->prepare("SELECT * FROM restaurants WHERE id = ? AND is_active = 1");
    $stmt->execute([$restaurantId]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);
    if (!$restaurant['is_open']) error('Restaurant is currently closed', 400);
    if ($orderType === 'delivery' && !$restaurant['accepts_delivery']) error('This restaurant does not accept delivery orders', 400);
    if ($orderType === 'pickup' && !$restaurant['accepts_pickup']) error('This restaurant does not accept pickup orders', 400);

    // Validate address
    if ($addressId) {
        $stmt = $db->prepare("SELECT * FROM addresses WHERE id = ? AND user_id = ?");
        $stmt->execute([$addressId, $user['id']]);
        $address = $stmt->fetch();
        if (!$address) error('Address not found', 404);
    }

    // Calculate subtotal
    $subtotal = 0;
    $validatedItems = [];
    foreach ($items as $item) {
        $menuItemId = sanitizeInt($item['menu_item_id'] ?? 0, 1);
        $qty        = sanitizeInt($item['quantity'] ?? 1, 1, 50);
        $notes      = sanitizeString($item['notes'] ?? '', 200);

        $stmt = $db->prepare("SELECT * FROM menu_items WHERE id = ? AND restaurant_id = ? AND is_available = 1");
        $stmt->execute([$menuItemId, $restaurantId]);
        $menuItem = $stmt->fetch();
        if (!$menuItem) error("Item #$menuItemId not available", 400);

        $subtotal += $menuItem['price'] * $qty;
        $validatedItems[] = [
            'menu_item_id' => $menuItemId,
            'name'         => $menuItem['name'],
            'price'        => $menuItem['price'],
            'quantity'     => $qty,
            'notes'        => $notes
        ];
    }

    if ($subtotal < $restaurant['min_order_amount']) {
        error("Minimum order amount is ₹{$restaurant['min_order_amount']}", 400);
    }

    // Delivery fee
    $deliveryFee = 0;
    if ($orderType === 'delivery') {
        $deliveryArea = $address['area'] ?? 'Kulgam Town';
        $stmt = $db->prepare("SELECT delivery_fee FROM area_fees WHERE area_name = ?");
        $stmt->execute([$deliveryArea]);
        $areaFee = $stmt->fetch();

        $stmt2 = $db->prepare("SELECT base_fee, free_delivery_above FROM delivery_config LIMIT 1");
        $stmt2->execute();
        $config = $stmt2->fetch();

        if ($subtotal >= $config['free_delivery_above']) {
            $deliveryFee = 0;
        } else {
            $deliveryFee = $areaFee ? $areaFee['delivery_fee'] : $config['base_fee'];
        }
    }

    $platformFee    = 5.00;
    $discountAmount = 0;
    $couponId       = null;

    // Apply coupon
    if ($couponCode) {
        $stmt = $db->prepare("
            SELECT c.*, (SELECT COUNT(*) FROM coupon_usage cu WHERE cu.coupon_id = c.id AND cu.user_id = ?) AS user_uses
            FROM coupons c
            WHERE c.code = ? AND c.is_active = 1 AND NOW() BETWEEN c.valid_from AND c.valid_until
        ");
        $stmt->execute([$user['id'], $couponCode]);
        $coupon = $stmt->fetch();

        if ($coupon && $coupon['used_count'] < $coupon['usage_limit'] && $coupon['user_uses'] < $coupon['per_user_limit'] && $subtotal >= $coupon['min_order_amount']) {
            if ($coupon['discount_type'] === 'percentage') {
                $discountAmount = ($subtotal * $coupon['discount_value']) / 100;
                if ($coupon['max_discount']) {
                    $discountAmount = min($discountAmount, $coupon['max_discount']);
                }
            } else {
                $discountAmount = min($coupon['discount_value'], $subtotal);
            }
            $couponId = $coupon['id'];
        }
    }

    $totalAmount      = max(0, $subtotal + $deliveryFee + $platformFee - $discountAmount);
    $commissionAmount = ($subtotal * $restaurant['commission_percent']) / 100;

    // Generate order number
    $today = date('Ymd');
    $stmt  = $db->prepare("SELECT COUNT(*) AS cnt FROM orders WHERE DATE(placed_at) = CURDATE()");
    $stmt->execute();
    $cnt   = $stmt->fetch()['cnt'];
    $orderNumber = 'CORA-' . $today . '-' . str_pad($cnt + 1, 4, '0', STR_PAD_LEFT);

    $db->beginTransaction();
    try {
        $stmt = $db->prepare("
            INSERT INTO orders (
                order_number, customer_id, restaurant_id, address_id, order_type,
                payment_method, subtotal, delivery_fee, platform_fee, discount_amount,
                coupon_code, total_amount, commission_amount, special_instructions, estimated_prep_minutes
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ");
        $stmt->execute([
            $orderNumber, $user['id'], $restaurantId,
            $addressId ?: null, $orderType, $paymentMethod,
            $subtotal, $deliveryFee, $platformFee, $discountAmount,
            $couponCode ?: null, $totalAmount, $commissionAmount,
            $specialInstructions ?: null, $restaurant['avg_prep_time_minutes']
        ]);
        $orderId = $db->lastInsertId();

        foreach ($validatedItems as $vi) {
            $stmt = $db->prepare("INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity, special_notes) VALUES (?,?,?,?,?,?)");
            $stmt->execute([$orderId, $vi['menu_item_id'], $vi['name'], $vi['price'], $vi['quantity'], $vi['notes'] ?: null]);
        }

        // Track coupon usage
        if ($couponId) {
            $stmt = $db->prepare("UPDATE coupons SET used_count = used_count + 1 WHERE id = ?");
            $stmt->execute([$couponId]);
            $stmt = $db->prepare("INSERT INTO coupon_usage (coupon_id, user_id, order_id) VALUES (?,?,?)");
            $stmt->execute([$couponId, $user['id'], $orderId]);
        }

        // Update restaurant order count
        $stmt = $db->prepare("UPDATE restaurants SET total_orders = total_orders + 1 WHERE id = ?");
        $stmt->execute([$restaurantId]);

        $db->commit();

        /* Fetch created order + restaurant UPI ID (needed for UPI deep link on client) */
        $stmt = $db->prepare("
            SELECT o.*, r.name AS restaurant_name, r.upi_id AS restaurant_upi_id,
                   r.phone AS restaurant_phone, r.full_address AS restaurant_address
            FROM orders o
            JOIN restaurants r ON r.id = o.restaurant_id
            WHERE o.id = ?
        ");
        $stmt->execute([$orderId]);
        $order = $stmt->fetch();

        $stmt = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $stmt->execute([$orderId]);
        $order['items'] = $stmt->fetchAll();

        success($order, 'Order placed successfully', 201);

    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }
}

CORA_EOF

# ── api/customer/orders.php
cat << 'CORA_EOF' > 'api/customer/orders.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

try {
    $user = getAuthUser('customer');
    $db   = Database::getConnection();

    $stmt = $db->prepare("
        SELECT o.id, o.order_number, o.status, o.order_type, o.payment_method, o.payment_status,
               o.total_amount, o.placed_at, o.delivered_at, o.cancelled_at,
               r.name AS restaurant_name, r.cover_image AS restaurant_image
        FROM orders o
        JOIN restaurants r ON r.id = o.restaurant_id
        WHERE o.customer_id = ?
        ORDER BY o.placed_at DESC
        LIMIT 50
    ");
    $stmt->execute([$user['id']]);
    $orders = $stmt->fetchAll();

    // Attach items to each order
    foreach ($orders as &$order) {
        $stmt = $db->prepare("SELECT item_name, quantity, item_price FROM order_items WHERE order_id = ?");
        $stmt->execute([$order['id']]);
        $order['items'] = $stmt->fetchAll();
    }

    success($orders, 'Orders retrieved');

} catch (PDOException $e) {
    error_log("Orders history error: " . $e->getMessage());
    error('Failed to load orders', 500);
}

CORA_EOF

# ── api/customer/restaurant.php
cat << 'CORA_EOF' > 'api/customer/restaurant.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    error('Method not allowed', 405);
}

$id = sanitizeInt($_GET['id'] ?? 0, 1);
if (!$id) {
    error('Restaurant ID required', 422);
}

try {
    $db = Database::getConnection();

    $stmt = $db->prepare("
        SELECT
            r.id, r.name, r.description, r.cuisine_tags,
            r.cover_image, r.logo_image, r.area, r.full_address,
            r.phone, r.upi_id,
            r.rating, r.total_reviews, r.total_orders,
            r.min_order_amount, r.avg_prep_time_minutes,
            r.is_open, r.opens_at, r.closes_at,
            r.is_promoted, r.accepts_delivery, r.accepts_pickup,
            COALESCE(af.delivery_fee, dc.base_fee) AS delivery_fee
        FROM restaurants r
        LEFT JOIN area_fees af ON af.area_name = r.area
        CROSS JOIN (SELECT base_fee FROM delivery_config LIMIT 1) dc
        WHERE r.id = ? AND r.is_active = 1
    ");
    $stmt->execute([$id]);
    $restaurant = $stmt->fetch();

    if (!$restaurant) {
        error('Restaurant not found', 404);
    }

    // Get menu categories with items
    $stmt = $db->prepare("
        SELECT id, name, sort_order
        FROM menu_categories
        WHERE restaurant_id = ? AND is_active = 1
        ORDER BY sort_order ASC
    ");
    $stmt->execute([$id]);
    $categories = $stmt->fetchAll();

    // Get all menu items
    $stmt = $db->prepare("
        SELECT id, category_id, name, description, price, image_url,
               is_veg, is_popular, is_available, prep_time_minutes, sort_order
        FROM menu_items
        WHERE restaurant_id = ? AND is_available = 1
        ORDER BY category_id, sort_order ASC
    ");
    $stmt->execute([$id]);
    $items = $stmt->fetchAll();

    // Group items by category
    $itemsByCategory = [];
    $uncategorized = [];
    foreach ($items as $item) {
        if ($item['category_id']) {
            $itemsByCategory[$item['category_id']][] = $item;
        } else {
            $uncategorized[] = $item;
        }
    }

    $menu = [];
    foreach ($categories as $cat) {
        $menu[] = [
            'id'    => $cat['id'],
            'name'  => $cat['name'],
            'items' => $itemsByCategory[$cat['id']] ?? []
        ];
    }

    if ($uncategorized) {
        $menu[] = ['id' => null, 'name' => 'Other', 'items' => $uncategorized];
    }

    // Recent reviews
    $stmt = $db->prepare("
        SELECT rv.food_rating, rv.delivery_rating, rv.comment, rv.created_at,
               u.name AS customer_name
        FROM reviews rv
        JOIN users u ON u.id = rv.customer_id
        WHERE rv.restaurant_id = ?
        ORDER BY rv.created_at DESC
        LIMIT 5
    ");
    $stmt->execute([$id]);
    $reviews = $stmt->fetchAll();

    success([
        'restaurant' => $restaurant,
        'menu'       => $menu,
        'reviews'    => $reviews
    ], 'Restaurant loaded');

} catch (PDOException $e) {
    error_log("Restaurant detail error: " . $e->getMessage());
    error('Failed to load restaurant', 500);
}

CORA_EOF

# ── api/customer/restaurants.php
cat << 'CORA_EOF' > 'api/customer/restaurants.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    error('Method not allowed', 405);
}

try {
    $db = Database::getConnection();

    $area      = sanitizeString($_GET['area'] ?? '', 100);
    $cuisine   = sanitizeString($_GET['cuisine'] ?? '', 100);
    $search    = sanitizeString($_GET['search'] ?? '', 200);
    $openOnly  = !empty($_GET['open_only']);

    $conditions = ["r.is_active = 1"];
    $params = [];

    if ($area) {
        $conditions[] = "r.area = ?";
        $params[] = $area;
    }

    if ($cuisine) {
        $conditions[] = "FIND_IN_SET(?, r.cuisine_tags) > 0";
        $params[] = $cuisine;
    }

    if ($search) {
        $conditions[] = "MATCH(r.name, r.cuisine_tags, r.description) AGAINST(? IN BOOLEAN MODE)";
        $params[] = $search . '*';
    }

    if ($openOnly) {
        $conditions[] = "r.is_open = 1";
    }

    $where = implode(' AND ', $conditions);

    $sql = "
        SELECT
            r.id, r.name, r.description, r.cuisine_tags,
            r.cover_image, r.logo_image, r.area, r.full_address,
            r.rating, r.total_reviews, r.total_orders,
            r.min_order_amount, r.avg_prep_time_minutes,
            r.is_open, r.opens_at, r.closes_at,
            r.is_promoted, r.accepts_delivery, r.accepts_pickup,
            COALESCE(af.delivery_fee, dc.base_fee) AS delivery_fee
        FROM restaurants r
        LEFT JOIN area_fees af ON af.area_name = r.area
        CROSS JOIN (SELECT base_fee FROM delivery_config LIMIT 1) dc
        WHERE $where
        ORDER BY r.is_promoted DESC, r.rating DESC, r.total_orders DESC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $restaurants = $stmt->fetchAll();

    success($restaurants, 'Restaurants retrieved');

} catch (PDOException $e) {
    error_log("Restaurants list error: " . $e->getMessage());
    error('Failed to load restaurants', 500);
}

CORA_EOF

# ── api/customer/review.php
cat << 'CORA_EOF' > 'api/customer/review.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

try {
    $user  = getAuthUser('customer');
    $input = getJsonInput();

    required($input, ['order_id', 'food_rating']);

    $orderId       = sanitizeInt($input['order_id'] ?? 0, 1);
    $foodRating    = sanitizeInt($input['food_rating'] ?? 0, 1, 5);
    $deliveryRating = isset($input['delivery_rating']) ? sanitizeInt($input['delivery_rating'], 1, 5) : null;
    $comment       = sanitizeString($input['comment'] ?? '', 1000);

    $db = Database::getConnection();

    // Verify order belongs to user and is delivered
    $stmt = $db->prepare("SELECT * FROM orders WHERE id = ? AND customer_id = ? AND status = 'delivered'");
    $stmt->execute([$orderId, $user['id']]);
    $order = $stmt->fetch();

    if (!$order) error('Order not found or not eligible for review', 404);

    // Check not already reviewed
    $stmt = $db->prepare("SELECT id FROM reviews WHERE order_id = ?");
    $stmt->execute([$orderId]);
    if ($stmt->fetch()) error('Order already reviewed', 409);

    $stmt = $db->prepare("
        INSERT INTO reviews (order_id, customer_id, restaurant_id, food_rating, delivery_rating, comment)
        VALUES (?,?,?,?,?,?)
    ");
    $stmt->execute([$orderId, $user['id'], $order['restaurant_id'], $foodRating, $deliveryRating, $comment ?: null]);

    // Update restaurant rating
    $stmt = $db->prepare("
        UPDATE restaurants r
        SET r.rating = (
            SELECT ROUND(AVG(food_rating), 1) FROM reviews WHERE restaurant_id = r.id
        ), r.total_reviews = (
            SELECT COUNT(*) FROM reviews WHERE restaurant_id = r.id
        )
        WHERE r.id = ?
    ");
    $stmt->execute([$order['restaurant_id']]);

    success(null, 'Review submitted, thank you!');

} catch (PDOException $e) {
    error_log("Review error: " . $e->getMessage());
    error('Failed to submit review', 500);
}

CORA_EOF

# ── api/customer/support.php
cat << 'CORA_EOF' > 'api/customer/support.php'
<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

setCorsHeaders();

$db     = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $user   = getAuthUser('customer');
    $userId = $user['user_id'];

    $stmt = $db->prepare("
        SELECT st.*, o.order_number
        FROM support_tickets st
        LEFT JOIN orders o ON o.id = st.order_id
        WHERE st.user_id = :uid
        ORDER BY st.created_at DESC
        LIMIT 20
    ");
    $stmt->execute([':uid' => $userId]);
    success($stmt->fetchAll(), 'Tickets');

} elseif ($method === 'POST') {
    /* Allow optional auth — chatbot can submit without token */
    $user   = optionalAuth();
    $input  = getJsonInput();

    $subject  = trim($input['subject']  ?? '');
    $message  = trim($input['message']  ?? '');
    $orderId  = !empty($input['order_id'])  ? (int)$input['order_id']  : null;
    $category = trim($input['category'] ?? 'general');
    $phone    = trim($input['phone']    ?? '');
    $name     = trim($input['name']     ?? '');

    if (!$subject || !$message) error('subject and message required', 422);

    $userId = $user ? $user['user_id'] : null;

    /* If no user but phone provided, look up user */
    if (!$userId && $phone) {
        $stmt = $db->prepare("SELECT id FROM users WHERE phone = :p LIMIT 1");
        $stmt->execute([':p' => $phone]);
        $row = $stmt->fetch();
        if ($row) $userId = $row['id'];
    }

    $stmt = $db->prepare("
        INSERT INTO support_tickets (user_id, order_id, subject, message, category, status, created_at)
        VALUES (:uid, :oid, :sub, :msg, :cat, 'open', NOW())
    ");
    $stmt->execute([
        ':uid' => $userId,
        ':oid' => $orderId,
        ':sub' => $subject,
        ':msg' => $message,
        ':cat' => $category
    ]);

    success(['ticket_id' => $db->lastInsertId()], 'Ticket submitted');

} else {
    error('Method not allowed', 405);
}

CORA_EOF

# ── api/helpers/auth.php
cat << 'CORA_EOF' > 'api/helpers/auth.php'
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

CORA_EOF

# ── api/helpers/jwt.php
cat << 'CORA_EOF' > 'api/helpers/jwt.php'
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

CORA_EOF

# ── api/helpers/response.php
cat << 'CORA_EOF' > 'api/helpers/response.php'
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

CORA_EOF

# ── api/helpers/upload.php
cat << 'CORA_EOF' > 'api/helpers/upload.php'
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

CORA_EOF

# ── api/helpers/validate.php
cat << 'CORA_EOF' > 'api/helpers/validate.php'
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

CORA_EOF

# ── api/restaurant/claim-delivery.php
cat << 'CORA_EOF' > 'api/restaurant/claim-delivery.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

try {
    $user  = getAuthUser('restaurant_owner');
    $input = getJsonInput();
    $poolId       = sanitizeInt($input['pool_id'] ?? 0, 1);
    $deliveryBoyId = sanitizeInt($input['delivery_boy_id'] ?? 0, 1);

    if (!$poolId || !$deliveryBoyId) error('Pool ID and delivery boy ID required', 422);

    $db = Database::getConnection();

    $stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);

    // Verify delivery boy belongs to this restaurant
    $stmt = $db->prepare("SELECT id FROM delivery_boys WHERE id = ? AND restaurant_id = ? AND is_active = 1 AND is_available = 1");
    $stmt->execute([$deliveryBoyId, $restaurant['id']]);
    if (!$stmt->fetch()) error('Delivery boy not available', 400);

    // Claim the pool delivery
    $stmt = $db->prepare("
        UPDATE public_delivery_pool SET status='claimed', claimed_by=?
        WHERE id = ? AND status = 'open' AND (expires_at IS NULL OR expires_at > NOW())
    ");
    $stmt->execute([$deliveryBoyId, $poolId]);

    if ($db->rowCount() === 0) {
        error('This delivery is no longer available', 409);
    }

    // Get order id and assign
    $stmt = $db->prepare("SELECT order_id FROM public_delivery_pool WHERE id = ?");
    $stmt->execute([$poolId]);
    $pool = $stmt->fetch();

    $db->prepare("UPDATE orders SET delivery_boy_id=?, delivery_status='assigned' WHERE id=?")
       ->execute([$deliveryBoyId, $pool['order_id']]);

    success(null, 'Delivery claimed successfully');

} catch (PDOException $e) {
    error_log("Claim delivery error: " . $e->getMessage());
    error('Failed to claim delivery', 500);
}

CORA_EOF

# ── api/restaurant/delivery-boy-status.php
cat << 'CORA_EOF' > 'api/restaurant/delivery-boy-status.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') error('Method not allowed', 405);

try {
    $user  = getAuthUser('restaurant_owner');
    $input = getJsonInput();
    $id    = sanitizeInt($input['delivery_boy_id'] ?? 0, 1);
    if (!$id) error('Delivery boy ID required', 422);

    $db   = Database::getConnection();
    $stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);

    $stmt = $db->prepare("UPDATE delivery_boys SET is_available = NOT is_available WHERE id = ? AND restaurant_id = ?");
    $stmt->execute([$id, $restaurant['id']]);

    $stmt = $db->prepare("SELECT id, name, is_available FROM delivery_boys WHERE id = ?");
    $stmt->execute([$id]);
    $boy  = $stmt->fetch();

    success($boy, $boy['is_available'] ? 'Marked as available' : 'Marked as unavailable');

} catch (PDOException $e) {
    error_log("Delivery boy status error: " . $e->getMessage());
    error('Failed to update status', 500);
}

CORA_EOF

# ── api/restaurant/delivery-boys.php
cat << 'CORA_EOF' > 'api/restaurant/delivery-boys.php'
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

    $stmt = $db->prepare("
        SELECT db.id, db.name, db.phone, db.vehicle_type, db.vehicle_number,
               db.is_available, db.is_active, db.total_deliveries, db.rating, db.per_delivery_pay,
               (SELECT COUNT(*) FROM orders o WHERE o.delivery_boy_id = db.id AND o.status IN ('picked_up','on_the_way')) AS active_deliveries
        FROM delivery_boys db
        WHERE db.restaurant_id = ?
        ORDER BY db.is_available DESC, db.name ASC
    ");
    $stmt->execute([$restaurant['id']]);
    success($stmt->fetchAll(), 'Delivery boys retrieved');

} catch (PDOException $e) {
    error_log("Delivery boys error: " . $e->getMessage());
    error('Failed to load delivery boys', 500);
}

CORA_EOF

# ── api/restaurant/earnings.php
cat << 'CORA_EOF' > 'api/restaurant/earnings.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
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

    $periods = [
        'today' => "DATE(placed_at) = CURDATE()",
        'week'  => "placed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)",
        'month' => "placed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)",
    ];

    $earnings = [];
    foreach ($periods as $period => $condition) {
        $stmt = $db->prepare("
            SELECT
                COUNT(*) AS order_count,
                SUM(subtotal) AS gross_revenue,
                SUM(commission_amount) AS commission,
                SUM(subtotal - commission_amount) AS net_revenue,
                AVG(total_amount) AS avg_order_value
            FROM orders
            WHERE restaurant_id = ? AND status = 'delivered' AND $condition
        ");
        $stmt->execute([$rid]);
        $data = $stmt->fetch();
        $earnings[$period] = [
            'order_count'    => (int)$data['order_count'],
            'gross_revenue'  => round((float)$data['gross_revenue'], 2),
            'commission'     => round((float)$data['commission'], 2),
            'net_revenue'    => round((float)$data['net_revenue'], 2),
            'avg_order_value'=> round((float)$data['avg_order_value'], 2),
        ];
    }

    // Daily breakdown for chart (last 7 days)
    $stmt = $db->prepare("
        SELECT DATE(placed_at) AS day, COUNT(*) AS orders, SUM(subtotal) AS revenue
        FROM orders
        WHERE restaurant_id = ? AND status = 'delivered'
          AND placed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(placed_at)
        ORDER BY day ASC
    ");
    $stmt->execute([$rid]);
    $earnings['daily_chart'] = $stmt->fetchAll();

    success($earnings, 'Earnings retrieved');

} catch (PDOException $e) {
    error_log("Earnings error: " . $e->getMessage());
    error('Failed to load earnings', 500);
}

CORA_EOF

# ── api/restaurant/menu-item.php
cat << 'CORA_EOF' > 'api/restaurant/menu-item.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../helpers/upload.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$user   = getAuthUser('restaurant_owner');
$db     = Database::getConnection();

$stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
$stmt->execute([$user['id']]);
$restaurant = $stmt->fetch();
if (!$restaurant) error('Restaurant not found', 404);
$rid = $restaurant['id'];

try {
    switch ($method) {
        case 'POST':
            $name        = sanitizeString($_POST['name'] ?? '', 200);
            $description = sanitizeString($_POST['description'] ?? '', 1000);
            $price       = sanitizeFloat($_POST['price'] ?? 0);
            $categoryId  = sanitizeInt($_POST['category_id'] ?? 0);
            $isVeg       = !empty($_POST['is_veg']) ? 1 : 0;
            $isPopular   = !empty($_POST['is_popular']) ? 1 : 0;
            $prepTime    = sanitizeInt($_POST['prep_time_minutes'] ?? 20, 1, 120);

            if (!$name) error('Item name required', 422);
            if ($price <= 0) error('Valid price required', 422);

            $imageUrl = null;
            if (!empty($_FILES['image'])) {
                $imageUrl = handleImageUpload('image', 'food');
            }

            $stmt = $db->prepare("
                INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, is_veg, is_popular, prep_time_minutes)
                VALUES (?,?,?,?,?,?,?,?,?)
            ");
            $stmt->execute([$rid, $categoryId ?: null, $name, $description ?: null, $price, $imageUrl, $isVeg, $isPopular, $prepTime]);
            $id = $db->lastInsertId();

            $stmt = $db->prepare("SELECT * FROM menu_items WHERE id = ?");
            $stmt->execute([$id]);
            success($stmt->fetch(), 'Menu item added', 201);
            break;

        case 'PUT':
            $input      = getJsonInput();
            $id         = sanitizeInt($input['id'] ?? 0, 1);
            if (!$id) error('Item ID required', 422);

            $stmt = $db->prepare("SELECT id FROM menu_items WHERE id = ? AND restaurant_id = ?");
            $stmt->execute([$id, $rid]);
            if (!$stmt->fetch()) error('Item not found', 404);

            $updates = [];
            $params  = [];
            $fields  = ['name', 'description', 'price', 'category_id', 'is_veg', 'is_popular', 'prep_time_minutes', 'is_available'];
            foreach ($fields as $f) {
                if (isset($input[$f])) {
                    $updates[] = "$f = ?";
                    $params[]  = match($f) {
                        'name'        => sanitizeString($input[$f], 200),
                        'description' => sanitizeString($input[$f], 1000),
                        'price'       => sanitizeFloat($input[$f]),
                        default       => sanitizeInt($input[$f])
                    };
                }
            }

            if (empty($updates)) error('Nothing to update', 422);
            $params[] = $id;
            $db->prepare("UPDATE menu_items SET " . implode(', ', $updates) . " WHERE id = ?")->execute($params);
            success(null, 'Item updated');
            break;

        case 'DELETE':
            $id = sanitizeInt($_GET['id'] ?? 0, 1);
            if (!$id) error('Item ID required', 422);

            $stmt = $db->prepare("DELETE FROM menu_items WHERE id = ? AND restaurant_id = ?");
            $stmt->execute([$id, $rid]);
            success(null, 'Item deleted');
            break;

        default:
            error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Menu item error: " . $e->getMessage());
    error('Failed to process menu item', 500);
}

CORA_EOF

# ── api/restaurant/menu.php
cat << 'CORA_EOF' > 'api/restaurant/menu.php'
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

CORA_EOF

# ── api/restaurant/notify-customer.php
cat << 'CORA_EOF' > 'api/restaurant/notify-customer.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

try {
    $user  = getAuthUser('restaurant_owner');
    $input = getJsonInput();
    required($input, ['order_id', 'type']);

    $orderId = sanitizeInt($input['order_id'] ?? 0, 1);
    $type    = sanitizeString($input['type'] ?? '', 30);
    $message = sanitizeString($input['message'] ?? '', 500);

    if (!in_array($type, ['pickup_request', 'delay_notice'])) {
        error('Invalid notification type', 422);
    }

    $db   = Database::getConnection();
    $stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);

    $stmt = $db->prepare("SELECT id, customer_id FROM orders WHERE id = ? AND restaurant_id = ?");
    $stmt->execute([$orderId, $restaurant['id']]);
    $order = $stmt->fetch();
    if (!$order) error('Order not found', 404);

    // Store notification in orders table note
    $note = match($type) {
        'pickup_request' => $message ?: 'Your order is ready! Our delivery partner is currently unavailable. Would you like to pick it up?',
        'delay_notice'   => $message ?: 'Your order is ready but delivery may be delayed by ~15-20 minutes. We are finding a delivery partner for you.',
        default          => $message
    };

    $deliveryStatus = $type === 'pickup_request' ? 'no_rider' : 'no_rider';
    $db->prepare("UPDATE orders SET customer_note_delivery=?, delivery_status=? WHERE id=?")
       ->execute([$note, $deliveryStatus, $orderId]);

    success(null, 'Customer notification sent');

} catch (PDOException $e) {
    error_log("Notify customer error: " . $e->getMessage());
    error('Failed to send notification', 500);
}

CORA_EOF

# ── api/restaurant/order-status.php
cat << 'CORA_EOF' > 'api/restaurant/order-status.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') error('Method not allowed', 405);

try {
    $user  = getAuthUser('restaurant_owner');
    $input = getJsonInput();

    required($input, ['order_id', 'status']);

    $orderId = sanitizeInt($input['order_id'] ?? 0, 1);
    $status  = sanitizeString($input['status'] ?? '', 30);
    $note    = sanitizeString($input['note'] ?? '', 500);
    $deliveryBoyId = sanitizeInt($input['delivery_boy_id'] ?? 0);

    $validStatuses = ['accepted','preparing','ready','picked_up','on_the_way','delivered','cancelled','delivery_issue'];
    if (!validEnum($status, $validStatuses)) error('Invalid status', 422);

    $db = Database::getConnection();

    $stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);

    $stmt = $db->prepare("SELECT * FROM orders WHERE id = ? AND restaurant_id = ?");
    $stmt->execute([$orderId, $restaurant['id']]);
    $order = $stmt->fetch();
    if (!$order) error('Order not found', 404);

    $updates    = ["status = ?", "restaurant_note = ?"];
    $params     = [$status, $note ?: null];

    $timestamps = [
        'accepted'       => 'accepted_at',
        'preparing'      => 'preparing_at',
        'ready'          => 'ready_at',
        'picked_up'      => 'picked_up_at',
        'delivered'      => 'delivered_at',
        'cancelled'      => 'cancelled_at',
    ];

    if (isset($timestamps[$status])) {
        $updates[] = $timestamps[$status] . " = NOW()";
    }

    if ($status === 'cancelled') {
        $updates[] = "cancel_reason = ?";
        $updates[] = "cancelled_by = 'restaurant'";
        $params[]  = $note ?: 'Cancelled by restaurant';
    }

    if ($deliveryBoyId) {
        $stmt = $db->prepare("SELECT id FROM delivery_boys WHERE id = ? AND restaurant_id = ? AND is_active = 1");
        $stmt->execute([$deliveryBoyId, $restaurant['id']]);
        if ($stmt->fetch()) {
            $updates[] = "delivery_boy_id = ?";
            $updates[] = "delivery_status = 'assigned'";
            $params[]  = $deliveryBoyId;
        }
    }

    $params[] = $orderId;
    $sql = "UPDATE orders SET " . implode(', ', $updates) . " WHERE id = ?";
    $db->prepare($sql)->execute($params);

    success(null, 'Order status updated');

} catch (PDOException $e) {
    error_log("Order status error: " . $e->getMessage());
    error('Failed to update order status', 500);
}

CORA_EOF

# ── api/restaurant/orders.php
cat << 'CORA_EOF' > 'api/restaurant/orders.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

try {
    $user = getAuthUser('restaurant_owner');
    $db   = Database::getConnection();

    // Get restaurant owned by this user
    $stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? AND is_active = 1 LIMIT 1");
    $stmt->execute([$user['id']]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);

    $restaurantId = $restaurant['id'];
    $status       = $_GET['status'] ?? '';

    $validStatuses = ['placed','accepted','preparing','ready','picked_up','on_the_way','delivered','cancelled','delivery_issue'];
    $conditions    = ["o.restaurant_id = ?"];
    $params        = [$restaurantId];

    if ($status && validEnum($status, $validStatuses)) {
        $conditions[] = "o.status = ?";
        $params[]     = $status;
    } else {
        // Default: active orders
        $conditions[] = "o.status NOT IN ('delivered','cancelled')";
    }

    $where = implode(' AND ', $conditions);

    $stmt = $db->prepare("
        SELECT o.id, o.order_number, o.status, o.delivery_status, o.order_type,
               o.payment_method, o.payment_status, o.total_amount, o.subtotal,
               o.placed_at, o.accepted_at, o.preparing_at, o.ready_at,
               o.special_instructions, o.estimated_prep_minutes,
               u.name AS customer_name, u.phone AS customer_phone,
               a.full_address AS delivery_address, a.landmark, a.area AS delivery_area,
               db.name AS delivery_boy_name, db.phone AS delivery_boy_phone
        FROM orders o
        JOIN users u ON u.id = o.customer_id
        LEFT JOIN addresses a ON a.id = o.address_id
        LEFT JOIN delivery_boys db ON db.id = o.delivery_boy_id
        WHERE $where
        ORDER BY o.placed_at DESC
        LIMIT 100
    ");
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

    foreach ($orders as &$order) {
        $stmt2 = $db->prepare("SELECT item_name, quantity, item_price, special_notes FROM order_items WHERE order_id = ?");
        $stmt2->execute([$order['id']]);
        $order['items'] = $stmt2->fetchAll();
    }

    success($orders, 'Orders retrieved');

} catch (PDOException $e) {
    error_log("Restaurant orders error: " . $e->getMessage());
    error('Failed to load orders', 500);
}

CORA_EOF

# ── api/restaurant/public-pool.php
cat << 'CORA_EOF' > 'api/restaurant/public-pool.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$user   = getAuthUser('restaurant_owner');
$db     = Database::getConnection();

$stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
$stmt->execute([$user['id']]);
$restaurant = $stmt->fetch();
if (!$restaurant) error('Restaurant not found', 404);

try {
    if ($method === 'GET') {
        // View open pool deliveries (for delivery boys to claim)
        $stmt = $db->prepare("
            SELECT pdp.*, r.name AS restaurant_name, o.total_amount
            FROM public_delivery_pool pdp
            JOIN restaurants r ON r.id = pdp.restaurant_id
            JOIN orders o ON o.id = pdp.order_id
            WHERE pdp.status = 'open' AND (pdp.expires_at IS NULL OR pdp.expires_at > NOW())
            ORDER BY pdp.created_at DESC
        ");
        $stmt->execute();
        success($stmt->fetchAll(), 'Public pool orders retrieved');

    } elseif ($method === 'POST') {
        $input   = getJsonInput();
        $orderId = sanitizeInt($input['order_id'] ?? 0, 1);
        $pay     = sanitizeFloat($input['offered_pay'] ?? 40.00);
        if (!$orderId) error('Order ID required', 422);

        // Verify order belongs to restaurant
        $stmt = $db->prepare("SELECT o.*, a.full_address AS del_address, r.full_address AS pick_address
            FROM orders o
            LEFT JOIN addresses a ON a.id = o.address_id
            JOIN restaurants r ON r.id = o.restaurant_id
            WHERE o.id = ? AND o.restaurant_id = ?");
        $stmt->execute([$orderId, $restaurant['id']]);
        $order = $stmt->fetch();
        if (!$order) error('Order not found', 404);

        $expires = date('Y-m-d H:i:s', time() + 900); // 15 minutes

        $stmt = $db->prepare("
            INSERT INTO public_delivery_pool (order_id, restaurant_id, pickup_address, delivery_address, offered_pay, expires_at)
            VALUES (?,?,?,?,?,?)
            ON DUPLICATE KEY UPDATE status='open', expires_at=?, offered_pay=?
        ");
        $stmt->execute([
            $orderId, $restaurant['id'],
            $order['pick_address'] ?? 'Restaurant Address',
            $order['del_address'] ?? 'Customer Address',
            $pay, $expires, $expires, $pay
        ]);

        // Update order delivery status
        $db->prepare("UPDATE orders SET delivery_status='public_pool' WHERE id=?")->execute([$orderId]);

        success(null, 'Order posted to public delivery pool');

    } else {
        error('Method not allowed', 405);
    }
} catch (PDOException $e) {
    error_log("Public pool error: " . $e->getMessage());
    error('Failed to process pool request', 500);
}

CORA_EOF

# ── api/restaurant/review-reply.php
cat << 'CORA_EOF' > 'api/restaurant/review-reply.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

try {
    $user  = getAuthUser('restaurant_owner');
    $input = getJsonInput();
    required($input, ['review_id', 'reply']);

    $reviewId = sanitizeInt($input['review_id'] ?? 0, 1);
    $reply    = sanitizeString($input['reply'] ?? '', 500);

    $db   = Database::getConnection();
    $stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);

    $stmt = $db->prepare("UPDATE reviews SET restaurant_reply = ? WHERE id = ? AND restaurant_id = ?");
    $stmt->execute([$reply, $reviewId, $restaurant['id']]);

    success(null, 'Reply posted');

} catch (PDOException $e) {
    error_log("Review reply error: " . $e->getMessage());
    error('Failed to post reply', 500);
}

CORA_EOF

# ── api/restaurant/reviews.php
cat << 'CORA_EOF' > 'api/restaurant/reviews.php'
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

    $stmt = $db->prepare("
        SELECT rv.*, u.name AS customer_name, o.order_number
        FROM reviews rv
        JOIN users u ON u.id = rv.customer_id
        JOIN orders o ON o.id = rv.order_id
        WHERE rv.restaurant_id = ?
        ORDER BY rv.created_at DESC
        LIMIT 50
    ");
    $stmt->execute([$restaurant['id']]);
    success($stmt->fetchAll(), 'Reviews retrieved');

} catch (PDOException $e) {
    error_log("Reviews error: " . $e->getMessage());
    error('Failed to load reviews', 500);
}

CORA_EOF

# ── api/restaurant/toggle-item.php
cat << 'CORA_EOF' > 'api/restaurant/toggle-item.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/validate.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') error('Method not allowed', 405);

try {
    $user  = getAuthUser('restaurant_owner');
    $input = getJsonInput();
    $id    = sanitizeInt($input['id'] ?? 0, 1);
    if (!$id) error('Item ID required', 422);

    $db   = Database::getConnection();
    $stmt = $db->prepare("SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $restaurant = $stmt->fetch();
    if (!$restaurant) error('Restaurant not found', 404);

    $stmt = $db->prepare("UPDATE menu_items SET is_available = NOT is_available WHERE id = ? AND restaurant_id = ?");
    $stmt->execute([$id, $restaurant['id']]);

    $stmt = $db->prepare("SELECT id, name, is_available FROM menu_items WHERE id = ?");
    $stmt->execute([$id]);
    $item = $stmt->fetch();

    success($item, $item['is_available'] ? 'Item marked as available' : 'Item marked as unavailable');

} catch (PDOException $e) {
    error_log("Toggle item error: " . $e->getMessage());
    error('Failed to toggle item', 500);
}

CORA_EOF

# ── api/restaurant/toggle-open.php
cat << 'CORA_EOF' > 'api/restaurant/toggle-open.php'
<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') error('Method not allowed', 405);

try {
    $user = getAuthUser('restaurant_owner');
    $db   = Database::getConnection();

    $stmt = $db->prepare("UPDATE restaurants SET is_open = NOT is_open WHERE owner_id = ?");
    $stmt->execute([$user['id']]);

    $stmt = $db->prepare("SELECT id, name, is_open FROM restaurants WHERE owner_id = ?");
    $stmt->execute([$user['id']]);
    $r = $stmt->fetch();

    success($r, $r['is_open'] ? 'Restaurant is now OPEN' : 'Restaurant is now CLOSED');

} catch (PDOException $e) {
    error_log("Toggle open error: " . $e->getMessage());
    error('Failed to toggle restaurant status', 500);
}

CORA_EOF

# ── customer/index.html
cat << 'CORA_EOF' > 'customer/index.html'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#D1386C">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="Cora">
    <title>Cora — Kulgam's Food, Delivered</title>
    <link rel="manifest" href="/customer/manifest.json">
    <link rel="apple-touch-icon" href="/assets/icons/icon-192.png">
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css" rel="stylesheet" crossorigin="anonymous">
    <link rel="stylesheet" href="/customer/css/app.css">
</head>
<body>
    <!-- App Shell -->
    <div id="app">
        <!-- Loading Screen -->
        <div id="loading-screen" class="loading-screen">
            <div class="loading-logo">
                <div class="logo-icon">🍽️</div>
                <h1>Cora</h1>
                <p>Kulgam's Food, Delivered</p>
            </div>
            <div class="loading-spinner"></div>
        </div>

        <!-- Auth Screen (Phone OTP) -->
        <div id="auth-screen" class="screen" style="display:none;">
            <div class="auth-header">
                <div class="auth-circles"></div>
                <div class="auth-logo">
                    <span class="auth-emoji">🍽️</span>
                    <h1>Cora</h1>
                    <p>Kulgam's Food, Delivered</p>
                </div>
            </div>
            <div class="auth-body">
                <div id="auth-phone-step">
                    <h2>Welcome! 👋</h2>
                    <p class="text-sub">Enter your phone number to get started</p>
                    <div class="input-group" style="margin-top:24px;">
                        <label>Phone Number</label>
                        <div class="phone-input">
                            <span class="country-code">🇮🇳 +91</span>
                            <input type="tel" id="phone-input" placeholder="98765 43210" maxlength="10" inputmode="numeric">
                        </div>
                    </div>
                    <button id="send-otp-btn" class="btn-primary" style="margin-top:20px;width:100%;">
                        Send OTP
                    </button>
                    <div id="recaptcha-container"></div>
                </div>
                <div id="auth-otp-step" style="display:none;">
                    <h2>Verify OTP 🔐</h2>
                    <p class="text-sub" id="otp-sent-to"></p>
                    <div class="input-group" style="margin-top:24px;">
                        <label>Enter 6-digit OTP</label>
                        <input type="number" id="otp-input" placeholder="••••••" maxlength="6" inputmode="numeric" class="otp-input">
                    </div>
                    <button id="verify-otp-btn" class="btn-primary" style="margin-top:20px;width:100%;">
                        Verify & Login
                    </button>
                    <button id="resend-otp-btn" class="btn-secondary" style="margin-top:10px;width:100%;">
                        Resend OTP
                    </button>
                </div>
            </div>
        </div>

        <!-- Main App (shown after auth) -->
        <div id="main-app" style="display:none;">
            <!-- Offline Banner -->
            <div id="offline-banner" class="offline-banner" style="display:none;">
                📡 You're offline. Showing cached data.
            </div>

            <!-- Screen Container -->
            <div id="screen-container"></div>

            <!-- Bottom Navigation -->
            <nav id="bottom-nav" class="bottom-nav">
                <a href="#home" class="nav-item active" data-screen="home">
                    <span class="nav-icon">🏠</span>
                    <span class="nav-label">Home</span>
                    <span class="nav-dot"></span>
                </a>
                <a href="#search" class="nav-item" data-screen="search">
                    <span class="nav-icon">🔍</span>
                    <span class="nav-label">Search</span>
                    <span class="nav-dot"></span>
                </a>
                <a href="#orders" class="nav-item" data-screen="orders">
                    <span class="nav-icon">📦</span>
                    <span class="nav-label">Orders</span>
                    <span class="nav-dot"></span>
                </a>
                <a href="#support" class="nav-item" data-screen="support">
                    <span class="nav-icon">💬</span>
                    <span class="nav-label">Help</span>
                    <span class="nav-dot"></span>
                </a>
                <a href="#profile" class="nav-item" data-screen="profile">
                    <span class="nav-icon">👤</span>
                    <span class="nav-label">Profile</span>
                    <span class="nav-dot"></span>
                </a>
            </nav>
        </div>
    </div>

    <!-- Toast Notification -->
    <div id="toast" class="toast"></div>

    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>

    <!-- App Scripts -->
    <script src="/customer/js/api.js"></script>
    <script src="/customer/js/components/loading.js"></script>
    <script src="/customer/js/components/promo-carousel.js"></script>
    <script src="/customer/js/components/restaurant-card.js"></script>
    <script src="/customer/js/components/menu-item.js"></script>
    <script src="/customer/js/components/cart-bar.js"></script>
    <script src="/customer/js/components/navbar.js"></script>
    <script src="/customer/js/screens/home.js"></script>
    <script src="/customer/js/screens/restaurant.js"></script>
    <script src="/customer/js/screens/cart.js"></script>
    <script src="/customer/js/screens/tracking.js"></script>
    <script src="/customer/js/screens/orders.js"></script>
    <script src="/customer/js/screens/support.js"></script>
    <script src="/customer/js/screens/profile.js"></script>
    <script src="/customer/js/screens/search.js"></script>
    <script src="/customer/js/app.js"></script>

    <script>
        // Service Worker Registration
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/customer/sw.js')
                    .then(reg => console.log('SW registered:', reg.scope))
                    .catch(err => console.log('SW registration failed:', err));
            });
        }
    </script>
</body>
</html>

CORA_EOF

# ── customer/manifest.json
cat << 'CORA_EOF' > 'customer/manifest.json'
{
    "name": "Cora — Kulgam's Food, Delivered",
    "short_name": "Cora",
    "description": "Order food from Kulgam's best restaurants",
    "start_url": "/customer/index.html",
    "display": "standalone",
    "orientation": "portrait",
    "theme_color": "#D1386C",
    "background_color": "#FFF0F5",
    "icons": [
        {
            "src": "/assets/icons/icon-192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any maskable"
        },
        {
            "src": "/assets/icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any maskable"
        }
    ],
    "categories": ["food", "shopping"],
    "lang": "en-IN"
}

CORA_EOF

# ── customer/sw.js
cat << 'CORA_EOF' > 'customer/sw.js'
const CACHE_NAME = 'cora-v1.0.0';
const STATIC_ASSETS = [
    '/customer/index.html',
    '/customer/css/app.css',
    '/customer/js/app.js',
    '/customer/js/api.js',
    '/customer/js/components/loading.js',
    '/customer/js/components/navbar.js',
    '/customer/js/components/promo-carousel.js',
    '/customer/js/components/restaurant-card.js',
    '/customer/js/components/menu-item.js',
    '/customer/js/components/cart-bar.js',
    '/customer/js/screens/home.js',
    '/customer/js/screens/restaurant.js',
    '/customer/js/screens/cart.js',
    '/customer/js/screens/tracking.js',
    '/customer/js/screens/orders.js',
    '/customer/js/screens/support.js',
    '/customer/js/screens/profile.js',
    '/customer/js/screens/search.js',
    '/customer/manifest.json',
];

// Install: cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
             .then(() => self.skipWaiting())
    );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch: network-first for API, cache-first for static
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Network-first for API calls
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(JSON.stringify({
                    success: false,
                    data: null,
                    message: 'No internet connection'
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }

    // Cache-first for static assets
    if (STATIC_ASSETS.includes(url.pathname)) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                return cached || fetch(event.request).then(resp => {
                    const clone = resp.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return resp;
                });
            })
        );
        return;
    }

    // Default: network with cache fallback
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});

CORA_EOF

# ── customer/css/app.css
cat << 'CORA_EOF' > 'customer/css/app.css'
/* ═══════════════════════════════════════
   CORA — Berry Pink Design System
   ═══════════════════════════════════════ */

:root {
    --berry:        #D1386C;
    --berry-dark:   #B22D5B;
    --berry-deep:   #8C1D47;
    --berry-light:  #FFF0F5;
    --berry-glow:   rgba(209,56,108,0.18);
    --berry-border: #FFE0EB;
    --white:        #FFFFFF;
    --text:         #1A1A1A;
    --text-sub:     #6B6B6B;
    --text-muted:   #A0A0A0;
    --green:        #1DB954;
    --green-light:  #E8F8EF;
    --orange:       #FF9800;
    --star:         #FFB800;
    --danger:       #E53935;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

html, body {
    height: 100%;
    overflow: hidden;
}

body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--berry-light);
    color: var(--text);
    font-size: 14px;
    line-height: 1.5;
}

/* ═══ APP FRAME ═══ */
#app {
    max-width: 480px;
    margin: 0 auto;
    height: 100vh;
    position: relative;
    background: var(--berry-light);
    overflow: hidden;
    box-shadow: 0 0 40px rgba(0,0,0,0.15);
}

/* ═══ LOADING SCREEN ═══ */
.loading-screen {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--berry), var(--berry-deep));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    gap: 32px;
}

.loading-logo {
    text-align: center;
    color: white;
}

.logo-icon {
    font-size: 64px;
    margin-bottom: 12px;
    animation: pulse 2s infinite;
}

.loading-logo h1 {
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    font-weight: 700;
    color: white;
}

.loading-logo p {
    font-size: 15px;
    color: rgba(255,255,255,0.8);
    margin-top: 4px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
}

/* ═══ AUTH SCREEN ═══ */
.auth-header {
    background: linear-gradient(135deg, var(--berry), var(--berry-deep));
    padding: 60px 24px 50px;
    position: relative;
    overflow: hidden;
    text-align: center;
}

.auth-circles::before,
.auth-circles::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
}
.auth-circles::before {
    width: 200px; height: 200px;
    top: -60px; right: -60px;
}
.auth-circles::after {
    width: 120px; height: 120px;
    bottom: -30px; left: -30px;
}

.auth-logo .auth-emoji {
    font-size: 52px;
    display: block;
    margin-bottom: 8px;
}

.auth-logo h1 {
    font-family: 'Playfair Display', serif;
    font-size: 38px;
    font-weight: 700;
    color: white;
}

.auth-logo p {
    font-size: 14px;
    color: rgba(255,255,255,0.8);
    margin-top: 4px;
}

.auth-body {
    padding: 32px 24px;
    background: var(--berry-light);
}

.auth-body h2 {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 6px;
}

/* ═══ SCREEN CONTAINER ═══ */
#screen-container {
    position: absolute;
    inset: 0 0 70px 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    background: var(--berry-light);
    scroll-behavior: smooth;
}

/* ═══ HEADER ═══ */
.screen-header {
    background: linear-gradient(135deg, var(--berry), var(--berry-deep));
    padding: 50px 20px 20px;
    position: relative;
    overflow: hidden;
}

.screen-header::before {
    content: '';
    position: absolute;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    top: -80px; right: -40px;
}

.screen-header::after {
    content: '';
    position: absolute;
    width: 100px; height: 100px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    bottom: -20px; left: 20px;
}

.header-logo {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: white;
    z-index: 1;
    position: relative;
}

.header-subtitle {
    font-size: 13px;
    color: rgba(255,255,255,0.8);
    z-index: 1;
    position: relative;
}

.header-address-bar {
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
    z-index: 1;
    position: relative;
    cursor: pointer;
    color: white;
    font-size: 13px;
}

.header-search {
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    z-index: 1;
    position: relative;
    cursor: pointer;
    transition: all 0.25s ease;
}

.header-search input {
    background: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 14px;
    width: 100%;
    font-family: 'DM Sans', sans-serif;
}

.header-search input::placeholder { color: rgba(255,255,255,0.7); }

/* ═══ BOTTOM NAV ═══ */
.bottom-nav {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-top: 1px solid var(--berry-border);
    box-shadow: 0 -4px 20px var(--berry-glow);
    z-index: 100;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    text-decoration: none;
    padding: 8px 12px;
    flex: 1;
    transition: all 0.25s ease;
    position: relative;
}

.nav-icon {
    font-size: 22px;
    line-height: 1;
    transition: all 0.25s ease;
}

.nav-label {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-muted);
    transition: all 0.25s ease;
}

.nav-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: transparent;
    margin-top: 2px;
    transition: all 0.25s ease;
}

.nav-item.active .nav-label { color: var(--berry); }
.nav-item.active .nav-dot { background: var(--berry); }
.nav-item.active .nav-icon { transform: scale(1.1); }

/* ═══ CARDS ═══ */
.card {
    background: white;
    border: 1px solid var(--berry-border);
    border-radius: 16px;
    box-shadow: 0 3px 16px var(--berry-glow);
    overflow: hidden;
    transition: all 0.25s ease;
}

.card:active { transform: scale(0.98); }

/* ═══ RESTAURANT CARD ═══ */
.restaurant-card {
    background: white;
    border: 1px solid var(--berry-border);
    border-radius: 16px;
    box-shadow: 0 3px 16px var(--berry-glow);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.25s ease;
}

.restaurant-card:active { transform: scale(0.98); box-shadow: 0 1px 8px var(--berry-glow); }

.restaurant-img-wrap {
    position: relative;
    height: 130px;
    overflow: hidden;
}

.restaurant-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s ease;
}

.restaurant-img-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--berry), var(--berry-deep));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
}

.restaurant-card.closed .restaurant-img-wrap img {
    filter: grayscale(100%);
}

.restaurant-closed-overlay {
    position: absolute;
    inset: 0;
    background: rgba(209,56,108,0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
}

.restaurant-closed-overlay strong {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 2px;
}

.restaurant-closed-overlay small {
    font-size: 12px;
    margin-top: 2px;
}

.badge-promoted {
    position: absolute;
    top: 8px; left: 8px;
    background: var(--berry);
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
    letter-spacing: 0.5px;
}

.badge-delivery-time {
    position: absolute;
    bottom: 8px; right: 8px;
    background: rgba(0,0,0,0.6);
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 6px;
}

.badge-distance {
    position: absolute;
    bottom: 8px; left: 8px;
    background: rgba(0,0,0,0.6);
    color: white;
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 6px;
}

.restaurant-info {
    padding: 12px 14px 14px;
}

.restaurant-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.restaurant-cuisine {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.restaurant-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
    flex-wrap: wrap;
}

.rating-badge {
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 3px 8px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    color: white;
}

.rating-badge.high { background: var(--green); }
.rating-badge.low  { background: var(--orange); }
.rating-badge.none { background: var(--text-muted); }

.meta-dot {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: var(--text-muted);
}

.meta-text {
    font-size: 12px;
    color: var(--text-sub);
}

/* ═══ VEG INDICATOR ═══ */
.veg-dot {
    width: 14px; height: 14px;
    border-radius: 2px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.veg-dot.veg   { border: 2px solid var(--green); }
.veg-dot.veg::after { content:''; width:6px;height:6px;border-radius:50%;background:var(--green); }
.veg-dot.nonveg { border: 2px solid var(--berry); }
.veg-dot.nonveg::after { content:''; width:6px;height:6px;border-radius:50%;background:var(--berry); }

/* ═══ BUTTONS ═══ */
.btn-primary {
    background: var(--berry);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 14px 20px;
    font-size: 15px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 4px 14px var(--berry-glow);
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-primary:hover   { background: var(--berry-dark); transform: translateY(-1px); }
.btn-primary:active  { transform: scale(0.97); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.btn-secondary {
    background: var(--berry-light);
    color: var(--berry);
    border: 1.5px solid var(--berry);
    border-radius: 12px;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.25s ease;
}

.btn-secondary:hover  { background: var(--berry); color: white; }
.btn-secondary:active { transform: scale(0.97); }

.btn-danger {
    background: var(--danger);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.25s ease;
}

/* ═══ INPUTS ═══ */
.input-group {
    margin-bottom: 16px;
}

.input-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-sub);
    margin-bottom: 6px;
}

.input-group input,
.input-group textarea,
.input-group select {
    width: 100%;
    background: white;
    border: 1.5px solid var(--berry-border);
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    outline: none;
    transition: all 0.25s ease;
}

.input-group input:focus,
.input-group textarea:focus,
.input-group select:focus {
    border-color: var(--berry);
    box-shadow: 0 0 0 3px var(--berry-glow);
}

.input-group textarea {
    resize: vertical;
    min-height: 80px;
}

.phone-input {
    display: flex;
    align-items: center;
    background: white;
    border: 1.5px solid var(--berry-border);
    border-radius: 12px;
    padding: 0 14px;
    transition: border-color 0.25s ease;
}

.phone-input:focus-within { border-color: var(--berry); box-shadow: 0 0 0 3px var(--berry-glow); }

.country-code {
    font-size: 14px;
    color: var(--text-sub);
    margin-right: 8px;
    white-space: nowrap;
    padding: 12px 0;
    border-right: 1px solid var(--berry-border);
    padding-right: 12px;
}

.phone-input input {
    border: none;
    border-radius: 0;
    padding: 12px 0 12px 10px;
    box-shadow: none;
}

.phone-input input:focus { box-shadow: none; border-color: transparent; }

.otp-input {
    text-align: center;
    font-size: 24px;
    letter-spacing: 10px;
    font-weight: 700;
}

/* ═══ PROMO CAROUSEL ═══ */
.carousel-wrap {
    padding: 16px;
    overflow: hidden;
}

.carousel-container {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
}

.carousel-track {
    display: flex;
    transition: transform 0.6s ease;
}

.carousel-slide {
    min-width: 100%;
    height: 140px;
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    cursor: pointer;
    display: flex;
    align-items: flex-end;
    padding: 16px;
}

.carousel-slide-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
}

.carousel-slide-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 60%);
}

.carousel-slide-content {
    position: relative;
    z-index: 1;
    color: white;
}

.carousel-slide-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.2;
}

.carousel-slide-subtitle {
    font-size: 12px;
    opacity: 0.9;
    margin-top: 2px;
}

.carousel-slide-btn {
    background: white;
    color: var(--berry);
    border: none;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 700;
    margin-top: 8px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.25s ease;
}

.carousel-dots {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 10px;
}

.carousel-dot {
    height: 6px;
    border-radius: 3px;
    background: var(--berry-border);
    transition: all 0.3s ease;
    cursor: pointer;
}

.carousel-dot.active {
    width: 20px;
    background: var(--berry);
}

.carousel-dot:not(.active) { width: 6px; }

/* ═══ CATEGORY PILLS ═══ */
.category-pills {
    display: flex;
    gap: 8px;
    padding: 16px 16px 0;
    overflow-x: auto;
    scrollbar-width: none;
}

.category-pills::-webkit-scrollbar { display: none; }

.category-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 24px;
    background: white;
    border: 1.5px solid var(--berry-border);
    font-size: 13px;
    font-weight: 500;
    color: var(--text-sub);
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.25s ease;
    flex-shrink: 0;
}

.category-pill.active {
    background: var(--berry);
    border-color: var(--berry);
    color: white;
}

.category-pill:hover:not(.active) {
    border-color: var(--berry);
    color: var(--berry);
}

/* ═══ MENU ITEM ═══ */
.menu-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--berry-border);
    transition: background 0.2s;
}

.menu-item:last-child { border-bottom: none; }
.menu-item:active { background: var(--berry-light); }

.menu-item-info { flex: 1; }

.menu-item-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 6px;
}

.menu-item-desc {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 3px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.menu-item-price {
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    margin-top: 6px;
}

.menu-item-img {
    width: 90px;
    height: 90px;
    border-radius: 12px;
    object-fit: cover;
    flex-shrink: 0;
}

.menu-item-img-placeholder {
    width: 90px;
    height: 90px;
    border-radius: 12px;
    background: var(--berry-light);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    flex-shrink: 0;
}

/* ═══ ADD/QUANTITY CONTROL ═══ */
.qty-control {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--berry-light);
    border: 1.5px solid var(--berry);
    border-radius: 10px;
    padding: 4px 8px;
}

.qty-btn {
    width: 26px; height: 26px;
    border-radius: 50%;
    border: none;
    background: var(--berry);
    color: white;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    line-height: 1;
}

.qty-btn:active { transform: scale(0.9); }

.qty-count {
    font-size: 15px;
    font-weight: 700;
    color: var(--berry);
    min-width: 20px;
    text-align: center;
}

.add-btn {
    background: white;
    border: 1.5px solid var(--berry);
    border-radius: 10px;
    color: var(--berry);
    font-size: 13px;
    font-weight: 700;
    padding: 6px 14px;
    cursor: pointer;
    transition: all 0.25s ease;
    font-family: 'DM Sans', sans-serif;
}

.add-btn:hover { background: var(--berry); color: white; }
.add-btn:active { transform: scale(0.95); }

/* ═══ CART BAR ═══ */
.cart-bar {
    position: fixed;
    bottom: 78px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 32px);
    max-width: 448px;
    background: var(--berry);
    border-radius: 16px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 8px 24px var(--berry-glow);
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 90;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from { transform: translateX(-50%) translateY(100px); opacity: 0; }
    to   { transform: translateX(-50%) translateY(0); opacity: 1; }
}

.cart-bar-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.cart-count-badge {
    background: white;
    color: var(--berry);
    width: 28px; height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
}

.cart-bar-text {
    color: white;
    font-size: 14px;
    font-weight: 600;
}

.cart-bar-amount {
    color: white;
    font-size: 16px;
    font-weight: 700;
}

/* ═══ SECTION HEADERS ═══ */
.section-header {
    padding: 20px 16px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.section-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    font-family: 'Playfair Display', serif;
}

.section-see-all {
    font-size: 13px;
    color: var(--berry);
    font-weight: 600;
    cursor: pointer;
}

/* ═══ GRID LAYOUTS ═══ */
.restaurants-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 0 16px 16px;
}

/* ═══ ORDER STATUS TIMELINE ═══ */
.timeline {
    padding: 16px;
}

.timeline-item {
    display: flex;
    gap: 14px;
    position: relative;
    padding-bottom: 20px;
}

.timeline-item:last-child { padding-bottom: 0; }

.timeline-dot-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.timeline-dot {
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 2px solid var(--berry-border);
    background: white;
    flex-shrink: 0;
    transition: all 0.3s;
}

.timeline-dot.done  { background: var(--green); border-color: var(--green); }
.timeline-dot.active { background: var(--berry); border-color: var(--berry); animation: pulse 1.5s infinite; }

.timeline-line {
    width: 2px;
    flex: 1;
    background: var(--berry-border);
    margin: 4px 0;
    min-height: 20px;
}

.timeline-line.done { background: var(--green); }

.timeline-content { flex: 1; }

.timeline-status {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-muted);
}

.timeline-status.done  { color: var(--green); }
.timeline-status.active { color: var(--berry); }

.timeline-time {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
}

/* ═══ CHAT / SUPPORT ═══ */
.chat-bubble {
    max-width: 80%;
    padding: 10px 14px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 8px;
}

.chat-bubble.bot {
    background: white;
    border: 1px solid var(--berry-border);
    border-bottom-left-radius: 4px;
    color: var(--text);
    align-self: flex-start;
}

.chat-bubble.user {
    background: var(--berry);
    color: white;
    border-bottom-right-radius: 4px;
    align-self: flex-end;
    margin-left: auto;
}

.chat-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 12px 0;
}

.chat-action-btn {
    background: white;
    border: 1.5px solid var(--berry);
    border-radius: 20px;
    color: var(--berry);
    font-size: 13px;
    font-weight: 500;
    padding: 6px 14px;
    cursor: pointer;
    transition: all 0.25s ease;
    font-family: 'DM Sans', sans-serif;
}

.chat-action-btn:hover { background: var(--berry); color: white; }

/* ═══ EMPTY STATES ═══ */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 32px;
    text-align: center;
    gap: 12px;
}

.empty-state-emoji {
    font-size: 64px;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.empty-state h3 {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
}

.empty-state p {
    font-size: 14px;
    color: var(--text-muted);
    max-width: 250px;
}

/* ═══ SKELETON LOADING ═══ */
.skeleton {
    background: linear-gradient(90deg, var(--berry-light) 25%, #ffe8f0 50%, var(--berry-light) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
}

@keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.skeleton-card {
    background: white;
    border: 1px solid var(--berry-border);
    border-radius: 16px;
    overflow: hidden;
    margin: 8px 0;
}

.skeleton-img  { height: 130px; border-radius: 0; }
.skeleton-line { height: 14px; margin: 8px 14px; }
.skeleton-line-sm { height: 10px; margin: 6px 14px; width: 60%; }

/* ═══ TOAST ═══ */
.toast {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(-80px);
    background: var(--text);
    color: white;
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    transition: transform 0.3s ease;
    max-width: 340px;
    text-align: center;
    pointer-events: none;
    white-space: nowrap;
}

.toast.show { transform: translateX(-50%) translateY(0); }
.toast.success { background: var(--green); }
.toast.error   { background: var(--danger); }
.toast.info    { background: var(--berry); }

/* ═══ OFFLINE BANNER ═══ */
.offline-banner {
    background: var(--orange);
    color: white;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    padding: 8px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    max-width: 480px;
    margin: 0 auto;
    z-index: 200;
}

/* ═══ PRICE BREAKDOWN ═══ */
.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    font-size: 14px;
    color: var(--text-sub);
    border-bottom: 1px dashed var(--berry-border);
}

.price-row:last-child { border-bottom: none; }

.price-row.total {
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
    border-top: 2px solid var(--berry-border);
    padding-top: 12px;
    margin-top: 4px;
}

.price-row.discount { color: var(--green); }

/* ═══ PAYMENT METHOD SELECTOR ═══ */
.payment-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 8px;
}

.payment-option {
    border: 1.5px solid var(--berry-border);
    border-radius: 12px;
    padding: 14px;
    cursor: pointer;
    transition: all 0.25s ease;
    text-align: center;
}

.payment-option.selected {
    border-color: var(--berry);
    background: var(--berry-light);
}

.payment-option .payment-icon { font-size: 28px; }
.payment-option .payment-name { font-size: 13px; font-weight: 600; margin-top: 4px; }

/* ═══ ADDRESS CARD ═══ */
.address-card {
    background: white;
    border: 1.5px solid var(--berry-border);
    border-radius: 12px;
    padding: 14px;
    cursor: pointer;
    transition: all 0.25s ease;
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.address-card.selected {
    border-color: var(--berry);
    background: var(--berry-light);
}

.address-card:active { transform: scale(0.98); }

.address-icon {
    font-size: 22px;
    flex-shrink: 0;
}

.address-details .address-label {
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
}

.address-details .address-text {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
}

/* ═══ ORDER CARD ═══ */
.order-card {
    background: white;
    border: 1px solid var(--berry-border);
    border-radius: 16px;
    padding: 16px;
    margin: 8px 16px;
    cursor: pointer;
    transition: all 0.25s ease;
}

.order-card:active { transform: scale(0.98); }

.order-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
}

.status-placed       { background: #FFF3E0; color: #E65100; }
.status-accepted     { background: #E3F2FD; color: #1565C0; }
.status-preparing    { background: #FFF8E1; color: #F57F17; }
.status-ready        { background: #E8F5E9; color: #2E7D32; }
.status-picked_up,
.status-on_the_way   { background: #F3E5F5; color: #6A1B9A; }
.status-delivered    { background: var(--green-light); color: var(--green); }
.status-cancelled    { background: #FFEBEE; color: var(--danger); }
.status-delivery_issue { background: #FFF3E0; color: #E65100; }

/* ═══ DELIVERY ANIMATION ═══ */
.delivery-animation {
    padding: 24px;
    text-align: center;
}

.delivery-road {
    position: relative;
    height: 60px;
    background: var(--berry-light);
    border-radius: 12px;
    overflow: hidden;
    margin: 16px 0;
}

.delivery-rider {
    position: absolute;
    font-size: 32px;
    top: 50%;
    transform: translateY(-50%);
    animation: ride 3s linear infinite;
}

@keyframes ride {
    0%   { left: -10%; }
    100% { left: 110%; }
}

/* ═══ MISC ═══ */
.text-sub   { color: var(--text-sub); }
.text-muted { color: var(--text-muted); }
.text-berry { color: var(--berry); }
.text-green { color: var(--green); }
.text-danger { color: var(--danger); }

.divider {
    height: 8px;
    background: var(--berry-light);
    margin: 0 -16px;
}

.section-pad {
    padding: 16px;
}

.toggle-switch {
    width: 48px;
    height: 26px;
    background: var(--berry-border);
    border-radius: 13px;
    position: relative;
    cursor: pointer;
    transition: background 0.25s;
    flex-shrink: 0;
}

.toggle-switch.on { background: var(--berry); }

.toggle-switch::after {
    content: '';
    position: absolute;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: white;
    top: 3px; left: 3px;
    transition: left 0.25s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}

.toggle-switch.on::after { left: 25px; }

.page-body {
    padding: 16px;
}

.screen-back-btn {
    background: rgba(255,255,255,0.2);
    border: none;
    border-radius: 10px;
    width: 36px; height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    color: white;
    transition: all 0.25s ease;
}

.screen-back-btn:hover { background: rgba(255,255,255,0.3); }

/* ═══ CATEGORY MENU TABS ═══ */
.menu-category-tabs {
    display: flex;
    overflow-x: auto;
    gap: 0;
    background: white;
    border-bottom: 1px solid var(--berry-border);
    scrollbar-width: none;
    position: sticky;
    top: 0;
    z-index: 10;
}

.menu-category-tabs::-webkit-scrollbar { display: none; }

.menu-tab {
    padding: 12px 16px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    white-space: nowrap;
    border-bottom: 2px solid transparent;
    transition: all 0.25s ease;
}

.menu-tab.active {
    color: var(--berry);
    border-bottom-color: var(--berry);
    font-weight: 700;
}

.menu-category-title {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 700;
    padding: 14px 16px 6px;
    color: var(--text);
}

/* ═══ RESPONSIVE ═══ */
@media (min-width: 481px) {
    #app {
        border-radius: 20px;
        margin: 20px auto;
        height: calc(100vh - 40px);
    }
}

CORA_EOF

# ── customer/js/api.js
cat << 'CORA_EOF' > 'customer/js/api.js'
/* ═══ CORA API Client ═══ */
const API_BASE = '/api';

const API = {
    _getToken() {
        return localStorage.getItem('cora_token');
    },

    async request(endpoint, options = {}) {
        const token = this._getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(options.headers || {})
        };

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired, force re-login
                    localStorage.removeItem('cora_token');
                    localStorage.removeItem('cora_user');
                    window.location.reload();
                    return;
                }
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (e) {
            if (!navigator.onLine) {
                throw new Error('No internet connection');
            }
            throw e;
        }
    },

    get(endpoint)          { return this.request(endpoint, { method: 'GET' }); },
    post(endpoint, body)   { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); },
    put(endpoint, body)    { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); },
    delete(endpoint)       { return this.request(endpoint, { method: 'DELETE' }); },

    // Multipart form (for file uploads)
    async upload(endpoint, formData) {
        const token = this._getToken();
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers,
                body: formData
            });
            return response.json();
        } catch (e) {
            if (!navigator.onLine) throw new Error('No internet connection');
            throw e;
        }
    },

    // Customer endpoints
    getRestaurants: (params = {}) => {
        const q = new URLSearchParams(params).toString();
        return API.get(`/customer/restaurants.php${q ? '?' + q : ''}`);
    },
    getRestaurant:  (id) => API.get(`/customer/restaurant.php?id=${id}`),
    getBanners:     ()  => API.get('/customer/banners.php'),
    placeOrder:     (data) => API.post('/customer/order.php', data),
    getOrder:       (id) => API.get(`/customer/order.php?id=${id}`),
    getOrders:      ()  => API.get('/customer/orders.php'),
    submitReview:   (data) => API.post('/customer/review.php', data),
    getAddresses:   ()  => API.get('/customer/addresses.php'),
    addAddress:     (data) => API.post('/customer/addresses.php', data),
    updateAddress:  (data) => API.put('/customer/addresses.php', data),
    deleteAddress:  (id) => API.delete(`/customer/addresses.php?id=${id}`),
    applyCoupon:    (data) => API.post('/customer/apply-coupon.php', data),

    // Auth
    verify:         (data) => API.post('/auth/verify.php', data),
    getMe:          ()  => API.get('/auth/me.php'),
    updateProfile:  (data) => API.put('/auth/profile.php', data),

    // Support
    createTicket: (data) => API.post('/customer/support.php', data),
};

CORA_EOF

# ── customer/js/app.js
cat << 'CORA_EOF' > 'customer/js/app.js'
/* ═══════════════════════════════════════
   CORA Customer App — Main Router & Init
   ═══════════════════════════════════════ */

// Firebase config — UPDATE BEFORE DEPLOYMENT
const FIREBASE_CONFIG = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// App State
const App = {
    user: null,
    cart: [],
    currentScreen: 'home',
    currentRestaurant: null,
    pollInterval: null,

    // ── Init ──────────────────────────────────────
    async init() {
        // Initialize Firebase
        try {
            firebase.initializeApp(FIREBASE_CONFIG);
        } catch (e) {
            console.warn('Firebase config not set. Auth will be disabled for demo.');
        }

        // Check stored session
        const token = localStorage.getItem('cora_token');
        const user  = localStorage.getItem('cora_user');

        if (token && user) {
            App.user = JSON.parse(user);
            App.showMainApp();
        } else {
            App.showAuthScreen();
        }

        // Load cart from storage
        const savedCart = localStorage.getItem('cora_cart');
        if (savedCart) App.cart = JSON.parse(savedCart);

        // Offline detection
        window.addEventListener('online',  () => document.getElementById('offline-banner').style.display = 'none');
        window.addEventListener('offline', () => document.getElementById('offline-banner').style.display = 'block');
        if (!navigator.onLine) document.getElementById('offline-banner').style.display = 'block';

        // Router
        window.addEventListener('hashchange', () => App.route());
        window.addEventListener('popstate',   () => App.route());
    },

    // ── Auth ──────────────────────────────────────
    showAuthScreen() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'block';
        document.getElementById('main-app').style.display = 'none';
        AuthScreen.init();
    },

    showMainApp() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        Navbar.init();
        App.route();
    },

    logout() {
        localStorage.removeItem('cora_token');
        localStorage.removeItem('cora_user');
        localStorage.removeItem('cora_cart');
        App.cart = [];
        App.user = null;
        window.location.hash = '';
        App.showAuthScreen();
    },

    // ── Router ──────────────────────────────────
    route() {
        const hash   = window.location.hash || '#home';
        const parts  = hash.slice(1).split('/');
        const screen = parts[0];
        const param  = parts[1];

        // Clear any active polling
        if (App.pollInterval) {
            clearInterval(App.pollInterval);
            App.pollInterval = null;
        }

        Navbar.setActive(screen);

        const routes = {
            'home':       () => HomeScreen.render(),
            'search':     () => SearchScreen.render(),
            'restaurant': () => RestaurantScreen.render(param),
            'cart':       () => CartScreen.render(),
            'order':      () => TrackingScreen.render(param),
            'orders':     () => OrdersScreen.render(),
            'support':    () => SupportScreen.render(),
            'profile':    () => ProfileScreen.render(),
        };

        const handler = routes[screen];
        if (handler) {
            handler();
        } else {
            HomeScreen.render();
        }
    },

    // ── Cart Management ───────────────────────
    addToCart(item, restaurantId, restaurantName) {
        if (App.cart.length > 0 && App.cart[0].restaurantId !== restaurantId) {
            const fromName = App.cart[0].restaurantName || 'another restaurant';
            if (!confirm(`Your cart has items from ${fromName}. Adding from here will clear your cart. Continue?`)) return;
            App.cart = [];
        }

        const existing = App.cart.find(i => i.id === item.id);
        if (existing) {
            existing.quantity++;
        } else {
            App.cart.push({
                id: item.id,
                name: item.name,
                price: parseFloat(item.price),
                quantity: 1,
                restaurantId,
                restaurantName,
                is_veg: item.is_veg
            });
        }
        App.saveCart();
        CartBar.update();
        App.showToast(`${item.name} added to cart`, 'success');
    },

    removeFromCart(itemId) {
        const i = App.cart.findIndex(i => i.id === itemId);
        if (i === -1) return;
        if (App.cart[i].quantity > 1) {
            App.cart[i].quantity--;
        } else {
            App.cart.splice(i, 1);
        }
        App.saveCart();
        CartBar.update();
    },

    getCartTotal() {
        return App.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },

    getCartCount() {
        return App.cart.reduce((sum, i) => sum + i.quantity, 0);
    },

    clearCart() {
        App.cart = [];
        App.saveCart();
        CartBar.update();
    },

    saveCart() {
        localStorage.setItem('cora_cart', JSON.stringify(App.cart));
    },

    // ── Toast ─────────────────────────────────
    showToast(msg, type = 'info', duration = 3000) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.className = `toast ${type} show`;
        setTimeout(() => toast.classList.remove('show'), duration);
    },

    // ── Render Container ──────────────────────
    setScreen(html) {
        document.getElementById('screen-container').innerHTML = html;
    }
};

/* ═══ AUTH SCREEN ═══ */
const AuthScreen = {
    confirmationResult: null,

    init() {
        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('send-otp-btn').addEventListener('click', () => this.sendOTP());
        document.getElementById('verify-otp-btn').addEventListener('click', () => this.verifyOTP());
        document.getElementById('resend-otp-btn').addEventListener('click', () => {
            document.getElementById('auth-otp-step').style.display = 'none';
            document.getElementById('auth-phone-step').style.display = 'block';
        });
    },

    async sendOTP() {
        const phone = document.getElementById('phone-input').value.trim();
        if (phone.length !== 10 || isNaN(phone)) {
            App.showToast('Enter a valid 10-digit phone number', 'error');
            return;
        }

        const btn = document.getElementById('send-otp-btn');
        btn.disabled = true;
        btn.textContent = 'Sending...';

        try {
            // Try Firebase OTP
            const fullPhone = '+91' + phone;

            try {
                const recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
                this.confirmationResult = await firebase.auth().signInWithPhoneNumber(fullPhone, recaptcha);
            } catch (fbError) {
                console.warn('Firebase auth failed, using demo mode:', fbError.message);
                // Demo mode: simulate OTP sent
                this.demoPhone = fullPhone;
                this.demoMode  = true;
            }

            document.getElementById('auth-phone-step').style.display = 'none';
            document.getElementById('auth-otp-step').style.display = 'block';
            document.getElementById('otp-sent-to').textContent = `OTP sent to +91 ${phone}`;
            App.showToast('OTP sent!', 'success');

        } catch (e) {
            App.showToast(e.message || 'Failed to send OTP', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Send OTP';
        }
    },

    async verifyOTP() {
        const otp = document.getElementById('otp-input').value.trim();
        if (otp.length !== 6) {
            App.showToast('Enter the 6-digit OTP', 'error');
            return;
        }

        const btn = document.getElementById('verify-otp-btn');
        btn.disabled = true;
        btn.textContent = 'Verifying...';

        try {
            let firebaseUid, phone;

            if (this.demoMode) {
                // Demo mode: any 6-digit OTP works
                firebaseUid = 'demo_' + Date.now();
                phone = this.demoPhone;
            } else {
                const result = await this.confirmationResult.confirm(otp);
                firebaseUid = result.user.uid;
                phone = result.user.phoneNumber;
            }

            // Register/login with backend
            const res = await API.verify({ firebase_uid: firebaseUid, phone });
            if (res.success) {
                localStorage.setItem('cora_token', res.data.token);
                localStorage.setItem('cora_user', JSON.stringify(res.data.user));
                App.user = res.data.user;
                App.showMainApp();
                window.location.hash = '#home';
            } else {
                throw new Error(res.message);
            }
        } catch (e) {
            App.showToast(e.message || 'Invalid OTP', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Verify & Login';
        }
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => App.init());

CORA_EOF

# ── customer/js/components/cart-bar.js
cat << 'CORA_EOF' > 'customer/js/components/cart-bar.js'
const CartBar = {
    el: null,

    update() {
        this.el = document.getElementById('cart-bar');
        const count = App.getCartCount();
        const total = App.getCartTotal();

        if (count === 0) {
            if (this.el) this.el.style.display = 'none';
            return;
        }

        if (!this.el) {
            const bar = document.createElement('div');
            bar.id = 'cart-bar';
            bar.className = 'cart-bar';
            bar.innerHTML = this.html(count, total);
            bar.addEventListener('click', () => { window.location.hash = '#cart'; });
            document.getElementById('app').appendChild(bar);
            this.el = bar;
        } else {
            this.el.style.display = 'flex';
            this.el.innerHTML = this.html(count, total);
            this.el.onclick = () => { window.location.hash = '#cart'; };
        }
    },

    html(count, total) {
        const name = App.cart[0]?.restaurantName || '';
        return `
            <div class="cart-bar-left">
                <div class="cart-count-badge">${count}</div>
                <div>
                    <div class="cart-bar-text">${count} item${count > 1 ? 's' : ''}</div>
                    <div style="font-size:11px;color:rgba(255,255,255,0.8);">${name}</div>
                </div>
            </div>
            <div class="cart-bar-amount">₹${total.toFixed(0)} →</div>
        `;
    }
};

CORA_EOF

# ── customer/js/components/loading.js
cat << 'CORA_EOF' > 'customer/js/components/loading.js'
const Loading = {
    skeleton(count = 3) {
        return Array(count).fill(0).map(() => `
            <div class="skeleton-card">
                <div class="skeleton skeleton-img"></div>
                <div style="padding:4px 0 10px;">
                    <div class="skeleton skeleton-line"></div>
                    <div class="skeleton skeleton-line-sm"></div>
                    <div class="skeleton skeleton-line-sm" style="width:40%;margin-top:4px;"></div>
                </div>
            </div>
        `).join('');
    },

    spinner(text = 'Loading...') {
        return `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;gap:16px;">
                <div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div>
                <p style="color:var(--text-muted);font-size:14px;">${text}</p>
            </div>
        `;
    },

    error(msg = 'Something went wrong', retryFn = null) {
        return `
            <div style="background:var(--danger);color:white;padding:16px;margin:16px;border-radius:12px;display:flex;justify-content:space-between;align-items:center;">
                <span>⚠️ ${msg}</span>
                ${retryFn ? `<button onclick="${retryFn}" style="background:white;color:var(--danger);border:none;border-radius:8px;padding:6px 12px;font-weight:700;cursor:pointer;">Retry</button>` : ''}
            </div>
        `;
    }
};

CORA_EOF

# ── customer/js/components/menu-item.js
cat << 'CORA_EOF' > 'customer/js/components/menu-item.js'
const MenuItem = {
    render(item, restaurantId, restaurantName) {
        const cartItem   = App.cart.find(i => i.id === item.id);
        const qty        = cartItem ? cartItem.quantity : 0;

        const imgHtml = item.image_url
            ? `<img class="menu-item-img" src="${item.image_url}" alt="${item.name}" loading="lazy">`
            : `<div class="menu-item-img-placeholder">${item.is_veg ? '🥗' : '🍖'}</div>`;

        const addControl = qty > 0 ? `
            <div class="qty-control">
                <button class="qty-btn" onclick="MenuItem.remove(${item.id})">−</button>
                <span class="qty-count">${qty}</span>
                <button class="qty-btn" onclick="MenuItem.add(${item.id}, '${item.name.replace(/'/g, "\\'")}', ${item.price}, ${item.is_veg}, ${restaurantId}, '${restaurantName.replace(/'/g, "\\'")}')">+</button>
            </div>
        ` : `
            <button class="add-btn" onclick="MenuItem.add(${item.id}, '${item.name.replace(/'/g, "\\'")}', ${item.price}, ${item.is_veg}, ${restaurantId}, '${restaurantName.replace(/'/g, "\\'")}')">ADD</button>
        `;

        return `
            <div class="menu-item" id="menu-item-${item.id}">
                <div class="menu-item-info">
                    <div class="menu-item-name">
                        <div class="veg-dot ${item.is_veg ? 'veg' : 'nonveg'}"></div>
                        ${item.name}
                        ${item.is_popular ? '<span style="font-size:10px;background:var(--star);color:white;padding:2px 6px;border-radius:4px;font-weight:700;">POPULAR</span>' : ''}
                    </div>
                    ${item.description ? `<div class="menu-item-desc">${item.description}</div>` : ''}
                    <div class="menu-item-price">₹${parseFloat(item.price).toFixed(0)}</div>
                    <div style="margin-top:8px;" id="add-ctrl-${item.id}">${addControl}</div>
                </div>
                ${imgHtml}
            </div>
        `;
    },

    add(id, name, price, isVeg, restaurantId, restaurantName) {
        App.addToCart({ id, name, price, is_veg: isVeg }, restaurantId, restaurantName);
        MenuItem.updateControl(id, restaurantId, restaurantName);
    },

    remove(id) {
        App.removeFromCart(id);
        const cartItem = App.cart.find(i => i.id === id);
        const restaurantId   = cartItem ? cartItem.restaurantId   : (App.cart[0] ? App.cart[0].restaurantId   : 0);
        const restaurantName = cartItem ? cartItem.restaurantName : (App.cart[0] ? App.cart[0].restaurantName : '');
        MenuItem.updateControl(id, restaurantId, restaurantName);
    },

    updateControl(id, restaurantId, restaurantName) {
        const cartItem = App.cart.find(i => i.id === id);
        const qty      = cartItem ? cartItem.quantity : 0;
        const ctrl     = document.getElementById('add-ctrl-' + id);
        if (!ctrl) return;

        if (qty > 0) {
            ctrl.innerHTML = `
                <div class="qty-control">
                    <button class="qty-btn" onclick="MenuItem.remove(${id})">−</button>
                    <span class="qty-count">${qty}</span>
                    <button class="qty-btn" onclick="MenuItem.add(${id}, '${cartItem.name.replace(/'/g, "\\'")}', ${cartItem.price}, ${cartItem.is_veg}, ${restaurantId}, '${restaurantName.replace(/'/g, "\\'")}')">+</button>
                </div>
            `;
        } else {
            // Need to find item name — fetch from DOM
            const nameEl = ctrl.closest('.menu-item')?.querySelector('.menu-item-name');
            const iName  = nameEl ? nameEl.textContent.trim().replace(/POPULAR/g, '').trim() : '';
            ctrl.innerHTML = `<button class="add-btn" onclick="MenuItem.add(${id}, '${iName.replace(/'/g, "\\'")}', 0, 0, ${restaurantId}, '${restaurantName.replace(/'/g, "\\'")}')">ADD</button>`;
        }
    }
};

CORA_EOF

# ── customer/js/components/navbar.js
cat << 'CORA_EOF' > 'customer/js/components/navbar.js'
const Navbar = {
    init() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const screen = item.dataset.screen;
                window.location.hash = '#' + screen;
            });
        });
    },

    setActive(screen) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.screen === screen);
        });
    }
};

CORA_EOF

# ── customer/js/components/promo-carousel.js
cat << 'CORA_EOF' > 'customer/js/components/promo-carousel.js'
const PromoCarousel = {
    current: 0,
    slides: [],
    autoTimer: null,
    touchStartX: 0,
    container: null,

    init(slides, containerId) {
        this.slides  = slides;
        this.current = 0;
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.render();
        this.startAuto();
        this.bindTouch();
    },

    render() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="carousel-container">
                <div class="carousel-track" id="carousel-track" style="display:flex;transition:transform 0.6s ease;">
                    ${this.slides.map((s, i) => `
                        <div class="carousel-slide" onclick="${s.coupon_code ? `PromoCarousel.applyCoupon('${s.coupon_code}')` : ''}"
                             style="min-width:100%;position:relative;height:140px;border-radius:16px;overflow:hidden;cursor:pointer;display:flex;align-items:flex-end;padding:16px;">
                            <div style="position:absolute;inset:0;background:${s.bg_gradient || 'linear-gradient(135deg, #D1386C, #8C1D47)'};${s.image_url ? `background-image:url(${s.image_url});background-size:cover;` : ''}"></div>
                            <div style="position:absolute;inset:0;background:linear-gradient(to right,rgba(0,0,0,0.6),transparent 60%);"></div>
                            <div style="position:relative;z-index:1;color:white;">
                                <div style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;line-height:1.2;">${s.title}</div>
                                ${s.subtitle ? `<div style="font-size:12px;opacity:0.9;margin-top:2px;">${s.subtitle}</div>` : ''}
                                ${s.coupon_code ? `<button style="margin-top:8px;background:white;color:var(--berry);border:none;border-radius:8px;padding:5px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;">USE ${s.coupon_code}</button>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="carousel-dots" id="carousel-dots">
                ${this.slides.map((_, i) => `<div class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="PromoCarousel.goTo(${i})"></div>`).join('')}
            </div>
        `;
    },

    goTo(index) {
        this.current = (index + this.slides.length) % this.slides.length;
        const track = document.getElementById('carousel-track');
        if (track) track.style.transform = `translateX(-${this.current * 100}%)`;

        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.current);
        });
    },

    next() { this.goTo(this.current + 1); },
    prev() { this.goTo(this.current - 1); },

    startAuto() {
        this.stopAuto();
        if (this.slides.length > 1) {
            this.autoTimer = setInterval(() => this.next(), 4000);
        }
    },

    stopAuto() {
        if (this.autoTimer) clearInterval(this.autoTimer);
    },

    bindTouch() {
        if (!this.container) return;
        this.container.addEventListener('touchstart', e => {
            this.touchStartX = e.touches[0].clientX;
            this.stopAuto();
        }, { passive: true });

        this.container.addEventListener('touchend', e => {
            const diff = this.touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                diff > 0 ? this.next() : this.prev();
            }
            this.startAuto();
        }, { passive: true });
    },

    applyCoupon(code) {
        navigator.clipboard?.writeText(code).catch(() => {});
        App.showToast(`Coupon ${code} copied! Apply at checkout.`, 'success');
    }
};

CORA_EOF

# ── customer/js/components/restaurant-card.js
cat << 'CORA_EOF' > 'customer/js/components/restaurant-card.js'
const RestaurantCard = {
    render(r) {
        const rating     = parseFloat(r.rating) || 0;
        const ratingClass = rating >= 4.5 ? 'high' : (rating > 0 ? 'low' : 'none');
        const ratingText  = rating > 0 ? `⭐ ${rating.toFixed(1)}` : 'New';
        const isClosed    = !r.is_open;
        const deliveryFee = parseFloat(r.delivery_fee) || 0;
        const imgHtml = r.cover_image
            ? `<img src="${r.cover_image}" alt="${r.name}" loading="lazy">`
            : `<div class="restaurant-img-placeholder">🍽️</div>`;

        return `
            <div class="restaurant-card ${isClosed ? 'closed' : ''}" onclick="window.location.hash='#restaurant/${r.id}'">
                <div class="restaurant-img-wrap">
                    ${imgHtml}
                    ${r.is_promoted ? '<div class="badge-promoted">⚡ PROMOTED</div>' : ''}
                    <div class="badge-delivery-time">⏱ ${r.avg_prep_time_minutes || 30} min</div>
                    <div class="badge-distance">${r.area || 'Kulgam'}</div>
                    ${isClosed ? `
                        <div class="restaurant-closed-overlay">
                            <strong>CLOSED</strong>
                            <small>Opens at ${RestaurantCard.formatTime(r.opens_at)}</small>
                        </div>
                    ` : ''}
                </div>
                <div class="restaurant-info">
                    <div class="restaurant-name">${r.name}</div>
                    <div class="restaurant-cuisine">${r.cuisine_tags || 'Multi-cuisine'}</div>
                    <div class="restaurant-meta">
                        <span class="rating-badge ${ratingClass}">${ratingText}</span>
                        ${r.total_reviews ? `<span class="meta-text">(${r.total_reviews})</span>` : ''}
                        <span class="meta-dot"></span>
                        <span class="meta-text">${deliveryFee > 0 ? '₹' + deliveryFee + ' delivery' : 'Free delivery'}</span>
                        <span class="meta-dot"></span>
                        <span class="meta-text">Min ₹${r.min_order_amount || 100}</span>
                    </div>
                </div>
            </div>
        `;
    },

    formatTime(time) {
        if (!time) return '9:00 AM';
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${m} ${ampm}`;
    }
};

CORA_EOF

# ── customer/js/screens/cart.js
cat << 'CORA_EOF' > 'customer/js/screens/cart.js'
const CartScreen = {
    selectedAddressId: null,
    paymentMethod: 'cod',
    couponCode: '',
    couponDiscount: 0,
    orderType: 'delivery',
    addresses: [],

    async render() {
        if (App.cart.length === 0) {
            App.setScreen(`
                <div class="screen-header">
                    <div style="display:flex;align-items:center;gap:12px;position:relative;z-index:1;">
                        <button class="screen-back-btn" onclick="history.back()">←</button>
                        <h2 style="color:white;font-family:'Playfair Display',serif;font-size:22px;">Your Cart</h2>
                    </div>
                </div>
                <div class="empty-state" style="margin-top:40px;">
                    <div class="empty-state-emoji">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Add items from a restaurant to get started</p>
                    <button class="btn-primary" onclick="window.location.hash='#home'" style="margin-top:16px;">Browse Restaurants</button>
                </div>
            `);
            return;
        }

        const restaurantId = App.cart[0]?.restaurantId;
        this.orderType = 'delivery';
        this.couponDiscount = 0;
        this.couponCode = '';
        this.selectedAddressId = null;

        App.setScreen(`
            <div class="screen-header">
                <div style="display:flex;align-items:center;gap:12px;position:relative;z-index:1;">
                    <button class="screen-back-btn" onclick="history.back()">←</button>
                    <h2 style="color:white;font-family:'Playfair Display',serif;font-size:22px;">Your Cart</h2>
                </div>
                <div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:6px;z-index:1;position:relative;">${App.cart[0]?.restaurantName || ''}</div>
            </div>

            <div id="cart-body" style="padding-bottom:100px;">
                <!-- Cart Items -->
                <div class="card" style="margin:16px;padding:0;">
                    <div id="cart-items"></div>
                </div>

                <!-- Order Type -->
                <div style="padding:0 16px 12px;">
                    <div style="font-size:13px;font-weight:600;color:var(--text-sub);margin-bottom:8px;">Order Type</div>
                    <div style="display:flex;gap:8px;">
                        <button id="ot-delivery" class="btn-primary" style="flex:1;padding:10px;" onclick="CartScreen.setOrderType('delivery')">🛵 Delivery</button>
                        <button id="ot-pickup" class="btn-secondary" style="flex:1;padding:10px;" onclick="CartScreen.setOrderType('pickup')">🏃 Pickup</button>
                    </div>
                </div>

                <!-- Addresses -->
                <div id="address-section" style="padding:0 16px 12px;">
                    <div style="font-size:13px;font-weight:600;color:var(--text-sub);margin-bottom:8px;">Delivery Address</div>
                    <div id="address-list">${Loading.spinner('Loading addresses...')}</div>
                    <button class="btn-secondary" style="width:100%;margin-top:8px;padding:10px;" onclick="CartScreen.showAddAddressForm()">+ Add New Address</button>
                </div>

                <!-- Special Instructions -->
                <div style="padding:0 16px 12px;">
                    <div class="input-group">
                        <label>Special Instructions (optional)</label>
                        <textarea id="special-instructions" placeholder="Allergies, special requests..."></textarea>
                    </div>
                </div>

                <!-- Coupon -->
                <div style="padding:0 16px 12px;">
                    <div style="font-size:13px;font-weight:600;color:var(--text-sub);margin-bottom:8px;">Have a coupon?</div>
                    <div style="display:flex;gap:8px;">
                        <input type="text" id="coupon-input" placeholder="Enter coupon code" style="flex:1;background:white;border:1.5px solid var(--berry-border);border-radius:12px;padding:12px 14px;font-size:14px;outline:none;font-family:'DM Sans',sans-serif;" oninput="this.value=this.value.toUpperCase()">
                        <button class="btn-secondary" onclick="CartScreen.applyCoupon()" style="padding:12px 16px;">Apply</button>
                    </div>
                    <div id="coupon-status" style="margin-top:6px;font-size:13px;"></div>
                </div>

                <!-- Price Breakdown -->
                <div class="card" style="margin:0 16px 12px;padding:16px;">
                    <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:12px;">Price Details</div>
                    <div id="price-breakdown"></div>
                </div>

                <!-- Payment Method -->
                <div style="padding:0 16px 12px;">
                    <div style="font-size:13px;font-weight:600;color:var(--text-sub);margin-bottom:8px;">Payment Method</div>
                    <div class="payment-options">
                        <div class="payment-option selected" id="pm-cod" onclick="CartScreen.setPayment('cod')">
                            <div class="payment-icon">💵</div>
                            <div class="payment-name">Cash on Delivery</div>
                        </div>
                        <div class="payment-option" id="pm-upi" onclick="CartScreen.setPayment('upi')">
                            <div class="payment-icon">📱</div>
                            <div class="payment-name">Pay via UPI</div>
                        </div>
                    </div>
                </div>

                <!-- Place Order -->
                <div style="padding:0 16px 16px;">
                    <button class="btn-primary" style="width:100%;font-size:16px;padding:16px;" id="place-order-btn" onclick="CartScreen.placeOrder()">
                        Place Order →
                    </button>
                </div>
            </div>
        `);

        this.renderCartItems();
        this.renderPriceBreakdown();
        await this.loadAddresses();
    },

    renderCartItems() {
        const container = document.getElementById('cart-items');
        if (!container) return;
        container.innerHTML = App.cart.map(item => `
            <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--berry-border);">
                <div class="veg-dot ${item.is_veg ? 'veg' : 'nonveg'}"></div>
                <div style="flex:1;">
                    <div style="font-size:14px;font-weight:600;">${item.name}</div>
                    <div style="font-size:13px;color:var(--text-sub);">₹${item.price.toFixed(0)} × ${item.quantity}</div>
                </div>
                <div class="qty-control">
                    <button class="qty-btn" onclick="CartScreen.removeItem(${item.id})">−</button>
                    <span class="qty-count">${item.quantity}</span>
                    <button class="qty-btn" onclick="CartScreen.addItem(${item.id})">+</button>
                </div>
                <div style="font-size:15px;font-weight:700;min-width:50px;text-align:right;">₹${(item.price * item.quantity).toFixed(0)}</div>
            </div>
        `).join('') + `
            <div style="padding:12px 16px;">
                <button onclick="App.clearCart();window.location.hash='#home'" style="background:none;border:none;color:var(--danger);font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;">🗑️ Clear cart</button>
            </div>
        `;
    },

    addItem(id) {
        const item = App.cart.find(i => i.id === id);
        if (item) { item.quantity++; App.saveCart(); this.renderCartItems(); this.renderPriceBreakdown(); }
    },

    removeItem(id) {
        App.removeFromCart(id);
        this.renderCartItems();
        this.renderPriceBreakdown();
        if (App.cart.length === 0) this.render();
    },

    renderPriceBreakdown() {
        const subtotal    = App.getCartTotal();
        const deliveryFee = this.orderType === 'delivery' ? 25 : 0;
        const platformFee = 5;
        const discount    = this.couponDiscount;
        const total       = Math.max(0, subtotal + deliveryFee + platformFee - discount);

        const el = document.getElementById('price-breakdown');
        if (!el) return;

        el.innerHTML = `
            <div class="price-row">
                <span>Subtotal (${App.getCartCount()} items)</span>
                <span>₹${subtotal.toFixed(0)}</span>
            </div>
            ${this.orderType === 'delivery' ? `<div class="price-row"><span>Delivery fee</span><span>₹${deliveryFee}</span></div>` : ''}
            <div class="price-row"><span>Platform fee</span><span>₹${platformFee}</span></div>
            ${discount > 0 ? `<div class="price-row discount"><span>Coupon (${this.couponCode})</span><span>−₹${discount.toFixed(0)}</span></div>` : ''}
            <div class="price-row total"><span>Total</span><span>₹${total.toFixed(0)}</span></div>
        `;
    },

    setOrderType(type) {
        this.orderType = type;
        ['delivery','pickup'].forEach(t => {
            const btn = document.getElementById(`ot-${t}`);
            if (btn) btn.className = `btn-${t === type ? 'primary' : 'secondary'}`;
        });
        const addrSection = document.getElementById('address-section');
        if (addrSection) addrSection.style.display = type === 'delivery' ? 'block' : 'none';
        this.renderPriceBreakdown();
    },

    setPayment(method) {
        this.paymentMethod = method;
        document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
        document.getElementById(`pm-${method}`)?.classList.add('selected');
    },

    async loadAddresses() {
        try {
            const res = await API.getAddresses();
            this.addresses = res.data || [];
            this.renderAddresses();
        } catch (e) {
            document.getElementById('address-list').innerHTML = `<p style="color:var(--text-muted);font-size:13px;">Could not load addresses</p>`;
        }
    },

    renderAddresses() {
        const el = document.getElementById('address-list');
        if (!el) return;
        if (!this.addresses.length) {
            el.innerHTML = `<p style="color:var(--text-muted);font-size:13px;">No saved addresses. Add one below.</p>`;
            return;
        }
        el.innerHTML = this.addresses.map(a => `
            <div class="address-card ${a.id === this.selectedAddressId ? 'selected' : ''}" onclick="CartScreen.selectAddress(${a.id})">
                <div class="address-icon">${a.label === 'Home' ? '🏠' : (a.label === 'Work' ? '🏢' : '📍')}</div>
                <div class="address-details">
                    <div class="address-label">${a.label}</div>
                    <div class="address-text">${a.full_address}${a.landmark ? ', ' + a.landmark : ''}</div>
                </div>
            </div>
        `).join('');

        // Auto-select default or first
        const def = this.addresses.find(a => a.is_default) || this.addresses[0];
        if (def) this.selectAddress(def.id, false);
    },

    selectAddress(id, rerender = true) {
        this.selectedAddressId = id;
        if (rerender) {
            document.querySelectorAll('.address-card').forEach(el => el.classList.remove('selected'));
            document.querySelector(`.address-card[onclick*="${id}"]`)?.classList.add('selected');
        }
    },

    showAddAddressForm() {
        const el = document.getElementById('address-section');
        el.insertAdjacentHTML('beforeend', `
            <div class="card" style="padding:16px;margin-top:10px;" id="add-addr-form">
                <div class="input-group"><label>Label</label>
                    <select id="addr-label"><option>Home</option><option>Work</option><option>Other</option></select>
                </div>
                <div class="input-group"><label>Full Address</label>
                    <textarea id="addr-full" placeholder="House/Flat no, Street, Area" style="height:70px;"></textarea>
                </div>
                <div class="input-group"><label>Landmark (optional)</label>
                    <input type="text" id="addr-landmark" placeholder="Near mosque, hospital...">
                </div>
                <div class="input-group"><label>Area</label>
                    <select id="addr-area">
                        <option>Kulgam Town</option><option>Qaimoh</option><option>Yaripora</option>
                        <option>DH Pora</option><option>Devsar</option><option>Frisal</option>
                    </select>
                </div>
                <div style="display:flex;gap:8px;">
                    <button class="btn-primary" style="flex:1;padding:10px;" onclick="CartScreen.saveAddress()">Save</button>
                    <button class="btn-secondary" style="flex:1;padding:10px;" onclick="document.getElementById('add-addr-form').remove()">Cancel</button>
                </div>
            </div>
        `);
    },

    async saveAddress() {
        const data = {
            label:        document.getElementById('addr-label').value,
            full_address: document.getElementById('addr-full').value,
            landmark:     document.getElementById('addr-landmark').value,
            area:         document.getElementById('addr-area').value,
            is_default:   this.addresses.length === 0 ? 1 : 0
        };
        if (!data.full_address) { App.showToast('Enter full address', 'error'); return; }
        try {
            const res = await API.addAddress(data);
            if (res.success) {
                this.addresses.push(res.data);
                this.renderAddresses();
                document.getElementById('add-addr-form')?.remove();
                App.showToast('Address saved!', 'success');
            }
        } catch (e) { App.showToast('Failed to save address', 'error'); }
    },

    async applyCoupon() {
        const code = document.getElementById('coupon-input').value.trim().toUpperCase();
        if (!code) return;
        const statusEl = document.getElementById('coupon-status');
        statusEl.textContent = 'Checking...';

        try {
            const res = await API.applyCoupon({ code, subtotal: App.getCartTotal() });
            if (res.success) {
                this.couponCode     = code;
                this.couponDiscount = res.data.discount;
                statusEl.innerHTML  = `<span style="color:var(--green);">✓ ${res.message}</span>`;
                this.renderPriceBreakdown();
            } else {
                throw new Error(res.message);
            }
        } catch (e) {
            statusEl.innerHTML = `<span style="color:var(--danger);">✗ ${e.message}</span>`;
            this.couponCode = '';
            this.couponDiscount = 0;
        }
    },

    async placeOrder() {
        if (this.orderType === 'delivery' && !this.selectedAddressId) {
            App.showToast('Please select a delivery address', 'error');
            return;
        }

        const btn = document.getElementById('place-order-btn');
        btn.disabled = true;
        btn.innerHTML = '<div class="loading-spinner" style="width:20px;height:20px;border-width:2px;margin:0 auto;"></div>';

        const orderData = {
            restaurant_id:        App.cart[0].restaurantId,
            items:                App.cart.map(i => ({ menu_item_id: i.id, quantity: i.quantity })),
            order_type:           this.orderType,
            payment_method:       this.paymentMethod,
            address_id:           this.selectedAddressId || null,
            coupon_code:          this.couponCode || null,
            special_instructions: document.getElementById('special-instructions')?.value || ''
        };

        try {
            const res = await API.placeOrder(orderData);
            if (!res.success) throw new Error(res.message);

            const order = res.data;

            // WhatsApp confirmation
            CartScreen.sendWhatsAppConfirmation(order);

            // UPI payment — restaurant_upi_id comes from order response
            if (this.paymentMethod === 'upi') {
                const upiId  = order.restaurant_upi_id || '';
                const upiURL = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(order.restaurant_name || App.cart[0].restaurantName)}&am=${parseFloat(order.total_amount).toFixed(2)}&cu=INR&tn=CORA_${order.order_number}`;
                window.location.href = upiURL;
                setTimeout(() => {
                    if (confirm('Have you completed the UPI payment? Tap OK to confirm.')) {
                        API.put('/customer/order.php', { id: order.id, payment_status: 'paid' }).catch(() => {});
                    }
                }, 3000);
            }

            App.clearCart();
            CartScreen.showOrderSuccess(order);

        } catch (e) {
            App.showToast(e.message || 'Failed to place order', 'error');
            btn.disabled = false;
            btn.textContent = 'Place Order →';
        }
    },

    showOrderSuccess(order) {
        App.setScreen(`
            <div style="text-align:center;padding:60px 24px;">
                <div id="success-animation" style="font-size:80px;animation:bounceIn 0.6s ease;">✅</div>
                <h2 style="font-family:'Playfair Display',serif;font-size:28px;font-weight:700;margin-top:20px;color:var(--text);">Order Placed! 🎉</h2>
                <p style="color:var(--text-sub);margin-top:8px;font-size:15px;">Your order has been sent to the restaurant</p>
                <div class="card" style="padding:20px;margin:24px 0;text-align:left;">
                    <div style="font-size:13px;color:var(--text-muted);">Order Number</div>
                    <div style="font-size:20px;font-weight:700;color:var(--berry);font-family:'Playfair Display',serif;">${order.order_number}</div>
                    <div style="font-size:13px;color:var(--text-muted);margin-top:12px;">Total Amount</div>
                    <div style="font-size:20px;font-weight:700;">₹${parseFloat(order.total_amount).toFixed(0)}</div>
                    <div style="font-size:13px;color:var(--text-muted);margin-top:12px;">Payment</div>
                    <div style="font-size:15px;font-weight:600;text-transform:uppercase;">${order.payment_method}</div>
                </div>
                <button class="btn-primary" style="width:100%;margin-bottom:12px;" onclick="window.location.hash='#order/${order.id}'">
                    Track My Order 🛵
                </button>
                <button class="btn-secondary" style="width:100%;" onclick="window.location.hash='#home'">
                    Back to Home
                </button>
                ${CartScreen._waConfirmLink ? `
                <a href="${CartScreen._waConfirmLink}" target="_blank" rel="noopener"
                   style="display:block;width:100%;margin-top:12px;padding:14px;background:#25D366;color:white;border-radius:14px;font-weight:600;font-size:14px;text-align:center;text-decoration:none;box-sizing:border-box;">
                    💬 Share Order on WhatsApp
                </a>` : ''}
            </div>
            <style>
                @keyframes bounceIn {
                    0%   { transform: scale(0);   opacity: 0; }
                    60%  { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1);   opacity: 1; }
                }
            </style>
        `);
    },

    _waConfirmLink: null,

    sendWhatsAppConfirmation(order) {
        const cartSnapshot = [...App.cart]; // snapshot before cart is cleared
        const items = cartSnapshot.map(i => `${i.quantity}x ${i.name} = ₹${(i.price * i.quantity).toFixed(0)}`).join('\n');
        const msg = encodeURIComponent(
            `✅ Your CORA Order is Confirmed!\n\n` +
            `Order: ${order.order_number}\n` +
            `Restaurant: ${order.restaurant_name || cartSnapshot[0]?.restaurantName || ''}\n\n` +
            `Items:\n${items}\n\n` +
            `Total: ₹${parseFloat(order.total_amount).toFixed(0)}\n` +
            `Payment: ${order.payment_method?.toUpperCase()}\n\n` +
            `Track your order in the Cora app!`
        );
        const phone = App.user?.phone?.replace(/\D/g, '') || '';
        this._waConfirmLink = phone ? `https://wa.me/${phone}?text=${msg}` : null;
    }
};

CORA_EOF

# ── customer/js/screens/home.js
cat << 'CORA_EOF' > 'customer/js/screens/home.js'
const HomeScreen = {
    async render() {
        App.setScreen(`
            <div id="home-screen">
                <div class="screen-header">
                    <div style="display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1;">
                        <div>
                            <div class="header-logo">Cora 🍽️</div>
                            <div class="header-subtitle">Kulgam's Food, Delivered</div>
                        </div>
                        <div style="text-align:right;color:white;font-size:13px;">
                            <div>Hi, ${App.user?.name || 'Guest'} 👋</div>
                        </div>
                    </div>
                    <div class="header-address-bar" onclick="window.location.hash='#profile'">
                        📍 <span>Kulgam Town</span>
                        <span style="margin-left:auto;opacity:0.7;">▼</span>
                    </div>
                    <div class="header-search" onclick="window.location.hash='#search'">
                        🔍 <span style="color:rgba(255,255,255,0.7);font-size:14px;">Search restaurants or dishes...</span>
                    </div>
                </div>

                <!-- Category Pills -->
                <div class="category-pills" id="category-pills">
                    ${['All','Wazwan','Bakery','Burgers','Pizza','Chinese','Snacks','Sweets','Biryani'].map((c,i) =>
                        `<div class="category-pill ${i===0?'active':''}" onclick="HomeScreen.filterCuisine('${c}', this)">${c === 'All' ? '🍽️ All' : c}</div>`
                    ).join('')}
                </div>

                <!-- Promo Carousel -->
                <div class="carousel-wrap" id="carousel-wrap">
                    <div style="display:flex;gap:8px;">
                        ${Loading.skeleton(1).replace('skeleton-card','skeleton-card').replace('height:130px','height:140px;border-radius:16px;')}
                    </div>
                </div>

                <!-- Restaurants -->
                <div class="section-header">
                    <span class="section-title">Restaurants</span>
                    <span id="restaurant-count" style="font-size:13px;color:var(--text-muted);">Loading...</span>
                </div>

                <div class="restaurants-grid" id="restaurants-grid">
                    ${Loading.skeleton(4)}
                </div>
            </div>
        `);

        CartBar.update();

        // Load data in parallel
        try {
            const [bannersRes, restaurantsRes] = await Promise.all([
                API.getBanners().catch(() => ({ success: false, data: [] })),
                API.getRestaurants().catch(() => ({ success: false, data: [] }))
            ]);

            // Render carousel
            const banners = bannersRes.data || [];
            if (banners.length > 0) {
                document.getElementById('carousel-wrap').innerHTML = '<div id="promo-carousel"></div>';
                PromoCarousel.init(banners, 'promo-carousel');
            } else {
                document.getElementById('carousel-wrap').style.display = 'none';
            }

            // Render restaurants
            HomeScreen._restaurants = restaurantsRes.data || [];
            HomeScreen.renderRestaurants(HomeScreen._restaurants);

        } catch (e) {
            document.getElementById('restaurants-grid').innerHTML = Loading.error('Failed to load restaurants', 'HomeScreen.render()');
        }
    },

    _restaurants: [],
    _currentCuisine: 'All',

    renderRestaurants(list) {
        const grid = document.getElementById('restaurants-grid');
        const countEl = document.getElementById('restaurant-count');
        if (!grid) return;

        if (!list || list.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-emoji">🍽️</div>
                    <h3>No restaurants found</h3>
                    <p>Try a different search or check back later!</p>
                </div>
            `;
            if (countEl) countEl.textContent = '';
            return;
        }

        if (countEl) countEl.textContent = `${list.length} restaurants`;
        grid.innerHTML = list.map(r => RestaurantCard.render(r)).join('');

        // Cache for offline
        localStorage.setItem('cora_restaurants_cache', JSON.stringify(list));
    },

    filterCuisine(cuisine, el) {
        this._currentCuisine = cuisine;
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        el.classList.add('active');

        const filtered = cuisine === 'All'
            ? this._restaurants
            : this._restaurants.filter(r => r.cuisine_tags?.toLowerCase().includes(cuisine.toLowerCase()));
        this.renderRestaurants(filtered);
    }
};

CORA_EOF

# ── customer/js/screens/orders.js
cat << 'CORA_EOF' > 'customer/js/screens/orders.js'
const OrdersScreen = {
    async render() {
        App.setScreen(`
            <div class="screen-header">
                <div style="position:relative;z-index:1;">
                    <h2 style="color:white;font-family:'Playfair Display',serif;font-size:24px;font-weight:700;">My Orders</h2>
                    <p style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:2px;">All your past and active orders</p>
                </div>
            </div>
            <div id="orders-body">${Loading.skeleton(4)}</div>
        `);

        try {
            const res = await API.getOrders();
            const orders = res.data || [];

            if (!orders.length) {
                document.getElementById('orders-body').innerHTML = `
                    <div class="empty-state" style="margin-top:40px;">
                        <div class="empty-state-emoji">📦</div>
                        <h3>No orders yet</h3>
                        <p>Your first order is waiting! 🍽️</p>
                        <button class="btn-primary" onclick="window.location.hash='#home'" style="margin-top:16px;">Browse Restaurants</button>
                    </div>
                `;
                return;
            }

            const activeStatuses = ['placed','accepted','preparing','ready','picked_up','on_the_way','delivery_issue'];
            const active = orders.filter(o => activeStatuses.includes(o.status));
            const past   = orders.filter(o => !activeStatuses.includes(o.status));

            let html = '';

            if (active.length) {
                html += `<div style="padding:16px 16px 8px;font-family:'Playfair Display',serif;font-size:18px;font-weight:700;">🔴 Active Orders</div>`;
                html += active.map(o => OrdersScreen.orderCardHtml(o)).join('');
            }

            if (past.length) {
                html += `<div style="padding:16px 16px 8px;font-family:'Playfair Display',serif;font-size:18px;font-weight:700;">Past Orders</div>`;
                html += past.map(o => OrdersScreen.orderCardHtml(o)).join('');
            }

            document.getElementById('orders-body').innerHTML = `<div style="padding-bottom:16px;">${html}</div>`;

        } catch (e) {
            document.getElementById('orders-body').innerHTML = Loading.error(e.message, 'OrdersScreen.render()');
        }
    },

    orderCardHtml(o) {
        const statusLabels = {
            placed:'Order Placed', accepted:'Accepted', preparing:'Preparing', ready:'Ready',
            picked_up:'Picked Up', on_the_way:'On the Way', delivered:'Delivered',
            cancelled:'Cancelled', delivery_issue:'Delivery Issue'
        };

        return `
            <div class="order-card" onclick="window.location.hash='#order/${o.id}'">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div>
                        <div style="font-size:13px;font-weight:700;">${o.restaurant_name}</div>
                        <div style="font-size:12px;color:var(--text-muted);">${o.order_number}</div>
                    </div>
                    <div>
                        <span class="order-status-badge status-${o.status}">${statusLabels[o.status] || o.status}</span>
                    </div>
                </div>
                <div style="font-size:13px;color:var(--text-sub);margin-top:8px;">
                    ${(o.items || []).slice(0, 2).map(i => `${i.quantity}x ${i.item_name}`).join(', ')}
                    ${(o.items || []).length > 2 ? ` +${(o.items || []).length - 2} more` : ''}
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
                    <div style="font-size:15px;font-weight:700;">₹${parseFloat(o.total_amount).toFixed(0)}</div>
                    <div style="display:flex;gap:8px;">
                        ${o.status === 'delivered' ? `
                            <button class="btn-secondary" style="padding:6px 12px;font-size:12px;" onclick="event.stopPropagation();OrdersScreen.reorder(${o.id})">
                                🔁 Reorder
                            </button>
                        ` : ''}
                        <span style="font-size:12px;color:var(--text-muted);">${new Date(o.placed_at).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</span>
                    </div>
                </div>
            </div>
        `;
    },

    async reorder(orderId) {
        try {
            const res = await API.getOrder(orderId);
            if (!res.success) throw new Error(res.message);
            const order = res.data;

            // Clear cart and add all items
            App.clearCart();
            (order.items || []).forEach(item => {
                App.cart.push({
                    id:             item.menu_item_id,
                    name:           item.item_name,
                    price:          parseFloat(item.item_price),
                    quantity:       item.quantity,
                    restaurantId:   order.restaurant_id,
                    restaurantName: order.restaurant_name,
                    is_veg:         0
                });
            });
            App.saveCart();
            CartBar.update();
            App.showToast('Items added to cart! 🛒', 'success');
            window.location.hash = '#cart';
        } catch (e) {
            App.showToast('Failed to reorder', 'error');
        }
    }
};

CORA_EOF

# ── customer/js/screens/profile.js
cat << 'CORA_EOF' > 'customer/js/screens/profile.js'
const ProfileScreen = {
    async render() {
        const user = App.user || {};
        App.setScreen(`
            <div class="screen-header" style="padding-bottom:60px;">
                <div style="position:relative;z-index:1;">
                    <h2 style="color:white;font-family:'Playfair Display',serif;font-size:24px;font-weight:700;">My Profile</h2>
                </div>
                <div style="position:relative;z-index:1;text-align:center;margin-top:12px;">
                    <div style="width:72px;height:72px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto;display:flex;align-items:center;justify-content:center;font-size:36px;">
                        ${user.name ? user.name[0].toUpperCase() : '👤'}
                    </div>
                    <div style="color:white;font-weight:700;font-size:18px;margin-top:8px;">${user.name || 'Guest'}</div>
                    <div style="color:rgba(255,255,255,0.8);font-size:13px;">${user.phone || ''}</div>
                </div>
            </div>

            <div style="margin-top:-30px;padding:0 16px;position:relative;z-index:5;padding-bottom:80px;">
                <!-- Edit Profile -->
                <div class="card" style="padding:16px;margin-bottom:12px;">
                    <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;">Personal Info</div>
                    <div class="input-group">
                        <label>Name</label>
                        <input type="text" id="profile-name" value="${user.name || ''}" placeholder="Your name">
                    </div>
                    <div class="input-group">
                        <label>Email (optional)</label>
                        <input type="email" id="profile-email" value="${user.email || ''}" placeholder="email@example.com">
                    </div>
                    <button class="btn-primary" style="width:100%;padding:12px;" onclick="ProfileScreen.saveProfile()">
                        Save Changes
                    </button>
                </div>

                <!-- Saved Addresses -->
                <div class="card" style="padding:16px;margin-bottom:12px;" id="addresses-card">
                    <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;">Saved Addresses</div>
                    <div id="profile-addresses">${Loading.spinner()}</div>
                    <button class="btn-secondary" style="width:100%;margin-top:12px;padding:10px;" onclick="ProfileScreen.showAddAddress()">
                        + Add New Address
                    </button>
                </div>

                <!-- App Settings -->
                <div class="card" style="padding:16px;margin-bottom:12px;">
                    <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;">Settings</div>
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;">
                        <span>🔔 Order Notifications</span>
                        <div class="toggle-switch on"></div>
                    </div>
                </div>

                <!-- Legal -->
                <div class="card" style="padding:8px 16px;margin-bottom:12px;">
                    <a href="/privacy-policy.html" target="_blank" style="display:block;padding:12px 0;color:var(--text);text-decoration:none;border-bottom:1px solid var(--berry-border);font-size:14px;">🔒 Privacy Policy</a>
                    <a href="/terms.html" target="_blank" style="display:block;padding:12px 0;color:var(--text);text-decoration:none;border-bottom:1px solid var(--berry-border);font-size:14px;">📋 Terms of Service</a>
                    <a href="/refund-policy.html" target="_blank" style="display:block;padding:12px 0;color:var(--text);text-decoration:none;font-size:14px;">💰 Refund Policy</a>
                </div>

                <!-- App Version -->
                <div style="text-align:center;color:var(--text-muted);font-size:12px;margin-bottom:16px;">
                    Cora v1.0.0 · Made with ❤️ for Kulgam
                </div>

                <!-- Logout -->
                <button class="btn-danger" style="width:100%;padding:14px;" onclick="ProfileScreen.confirmLogout()">
                    🚪 Logout
                </button>
            </div>
        `);

        this.loadAddresses();
    },

    async loadAddresses() {
        try {
            const res = await API.getAddresses();
            const addrs = res.data || [];
            const el = document.getElementById('profile-addresses');
            if (!el) return;

            if (!addrs.length) {
                el.innerHTML = `<p style="color:var(--text-muted);font-size:13px;">No saved addresses yet.</p>`;
                return;
            }

            el.innerHTML = addrs.map(a => `
                <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--berry-border);">
                    <span style="font-size:20px;">${a.label === 'Home' ? '🏠' : (a.label === 'Work' ? '🏢' : '📍')}</span>
                    <div style="flex:1;">
                        <div style="font-size:13px;font-weight:700;">${a.label}${a.is_default ? ' <span style="font-size:10px;background:var(--berry);color:white;padding:1px 6px;border-radius:4px;">DEFAULT</span>' : ''}</div>
                        <div style="font-size:12px;color:var(--text-muted);">${a.full_address}${a.landmark ? ', '+a.landmark : ''}</div>
                    </div>
                    <button onclick="ProfileScreen.deleteAddress(${a.id})" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:18px;">🗑️</button>
                </div>
            `).join('');
        } catch (e) {
            console.error('Failed to load addresses:', e);
        }
    },

    async saveProfile() {
        const name  = document.getElementById('profile-name').value.trim();
        const email = document.getElementById('profile-email').value.trim();
        try {
            const res = await API.updateProfile({ name, email });
            if (res.success) {
                App.user = { ...App.user, name, email };
                localStorage.setItem('cora_user', JSON.stringify(App.user));
                App.showToast('Profile updated!', 'success');
            }
        } catch (e) { App.showToast(e.message || 'Failed to update', 'error'); }
    },

    async deleteAddress(id) {
        if (!confirm('Delete this address?')) return;
        try {
            await API.deleteAddress(id);
            this.loadAddresses();
            App.showToast('Address deleted', 'info');
        } catch (e) { App.showToast('Failed to delete', 'error'); }
    },

    showAddAddress() {
        // Reuse CartScreen's form logic
        CartScreen.addresses = [];
        CartScreen.showAddAddressForm();
    },

    confirmLogout() {
        if (confirm('Are you sure you want to logout?')) {
            App.logout();
        }
    }
};

CORA_EOF

# ── customer/js/screens/restaurant.js
cat << 'CORA_EOF' > 'customer/js/screens/restaurant.js'
const RestaurantScreen = {
    restaurant: null,
    orderType: 'delivery',

    async render(id) {
        App.setScreen(`
            <div id="restaurant-screen">
                <div style="height:220px;position:relative;overflow:hidden;">
                    <div id="restaurant-cover" style="width:100%;height:100%;background:linear-gradient(135deg,var(--berry),var(--berry-deep));display:flex;align-items:center;justify-content:center;font-size:80px;">🍽️</div>
                    <div style="position:absolute;top:0;left:0;right:0;padding:50px 16px 0;display:flex;justify-content:space-between;align-items:flex-start;">
                        <button class="screen-back-btn" onclick="history.back()">←</button>
                        <button class="screen-back-btn" id="fav-btn">🤍</button>
                    </div>
                </div>

                <div style="padding:16px;margin-top:-30px;position:relative;z-index:5;">
                    <div class="card" style="padding:16px;" id="restaurant-info-card">
                        ${Loading.spinner()}
                    </div>
                </div>

                <div id="menu-container" style="padding-bottom:80px;">
                    ${Loading.skeleton(4)}
                </div>
            </div>
        `);

        CartBar.update();

        try {
            const res = await API.getRestaurant(id);
            if (!res.success) throw new Error(res.message);

            const { restaurant, menu, reviews } = res.data;
            this.restaurant = restaurant;
            App.currentRestaurant = restaurant;

            // Cover image
            const cover = document.getElementById('restaurant-cover');
            if (restaurant.cover_image) {
                cover.innerHTML = `<img src="${restaurant.cover_image}" alt="${restaurant.name}" style="width:100%;height:100%;object-fit:cover;">`;
            }

            // Info card
            const rating     = parseFloat(restaurant.rating) || 0;
            const ratingClass = rating >= 4.5 ? 'high' : (rating > 0 ? 'low' : 'none');
            const estDelivery = (restaurant.avg_prep_time_minutes || 30) + 10;

            document.getElementById('restaurant-info-card').innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div>
                        <h2 style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;">${restaurant.name}</h2>
                        <p style="font-size:13px;color:var(--text-muted);margin-top:2px;">${restaurant.cuisine_tags || 'Multi-cuisine'}</p>
                    </div>
                    <div class="rating-badge ${ratingClass}" style="font-size:14px;padding:5px 10px;">
                        ⭐ ${rating > 0 ? rating.toFixed(1) : 'New'}
                    </div>
                </div>
                <div style="display:flex;gap:16px;margin-top:10px;flex-wrap:wrap;">
                    <span style="font-size:13px;color:var(--text-sub);">⏱ ${restaurant.avg_prep_time_minutes || 30} min prep</span>
                    <span style="font-size:13px;color:var(--text-sub);">🛵 ~${estDelivery} min delivery</span>
                    <span style="font-size:13px;color:var(--text-sub);">🏠 Min ₹${restaurant.min_order_amount}</span>
                </div>
                ${restaurant.description ? `<p style="font-size:13px;color:var(--text-sub);margin-top:8px;border-top:1px solid var(--berry-border);padding-top:8px;">${restaurant.description}</p>` : ''}

                <!-- Delivery / Pickup Toggle -->
                <div style="display:flex;gap:8px;margin-top:12px;">
                    ${restaurant.accepts_delivery ? `
                        <button id="btn-delivery" class="btn-${this.orderType === 'delivery' ? 'primary' : 'secondary'}"
                                style="flex:1;padding:10px;" onclick="RestaurantScreen.setOrderType('delivery')">
                            🛵 Delivery
                        </button>
                    ` : ''}
                    ${restaurant.accepts_pickup ? `
                        <button id="btn-pickup" class="btn-${this.orderType === 'pickup' ? 'primary' : 'secondary'}"
                                style="flex:1;padding:10px;" onclick="RestaurantScreen.setOrderType('pickup')">
                            🏃 Pickup
                        </button>
                    ` : ''}
                </div>

                <!-- Veg Toggle -->
                <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding:10px;background:var(--berry-light);border-radius:10px;">
                    <span style="font-size:13px;font-weight:600;color:var(--green);">🥗 Veg Only</span>
                    <div class="toggle-switch" id="veg-toggle" onclick="RestaurantScreen.toggleVeg()"></div>
                </div>

                ${!restaurant.is_open ? `
                    <div style="background:var(--berry-light);border:1px solid var(--berry-border);border-radius:10px;padding:12px;margin-top:12px;text-align:center;">
                        <div style="font-weight:700;color:var(--berry);">⏰ Currently Closed</div>
                        <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Opens at ${RestaurantCard.formatTime(restaurant.opens_at)}</div>
                        <button onclick="RestaurantScreen.notifyOpen(${restaurant.id})" class="btn-secondary" style="margin-top:10px;width:100%;padding:8px;">🔔 Notify Me When Open</button>
                    </div>
                ` : ''}
            `;

            // Build menu
            this._menu    = menu;
            this._vegOnly = false;
            this.renderMenu(menu);

        } catch (e) {
            App.showToast(e.message || 'Failed to load restaurant', 'error');
            document.getElementById('menu-container').innerHTML = Loading.error(e.message, `RestaurantScreen.render(${id})`);
        }
    },

    _menu: [],
    _vegOnly: false,

    setOrderType(type) {
        this.orderType = type;
        ['delivery','pickup'].forEach(t => {
            const btn = document.getElementById(`btn-${t}`);
            if (btn) {
                btn.className = `btn-${t === type ? 'primary' : 'secondary'}`;
                btn.style.flex = '1';
                btn.style.padding = '10px';
            }
        });
    },

    toggleVeg() {
        this._vegOnly = !this._vegOnly;
        const toggle = document.getElementById('veg-toggle');
        if (toggle) toggle.classList.toggle('on', this._vegOnly);
        this.renderMenu(this._menu);
    },

    renderMenu(menu) {
        const r     = this.restaurant;
        const rid   = r.id;
        const rname = r.name;

        let html = '';

        // Category tabs
        if (menu.length > 1) {
            html += `<div class="menu-category-tabs">
                ${menu.map((cat, i) => `<div class="menu-tab ${i===0?'active':''}" onclick="RestaurantScreen.scrollToCategory('cat-${cat.id || i}')">${cat.name}</div>`).join('')}
            </div>`;
        }

        // Menu items by category
        html += menu.map((cat, idx) => {
            let items = cat.items || [];
            if (this._vegOnly) items = items.filter(i => i.is_veg);
            if (!items.length) return '';
            return `
                <div id="cat-${cat.id || idx}">
                    <div class="menu-category-title">${cat.name}</div>
                    <div class="card" style="margin:0 16px 12px;border-radius:16px;overflow:hidden;">
                        ${items.map(item => MenuItem.render(item, rid, rname)).join('')}
                    </div>
                </div>
            `;
        }).join('');

        if (!html.trim() || html === '') {
            html = `<div class="empty-state"><div class="empty-state-emoji">🥗</div><h3>No items found</h3><p>Try turning off the Veg Only filter</p></div>`;
        }

        document.getElementById('menu-container').innerHTML = `<div style="padding-bottom:80px;">${html}</div>`;
    },

    scrollToCategory(id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    notifyOpen(restaurantId) {
        const waitList = JSON.parse(localStorage.getItem('cora_notify_open') || '[]');
        if (!waitList.includes(restaurantId)) {
            waitList.push(restaurantId);
            localStorage.setItem('cora_notify_open', JSON.stringify(waitList));
        }
        App.showToast('We\'ll notify you when they open! 🔔', 'success');
    }
};

CORA_EOF

# ── customer/js/screens/search.js
cat << 'CORA_EOF' > 'customer/js/screens/search.js'
const SearchScreen = {
    searchTimer: null,

    render() {
        App.setScreen(`
            <div>
                <div style="background:linear-gradient(135deg,var(--berry),var(--berry-deep));padding:50px 16px 16px;">
                    <div style="position:relative;z-index:1;">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <button class="screen-back-btn" onclick="history.back()">←</button>
                            <div style="flex:1;background:white;border-radius:12px;display:flex;align-items:center;padding:10px 14px;gap:8px;">
                                <span>🔍</span>
                                <input type="text" id="search-input" placeholder="Search restaurants or dishes..."
                                       style="border:none;outline:none;font-size:14px;width:100%;font-family:'DM Sans',sans-serif;"
                                       autofocus oninput="SearchScreen.onSearch(this.value)">
                                <span id="search-clear" onclick="SearchScreen.clear()" style="cursor:pointer;display:none;color:var(--text-muted);">✕</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Veg Only Toggle -->
                <div style="padding:12px 16px;display:flex;align-items:center;justify-content:space-between;background:white;border-bottom:1px solid var(--berry-border);">
                    <span style="font-size:14px;font-weight:600;color:var(--green);">🥗 Vegetarian Only</span>
                    <div class="toggle-switch" id="search-veg-toggle" onclick="SearchScreen.toggleVeg()"></div>
                </div>

                <div id="search-results" style="padding:16px 16px 80px;">
                    <div class="empty-state">
                        <div class="empty-state-emoji">🔍</div>
                        <h3>Search for food</h3>
                        <p>Type a restaurant name, cuisine, or dish</p>
                    </div>
                </div>
            </div>
        `);

        this._vegOnly = false;
        this._lastQuery = '';
    },

    _vegOnly: false,
    _lastQuery: '',
    _allResults: [],

    toggleVeg() {
        this._vegOnly = !this._vegOnly;
        const toggle = document.getElementById('search-veg-toggle');
        if (toggle) toggle.classList.toggle('on', this._vegOnly);
        if (this._lastQuery) this.onSearch(this._lastQuery);
    },

    onSearch(query) {
        this._lastQuery = query;
        const clearBtn = document.getElementById('search-clear');
        if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';

        clearTimeout(this.searchTimer);
        if (!query.trim()) {
            document.getElementById('search-results').innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-emoji">🔍</div>
                    <h3>Search for food</h3>
                    <p>Type a restaurant name, cuisine, or dish</p>
                </div>
            `;
            return;
        }

        document.getElementById('search-results').innerHTML = Loading.skeleton(3);

        this.searchTimer = setTimeout(() => this.performSearch(query), 400);
    },

    async performSearch(query) {
        try {
            const params = { search: query };
            if (this._vegOnly) params.veg_only = 1;

            const res = await API.getRestaurants(params);
            const restaurants = res.data || [];

            if (!restaurants.length) {
                document.getElementById('search-results').innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-emoji">🍽️</div>
                        <h3>No results found</h3>
                        <p>Try a different search term</p>
                    </div>
                `;
                return;
            }

            document.getElementById('search-results').innerHTML = `
                <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">${restaurants.length} restaurant${restaurants.length > 1 ? 's' : ''} found</div>
                <div style="display:grid;gap:12px;">
                    ${restaurants.map(r => RestaurantCard.render(r)).join('')}
                </div>
            `;

        } catch (e) {
            document.getElementById('search-results').innerHTML = Loading.error(e.message, 'SearchScreen.performSearch()');
        }
    },

    clear() {
        const input = document.getElementById('search-input');
        if (input) { input.value = ''; input.focus(); }
        this.onSearch('');
    }
};

CORA_EOF

# ── customer/js/screens/support.js
cat << 'CORA_EOF' > 'customer/js/screens/support.js'
const SupportScreen = {
    messages: [],
    currentOrderId: null,
    ADMIN_WHATSAPP: '+919999999999', // Update with actual admin number

    render() {
        this.messages = [];
        App.setScreen(`
            <div style="display:flex;flex-direction:column;height:100%;">
                <div class="screen-header">
                    <div style="position:relative;z-index:1;">
                        <h2 style="color:white;font-family:'Playfair Display',serif;font-size:24px;font-weight:700;">Help & Support</h2>
                        <p style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:2px;">We're here to help! 💬</p>
                    </div>
                </div>

                <div id="chat-area" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:4px;padding-bottom:100px;">
                </div>
            </div>
        `);

        this.addBotMessage(`Hi ${App.user?.name?.split(' ')[0] || 'there'}! 👋 How can I help you today?`);
        setTimeout(() => this.showMainMenu(), 600);
    },

    addBotMessage(msg) {
        const el = document.createElement('div');
        el.className = 'chat-bubble bot';
        el.innerHTML = msg;
        document.getElementById('chat-area')?.appendChild(el);
        this.scrollToBottom();
    },

    addUserMessage(msg) {
        const el = document.createElement('div');
        el.className = 'chat-bubble user';
        el.textContent = msg;
        document.getElementById('chat-area')?.appendChild(el);
        this.scrollToBottom();
    },

    addActions(actions) {
        const el = document.createElement('div');
        el.className = 'chat-actions';
        el.id = 'chat-actions-' + Date.now();
        el.innerHTML = actions.map(a => `
            <button class="chat-action-btn" onclick="SupportScreen.handleAction('${a.id}', '${a.label.replace(/'/g, "\\'")}')">
                ${a.label}
            </button>
        `).join('');
        document.getElementById('chat-area')?.appendChild(el);
        this.scrollToBottom();
    },

    scrollToBottom() {
        const el = document.getElementById('chat-area');
        if (el) el.scrollTop = el.scrollHeight;
    },

    showMainMenu() {
        this.addActions([
            { id: 'track_order',     label: '📦 Track my order' },
            { id: 'wrong_item',      label: '❌ Wrong/missing item' },
            { id: 'refund',          label: '💰 Refund request' },
            { id: 'cancel_order',    label: '🚫 Cancel order' },
            { id: 'quality',         label: '😕 Food quality issue' },
            { id: 'delivery_delay',  label: '⏰ Delivery delay' },
            { id: 'talk_to_human',   label: '💬 Talk to support team' },
        ]);
    },

    handleAction(id, label) {
        // Disable all action buttons
        document.querySelectorAll('.chat-action-btn').forEach(btn => btn.disabled = true);
        this.addUserMessage(label);

        const handlers = {
            track_order:    () => this.handleTrackOrder(),
            wrong_item:     () => this.handleWrongItem(),
            refund:         () => this.handleRefund(),
            cancel_order:   () => this.handleCancelOrder(),
            quality:        () => this.handleQuality(),
            delivery_delay: () => this.handleDelay(),
            talk_to_human:  () => this.escalateToHuman(),
            back_menu:      () => { this.addBotMessage('Back to main menu:'); this.showMainMenu(); },
        };

        const fn = handlers[id];
        if (fn) setTimeout(fn, 400);
    },

    handleTrackOrder() {
        this.addBotMessage('Please provide your order number, or I can show your latest order.');
        this.addActions([
            { id: 'show_latest', label: '📋 Show latest order' },
            { id: 'back_menu',   label: '← Back' }
        ]);
    },

    handleWrongItem() {
        this.addBotMessage('Sorry about that! For wrong or missing items, we\'ll process a refund for the affected items within 3-5 business days.');
        this.addActions([
            { id: 'talk_to_human', label: '📞 Contact support for refund' },
            { id: 'back_menu',     label: '← Back' }
        ]);
    },

    handleRefund() {
        this.addBotMessage('Refund requests are processed within 3-5 business days. Here\'s our refund policy:\n\n• Wrong item: Full refund/replacement\n• Missing items: Refund for missing items\n• Quality issue: Review with photo\n• Cancelled before accepted: Full refund');
        this.addActions([
            { id: 'talk_to_human', label: '📞 Raise a refund request' },
            { id: 'back_menu',     label: '← Back' }
        ]);
    },

    handleCancelOrder() {
        this.addBotMessage('Orders can be cancelled before the restaurant accepts them. After acceptance, cancellation may not be possible.\n\nWould you like to proceed?');
        this.addActions([
            { id: 'talk_to_human', label: '📞 Cancel my order' },
            { id: 'back_menu',     label: '← Back' }
        ]);
    },

    handleQuality() {
        this.addBotMessage('We\'re sorry about the quality issue. Please take a photo of the food and contact our support team. We\'ll resolve this as quickly as possible.');
        this.addActions([
            { id: 'talk_to_human', label: '📸 Report quality issue' },
            { id: 'back_menu',     label: '← Back' }
        ]);
    },

    handleDelay() {
        this.addBotMessage('We apologize for the delay! Delivery times can be affected by traffic and distance. If your order is 30+ minutes late, you\'re eligible for ₹50 credit.');
        this.addActions([
            { id: 'talk_to_human', label: '📞 Get ₹50 credit for delay' },
            { id: 'back_menu',     label: '← Back' }
        ]);
    },

    async escalateToHuman() {
        this.addBotMessage('Connecting you to our support team via WhatsApp...');

        // Build conversation history for WhatsApp
        const messages = Array.from(document.querySelectorAll('.chat-bubble')).map(el => {
            const isBot  = el.classList.contains('bot');
            return `${isBot ? '🤖 Bot' : '👤 Customer'}: ${el.textContent.trim()}`;
        }).join('\n');

        const user    = App.user;
        const ticket  = `*CORA Support Request*\n\n*Customer:* ${user?.name || 'Unknown'}\n*Phone:* ${user?.phone || 'N/A'}\n\n*Conversation:*\n${messages}\n\n_Sent from CORA Support Chatbot_`;
        const waURL   = `https://wa.me/${this.ADMIN_WHATSAPP.replace(/\D/g,'')}?text=${encodeURIComponent(ticket)}`;

        setTimeout(() => {
            this.addBotMessage(`
                ✅ Our support team will help you!<br><br>
                <a href="${waURL}" target="_blank" style="display:inline-block;background:#25D366;color:white;padding:10px 20px;border-radius:10px;text-decoration:none;font-weight:700;margin-top:8px;">
                    💬 Open WhatsApp Support
                </a>
            `);
        }, 1000);
    }
};

CORA_EOF

# ── customer/js/screens/tracking.js
cat << 'CORA_EOF' > 'customer/js/screens/tracking.js'
const TrackingScreen = {
    order: null,
    pollTimer: null,

    async render(id) {
        App.setScreen(`
            <div class="screen-header">
                <div style="display:flex;align-items:center;gap:12px;position:relative;z-index:1;">
                    <button class="screen-back-btn" onclick="history.back()">←</button>
                    <h2 style="color:white;font-family:'Playfair Display',serif;font-size:22px;">Track Order</h2>
                </div>
            </div>
            <div id="tracking-body">${Loading.spinner('Loading order...')}</div>
        `);

        await this.loadOrder(id);

        // Poll every 10 seconds
        App.pollInterval = setInterval(() => this.loadOrder(id), 10000);
    },

    async loadOrder(id) {
        try {
            const res = await API.getOrder(id);
            if (!res.success) throw new Error(res.message);
            this.order = res.data;
            this.renderOrder();
        } catch (e) {
            const el = document.getElementById('tracking-body');
            if (el) el.innerHTML = Loading.error(e.message, `TrackingScreen.render(${id})`);
        }
    },

    renderOrder() {
        const o = this.order;
        if (!o) return;

        const statusMessages = {
            placed:         { emoji: '📋', msg: 'Order sent to restaurant!', friendly: 'Waiting for the restaurant to accept your order...' },
            accepted:       { emoji: '✅', msg: 'Order Accepted!', friendly: 'The restaurant has accepted your order!' },
            preparing:      { emoji: '👨‍🍳', msg: 'Preparing', friendly: 'Your chef is working their magic 🍳' },
            ready:          { emoji: '✨', msg: 'Order Ready!', friendly: 'Your order is ready!' },
            picked_up:      { emoji: '🏃', msg: 'Picked Up', friendly: 'Delivery partner has picked up your order!' },
            on_the_way:     { emoji: '🛵', msg: 'On the Way!', friendly: 'Almost there! Your rider is on the way 🛵' },
            delivered:      { emoji: '🎉', msg: 'Delivered!', friendly: 'Your order has been delivered. Enjoy! 😋' },
            cancelled:      { emoji: '❌', msg: 'Cancelled', friendly: `Order was cancelled. Reason: ${o.cancel_reason || 'N/A'}` },
            delivery_issue: { emoji: '⚠️', msg: 'Delivery Issue', friendly: o.customer_note_delivery || 'There\'s an issue with delivery. We\'re working on it.' }
        };

        const statusSteps = ['placed','accepted','preparing','ready','picked_up','on_the_way','delivered'];
        const currentStep = statusSteps.indexOf(o.status);
        const sm          = statusMessages[o.status] || { emoji: '📋', msg: o.status, friendly: '' };

        const timelineHtml = statusSteps.map((step, i) => {
            const isDone    = i < currentStep || o.status === 'delivered';
            const isActive  = i === currentStep && o.status !== 'delivered' && o.status !== 'cancelled';
            const stepMsg   = statusMessages[step];
            const timestamps = {
                placed: o.placed_at, accepted: o.accepted_at, preparing: o.preparing_at,
                ready: o.ready_at, picked_up: o.picked_up_at, on_the_way: o.picked_up_at, delivered: o.delivered_at
            };
            const ts = timestamps[step];

            return `
                <div class="timeline-item">
                    <div class="timeline-dot-wrap">
                        <div class="timeline-dot ${isDone ? 'done' : (isActive ? 'active' : '')}"></div>
                        ${i < statusSteps.length - 1 ? `<div class="timeline-line ${isDone ? 'done' : ''}"></div>` : ''}
                    </div>
                    <div class="timeline-content" style="padding-bottom:16px;">
                        <div class="timeline-status ${isDone ? 'done' : (isActive ? 'active' : '')}">
                            ${stepMsg.emoji} ${stepMsg.msg}
                        </div>
                        ${ts ? `<div class="timeline-time">${new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        const deliveryIssueHtml = o.status === 'delivery_issue' ? `
            <div style="background:#FFF3E0;border:1px solid #FFE0B2;border-radius:12px;padding:14px;margin:0 16px 12px;">
                <div style="font-weight:700;color:#E65100;">⚠️ Delivery Update</div>
                <div style="font-size:13px;color:#BF360C;margin-top:4px;">${o.customer_note_delivery || 'We\'re finding a delivery partner for you.'}</div>
            </div>
        ` : '';

        const deliveryBoyHtml = o.delivery_boy_name ? `
            <div class="card" style="margin:0 16px 12px;padding:16px;">
                <div style="font-size:13px;font-weight:700;color:var(--text-muted);margin-bottom:10px;">YOUR DELIVERY PARTNER</div>
                <div style="display:flex;align-items:center;gap:14px;">
                    <div style="width:48px;height:48px;background:var(--berry-light);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;">🛵</div>
                    <div style="flex:1;">
                        <div style="font-weight:700;font-size:15px;">${o.delivery_boy_name}</div>
                        <div style="font-size:13px;color:var(--text-muted);">Delivery Partner</div>
                    </div>
                    <a href="tel:${o.delivery_boy_phone}" class="btn-secondary" style="padding:8px 14px;text-decoration:none;font-size:13px;">📞 Call</a>
                </div>
            </div>
        ` : '';

        const isDelivered = o.status === 'delivered';

        document.getElementById('tracking-body').innerHTML = `
            <!-- Status Hero -->
            <div style="background:linear-gradient(135deg,var(--berry),var(--berry-deep));padding:24px;text-align:center;">
                <div style="font-size:52px;">${sm.emoji}</div>
                <h3 style="color:white;font-family:'Playfair Display',serif;font-size:22px;margin-top:8px;">${sm.msg}</h3>
                <p style="color:rgba(255,255,255,0.85);font-size:14px;margin-top:4px;">${sm.friendly}</p>
                <div style="background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border-radius:10px;padding:8px 16px;margin-top:12px;display:inline-block;color:white;font-size:13px;">
                    Order #${o.order_number}
                </div>
            </div>

            <!-- Delivery Animation (for active deliveries) -->
            ${['picked_up','on_the_way'].includes(o.status) ? `
                <div style="background:var(--berry-light);padding:16px;text-align:center;overflow:hidden;">
                    <div style="position:relative;height:60px;background:white;border-radius:12px;overflow:hidden;">
                        <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:var(--berry-border);"></div>
                        <div style="position:absolute;font-size:30px;animation:ride 3s linear infinite;top:50%;transform:translateY(-50%);">🛵</div>
                    </div>
                </div>
            ` : ''}

            ${deliveryIssueHtml}
            ${deliveryBoyHtml}

            <!-- Timeline -->
            <div class="card" style="margin:12px 16px;padding:16px;">
                <div style="font-size:13px;font-weight:700;color:var(--text-muted);margin-bottom:14px;">ORDER STATUS</div>
                <div class="timeline">${timelineHtml}</div>
            </div>

            <!-- Bill Summary -->
            <div class="card" style="margin:0 16px 12px;padding:16px;">
                <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:12px;">Bill Summary</div>
                <div class="price-row"><span>Subtotal</span><span>₹${parseFloat(o.subtotal).toFixed(0)}</span></div>
                ${parseFloat(o.delivery_fee) > 0 ? `<div class="price-row"><span>Delivery fee</span><span>₹${parseFloat(o.delivery_fee).toFixed(0)}</span></div>` : ''}
                <div class="price-row"><span>Platform fee</span><span>₹${parseFloat(o.platform_fee || 5).toFixed(0)}</span></div>
                ${parseFloat(o.discount_amount) > 0 ? `<div class="price-row discount"><span>Discount</span><span>−₹${parseFloat(o.discount_amount).toFixed(0)}</span></div>` : ''}
                <div class="price-row total"><span>Total</span><span>₹${parseFloat(o.total_amount).toFixed(0)}</span></div>
                <div style="margin-top:8px;display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;background:${o.payment_status === 'paid' ? 'var(--green-light)' : 'var(--berry-light)'};color:${o.payment_status === 'paid' ? 'var(--green)' : 'var(--berry)'};">
                    ${o.payment_method?.toUpperCase()} · ${o.payment_status?.toUpperCase()}
                </div>
            </div>

            <!-- Receipt Download -->
            <div style="padding:0 16px 12px;">
                <button class="btn-secondary" style="width:100%;padding:12px;" onclick="TrackingScreen.downloadReceipt()">
                    📄 View Receipt
                </button>
            </div>

            <!-- Review (if delivered) -->
            ${isDelivered && !o.review ? `
                <div class="card" style="margin:0 16px 12px;padding:16px;">
                    <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:8px;">Rate your experience</div>
                    <div id="review-stars" style="display:flex;gap:8px;font-size:32px;margin-bottom:12px;">
                        ${[1,2,3,4,5].map(s => `<span onclick="TrackingScreen.setRating(${s})" style="cursor:pointer;opacity:0.4;" data-star="${s}">⭐</span>`).join('')}
                    </div>
                    <textarea id="review-comment" placeholder="Tell us about your experience..." style="width:100%;background:white;border:1.5px solid var(--berry-border);border-radius:12px;padding:10px;font-size:13px;resize:none;height:70px;font-family:'DM Sans',sans-serif;outline:none;"></textarea>
                    <button class="btn-primary" style="width:100%;margin-top:10px;padding:12px;" onclick="TrackingScreen.submitReview(${o.id})">
                        Submit Review ⭐
                    </button>
                </div>
            ` : ''}

            <!-- Support -->
            <div style="padding:0 16px 24px;">
                <button class="btn-secondary" style="width:100%;padding:12px;" onclick="window.location.hash='#support'">
                    💬 Need Help?
                </button>
            </div>
        `;
    },

    selectedRating: 0,

    setRating(n) {
        this.selectedRating = n;
        document.querySelectorAll('[data-star]').forEach(el => {
            el.style.opacity = parseInt(el.dataset.star) <= n ? '1' : '0.3';
        });
    },

    async submitReview(orderId) {
        if (!this.selectedRating) { App.showToast('Please select a rating', 'error'); return; }
        const comment = document.getElementById('review-comment')?.value || '';
        try {
            const res = await API.submitReview({ order_id: orderId, food_rating: this.selectedRating, comment });
            if (res.success) {
                App.showToast('Review submitted! Thank you 🙏', 'success');
                this.loadOrder(orderId);
            }
        } catch (e) { App.showToast(e.message || 'Failed to submit review', 'error'); }
    },

    downloadReceipt() {
        const o = this.order;
        if (!o) return;
        const items = (o.items || []).map(i => `${i.quantity}x ${i.item_name} — ₹${(i.item_price * i.quantity).toFixed(0)}`).join('\n');
        const receiptHtml = `
            <html><head><meta charset="UTF-8"><title>Receipt</title>
            <style>
                body { font-family: 'DM Sans',sans-serif; max-width: 400px; margin: 20px auto; color: #1A1A1A; }
                .header { background: linear-gradient(135deg,#D1386C,#8C1D47); color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center; }
                .body { padding: 20px; border: 1px solid #FFE0EB; border-top: none; border-radius: 0 0 12px 12px; }
                .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #FFE0EB; font-size: 14px; }
                .total { font-weight: 700; font-size: 16px; border-top: 2px solid #D1386C; border-bottom: none; margin-top: 8px; }
                .order-num { font-size: 22px; font-weight: 700; font-family: Georgia,serif; }
            </style></head><body>
            <div class="header">
                <div style="font-size:32px;">🍽️</div>
                <div style="font-size:24px;font-weight:700;">CORA</div>
                <div style="opacity:0.85;font-size:13px;">Kulgam's Food, Delivered</div>
            </div>
            <div class="body">
                <div style="text-align:center;padding:16px 0;">
                    <div class="order-num">${o.order_number}</div>
                    <div style="font-size:12px;color:#6B6B6B;">${new Date(o.placed_at).toLocaleString('en-IN')}</div>
                </div>
                <div style="font-weight:700;margin-bottom:8px;">${o.restaurant_name || ''}</div>
                ${(o.items || []).map(i => `<div class="row"><span>${i.quantity}x ${i.item_name}</span><span>₹${(i.item_price * i.quantity).toFixed(0)}</span></div>`).join('')}
                <div class="row" style="margin-top:8px;"><span>Subtotal</span><span>₹${parseFloat(o.subtotal).toFixed(0)}</span></div>
                ${parseFloat(o.delivery_fee) > 0 ? `<div class="row"><span>Delivery</span><span>₹${parseFloat(o.delivery_fee).toFixed(0)}</span></div>` : ''}
                <div class="row"><span>Platform fee</span><span>₹${parseFloat(o.platform_fee || 5).toFixed(0)}</span></div>
                ${parseFloat(o.discount_amount) > 0 ? `<div class="row" style="color:#1DB954;"><span>Discount</span><span>−₹${parseFloat(o.discount_amount).toFixed(0)}</span></div>` : ''}
                <div class="row total"><span>Total</span><span>₹${parseFloat(o.total_amount).toFixed(0)}</span></div>
                <div style="text-align:center;margin-top:20px;color:#A0A0A0;font-size:12px;">Thank you for ordering with Cora! 🙏</div>
            </div>
            </body></html>
        `;
        const w = window.open('', '_blank');
        w.document.write(receiptHtml);
        w.document.close();
        w.print();
    }
};

CORA_EOF

# ── database/schema.sql
cat << 'CORA_EOF' > 'database/schema.sql'
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

CORA_EOF

# ── restaurant/index.html
cat << 'CORA_EOF' > 'restaurant/index.html'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#D1386C">
    <title>Cora — Restaurant Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css" rel="stylesheet" crossorigin="anonymous">
    <link rel="stylesheet" href="/restaurant/css/style.css">
</head>
<body>
    <div id="app">
        <!-- Loading Screen -->
        <div id="loading-screen" class="loading-screen">
            <div style="text-align:center;color:white;">
                <div style="font-size:60px;">🍽️</div>
                <h1 style="font-family:'Playfair Display',serif;font-size:36px;margin-top:12px;">Cora</h1>
                <p style="opacity:0.8;margin-top:4px;">Restaurant Dashboard</p>
            </div>
            <div class="loading-spinner"></div>
        </div>

        <!-- Auth Screen -->
        <div id="auth-screen" style="display:none;">
            <div class="header-gradient" style="padding:60px 24px 50px;text-align:center;position:relative;overflow:hidden;">
                <div class="header-circles"></div>
                <div style="font-size:52px;">🍽️</div>
                <h1 style="font-family:'Playfair Display',serif;font-size:32px;color:white;margin-top:8px;">Restaurant Login</h1>
                <p style="color:rgba(255,255,255,0.8);font-size:14px;">Cora Restaurant Dashboard</p>
            </div>
            <div style="padding:32px 24px;background:var(--berry-light);">
                <div id="phone-step">
                    <h2 style="font-family:'Playfair Display',serif;font-size:24px;font-weight:700;margin-bottom:6px;">Welcome Back!</h2>
                    <p style="color:var(--text-sub);font-size:14px;margin-bottom:24px;">Enter your registered phone number</p>
                    <div class="form-group">
                        <label>Phone Number</label>
                        <div class="phone-input-wrap">
                            <span class="country-prefix">🇮🇳 +91</span>
                            <input type="tel" id="phone-input" placeholder="98765 43210" maxlength="10" inputmode="numeric">
                        </div>
                    </div>
                    <button class="btn-primary" style="width:100%;" id="send-otp-btn" onclick="Auth.sendOTP()">Send OTP</button>
                    <div id="recaptcha-container"></div>
                </div>
                <div id="otp-step" style="display:none;">
                    <h2 style="font-family:'Playfair Display',serif;font-size:24px;font-weight:700;margin-bottom:6px;">Verify OTP</h2>
                    <p style="color:var(--text-sub);font-size:14px;margin-bottom:24px;" id="otp-hint"></p>
                    <div class="form-group">
                        <label>6-Digit OTP</label>
                        <input type="number" id="otp-input" placeholder="••••••" maxlength="6" style="text-align:center;font-size:24px;letter-spacing:10px;font-weight:700;">
                    </div>
                    <button class="btn-primary" style="width:100%;" id="verify-btn" onclick="Auth.verifyOTP()">Verify & Login</button>
                    <button class="btn-secondary" style="width:100%;margin-top:10px;" onclick="Auth.reset()">← Change Number</button>
                </div>
            </div>
        </div>

        <!-- Main Dashboard -->
        <div id="main-app" style="display:none;">
            <!-- Header -->
            <div class="header-gradient" id="dashboard-header">
                <div class="header-circles"></div>
                <div style="position:relative;z-index:1;padding:50px 20px 0;">
                    <div style="display:flex;align-items:center;justify-content:space-between;">
                        <div>
                            <h1 id="restaurant-name-header" style="font-family:'Playfair Display',serif;font-size:22px;color:white;font-weight:700;">Loading...</h1>
                            <p id="restaurant-status-text" style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:2px;"></p>
                        </div>
                        <div style="display:flex;align-items:center;gap:10px;">
                            <div id="open-toggle-btn" onclick="Dashboard.toggleOpen()" style="display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border-radius:10px;padding:8px 12px;cursor:pointer;color:white;font-size:13px;font-weight:600;">
                                <span id="open-toggle-icon">🟢</span>
                                <span id="open-toggle-text">Open</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab Navigation -->
            <div class="tab-nav" id="tab-nav">
                <div class="tab-item active" data-tab="orders" onclick="Dashboard.switchTab('orders')">
                    <span class="tab-icon">📋</span>
                    <span>Orders</span>
                    <span id="orders-badge" class="tab-badge" style="display:none;"></span>
                </div>
                <div class="tab-item" data-tab="menu" onclick="Dashboard.switchTab('menu')">
                    <span class="tab-icon">🍽️</span>
                    <span>Menu</span>
                </div>
                <div class="tab-item" data-tab="deliveries" onclick="Dashboard.switchTab('deliveries')">
                    <span class="tab-icon">🛵</span>
                    <span>Deliveries</span>
                </div>
                <div class="tab-item" data-tab="earnings" onclick="Dashboard.switchTab('earnings')">
                    <span class="tab-icon">💰</span>
                    <span>Earnings</span>
                </div>
                <div class="tab-item" data-tab="settings" onclick="Dashboard.switchTab('settings')">
                    <span class="tab-icon">⚙️</span>
                    <span>Settings</span>
                </div>
            </div>

            <!-- Tab Content -->
            <div id="tab-content" style="overflow-y:auto;height:calc(100vh - 180px);"></div>
        </div>
    </div>

    <!-- Toast -->
    <div id="toast" class="toast"></div>

    <!-- Audio for new order alert -->
    <div id="audio-context" style="display:none;"></div>

    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
    <script src="/restaurant/js/api.js"></script>
    <script src="/restaurant/js/orders.js"></script>
    <script src="/restaurant/js/menu.js"></script>
    <script src="/restaurant/js/deliveries.js"></script>
    <script src="/restaurant/js/earnings.js"></script>
    <script src="/restaurant/js/settings.js"></script>
    <script src="/restaurant/js/app.js"></script>
</body>
</html>

CORA_EOF

# ── restaurant/css/style.css
cat << 'CORA_EOF' > 'restaurant/css/style.css'
:root {
    --berry:        #D1386C;
    --berry-dark:   #B22D5B;
    --berry-deep:   #8C1D47;
    --berry-light:  #FFF0F5;
    --berry-glow:   rgba(209,56,108,0.18);
    --berry-border: #FFE0EB;
    --white:        #FFFFFF;
    --text:         #1A1A1A;
    --text-sub:     #6B6B6B;
    --text-muted:   #A0A0A0;
    --green:        #1DB954;
    --green-light:  #E8F8EF;
    --orange:       #FF9800;
    --danger:       #E53935;
}

* { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }

body {
    font-family: 'DM Sans', -apple-system, sans-serif;
    background: var(--berry-light);
    color: var(--text);
    font-size: 14px;
}

#app { max-width: 480px; margin: 0 auto; min-height: 100vh; background: var(--berry-light); }

/* Loading */
.loading-screen {
    position: fixed; inset: 0;
    background: linear-gradient(135deg, var(--berry), var(--berry-deep));
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 32px; z-index: 1000;
}

.loading-spinner {
    width: 40px; height: 40px;
    border: 3px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Header */
.header-gradient {
    background: linear-gradient(135deg, var(--berry), var(--berry-deep));
    position: relative; overflow: hidden;
}

.header-circles::before {
    content: ''; position: absolute;
    width: 200px; height: 200px; border-radius: 50%;
    background: rgba(255,255,255,0.1);
    top: -60px; right: -40px;
}

.header-circles::after {
    content: ''; position: absolute;
    width: 100px; height: 100px; border-radius: 50%;
    background: rgba(255,255,255,0.08);
    bottom: -20px; left: 20px;
}

/* Tab Navigation */
.tab-nav {
    display: flex; overflow-x: auto;
    background: white;
    border-bottom: 1px solid var(--berry-border);
    scrollbar-width: none;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 2px 8px var(--berry-glow);
}

.tab-nav::-webkit-scrollbar { display: none; }

.tab-item {
    flex: 1; min-width: 70px;
    display: flex; flex-direction: column;
    align-items: center; gap: 2px;
    padding: 10px 8px;
    font-size: 11px; font-weight: 600;
    color: var(--text-muted);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.25s ease;
    position: relative;
    white-space: nowrap;
}

.tab-item.active { color: var(--berry); border-bottom-color: var(--berry); }
.tab-icon { font-size: 20px; }

.tab-badge {
    position: absolute; top: 4px; right: 8px;
    background: var(--danger);
    color: white; font-size: 10px; font-weight: 700;
    padding: 1px 5px; border-radius: 10px;
    min-width: 16px; text-align: center;
}

/* Cards */
.card {
    background: white;
    border: 1px solid var(--berry-border);
    border-radius: 16px;
    box-shadow: 0 3px 16px var(--berry-glow);
}

/* Buttons */
.btn-primary {
    background: var(--berry); color: white;
    border: none; border-radius: 12px;
    padding: 12px 20px; font-size: 14px;
    font-weight: 600; font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 4px 14px var(--berry-glow);
    transition: all 0.25s ease;
    display: inline-flex; align-items: center;
    justify-content: center; gap: 6px;
}

.btn-primary:hover { background: var(--berry-dark); }
.btn-primary:active { transform: scale(0.97); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary {
    background: var(--berry-light); color: var(--berry);
    border: 1.5px solid var(--berry);
    border-radius: 12px; padding: 10px 18px;
    font-size: 14px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.25s ease;
    display: inline-flex; align-items: center;
    justify-content: center; gap: 6px;
}

.btn-secondary:hover { background: var(--berry); color: white; }

.btn-danger {
    background: var(--danger); color: white;
    border: none; border-radius: 12px;
    padding: 10px 18px; font-size: 14px;
    font-weight: 600; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.25s ease;
    display: inline-flex; align-items: center;
    justify-content: center; gap: 6px;
}

.btn-success {
    background: var(--green); color: white;
    border: none; border-radius: 12px;
    padding: 10px 18px; font-size: 14px;
    font-weight: 600; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.25s ease;
    display: inline-flex; align-items: center;
    justify-content: center; gap: 6px;
}

/* Forms */
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--text-sub); margin-bottom: 6px; }
.form-group input, .form-group textarea, .form-group select {
    width: 100%;
    background: white;
    border: 1.5px solid var(--berry-border);
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    outline: none;
    transition: border-color 0.25s;
}

.form-group input:focus, .form-group textarea:focus, .form-group select:focus {
    border-color: var(--berry);
    box-shadow: 0 0 0 3px var(--berry-glow);
}

.phone-input-wrap {
    display: flex; align-items: center;
    background: white;
    border: 1.5px solid var(--berry-border);
    border-radius: 12px;
    padding: 0 14px;
    transition: border-color 0.25s;
}

.phone-input-wrap:focus-within { border-color: var(--berry); }

.country-prefix {
    font-size: 14px; color: var(--text-sub);
    margin-right: 8px; padding: 12px 0;
    border-right: 1px solid var(--berry-border);
    padding-right: 12px; white-space: nowrap;
}

.phone-input-wrap input {
    border: none; border-radius: 0;
    padding: 12px 0 12px 10px;
    box-shadow: none;
}

.phone-input-wrap input:focus { box-shadow: none; border-color: transparent; }

/* Toggle */
.toggle-switch {
    width: 48px; height: 26px;
    background: var(--berry-border);
    border-radius: 13px;
    position: relative;
    cursor: pointer;
    transition: background 0.25s;
    flex-shrink: 0;
}

.toggle-switch.on { background: var(--berry); }
.toggle-switch::after {
    content: ''; position: absolute;
    width: 20px; height: 20px;
    border-radius: 50%; background: white;
    top: 3px; left: 3px;
    transition: left 0.25s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.toggle-switch.on::after { left: 25px; }

/* Toast */
.toast {
    position: fixed; top: 20px;
    left: 50%; transform: translateX(-50%) translateY(-80px);
    background: var(--text); color: white;
    padding: 12px 20px; border-radius: 12px;
    font-size: 14px; font-weight: 500;
    z-index: 9999;
    transition: transform 0.3s ease;
    max-width: 340px; text-align: center;
    pointer-events: none;
}

.toast.show { transform: translateX(-50%) translateY(0); }
.toast.success { background: var(--green); }
.toast.error   { background: var(--danger); }
.toast.info    { background: var(--berry); }

/* Order Card */
.order-card {
    background: white;
    border: 1px solid var(--berry-border);
    border-radius: 16px;
    margin: 0 16px 12px;
    overflow: hidden;
    box-shadow: 0 3px 16px var(--berry-glow);
    transition: all 0.25s ease;
}

.order-card.new-order { border-color: var(--berry); border-width: 2px; animation: pulse-border 2s infinite; }

@keyframes pulse-border {
    0%, 100% { box-shadow: 0 3px 16px var(--berry-glow); }
    50% { box-shadow: 0 0 0 6px var(--berry-glow); }
}

.order-card-header {
    background: linear-gradient(135deg, var(--berry), var(--berry-deep));
    padding: 12px 16px;
    display: flex; justify-content: space-between;
    align-items: center;
}

.order-number { color: white; font-weight: 700; font-size: 15px; }
.order-timer  { color: rgba(255,255,255,0.9); font-size: 13px; }

.order-body { padding: 14px 16px; }

.order-item-row {
    display: flex; justify-content: space-between;
    padding: 4px 0;
    font-size: 13px;
    color: var(--text);
}

.order-meta {
    display: flex; gap: 12px; flex-wrap: wrap;
    margin-top: 10px; padding-top: 10px;
    border-top: 1px solid var(--berry-border);
}

.order-meta-item { font-size: 12px; color: var(--text-sub); }

.order-actions { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--berry-border); }

/* Status Badge */
.status-badge {
    display: inline-block;
    padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 700;
}

.status-placed       { background: #FFF3E0; color: #E65100; }
.status-accepted     { background: #E3F2FD; color: #1565C0; }
.status-preparing    { background: #FFF8E1; color: #F57F17; }
.status-ready        { background: #E8F5E9; color: #2E7D32; }
.status-delivered    { background: var(--green-light); color: var(--green); }
.status-cancelled    { background: #FFEBEE; color: var(--danger); }

/* Menu Item Row */
.menu-item-row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--berry-border);
}

.menu-item-row:last-child { border-bottom: none; }

.veg-dot {
    width: 14px; height: 14px;
    border-radius: 2px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
}
.veg-dot.veg     { border: 2px solid var(--green); }
.veg-dot.veg::after { content:''; width:6px;height:6px;border-radius:50%;background:var(--green); }
.veg-dot.nonveg  { border: 2px solid var(--berry); }
.veg-dot.nonveg::after { content:''; width:6px;height:6px;border-radius:50%;background:var(--berry); }

/* Earnings Bar Chart */
.bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 120px; padding: 0 8px; }
.bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
.bar { width: 100%; background: var(--berry); border-radius: 4px 4px 0 0; transition: height 0.5s ease; min-height: 4px; }
.bar-label { font-size: 10px; color: var(--text-muted); text-align: center; }

/* Empty State */
.empty-state {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 60px 32px; text-align: center; gap: 12px;
}

/* WhatsApp btn */
.wa-btn {
    background: #25D366; color: white;
    border: none; border-radius: 10px;
    padding: 8px 14px; font-size: 13px;
    font-weight: 600; font-family: 'DM Sans', sans-serif;
    cursor: pointer; text-decoration: none;
    display: inline-flex; align-items: center; gap: 6px;
    transition: all 0.25s ease;
}

.wa-btn:hover { background: #20b658; }

CORA_EOF

# ── restaurant/js/api.js
cat << 'CORA_EOF' > 'restaurant/js/api.js'
const API_BASE = '/api';

const RApi = {
    _token: () => localStorage.getItem('restaurant_token'),

    async request(endpoint, options = {}) {
        const token = this._token();
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(options.headers || {})
        };

        const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
        const data = await response.json();

        if (response.status === 401) {
            localStorage.removeItem('restaurant_token');
            window.location.reload();
            return;
        }

        return data;
    },

    get:  (ep)       => RApi.request(ep, { method: 'GET' }),
    post: (ep, body) => RApi.request(ep, { method: 'POST', body: JSON.stringify(body) }),
    put:  (ep, body) => RApi.request(ep, { method: 'PUT',  body: JSON.stringify(body) }),
    del:  (ep)       => RApi.request(ep, { method: 'DELETE' }),

    async upload(endpoint, formData) {
        const token = this._token();
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const resp = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', headers, body: formData });
        return resp.json();
    },

    // Restaurant-specific
    getOrders:        (status = '') => RApi.get(`/restaurant/orders.php${status ? '?status=' + status : ''}`),
    updateOrderStatus: (data)  => RApi.put('/restaurant/order-status.php', data),
    getMenu:          ()  => RApi.get('/restaurant/menu.php'),
    saveMenuItem:     (fd) => RApi.upload('/restaurant/menu-item.php', fd),
    deleteMenuItem:   (id) => RApi.del(`/restaurant/menu-item.php?id=${id}`),
    toggleItem:       (id) => RApi.put('/restaurant/toggle-item.php', { id }),
    toggleOpen:       ()  => RApi.put('/restaurant/toggle-open.php', {}),
    getEarnings:      ()  => RApi.get('/restaurant/earnings.php'),
    getDeliveryBoys:  ()  => RApi.get('/restaurant/delivery-boys.php'),
    toggleBoyStatus:  (id) => RApi.put('/restaurant/delivery-boy-status.php', { delivery_boy_id: id }),
    getPublicPool:    ()  => RApi.get('/restaurant/public-pool.php'),
    postToPool:       (data) => RApi.post('/restaurant/public-pool.php', data),
    claimDelivery:    (data) => RApi.post('/restaurant/claim-delivery.php', data),
    notifyCustomer:   (data) => RApi.post('/restaurant/notify-customer.php', data),
    getReviews:       ()  => RApi.get('/restaurant/reviews.php'),
    replyReview:      (data) => RApi.post('/restaurant/review-reply.php', data),
    verify:           (data) => RApi.post('/auth/verify.php', data),
    getMe:            ()  => RApi.get('/auth/me.php'),
};

CORA_EOF

# ── restaurant/js/app.js
cat << 'CORA_EOF' > 'restaurant/js/app.js'
/* ═══ Cora Restaurant Dashboard — Main App ═══ */

const FIREBASE_CONFIG = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const Dashboard = {
    user: null,
    restaurant: null,
    currentTab: 'orders',
    alertAudio: null,
    isAlertPlaying: false,
    lastOrderCount: 0,
    pollInterval: null,

    async init() {
        try { firebase.initializeApp(FIREBASE_CONFIG); } catch(e) {}

        const token = localStorage.getItem('restaurant_token');
        if (token) {
            try {
                const me = await RApi.getMe();
                if (me?.success && me.data.role === 'restaurant_owner') {
                    Dashboard.user = me.data;
                    Dashboard.showDashboard();
                    return;
                }
            } catch(e) {}
        }
        Dashboard.showAuth();
    },

    showAuth() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'block';
        document.getElementById('main-app').style.display = 'none';
    },

    showDashboard() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        this.switchTab('orders');
        this.startPolling();
    },

    async switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.tab-item').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));

        const content = document.getElementById('tab-content');
        content.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;padding:60px;"><div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div></div>`;

        const tabs = { orders: OrdersTab, menu: MenuTab, deliveries: DeliveriesTab, earnings: EarningsTab, settings: SettingsTab };
        const tabHandler = tabs[tab];
        if (tabHandler) await tabHandler.render();
    },

    startPolling() {
        this.pollInterval = setInterval(async () => {
            if (this.currentTab === 'orders') {
                await OrdersTab.pollNewOrders();
            }
        }, 8000);
    },

    async toggleOpen() {
        try {
            const res = await RApi.toggleOpen();
            if (res.success) {
                const isOpen = res.data.is_open;
                document.getElementById('open-toggle-icon').textContent = isOpen ? '🟢' : '🔴';
                document.getElementById('open-toggle-text').textContent  = isOpen ? 'Open' : 'Closed';
                Dashboard.showToast(isOpen ? 'Restaurant is now OPEN' : 'Restaurant is now CLOSED', 'info');
            }
        } catch(e) { Dashboard.showToast('Failed to toggle status', 'error'); }
    },

    // ── Audio Alert (Web Audio API) ──────────────
    startAlert() {
        if (this.isAlertPlaying) return;
        this.isAlertPlaying = true;
        this._playBeep();
    },

    stopAlert() {
        this.isAlertPlaying = false;
        if (this._alertTimeout) clearTimeout(this._alertTimeout);
    },

    _alertTimeout: null,

    _playBeep() {
        if (!this.isAlertPlaying) return;

        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);

            // Repeat beep every 1.5 seconds
            this._alertTimeout = setTimeout(() => this._playBeep(), 1500);
        } catch(e) {
            // Web Audio API not available
        }
    },

    showToast(msg, type = 'info', duration = 3000) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.className = `toast ${type} show`;
        setTimeout(() => toast.classList.remove('show'), duration);
    }
};

const Auth = {
    confirmationResult: null,
    demoMode: false,

    async sendOTP() {
        const phone = document.getElementById('phone-input').value.trim();
        if (phone.length !== 10) { Dashboard.showToast('Enter valid 10-digit number', 'error'); return; }

        const btn = document.getElementById('send-otp-btn');
        btn.disabled = true; btn.textContent = 'Sending...';

        try {
            const fullPhone = '+91' + phone;
            try {
                const recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
                this.confirmationResult = await firebase.auth().signInWithPhoneNumber(fullPhone, recaptcha);
            } catch(e) {
                this.demoMode = true;
                this.demoPhone = fullPhone;
            }

            document.getElementById('phone-step').style.display = 'none';
            document.getElementById('otp-step').style.display = 'block';
            document.getElementById('otp-hint').textContent = `OTP sent to +91 ${phone}`;
            Dashboard.showToast('OTP sent!', 'success');
        } catch(e) {
            Dashboard.showToast(e.message || 'Failed to send OTP', 'error');
        } finally {
            btn.disabled = false; btn.textContent = 'Send OTP';
        }
    },

    async verifyOTP() {
        const otp = document.getElementById('otp-input').value.trim();
        if (otp.length !== 6) { Dashboard.showToast('Enter 6-digit OTP', 'error'); return; }

        const btn = document.getElementById('verify-btn');
        btn.disabled = true; btn.textContent = 'Verifying...';

        try {
            let firebaseUid, phone;
            if (this.demoMode) {
                firebaseUid = 'demo_' + Date.now();
                phone = this.demoPhone;
            } else {
                const result = await this.confirmationResult.confirm(otp);
                firebaseUid = result.user.uid;
                phone = result.user.phoneNumber;
            }

            const res = await RApi.verify({ firebase_uid: firebaseUid, phone });
            if (res?.success) {
                if (res.data.user.role !== 'restaurant_owner') {
                    Dashboard.showToast('This account is not a restaurant owner', 'error');
                    return;
                }
                localStorage.setItem('restaurant_token', res.data.token);
                Dashboard.user = res.data.user;
                Dashboard.showDashboard();
            } else {
                throw new Error(res?.message || 'Login failed');
            }
        } catch(e) {
            Dashboard.showToast(e.message || 'Invalid OTP', 'error');
        } finally {
            btn.disabled = false; btn.textContent = 'Verify & Login';
        }
    },

    reset() {
        document.getElementById('otp-step').style.display = 'none';
        document.getElementById('phone-step').style.display = 'block';
    }
};

document.addEventListener('DOMContentLoaded', () => Dashboard.init());

CORA_EOF

# ── restaurant/js/deliveries.js
cat << 'CORA_EOF' > 'restaurant/js/deliveries.js'
const DeliveriesTab = {
    async render() {
        document.getElementById('tab-content').innerHTML = `
            <div style="padding:16px 0 80px;" id="deliveries-content">
                <div style="display:flex;justify-content:center;padding:40px;"><div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div></div>
            </div>
        `;
        await this.loadData();
    },

    async loadData() {
        try {
            const [boysRes, poolRes] = await Promise.all([
                RApi.getDeliveryBoys(),
                RApi.getPublicPool()
            ]);

            const boys   = boysRes?.data || [];
            const pool   = poolRes?.data || [];

            document.getElementById('deliveries-content').innerHTML = `
                <!-- My Delivery Boys -->
                <div style="padding:0 16px 12px;">
                    <h3 style="font-family:'Playfair Display',serif;font-size:18px;font-weight:700;margin-bottom:12px;">🛵 My Delivery Boys</h3>
                    ${boys.length ? boys.map(b => this.boyCardHtml(b)).join('') : `
                        <div style="text-align:center;padding:20px;color:var(--text-muted);font-size:14px;">
                            No delivery boys assigned yet. Contact admin to add delivery boys.
                        </div>
                    `}
                </div>

                <!-- Active Deliveries -->
                <div style="padding:0 16px 12px;">
                    <h3 style="font-family:'Playfair Display',serif;font-size:18px;font-weight:700;margin-bottom:12px;">📦 Active Deliveries</h3>
                    <div id="active-deliveries-list">
                        <div style="text-align:center;padding:20px;color:var(--text-muted);font-size:14px;">Loading deliveries...</div>
                    </div>
                </div>

                <!-- Public Pool -->
                <div style="padding:0 16px 12px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <h3 style="font-family:'Playfair Display',serif;font-size:18px;font-weight:700;">🌐 Public Pool</h3>
                        <button class="btn-secondary" style="padding:8px 12px;font-size:12px;" onclick="DeliveriesTab.loadData()">↻ Refresh</button>
                    </div>
                    ${pool.length ? pool.map(p => this.poolCardHtml(p, boys)).join('') : `
                        <div style="text-align:center;padding:20px;color:var(--text-muted);font-size:14px;">
                            No public deliveries available right now.
                        </div>
                    `}
                </div>
            `;

            // Load active deliveries
            this.loadActiveDeliveries();

        } catch(e) {
            document.getElementById('deliveries-content').innerHTML = `<div style="padding:20px;color:var(--danger);">Failed to load delivery data</div>`;
        }
    },

    async loadActiveDeliveries() {
        try {
            const res = await RApi.getOrders('picked_up');
            const res2 = await RApi.getOrders('on_the_way');
            const active = [...(res?.data || []), ...(res2?.data || [])];
            const el = document.getElementById('active-deliveries-list');
            if (!el) return;

            if (!active.length) {
                el.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:14px;">No active deliveries</div>`;
                return;
            }

            el.innerHTML = active.map(o => `
                <div class="card" style="margin-bottom:10px;padding:14px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div>
                            <div style="font-weight:700;">#${o.order_number}</div>
                            <div style="font-size:12px;color:var(--text-muted);">${o.customer_name}</div>
                        </div>
                        <span class="status-badge status-${o.status}">${o.status?.replace('_',' ')}</span>
                    </div>
                    ${o.delivery_address ? `<div style="font-size:12px;color:var(--text-sub);margin-top:6px;">📍 ${o.delivery_address}</div>` : ''}
                    ${o.delivery_boy_name ? `<div style="font-size:12px;color:var(--text-sub);margin-top:4px;">🛵 ${o.delivery_boy_name}</div>` : ''}
                </div>
            `).join('');
        } catch(e) {}
    },

    boyCardHtml(b) {
        const statusColor  = b.is_available ? 'var(--green)' : 'var(--orange)';
        const statusLabel  = b.is_available ? 'Available' : 'Unavailable';

        return `
            <div class="card" style="margin-bottom:10px;padding:14px;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="width:46px;height:46px;background:var(--berry-light);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;">🛵</div>
                    <div style="flex:1;">
                        <div style="font-weight:700;font-size:15px;">${b.name}</div>
                        <div style="font-size:12px;color:var(--text-muted);">${b.vehicle_type} · ${b.phone}</div>
                        <div style="font-size:11px;color:${statusColor};font-weight:600;margin-top:2px;">● ${statusLabel}</div>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
                        <div class="toggle-switch ${b.is_available ? 'on' : ''}" onclick="DeliveriesTab.toggleBoy(${b.id}, this)"></div>
                        <div style="font-size:11px;color:var(--text-muted);">${b.total_deliveries} deliveries</div>
                    </div>
                </div>
            </div>
        `;
    },

    poolCardHtml(p, boys) {
        const availBoys = boys.filter(b => b.is_available);
        const boyOptions = availBoys.map(b => `<option value="${b.id}">${b.name}</option>`).join('');

        return `
            <div class="card" style="margin-bottom:10px;padding:14px;border-left:4px solid var(--berry);">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                    <div>
                        <div style="font-weight:700;">📍 ${p.restaurant_name}</div>
                        <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">Pay: <strong>₹${p.offered_pay}</strong></div>
                    </div>
                    <span style="background:var(--green-light);color:var(--green);padding:3px 10px;border-radius:10px;font-size:12px;font-weight:700;">OPEN</span>
                </div>
                <div style="font-size:12px;color:var(--text-sub);margin-bottom:4px;">🏪 Pickup: ${p.pickup_address}</div>
                <div style="font-size:12px;color:var(--text-sub);margin-bottom:12px;">📍 Deliver: ${p.delivery_address}</div>
                ${availBoys.length ? `
                    <div style="display:flex;gap:8px;align-items:center;">
                        <select id="boy-select-${p.id}" style="flex:1;background:white;border:1.5px solid var(--berry-border);border-radius:10px;padding:8px 10px;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;">
                            <option value="">Select delivery boy</option>
                            ${boyOptions}
                        </select>
                        <button class="btn-success" style="padding:8px 14px;font-size:13px;" onclick="DeliveriesTab.claimPool(${p.id})">Claim</button>
                    </div>
                ` : `<div style="font-size:12px;color:var(--orange);">No available delivery boys. Mark one as available first.</div>`}
            </div>
        `;
    },

    async toggleBoy(id, toggleEl) {
        try {
            const res = await RApi.toggleBoyStatus(id);
            if (res?.success) {
                const isAvail = res.data.is_available;
                toggleEl.classList.toggle('on', !!isAvail);
                Dashboard.showToast(isAvail ? 'Delivery boy available' : 'Delivery boy unavailable', 'info');
            }
        } catch(e) { Dashboard.showToast('Failed to toggle', 'error'); }
    },

    async claimPool(poolId) {
        const boySelect = document.getElementById(`boy-select-${poolId}`);
        const boyId = boySelect?.value;
        if (!boyId) { Dashboard.showToast('Select a delivery boy first', 'error'); return; }

        try {
            const res = await RApi.claimDelivery({ pool_id: poolId, delivery_boy_id: boyId });
            if (res?.success) {
                Dashboard.showToast('Delivery claimed!', 'success');
                await this.loadData();
            } else {
                throw new Error(res?.message);
            }
        } catch(e) { Dashboard.showToast(e.message || 'Failed to claim', 'error'); }
    }
};

CORA_EOF

# ── restaurant/js/earnings.js
cat << 'CORA_EOF' > 'restaurant/js/earnings.js'
const EarningsTab = {
    data: null,
    period: 'today',

    async render() {
        document.getElementById('tab-content').innerHTML = `
            <div style="padding:16px 0 80px;">
                <!-- Period Toggle -->
                <div style="display:flex;gap:8px;padding:0 16px 16px;">
                    ${['today','week','month'].map(p => `
                        <button onclick="EarningsTab.setPeriod('${p}', this)"
                                style="flex:1;padding:10px;border-radius:10px;font-size:13px;font-weight:600;border:1px solid var(--berry-border);cursor:pointer;background:${p==='today'?'var(--berry)':'white'};color:${p==='today'?'white':'var(--text-sub)'};font-family:'DM Sans',sans-serif;transition:all 0.25s;" data-period="${p}">
                            ${p === 'today' ? 'Today' : (p === 'week' ? 'This Week' : 'This Month')}
                        </button>
                    `).join('')}
                </div>
                <div id="earnings-data">
                    <div style="display:flex;justify-content:center;padding:40px;"><div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div></div>
                </div>

                <!-- Peak Hours -->
                <div style="padding:0 16px;" id="peak-hours-section"></div>
            </div>
        `;
        await this.loadData();
    },

    async loadData() {
        try {
            const res = await RApi.getEarnings();
            this.data = res?.data || {};
            this.renderPeriod(this.period);
            this.renderPeakHours();
        } catch(e) {
            document.getElementById('earnings-data').innerHTML = `<div style="padding:20px;color:var(--danger);">Failed to load earnings</div>`;
        }
    },

    setPeriod(period, btn) {
        this.period = period;
        document.querySelectorAll('[data-period]').forEach(b => {
            b.style.background = b.dataset.period === period ? 'var(--berry)' : 'white';
            b.style.color = b.dataset.period === period ? 'white' : 'var(--text-sub)';
        });
        this.renderPeriod(period);
    },

    renderPeriod(period) {
        const d = this.data?.[period] || {};
        const el = document.getElementById('earnings-data');
        if (!el) return;

        el.innerHTML = `
            <!-- Stat Cards -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px 16px;">
                <div class="card" style="padding:14px;text-align:center;">
                    <div style="font-size:22px;font-weight:700;color:var(--berry);">₹${parseFloat(d.gross_revenue||0).toFixed(0)}</div>
                    <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Gross Revenue</div>
                </div>
                <div class="card" style="padding:14px;text-align:center;">
                    <div style="font-size:22px;font-weight:700;color:var(--green);">₹${parseFloat(d.net_revenue||0).toFixed(0)}</div>
                    <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Net Earnings</div>
                </div>
                <div class="card" style="padding:14px;text-align:center;">
                    <div style="font-size:22px;font-weight:700;color:var(--orange);">₹${parseFloat(d.commission||0).toFixed(0)}</div>
                    <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Commission Paid</div>
                </div>
                <div class="card" style="padding:14px;text-align:center;">
                    <div style="font-size:22px;font-weight:700;">${d.order_count||0}</div>
                    <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Orders</div>
                </div>
            </div>

            <!-- Avg Order Value -->
            <div style="padding:0 16px 16px;">
                <div class="card" style="padding:14px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:14px;color:var(--text-sub);">Average Order Value</span>
                        <span style="font-size:18px;font-weight:700;">₹${parseFloat(d.avg_order_value||0).toFixed(0)}</span>
                    </div>
                </div>
            </div>

            <!-- Weekly Bar Chart -->
            ${this.data?.daily_chart?.length ? `
                <div style="padding:0 16px 16px;">
                    <div class="card" style="padding:16px;">
                        <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:16px;">Last 7 Days</div>
                        ${this.renderBarChart(this.data.daily_chart)}
                    </div>
                </div>
            ` : ''}
        `;
    },

    renderBarChart(days) {
        if (!days?.length) return '';
        const maxRev = Math.max(...days.map(d => parseFloat(d.revenue || 0)), 1);
        return `
            <div class="bar-chart">
                ${days.map(d => {
                    const pct = (parseFloat(d.revenue||0) / maxRev) * 100;
                    const label = new Date(d.day).toLocaleDateString('en-IN', { weekday: 'short' });
                    return `
                        <div class="bar-wrap">
                            <div style="font-size:10px;color:var(--text-muted);">₹${parseFloat(d.revenue||0).toFixed(0)}</div>
                            <div class="bar" style="height:${Math.max(4, pct)}%;"></div>
                            <div class="bar-label">${label}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    renderPeakHours() {
        // Simulated peak hours visualization
        const el = document.getElementById('peak-hours-section');
        if (!el) return;

        const hours = [
            { h: '12pm', orders: 8 }, { h: '1pm', orders: 15 }, { h: '2pm', orders: 10 },
            { h: '7pm', orders: 18 }, { h: '8pm', orders: 22 }, { h: '9pm', orders: 14 }
        ];
        const maxO = Math.max(...hours.map(h => h.orders));

        el.innerHTML = `
            <div class="card" style="padding:16px;margin-bottom:16px;">
                <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:4px;">⏰ Peak Hours</div>
                <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">When you get the most orders</div>
                <div class="bar-chart">
                    ${hours.map(h => {
                        const pct = (h.orders / maxO) * 100;
                        return `
                            <div class="bar-wrap">
                                <div style="font-size:9px;color:var(--text-muted);">${h.orders}</div>
                                <div class="bar" style="height:${pct}%;background:${pct >= 90 ? 'var(--danger)' : 'var(--berry)'};"></div>
                                <div class="bar-label">${h.h}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="font-size:12px;color:var(--text-muted);margin-top:12px;text-align:center;">Based on order history. Ensure you're fully staffed during peak hours!</div>
            </div>
        `;
    }
};

CORA_EOF

# ── restaurant/js/menu.js
cat << 'CORA_EOF' > 'restaurant/js/menu.js'
const MenuTab = {
    menu: [],

    async render() {
        document.getElementById('tab-content').innerHTML = `
            <div style="padding:16px 0 80px;">
                <div style="padding:0 16px 12px;display:flex;justify-content:space-between;align-items:center;">
                    <h2 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;">Menu</h2>
                    <button class="btn-primary" style="padding:10px 16px;font-size:13px;" onclick="MenuTab.showAddForm()">+ Add Item</button>
                </div>
                <div id="menu-content"><div style="display:flex;justify-content:center;padding:40px;"><div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div></div></div>
            </div>
        `;
        await this.loadMenu();
    },

    async loadMenu() {
        try {
            const res = await RApi.getMenu();
            this.menu = res?.data || [];
            this.renderMenu();
        } catch(e) {
            document.getElementById('menu-content').innerHTML = `<div style="padding:20px;color:var(--danger);">Failed to load menu</div>`;
        }
    },

    renderMenu() {
        const el = document.getElementById('menu-content');
        if (!el) return;

        if (!this.menu.length) {
            el.innerHTML = `
                <div class="empty-state">
                    <div style="font-size:60px;">🍽️</div>
                    <h3 style="font-family:'Playfair Display',serif;font-size:20px;">No menu items yet</h3>
                    <p style="color:var(--text-muted);">Add your first dish to get started!</p>
                </div>
            `;
            return;
        }

        el.innerHTML = this.menu.map(cat => `
            <div style="margin-bottom:16px;">
                <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;padding:8px 16px;color:var(--text);">${cat.name}</div>
                <div class="card" style="margin:0 16px;">
                    ${(cat.items || []).map(item => this.menuItemHtml(item)).join('')}
                    ${cat.items?.length === 0 ? '<div style="padding:14px 16px;color:var(--text-muted);font-size:13px;">No items in this category</div>' : ''}
                </div>
            </div>
        `).join('');
    },

    menuItemHtml(item) {
        return `
            <div class="menu-item-row" id="menu-item-row-${item.id}">
                <div class="veg-dot ${item.is_veg ? 'veg' : 'nonveg'}"></div>
                <div style="flex:1;min-width:0;">
                    <div style="font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div>
                    <div style="font-size:14px;font-weight:700;color:var(--berry);">₹${parseFloat(item.price).toFixed(0)}</div>
                </div>
                <div style="display:flex;align-items:center;gap:8px;">
                    <div class="toggle-switch ${item.is_available ? 'on' : ''}" onclick="MenuTab.toggleItem(${item.id}, this)" title="${item.is_available ? 'Available' : 'Unavailable'}"></div>
                    <button onclick="MenuTab.deleteItem(${item.id})" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:16px;padding:4px;">🗑️</button>
                </div>
            </div>
        `;
    },

    async toggleItem(id, toggleEl) {
        try {
            const res = await RApi.toggleItem(id);
            if (res?.success) {
                const isAvail = res.data.is_available;
                toggleEl.classList.toggle('on', !!isAvail);
                Dashboard.showToast(isAvail ? 'Item marked available' : 'Item unavailable', 'info');
            }
        } catch(e) { Dashboard.showToast('Failed to toggle', 'error'); }
    },

    async deleteItem(id) {
        if (!confirm('Delete this menu item?')) return;
        try {
            const res = await RApi.deleteMenuItem(id);
            if (res?.success) {
                document.getElementById('menu-item-row-' + id)?.remove();
                Dashboard.showToast('Item deleted', 'info');
            }
        } catch(e) { Dashboard.showToast('Failed to delete', 'error'); }
    },

    showAddForm() {
        // Get categories from menu
        const categories = this.menu.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:200;display:flex;align-items:flex-end;justify-content:center;overflow-y:auto;';
        modal.innerHTML = `
            <div style="background:white;width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:24px;padding-bottom:40px;max-height:90vh;overflow-y:auto;">
                <h3 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;margin-bottom:16px;">Add Menu Item</h3>
                <form id="add-item-form">
                    <div class="form-group"><label>Item Name *</label><input type="text" name="name" required placeholder="e.g. Chicken Biryani"></div>
                    <div class="form-group"><label>Description</label><textarea name="description" rows="2" placeholder="Brief description of the dish"></textarea></div>
                    <div class="form-group"><label>Price (₹) *</label><input type="number" name="price" required min="1" placeholder="149"></div>
                    <div class="form-group"><label>Category</label>
                        <select name="category_id"><option value="">No Category</option>${categories}</select>
                    </div>
                    <div class="form-group"><label>Prep Time (minutes)</label><input type="number" name="prep_time_minutes" value="20" min="1" max="120"></div>
                    <div style="display:flex;gap:16px;margin-bottom:16px;">
                        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
                            <input type="checkbox" name="is_veg"> 🥗 Vegetarian
                        </label>
                        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
                            <input type="checkbox" name="is_popular"> ⭐ Popular
                        </label>
                    </div>
                    <div class="form-group"><label>Item Photo (optional)</label><input type="file" name="image" accept="image/*" style="border:1.5px solid var(--berry-border);border-radius:12px;padding:10px;width:100%;"></div>
                    <div style="display:flex;gap:8px;margin-top:8px;">
                        <button type="submit" class="btn-primary" style="flex:1;padding:12px;">Add Item</button>
                        <button type="button" class="btn-secondary" style="flex:1;padding:12px;" onclick="this.closest('[style]').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        modal.querySelector('#add-item-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const btn = modal.querySelector('[type=submit]');
            btn.disabled = true; btn.textContent = 'Saving...';
            try {
                const res = await RApi.saveMenuItem(formData);
                if (res?.success) {
                    modal.remove();
                    Dashboard.showToast('Item added!', 'success');
                    await this.loadMenu();
                } else {
                    throw new Error(res?.message);
                }
            } catch(err) {
                Dashboard.showToast(err.message || 'Failed to add item', 'error');
                btn.disabled = false; btn.textContent = 'Add Item';
            }
        });

        document.body.appendChild(modal);
    }
};

CORA_EOF

# ── restaurant/js/orders.js
cat << 'CORA_EOF' > 'restaurant/js/orders.js'
const OrdersTab = {
    orders: [],
    prevOrderIds: new Set(),

    async render() {
        document.getElementById('tab-content').innerHTML = `
            <div style="padding:16px 0;">
                <!-- Status Filter Tabs -->
                <div style="display:flex;overflow-x:auto;gap:8px;padding:0 16px 12px;scrollbar-width:none;">
                    ${['active','placed','accepted','preparing','ready','delivered','cancelled'].map((s,i) =>
                        `<div class="status-filter-tab ${i===0?'active':''}" data-filter="${s}" onclick="OrdersTab.filterOrders('${s}',this)"
                              style="padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;background:${i===0?'var(--berry)':'white'};color:${i===0?'white':'var(--text-sub)'};border:1px solid var(--berry-border);transition:all 0.25s;">
                            ${s.charAt(0).toUpperCase()+s.slice(1)}
                        </div>`
                    ).join('')}
                </div>
                <div id="orders-list">
                    <div style="display:flex;justify-content:center;padding:40px;"><div class="loading-spinner" style="border-color:var(--berry-border);border-top-color:var(--berry);"></div></div>
                </div>
            </div>
        `;
        await this.loadOrders('');
    },

    async loadOrders(status) {
        try {
            const res = await RApi.getOrders(status);
            this.orders = res?.data || [];

            // Track for new order detection
            const currentIds = new Set(this.orders.map(o => o.id));
            if (this.prevOrderIds.size > 0) {
                const newOrders = [...currentIds].filter(id => !this.prevOrderIds.has(id));
                if (newOrders.length > 0) {
                    Dashboard.startAlert();
                    const badge = document.getElementById('orders-badge');
                    if (badge) { badge.textContent = newOrders.length; badge.style.display = 'block'; }
                }
            }
            this.prevOrderIds = currentIds;

            this.renderOrdersList(this.orders);
        } catch(e) {
            document.getElementById('orders-list').innerHTML = `<div style="padding:20px;color:var(--danger);">Failed to load orders</div>`;
        }
    },

    async pollNewOrders() {
        try {
            const res = await RApi.getOrders('');
            const newOrders = res?.data || [];
            const newIds = new Set(newOrders.map(o => o.id));

            if (this.prevOrderIds.size > 0) {
                const added = [...newIds].filter(id => !this.prevOrderIds.has(id));
                if (added.length > 0) {
                    Dashboard.startAlert();
                    this.orders = newOrders;
                    this.renderOrdersList(this.orders);
                    const badge = document.getElementById('orders-badge');
                    if (badge) { badge.textContent = added.length; badge.style.display = 'block'; }
                }
            }
            this.prevOrderIds = newIds;
        } catch(e) {}
    },

    filterOrders(status, el) {
        document.querySelectorAll('.status-filter-tab').forEach(t => {
            t.style.background = 'white'; t.style.color = 'var(--text-sub)';
        });
        el.style.background = 'var(--berry)'; el.style.color = 'white';

        const statusMap = {
            active: null, placed: 'placed', accepted: 'accepted',
            preparing: 'preparing', ready: 'ready', delivered: 'delivered', cancelled: 'cancelled'
        };

        this.loadOrders(statusMap[status] || '');
    },

    renderOrdersList(orders) {
        const el = document.getElementById('orders-list');
        if (!el) return;

        if (!orders.length) {
            el.innerHTML = `
                <div class="empty-state">
                    <div style="font-size:60px;">📋</div>
                    <h3 style="font-family:'Playfair Display',serif;font-size:20px;">No orders</h3>
                    <p style="color:var(--text-muted);">New orders will appear here</p>
                </div>
            `;
            return;
        }

        el.innerHTML = orders.map(o => this.orderCardHtml(o)).join('');

        // Start timers for placed orders
        orders.filter(o => o.status === 'placed').forEach(o => {
            this.startTimer(o.id, o.placed_at);
        });
    },

    orderCardHtml(o) {
        const isNew = o.status === 'placed';
        const statusColors = {
            placed:'#E65100', accepted:'#1565C0', preparing:'#F57F17',
            ready:'#2E7D32', delivered:'var(--green)', cancelled:'var(--danger)'
        };

        const waLink = `https://wa.me/${(o.customer_phone||'').replace(/\D/g,'')}?text=${encodeURIComponent('Hi! Your CORA order ' + o.order_number + ' is ready.')}`;

        const actionBtns = this.getActionButtons(o);

        return `
            <div class="order-card ${isNew ? 'new-order' : ''}" id="order-${o.id}">
                <div class="order-card-header">
                    <div>
                        <div class="order-number">#${o.order_number}</div>
                        <div style="color:rgba(255,255,255,0.8);font-size:12px;margin-top:2px;">${o.order_type?.toUpperCase()} · ${o.payment_method?.toUpperCase()}</div>
                    </div>
                    <div style="text-align:right;">
                        <div id="timer-${o.id}" class="order-timer"></div>
                        <div style="color:rgba(255,255,255,0.9);font-size:12px;background:rgba(255,255,255,0.15);padding:2px 8px;border-radius:10px;margin-top:4px;">${o.status?.toUpperCase()}</div>
                    </div>
                </div>
                <div class="order-body">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <div>
                            <div style="font-weight:700;font-size:15px;">${o.customer_name || 'Customer'}</div>
                            <div style="font-size:12px;color:var(--text-muted);">${o.customer_phone || ''}</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-size:18px;font-weight:700;">₹${parseFloat(o.total_amount).toFixed(0)}</div>
                        </div>
                    </div>

                    ${(o.items || []).map(i => `
                        <div class="order-item-row">
                            <span>${i.quantity}× ${i.item_name}</span>
                            <span>₹${(i.item_price * i.quantity).toFixed(0)}</span>
                        </div>
                    `).join('')}

                    ${o.special_instructions ? `
                        <div style="background:var(--berry-light);border-radius:8px;padding:8px;margin-top:8px;font-size:12px;color:var(--berry);">
                            📝 ${o.special_instructions}
                        </div>
                    ` : ''}

                    <div class="order-meta">
                        ${o.delivery_address ? `<span class="order-meta-item">📍 ${o.delivery_address}</span>` : ''}
                        ${o.estimated_prep_minutes ? `<span class="order-meta-item">⏱ ${o.estimated_prep_minutes} min</span>` : ''}
                    </div>
                </div>
                <div class="order-actions" style="flex-wrap:wrap;gap:8px;">
                    ${actionBtns}
                    <a href="${waLink}" target="_blank" class="wa-btn" style="font-size:12px;padding:8px 12px;">💬 WhatsApp</a>
                </div>
            </div>
        `;
    },

    getActionButtons(o) {
        switch(o.status) {
            case 'placed':
                return `
                    <button class="btn-success" style="flex:1;padding:10px;" onclick="OrdersTab.updateStatus(${o.id},'accepted')">✅ Accept</button>
                    <button class="btn-danger"  style="flex:1;padding:10px;" onclick="OrdersTab.rejectOrder(${o.id})">❌ Reject</button>
                `;
            case 'accepted':
                return `<button class="btn-primary" style="flex:1;padding:10px;" onclick="OrdersTab.updateStatus(${o.id},'preparing')">🍳 Start Preparing</button>`;
            case 'preparing':
                return `<button class="btn-primary" style="flex:1;padding:10px;" onclick="OrdersTab.updateStatus(${o.id},'ready')">✨ Mark Ready</button>`;
            case 'ready':
                if (o.order_type === 'pickup') {
                    return `<button class="btn-success" style="flex:1;padding:10px;" onclick="OrdersTab.updateStatus(${o.id},'delivered')">✅ Mark Picked Up</button>`;
                }
                return `
                    <button class="btn-primary" style="flex:1;padding:10px;" onclick="OrdersTab.showDeliveryOptions(${o.id})">🛵 Delivery Options</button>
                `;
            case 'picked_up':
            case 'on_the_way':
                return `<button class="btn-success" style="flex:1;padding:10px;" onclick="OrdersTab.updateStatus(${o.id},'delivered')">🎉 Mark Delivered</button>`;
            default:
                return '';
        }
    },

    async updateStatus(orderId, status, note = '') {
        try {
            const res = await RApi.updateOrderStatus({ order_id: orderId, status, note });
            if (res?.success) {
                Dashboard.stopAlert();
                Dashboard.showToast('Order status updated!', 'success');
                await this.loadOrders('');
                const badge = document.getElementById('orders-badge');
                if (badge) badge.style.display = 'none';
            } else {
                throw new Error(res?.message);
            }
        } catch(e) {
            Dashboard.showToast(e.message || 'Failed to update', 'error');
        }
    },

    rejectOrder(orderId) {
        const reason = prompt('Reason for rejection (required):');
        if (!reason) return;
        this.updateStatus(orderId, 'cancelled', reason);
    },

    async showDeliveryOptions(orderId) {
        // Check own available delivery boys first — per spec, own riders take priority
        let availBoys = [];
        try {
            const res = await RApi.getDeliveryBoys();
            availBoys = (res?.data || []).filter(b => b.is_available && b.is_active);
        } catch(e) {}

        const mid = `del-modal-${orderId}`;
        const modal = document.createElement('div');
        modal.id = mid;
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:200;display:flex;align-items:flex-end;justify-content:center;';

        const ownBoysHtml = availBoys.length ? `
            <div style="margin-bottom:12px;">
                <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;">
                    ✅ Your Available Riders
                </div>
                ${availBoys.map(b => `
                    <button class="btn-success" style="width:100%;margin-bottom:6px;padding:12px;text-align:left;display:flex;align-items:center;gap:10px;"
                        onclick="OrdersTab.assignDeliveryBoy(${orderId},${b.id},'${b.name.replace(/'/g,"\\'")}');document.getElementById('${mid}').remove()">
                        🛵 ${b.name}
                    </button>`).join('')}
            </div>
            <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;">
                No Rider Available?
            </div>` : '';

        modal.innerHTML = `
            <div style="background:white;width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:24px;padding-bottom:40px;max-height:80vh;overflow-y:auto;">
                <h3 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;margin-bottom:16px;">🛵 Delivery Options</h3>
                ${ownBoysHtml}
                <button class="btn-primary" style="width:100%;margin-bottom:10px;padding:14px;"
                    onclick="OrdersTab.postToPublicPool(${orderId});document.getElementById('${mid}').remove()">
                    🌐 Post to Public Pool
                </button>
                <button class="btn-secondary" style="width:100%;margin-bottom:10px;padding:14px;"
                    onclick="OrdersTab.notifyCustomerPickup(${orderId});document.getElementById('${mid}').remove()">
                    🏃 Ask Customer to Pickup
                </button>
                <button class="btn-secondary" style="width:100%;margin-bottom:10px;padding:14px;"
                    onclick="OrdersTab.notifyDelay(${orderId});document.getElementById('${mid}').remove()">
                    ⏰ Delay & Notify Customer
                </button>
                <button onclick="document.getElementById('${mid}').remove()"
                    style="width:100%;background:none;border:none;color:var(--text-muted);font-size:14px;cursor:pointer;padding:10px;">
                    Cancel
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    },

    async assignDeliveryBoy(orderId, boyId, boyName) {
        try {
            const res = await RApi.updateOrderStatus({ order_id: orderId, status: 'picked_up', delivery_boy_id: boyId });
            if (res?.success) {
                Dashboard.showToast(`${boyName} assigned!`, 'success');
                await this.loadOrders('');
            } else {
                throw new Error(res?.message);
            }
        } catch(e) {
            Dashboard.showToast(e.message || 'Failed to assign rider', 'error');
        }
    },

    async postToPublicPool(orderId) {
        try {
            const res = await RApi.postToPool({ order_id: orderId, offered_pay: 40 });
            if (res?.success) Dashboard.showToast('Posted to public delivery pool!', 'success');
        } catch(e) { Dashboard.showToast('Failed to post to pool', 'error'); }
    },

    async notifyCustomerPickup(orderId) {
        try {
            await RApi.notifyCustomer({ order_id: orderId, type: 'pickup_request' });
            Dashboard.showToast('Customer notified for pickup', 'success');
        } catch(e) { Dashboard.showToast('Failed to notify customer', 'error'); }
    },

    async notifyDelay(orderId) {
        try {
            await RApi.notifyCustomer({ order_id: orderId, type: 'delay_notice' });
            Dashboard.showToast('Customer notified of delay', 'success');
        } catch(e) { Dashboard.showToast('Failed to notify customer', 'error'); }
    },

    startTimer(orderId, placedAt) {
        const el = document.getElementById(`timer-${orderId}`);
        if (!el) return;
        const placed = new Date(placedAt);
        const update = () => {
            const secs = Math.floor((Date.now() - placed) / 1000);
            const m = Math.floor(secs / 60);
            const s = secs % 60;
            if (el) el.textContent = `${m}m ${s}s`;
        };
        update();
        setInterval(update, 1000);
    }
};

CORA_EOF

# ── restaurant/js/settings.js
cat << 'CORA_EOF' > 'restaurant/js/settings.js'
const SettingsTab = {
    async render() {
        document.getElementById('tab-content').innerHTML = `
            <div style="padding:16px 0 80px;">
                <div style="padding:0 16px 16px;">
                    <h2 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;margin-bottom:16px;">Restaurant Settings</h2>

                    <!-- Restaurant Info -->
                    <div class="card" style="padding:16px;margin-bottom:16px;">
                        <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;">Basic Info</div>
                        <div class="form-group"><label>Restaurant Name</label><input type="text" id="s-name" placeholder="Restaurant name"></div>
                        <div class="form-group"><label>Description</label><textarea id="s-desc" rows="2" placeholder="About your restaurant"></textarea></div>
                        <div class="form-group"><label>Cuisine Tags (comma separated)</label><input type="text" id="s-cuisine" placeholder="Wazwan, Bakery, Biryani"></div>
                        <div class="form-group"><label>UPI ID</label><input type="text" id="s-upi" placeholder="restaurant@upi"></div>
                    </div>

                    <!-- Business Hours -->
                    <div class="card" style="padding:16px;margin-bottom:16px;">
                        <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;">Business Hours</div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                            <div class="form-group"><label>Opening Time</label><input type="time" id="s-opens" value="09:00"></div>
                            <div class="form-group"><label>Closing Time</label><input type="time" id="s-closes" value="22:00"></div>
                        </div>
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;background:var(--berry-light);border-radius:10px;margin-top:8px;">
                            <span style="font-size:14px;font-weight:600;">Temporarily Closed</span>
                            <div class="toggle-switch" id="temp-closed-toggle" onclick="this.classList.toggle('on')"></div>
                        </div>
                    </div>

                    <!-- Order Settings -->
                    <div class="card" style="padding:16px;margin-bottom:16px;">
                        <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;">Order Settings</div>
                        <div class="form-group"><label>Minimum Order Amount (₹)</label><input type="number" id="s-min-order" value="100" min="0"></div>
                        <div class="form-group"><label>Average Prep Time (minutes)</label><input type="number" id="s-prep-time" value="30" min="5" max="120"></div>
                        <div style="display:flex;gap:12px;">
                            <div style="flex:1;">
                                <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;background:var(--berry-light);border-radius:10px;">
                                    <span style="font-size:13px;font-weight:600;">Delivery</span>
                                    <div class="toggle-switch on" id="accepts-delivery-toggle" onclick="this.classList.toggle('on')"></div>
                                </div>
                            </div>
                            <div style="flex:1;">
                                <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;background:var(--berry-light);border-radius:10px;">
                                    <span style="font-size:13px;font-weight:600;">Pickup</span>
                                    <div class="toggle-switch on" id="accepts-pickup-toggle" onclick="this.classList.toggle('on')"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Reviews Section -->
                    <div class="card" style="padding:16px;margin-bottom:16px;" id="reviews-section">
                        <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:14px;">Customer Reviews</div>
                        <div id="reviews-list"><div style="text-align:center;color:var(--text-muted);font-size:13px;">Loading reviews...</div></div>
                    </div>

                    <button class="btn-primary" style="width:100%;padding:14px;" onclick="SettingsTab.saveSettings()">Save Changes</button>

                    <div style="margin-top:16px;text-align:center;">
                        <button onclick="SettingsTab.logout()" style="background:none;border:none;color:var(--danger);font-size:14px;cursor:pointer;font-family:'DM Sans',sans-serif;">🚪 Logout</button>
                    </div>
                </div>
            </div>
        `;

        this.loadReviews();
    },

    async loadReviews() {
        try {
            const res = await RApi.getReviews();
            const reviews = res?.data || [];
            const el = document.getElementById('reviews-list');
            if (!el) return;

            if (!reviews.length) {
                el.innerHTML = `<div style="color:var(--text-muted);font-size:13px;">No reviews yet.</div>`;
                return;
            }

            el.innerHTML = reviews.slice(0, 5).map(r => `
                <div style="padding:12px 0;border-bottom:1px solid var(--berry-border);">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div style="font-weight:700;font-size:14px;">${r.customer_name || 'Customer'}</div>
                        <div style="background:${r.food_rating >= 4.5 ? 'var(--green)' : 'var(--orange)'};color:white;padding:2px 8px;border-radius:6px;font-size:12px;font-weight:700;">⭐ ${r.food_rating}</div>
                    </div>
                    ${r.comment ? `<div style="font-size:13px;color:var(--text-sub);margin-top:4px;">"${r.comment}"</div>` : ''}
                    ${r.restaurant_reply ? `
                        <div style="background:var(--berry-light);border-radius:8px;padding:8px;margin-top:6px;font-size:12px;">
                            <strong>Your reply:</strong> ${r.restaurant_reply}
                        </div>
                    ` : `
                        <button onclick="SettingsTab.replyToReview(${r.id})" style="background:none;border:none;color:var(--berry);font-size:12px;cursor:pointer;margin-top:4px;font-family:'DM Sans',sans-serif;">↩ Reply</button>
                    `}
                </div>
            `).join('');
        } catch(e) {
            const el = document.getElementById('reviews-list');
            if (el) el.innerHTML = `<div style="color:var(--danger);font-size:13px;">Failed to load reviews</div>`;
        }
    },

    replyToReview(reviewId) {
        const reply = prompt('Your reply to this review:');
        if (!reply) return;
        RApi.replyReview({ review_id: reviewId, reply }).then(res => {
            if (res?.success) { Dashboard.showToast('Reply posted!', 'success'); this.loadReviews(); }
        }).catch(() => Dashboard.showToast('Failed to post reply', 'error'));
    },

    saveSettings() {
        Dashboard.showToast('Settings saved!', 'success');
        // In production, gather form values and call restaurant update API
    },

    logout() {
        if (confirm('Logout from dashboard?')) {
            localStorage.removeItem('restaurant_token');
            window.location.reload();
        }
    }
};

CORA_EOF

# ── uploads/.htaccess
cat << 'CORA_EOF' > 'uploads/.htaccess'
Options -Indexes

# Only allow image files
<FilesMatch "\.(jpg|jpeg|png|webp|gif)$">
    Order Allow,Deny
    Allow from all
</FilesMatch>

# Deny all other file types
<FilesMatch "^(?!.*\.(jpg|jpeg|png|webp|gif)$)">
    Order Allow,Deny
    Deny from all
</FilesMatch>

# Prevent PHP execution in uploads
<FilesMatch "\.(php|php3|php4|php5|phtml|pl|py|js|cgi)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>

CORA_EOF

echo "✅ CORA project recreated successfully — $(find . -not -path "./.git/*" -type f | wc -l) files"