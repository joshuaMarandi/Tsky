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
header('Access-Control-Allow-Credentials: true');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

$error_code = http_response_code();
$error_message = 'An error occurred';

switch ($error_code) {
    case 403:
        $error_message = 'Access Forbidden - Please check your request';
        break;
    case 404:
        $error_message = 'API endpoint not found';
        break;
    case 500:
        $error_message = 'Internal server error';
        break;
}

$response = [
    'error' => true,
    'code' => $error_code,
    'message' => $error_message,
    'timestamp' => date('Y-m-d H:i:s'),
    'available_endpoints' => [
        'GET /api/products.php' => 'Get all products',
        'GET /api/sales.php' => 'Get all sales',
        'POST /api/sold-out.php' => 'Update product sold out status',
        'GET /init_database.php' => 'Initialize database'
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>
