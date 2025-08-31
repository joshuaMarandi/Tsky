<?php
// Database configuration
$servername = "localhost";
$username = "root";
$password = "";  // Default XAMPP MySQL password is empty
$dbname = "bigman_pc";

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
