<?php
// Set headers first
$allowed_origins = [
    'http://localhost:5174',
    'https://tskyapp.netlify.app',
    'https://tsky.kesug.com',
    'http://localhost:4173'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: *");
}

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Only allow POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('{"error":"Method not allowed"}');
}

try {
    // Database connection
    $pdo = new PDO("mysql:host=localhost;dbname=bigman_pc", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Log input for debugging
    error_log('Sold-out API received: ' . print_r($input, true));
    
    // Validate input
    if (!$input) {
        http_response_code(400);
        die('{"error":"Invalid JSON input"}');
    }
    
    // Check for both 'id' and 'product_id' to be flexible
    $productId = null;
    if (isset($input['id'])) {
        $productId = intval($input['id']);
    } elseif (isset($input['product_id'])) {
        $productId = intval($input['product_id']);
    }
    
    if (!$productId || !isset($input['sold_out'])) {
        http_response_code(400);
        die('{"error":"Missing required fields: product_id/id and sold_out","received":' . json_encode($input) . '}');
    }
    
    $soldOut = $input['sold_out'] ? 1 : 0;
    
    // Check if sold_out column exists
    try {
        $columnCheck = $pdo->query("SHOW COLUMNS FROM products LIKE 'sold_out'");
        if ($columnCheck->rowCount() === 0) {
            http_response_code(500);
            die('{"error":"The sold_out column does not exist. Please run: ALTER TABLE products ADD COLUMN sold_out TINYINT(1) DEFAULT 0 AFTER tag;"}');
        }
    } catch (PDOException $e) {
        http_response_code(500);
        die('{"error":"Database error checking column: ' . $e->getMessage() . '"}');
    }
    
    // Check if product exists
    $checkStmt = $pdo->prepare("SELECT id FROM products WHERE id = ?");
    $checkStmt->execute([$productId]);
    
    if (!$checkStmt->fetch()) {
        http_response_code(404);
        die('{"error":"Product not found","product_id":' . $productId . '}');
    }
    
    // Update sold out status
    $stmt = $pdo->prepare("UPDATE products SET sold_out = ? WHERE id = ?");
    $result = $stmt->execute([$soldOut, $productId]);
    
    if ($result) {
        die('{"success":true,"message":"Product status updated successfully","sold_out":' . $soldOut . ',"product_id":' . $productId . '}');
    } else {
        http_response_code(500);
        die('{"error":"Failed to update product status"}');
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    die('{"error":"Database error: ' . $e->getMessage() . '"}');
} catch (Exception $e) {
    http_response_code(500);
    die('{"error":"Server error: ' . $e->getMessage() . '"}');
}
?>
