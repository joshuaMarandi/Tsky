<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'db_config.php';

// Copy the authenticate function locally for testing
function testAuthenticate($username, $password) {
    global $conn;
    
    echo "Testing authentication for: $username with password: $password" . PHP_EOL;
    
    try {
        // Prepare statement to prevent SQL injection
        $stmt = $conn->prepare("SELECT id, username, password, email, full_name, is_active FROM admin_users WHERE username = ? AND is_active = 1");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        
        $result = $stmt->get_result();
        echo "Query executed. Rows found: " . $result->num_rows . PHP_EOL;
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            echo "User found: " . $user['username'] . PHP_EOL;
            echo "Stored password hash: " . $user['password'] . PHP_EOL;
            
            // Verify password
            echo "Verifying password..." . PHP_EOL;
            if (password_verify($password, $user['password'])) {
                echo "✅ Password verification successful!" . PHP_EOL;
                
                // Generate JWT token (simple version)
                $token = base64_encode(json_encode([
                    'user_id' => $user['id'],
                    'username' => $user['username'],
                    'exp' => time() + (24 * 60 * 60) // 24 hours
                ]));
                
                return [
                    'success' => true,
                    'token' => $token,
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'email' => $user['email'],
                        'full_name' => $user['full_name']
                    ]
                ];
            } else {
                echo "❌ Password verification failed!" . PHP_EOL;
                return ['success' => false, 'message' => 'Invalid credentials'];
            }
        } else {
            echo "❌ User not found or inactive" . PHP_EOL;
            return ['success' => false, 'message' => 'Invalid credentials'];
        }
        
    } catch (Exception $e) {
        echo "❌ Exception: " . $e->getMessage() . PHP_EOL;
        return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
    }
}

$result = testAuthenticate('admin', 'admin123');
echo "Final result: " . json_encode($result, JSON_PRETTY_PRINT) . PHP_EOL;

$conn->close();
?>
