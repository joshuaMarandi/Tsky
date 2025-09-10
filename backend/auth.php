<?php
// Suppress PHP errors from being displayed as HTML
error_reporting(0);
ini_set('display_errors', 0);

// Set CORS headers for multiple origins
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
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
// Error handling wrapper
function handleError($message) {
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}
try {
    require_once 'db_config.php';
} catch (Exception $e) {
    handleError('Database connection failed');
}
function authenticate($username, $password) {
    global $conn;
    
    try {
        // Prepare statement to prevent SQL injection
        $stmt = $conn->prepare("SELECT id, username, password, email, full_name, is_active FROM admin_users WHERE username = ? AND is_active = 1");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            
            // Verify password
            if (password_verify($password, $user['password'])) {
                // Update last login
                $updateStmt = $conn->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
                $updateStmt->bind_param("i", $user['id']);
                $updateStmt->execute();
                
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
            }
        }
        
        return ['success' => false, 'message' => 'Invalid credentials'];
        
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
    }
}

function validateToken($token) {
    try {
        $data = json_decode(base64_decode($token), true);
        
        if (!$data || !isset($data['exp']) || $data['exp'] < time()) {
            return false;
        }
        
        return $data;
    } catch (Exception $e) {
        return false;
    }
}

// Handle authentication request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            handleError('Invalid JSON input');
        }
        
        if (isset($input['action']) && $input['action'] === 'login') {
            $username = trim($input['username'] ?? '');
            $password = $input['password'] ?? '';
            
            if (empty($username) || empty($password)) {
                echo json_encode(['success' => false, 'message' => 'Username and password are required']);
                exit;
            }
            
            $result = authenticate($username, $password);
            echo json_encode($result);
            
        } elseif (isset($input['action']) && $input['action'] === 'verify') {
            $token = $input['token'] ?? '';
            
            $tokenData = validateToken($token);
            
            if ($tokenData) {
                echo json_encode(['success' => true, 'user' => $tokenData]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
            }
            
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
        }
    } catch (Exception $e) {
        handleError('Server error occurred');
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
