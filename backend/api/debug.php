<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

echo json_encode([
    "status" => "API Debug Info",
    "php_version" => phpversion(),
    "server_method" => $_SERVER['REQUEST_METHOD'],
    "headers" => getallheaders(),
    "get_data" => $_GET,
    "post_data" => $_POST,
    "raw_input" => file_get_contents("php://input"),
    "server_info" => [
        "document_root" => $_SERVER['DOCUMENT_ROOT'],
        "script_name" => $_SERVER['SCRIPT_NAME'],
        "request_uri" => $_SERVER['REQUEST_URI']
    ],
    "database_test" => test_database_connection()
]);

function test_database_connection() {
    try {
        include_once '../config/database.php';
        $database = new Database();
        $db = $database->getConnection();
        
        if ($db) {
            return "Database connection successful";
        } else {
            return "Database connection failed";
        }
    } catch (Exception $e) {
        return "Database error: " . $e->getMessage();
    }
}
?>
