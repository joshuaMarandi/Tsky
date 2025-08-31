<?php
// Error handler for backend
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://tskyapp.netlify.app');
header('Access-Control-Allow-Origin: http://localhost:5174');

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
