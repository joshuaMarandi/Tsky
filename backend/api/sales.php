<?php
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
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include database configuration
include_once '../config/database.php';

// Initialize database connection
$database = new Database();
$pdo = $database->getConnection();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getSales($pdo);
        break;
    case 'POST':
        addSale($pdo);
        break;
    case 'DELETE':
        deleteSale($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getSales($pdo) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM sales ORDER BY sale_date DESC, created_at DESC");
        $stmt->execute();
        $sales = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'sales' => $sales
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch sales: ' . $e->getMessage()]);
    }
}

function addSale($pdo) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (empty($input['product_id']) || empty($input['product_name']) || 
            empty($input['price']) || empty($input['sale_date'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields: product_id, product_name, price, sale_date']);
            return;
        }
        
        // Validate price
        if (!is_numeric($input['price']) || $input['price'] <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Price must be a positive number']);
            return;
        }
        
        // Validate date format
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $input['sale_date'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid date format. Use YYYY-MM-DD']);
            return;
        }
        
        // Check if product exists
        $checkStmt = $pdo->prepare("SELECT id, name FROM products WHERE id = ?");
        $checkStmt->execute([$input['product_id']]);
        $product = $checkStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$product) {
            http_response_code(400);
            echo json_encode(['error' => 'Product not found']);
            return;
        }
        
        // Insert sale
        $stmt = $pdo->prepare("INSERT INTO sales (product_id, product_name, price, sale_date) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $input['product_id'],
            $input['product_name'],
            $input['price'],
            $input['sale_date']
        ]);
        
        $saleId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Sale added successfully',
            'sale_id' => $saleId
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to add sale: ' . $e->getMessage()]);
    }
}

function deleteSale($pdo) {
    try {
        $saleId = $_GET['id'] ?? null;
        
        if (!$saleId) {
            http_response_code(400);
            echo json_encode(['error' => 'Sale ID is required']);
            return;
        }
        
        // Check if sale exists
        $checkStmt = $pdo->prepare("SELECT id FROM sales WHERE id = ?");
        $checkStmt->execute([$saleId]);
        
        if (!$checkStmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Sale not found']);
            return;
        }
        
        // Delete sale
        $stmt = $pdo->prepare("DELETE FROM sales WHERE id = ?");
        $stmt->execute([$saleId]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Sale deleted successfully'
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete sale: ' . $e->getMessage()]);
    }
}
?>
