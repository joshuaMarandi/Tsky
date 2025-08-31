<?php
// Debug version of auth.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Start output buffering to catch any unwanted output
ob_start();

try {
    require_once 'db_config.php';
    
    if ($conn->connect_error) {
        ob_clean();
        echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
        exit;
    }
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            ob_clean();
            echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
            exit;
        }
        
        if (isset($input['action']) && $input['action'] === 'login') {
            $username = trim($input['username'] ?? '');
            $password = $input['password'] ?? '';
            
            if (empty($username) || empty($password)) {
                ob_clean();
                echo json_encode(['success' => false, 'message' => 'Username and password are required']);
                exit;
            }
            
            // Authenticate
            $stmt = $conn->prepare("SELECT id, username, password, email, full_name, is_active FROM admin_users WHERE username = ? AND is_active = 1");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 1) {
                $user = $result->fetch_assoc();
                
                if (password_verify($password, $user['password'])) {
                    // Update last login
                    $updateStmt = $conn->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
                    $updateStmt->bind_param("i", $user['id']);
                    $updateStmt->execute();
                    
                    // Generate token
                    $token = base64_encode(json_encode([
                        'user_id' => $user['id'],
                        'username' => $user['username'],
                        'exp' => time() + (24 * 60 * 60)
                    ]));
                    
                    ob_clean();
                    echo json_encode([
                        'success' => true,
                        'token' => $token,
                        'user' => [
                            'id' => $user['id'],
                            'username' => $user['username'],
                            'email' => $user['email'],
                            'full_name' => $user['full_name']
                        ]
                    ]);
                    exit;
                }
            }
            
            ob_clean();
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
            exit;
        }
    }
    
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    
} catch (Exception $e) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
