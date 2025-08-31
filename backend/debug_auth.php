<?php
// Debug authentication
require_once 'db_config.php';

$username = 'admin';
$password = 'admin123';

echo "=== Authentication Debug ===" . PHP_EOL;
echo "Username: $username" . PHP_EOL;
echo "Password: $password" . PHP_EOL . PHP_EOL;

try {
    // Step 1: Check if user exists
    echo "Step 1: Checking if user exists..." . PHP_EOL;
    $stmt = $conn->prepare("SELECT id, username, password, email, full_name, is_active FROM admin_users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    echo "Query executed. Rows found: " . $result->num_rows . PHP_EOL;
    
    if ($result->num_rows === 0) {
        echo "❌ User not found!" . PHP_EOL;
        exit;
    }
    
    $user = $result->fetch_assoc();
    echo "✅ User found:" . PHP_EOL;
    echo "  ID: " . $user['id'] . PHP_EOL;
    echo "  Username: " . $user['username'] . PHP_EOL;
    echo "  Email: " . $user['email'] . PHP_EOL;
    echo "  Is Active: " . ($user['is_active'] ? 'Yes' : 'No') . PHP_EOL;
    echo "  Stored Hash: " . substr($user['password'], 0, 20) . "..." . PHP_EOL . PHP_EOL;
    
    // Step 2: Check if user is active
    echo "Step 2: Checking if user is active..." . PHP_EOL;
    if (!$user['is_active']) {
        echo "❌ User is not active!" . PHP_EOL;
        exit;
    }
    echo "✅ User is active" . PHP_EOL . PHP_EOL;
    
    // Step 3: Verify password
    echo "Step 3: Verifying password..." . PHP_EOL;
    echo "Input password: $password" . PHP_EOL;
    echo "Stored hash: " . $user['password'] . PHP_EOL;
    
    if (password_verify($password, $user['password'])) {
        echo "✅ Password verification successful!" . PHP_EOL;
        
        // Generate token
        $token = base64_encode(json_encode([
            'user_id' => $user['id'],
            'username' => $user['username'],
            'exp' => time() + (24 * 60 * 60)
        ]));
        
        echo "✅ Generated token: " . substr($token, 0, 50) . "..." . PHP_EOL;
        echo "✅ Authentication would be successful!" . PHP_EOL;
        
    } else {
        echo "❌ Password verification failed!" . PHP_EOL;
        
        // Test with a fresh hash
        $newHash = password_hash($password, PASSWORD_DEFAULT);
        echo "Fresh hash for same password: $newHash" . PHP_EOL;
        
        if (password_verify($password, $newHash)) {
            echo "✅ Fresh hash verification works - issue is with stored hash" . PHP_EOL;
            
            // Update the password in database
            $updateStmt = $conn->prepare("UPDATE admin_users SET password = ? WHERE username = ?");
            $updateStmt->bind_param("ss", $newHash, $username);
            
            if ($updateStmt->execute()) {
                echo "✅ Updated password hash in database" . PHP_EOL;
            } else {
                echo "❌ Failed to update password hash" . PHP_EOL;
            }
        } else {
            echo "❌ Even fresh hash verification failed - PHP issue?" . PHP_EOL;
        }
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . PHP_EOL;
}

$conn->close();
?>
