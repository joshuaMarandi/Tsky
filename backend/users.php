<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5174');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db_config.php';
require_once 'auth.php'; // For token validation

function requireAuth() {
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? '';
    
    if (strpos($token, 'Bearer ') === 0) {
        $token = substr($token, 7);
    }
    
    $tokenData = validateToken($token);
    if (!$tokenData) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }
    
    return $tokenData;
}

function getAllUsers() {
    global $conn;
    
    try {
        $stmt = $conn->prepare("SELECT id, username, email, full_name, is_active, last_login, created_at FROM admin_users ORDER BY created_at DESC");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        
        return ['success' => true, 'users' => $users];
        
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
    }
}

function createUser($data) {
    global $conn;
    
    try {
        $username = trim($data['username'] ?? '');
        $password = $data['password'] ?? '';
        $email = trim($data['email'] ?? '');
        $fullName = trim($data['full_name'] ?? '');
        
        if (empty($username) || empty($password)) {
            return ['success' => false, 'message' => 'Username and password are required'];
        }
        
        // Check if username already exists
        $checkStmt = $conn->prepare("SELECT id FROM admin_users WHERE username = ?");
        $checkStmt->bind_param("s", $username);
        $checkStmt->execute();
        
        if ($checkStmt->get_result()->num_rows > 0) {
            return ['success' => false, 'message' => 'Username already exists'];
        }
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert new user
        $stmt = $conn->prepare("INSERT INTO admin_users (username, password, email, full_name) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $username, $hashedPassword, $email, $fullName);
        
        if ($stmt->execute()) {
            $userId = $conn->insert_id;
            return ['success' => true, 'message' => 'User created successfully', 'user_id' => $userId];
        } else {
            return ['success' => false, 'message' => 'Failed to create user'];
        }
        
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
    }
}

function updateUser($userId, $data) {
    global $conn;
    
    try {
        $email = trim($data['email'] ?? '');
        $fullName = trim($data['full_name'] ?? '');
        $isActive = isset($data['is_active']) ? (bool)$data['is_active'] : true;
        
        $stmt = $conn->prepare("UPDATE admin_users SET email = ?, full_name = ?, is_active = ? WHERE id = ?");
        $stmt->bind_param("ssii", $email, $fullName, $isActive, $userId);
        
        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'User updated successfully'];
        } else {
            return ['success' => false, 'message' => 'Failed to update user'];
        }
        
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
    }
}

function changePassword($userId, $data) {
    global $conn;
    
    try {
        $currentPassword = $data['current_password'] ?? '';
        $newPassword = $data['new_password'] ?? '';
        
        if (empty($currentPassword) || empty($newPassword)) {
            return ['success' => false, 'message' => 'Current password and new password are required'];
        }
        
        // Verify current password
        $stmt = $conn->prepare("SELECT password FROM admin_users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            return ['success' => false, 'message' => 'User not found'];
        }
        
        $user = $result->fetch_assoc();
        
        if (!password_verify($currentPassword, $user['password'])) {
            return ['success' => false, 'message' => 'Current password is incorrect'];
        }
        
        // Update password
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $updateStmt = $conn->prepare("UPDATE admin_users SET password = ? WHERE id = ?");
        $updateStmt->bind_param("si", $hashedPassword, $userId);
        
        if ($updateStmt->execute()) {
            return ['success' => true, 'message' => 'Password changed successfully'];
        } else {
            return ['success' => false, 'message' => 'Failed to change password'];
        }
        
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
    }
}

// Handle requests
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        $user = requireAuth();
        $result = getAllUsers();
        echo json_encode($result);
        break;
        
    case 'POST':
        $user = requireAuth();
        $result = createUser($input);
        echo json_encode($result);
        break;
        
    case 'PUT':
        $user = requireAuth();
        $userId = $input['user_id'] ?? 0;
        
        if (isset($input['action']) && $input['action'] === 'change_password') {
            $result = changePassword($userId, $input);
        } else {
            $result = updateUser($userId, $input);
        }
        
        echo json_encode($result);
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
