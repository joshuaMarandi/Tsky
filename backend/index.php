<?php
// Backend API Index
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://tskyapp.netlify.app');
header('Access-Control-Allow-Origin: http://localhost:5174');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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
