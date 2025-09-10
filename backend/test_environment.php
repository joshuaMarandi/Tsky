<?php
// Environment Detection Test Script
// This script demonstrates the auto-database detection capability

echo "<h1>Environment Detection Test</h1>";
echo "<h2>Server Information:</h2>";
echo "<ul>";
echo "<li><strong>SERVER_NAME:</strong> " . ($_SERVER['SERVER_NAME'] ?? 'Not set') . "</li>";
echo "<li><strong>HTTP_HOST:</strong> " . ($_SERVER['HTTP_HOST'] ?? 'Not set') . "</li>";
echo "<li><strong>REMOTE_ADDR:</strong> " . ($_SERVER['REMOTE_ADDR'] ?? 'Not set') . "</li>";
echo "</ul>";

// Detect environment
$server_name = $_SERVER['SERVER_NAME'] ?? 'localhost';
$http_host = $_SERVER['HTTP_HOST'] ?? 'localhost';

$is_localhost = (
    strpos($server_name, 'localhost') !== false ||
    strpos($http_host, 'localhost') !== false ||
    strpos($server_name, '127.0.0.1') !== false ||
    strpos($http_host, '127.0.0.1') !== false ||
    $server_name === '::1'
);

echo "<h2>Environment Detection:</h2>";
if ($is_localhost) {
    echo "<p style='color: green; font-weight: bold;'>✅ DETECTED: Localhost Environment</p>";
    echo "<p><strong>Database:</strong> Local MySQL (localhost/Tsky)</p>";
    echo "<p><strong>Username:</strong> root</p>";
    echo "<p><strong>Password:</strong> (empty)</p>";
} else {
    echo "<p style='color: blue; font-weight: bold;'>🌐 DETECTED: Hosted Environment</p>";
    echo "<p><strong>Database:</strong> InfinityFree (sql313.infinityfree.com/if0_39779787_tsky)</p>";
    echo "<p><strong>Username:</strong> if0_39779787</p>";
    echo "<p><strong>Password:</strong> [HIDDEN]</p>";
}

// Test database connection
echo "<h2>Database Connection Test:</h2>";
try {
    if ($is_localhost) {
        $pdo = new PDO("mysql:host=localhost;dbname=Tsky", "root", "");
    } else {
        $pdo = new PDO("mysql:host=sql313.infinityfree.com;dbname=if0_39779787_tsky", "if0_39779787", "TvNOFPsbii43km");
    }

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Test query
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM products");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo "<p style='color: green; font-weight: bold;'>✅ Database Connection: SUCCESS</p>";
    echo "<p><strong>Products in database:</strong> " . $result['count'] . "</p>";

} catch (PDOException $e) {
    echo "<p style='color: red; font-weight: bold;'>❌ Database Connection: FAILED</p>";
    echo "<p><strong>Error:</strong> " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<p><strong>Auto-Detection Logic:</strong> The system automatically detects localhost vs hosted environment and uses the appropriate database configuration.</p>";
?>
