<?php
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");

// Simple test endpoint
echo json_encode([
    "status" => "success",
    "message" => "BIGMAN PC API is working!",
    "timestamp" => date('Y-m-d H:i:s'),
    "endpoints" => [
        "products" => "api/products.php",
        "admin" => "admin/index.html",
        "test" => "api/test.php"
    ]
]);
?>
