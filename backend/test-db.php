<?php
// Test file to check database structure and connectivity
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Include database configuration
include_once 'config/database.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    if (!$pdo) {
        echo "❌ Database connection failed\n";
        exit;
    }
    
    echo "✅ Database connection successful\n";
    
    // Check if products table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'products'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Products table exists\n";
        
        // Check table structure
        $stmt = $pdo->query("DESCRIBE products");
        $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        echo "📋 Table columns: " . implode(', ', $columns) . "\n";
        
        if (in_array('sold_out', $columns)) {
            echo "✅ sold_out column exists\n";
        } else {
            echo "❌ sold_out column does NOT exist\n";
            echo "💡 Run this SQL: ALTER TABLE products ADD COLUMN sold_out TINYINT(1) DEFAULT 0 AFTER tag;\n";
        }
        
        // Count products
        $stmt = $pdo->query("SELECT COUNT(*) FROM products");
        $count = $stmt->fetchColumn();
        echo "📊 Total products: $count\n";
        
        // Show first few products with their sold_out status if column exists
        if (in_array('sold_out', $columns)) {
            $stmt = $pdo->query("SELECT id, name, sold_out FROM products LIMIT 3");
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo "📝 Sample products:\n";
            foreach ($products as $product) {
                $status = $product['sold_out'] ? 'SOLD OUT' : 'AVAILABLE';
                echo "   - ID: {$product['id']}, Name: {$product['name']}, Status: $status\n";
            }
        }
        
    } else {
        echo "❌ Products table does not exist\n";
    }
    
} catch(PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
} catch(Exception $e) {
    echo "❌ General error: " . $e->getMessage() . "\n";
}
?>
