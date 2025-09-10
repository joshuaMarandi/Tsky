<?php
// Set CORS headers for multiple origins
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
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
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$api_info = [
    'status' => 'success',
    'message' => 'Tsky Backend API Server',
    'version' => '1.0.0',
    'endpoints' => [
        'products' => '/api/products.php',
        'sales' => '/api/sales.php',
        'sold_out' => '/api/sold-out.php',
        'init_db' => '/init_database.php'
    ],
    'documentation' => 'API endpoints are working correctly',
    'timestamp' => date('Y-m-d H:i:s')
];

echo json_encode($api_info, JSON_PRETTY_PRINT);
?>
