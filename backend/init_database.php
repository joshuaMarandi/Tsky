<?php
include_once 'config/database.php';
include_once 'classes/Product.php';

$database = new Database();

// Create database
if ($database->createDatabase()) {
    echo "Database created successfully.\n";
} else {
    echo "Error creating database.\n";
    exit;
}

// Get connection
$db = $database->getConnection();

if ($db) {
    echo "Database connection established.\n";
    
    $product = new Product($db);
    
    // Create table
    if ($product->createTable()) {
        echo "Products table created successfully.\n";
        
        // Insert sample data
        $sampleProducts = [
            [
                'name' => 'Gaming Beast Pro',
                'processor' => 'intel-i7',
                'ram' => '16gb',
                'graphics' => 'nvidia-rtx3070',
                'storage' => 'ssd-1tb',
                'purpose' => 'gaming',
                'price' => 1299.99,
                'image' => '/src/assets/images/pc1.svg',
                'specs' => 'Intel Core i7, 16GB DDR4, NVIDIA RTX 3070, 1TB SSD',
                'tag' => 'Best Seller'
            ],
            [
                'name' => 'Office Master',
                'processor' => 'intel-i5',
                'ram' => '8gb',
                'graphics' => 'integrated',
                'storage' => 'ssd-512',
                'purpose' => 'office',
                'price' => 599.99,
                'image' => '/src/assets/images/pc2.svg',
                'specs' => 'Intel Core i5, 8GB DDR4, Integrated Graphics, 512GB SSD',
                'tag' => 'Budget'
            ],
            [
                'name' => 'Workstation Elite',
                'processor' => 'amd-ryzen9',
                'ram' => '32gb',
                'graphics' => 'nvidia-rtx3080',
                'storage' => 'ssd-2tb',
                'purpose' => 'workstation',
                'price' => 2199.99,
                'image' => '/src/assets/images/pc3.svg',
                'specs' => 'AMD Ryzen 9, 32GB DDR4, NVIDIA RTX 3080, 2TB SSD',
                'tag' => 'Premium'
            ],
            [
                'name' => 'Gaming Starter',
                'processor' => 'amd-ryzen5',
                'ram' => '8gb',
                'graphics' => 'nvidia-gtx1660',
                'storage' => 'combo-ssd-hdd',
                'purpose' => 'gaming',
                'price' => 799.99,
                'image' => '/src/assets/images/pc1.svg',
                'specs' => 'AMD Ryzen 5, 8GB DDR4, NVIDIA GTX 1660, 512GB SSD + 2TB HDD',
                'tag' => 'Entry Level'
            ],
            [
                'name' => 'Design Studio Pro',
                'processor' => 'intel-i9',
                'ram' => '64gb',
                'graphics' => 'nvidia-rtx3080',
                'storage' => 'ssd-2tb',
                'purpose' => 'design',
                'price' => 2899.99,
                'image' => '/src/assets/images/pc2.svg',
                'specs' => 'Intel Core i9, 64GB DDR4, NVIDIA RTX 3080, 2TB SSD',
                'tag' => 'Professional'
            ],
            [
                'name' => 'Streaming Central',
                'processor' => 'amd-ryzen7',
                'ram' => '16gb',
                'graphics' => 'nvidia-rtx3060',
                'storage' => 'ssd-1tb',
                'purpose' => 'streaming',
                'price' => 1099.99,
                'image' => '/src/assets/images/pc3.svg',
                'specs' => 'AMD Ryzen 7, 16GB DDR4, NVIDIA RTX 3060, 1TB SSD',
                'tag' => 'Streamer'
            ],
            [
                'name' => 'Budget Office',
                'processor' => 'intel-i3',
                'ram' => '4gb',
                'graphics' => 'integrated',
                'storage' => 'hdd-1tb',
                'purpose' => 'office',
                'price' => 399.99,
                'image' => '/src/assets/images/pc1.svg',
                'specs' => 'Intel Core i3, 4GB DDR4, Integrated Graphics, 1TB HDD',
                'tag' => 'Economy'
            ],
            [
                'name' => 'Gaming Ultra',
                'processor' => 'intel-i9',
                'ram' => '32gb',
                'graphics' => 'nvidia-rtx3080',
                'storage' => 'ssd-2tb',
                'purpose' => 'gaming',
                'price' => 2499.99,
                'image' => '/src/assets/images/pc2.svg',
                'specs' => 'Intel Core i9, 32GB DDR4, NVIDIA RTX 3080, 2TB SSD',
                'tag' => 'Ultimate'
            ]
        ];
        
        foreach ($sampleProducts as $productData) {
            $product->name = $productData['name'];
            $product->processor = $productData['processor'];
            $product->ram = $productData['ram'];
            $product->graphics = $productData['graphics'];
            $product->storage = $productData['storage'];
            $product->purpose = $productData['purpose'];
            $product->price = $productData['price'];
            $product->image = $productData['image'];
            $product->specs = $productData['specs'];
            $product->tag = $productData['tag'];
            
            if ($product->create()) {
                echo "Created product: " . $productData['name'] . "\n";
            } else {
                echo "Failed to create product: " . $productData['name'] . "\n";
            }
        }
        
        echo "Database initialization completed successfully!\n";
        echo "You can now access the API at: http://localhost/Tsky-react/backend/api/products.php\n";
        
    } else {
        echo "Error creating products table.\n";
    }
} else {
    echo "Database connection failed.\n";
}
?>
