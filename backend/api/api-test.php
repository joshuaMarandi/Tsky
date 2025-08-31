<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Simple test endpoint
echo json_encode([
    'status' => 'API is working',
    'timestamp' => date('Y-m-d H:i:s'),
    'method' => $_SERVER['REQUEST_METHOD']
]);
?>
