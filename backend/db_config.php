<?php
// Auto-detect environment and configure database accordingly
$server_name = $_SERVER['SERVER_NAME'] ?? 'localhost';
$http_host = $_SERVER['HTTP_HOST'] ?? 'localhost';

// Check if we're on localhost (development) or hosted (production)
$is_localhost = (
    strpos($server_name, 'localhost') !== false ||
    strpos($http_host, 'localhost') !== false ||
    strpos($server_name, '127.0.0.1') !== false ||
    strpos($http_host, '127.0.0.1') !== false ||
    $server_name === '::1'
);

if ($is_localhost) {
    // Local development database
    $servername = "localhost";
    $username = "root";
    $password = "";  // Default XAMPP MySQL password is empty
    $dbname = "Tsky";
} else {
    // Production/Hosted database (InfinityFree)
    $servername = "sql313.infinityfree.com";
    $username = "if0_39779787";
    $password = "TvNOFPsbii43km";  // InfinityFree database password
    $dbname = "if0_39779787_tsky";
}

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // Don't die here, let the calling script handle the error
    error_log("Database connection failed: " . $conn->connect_error);
}

// Set charset to utf8
$conn->set_charset("utf8");
?>
