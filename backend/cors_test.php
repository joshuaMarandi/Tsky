<?php
// CORS Test Endpoint
// This file helps test CORS configuration

// Set comprehensive CORS headers
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
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Return CORS test information
$response = [
    'status' => 'success',
    'message' => 'CORS test successful',
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [
        'server_name' => $_SERVER['SERVER_NAME'] ?? 'unknown',
        'http_host' => $_SERVER['HTTP_HOST'] ?? 'unknown',
        'remote_addr' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown',
        'http_origin' => $_SERVER['HTTP_ORIGIN'] ?? 'none',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ],
    'cors_headers' => [
        'access_control_allow_origin' => $origin ?: '*',
        'access_control_allow_methods' => 'GET, POST, PUT, DELETE, OPTIONS',
        'access_control_allow_headers' => 'Content-Type, Authorization',
        'access_control_allow_credentials' => 'true'
    ],
    'environment' => [
        'is_localhost' => (strpos($_SERVER['SERVER_NAME'] ?? '', 'localhost') !== false ||
                          strpos($_SERVER['HTTP_HOST'] ?? '', 'localhost') !== false ||
                          strpos($_SERVER['SERVER_NAME'] ?? '', '127.0.0.1') !== false ||
                          strpos($_SERVER['HTTP_HOST'] ?? '', '127.0.0.1') !== false ||
                          ($_SERVER['SERVER_NAME'] ?? '') === '::1') ? 'yes' : 'no',
        'php_version' => phpversion(),
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown'
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>
