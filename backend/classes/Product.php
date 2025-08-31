<?php
class Product {
    private $conn;
    private $table_name = "products";

    public $id;
    public $name;
    public $processor;
    public $ram;
    public $graphics;
    public $storage;
    public $purpose;
    public $price;
    public $image;
    public $specs;
    public $tag;
    public $sold_out;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create products table
    public function createTable() {
        $query = "CREATE TABLE IF NOT EXISTS " . $this->table_name . " (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            processor VARCHAR(100) NOT NULL,
            ram VARCHAR(50) NOT NULL,
            graphics VARCHAR(100) NOT NULL,
            storage VARCHAR(100) NOT NULL,
            purpose VARCHAR(50) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            image VARCHAR(500) DEFAULT NULL,
            specs TEXT DEFAULT NULL,
            tag VARCHAR(50) DEFAULT NULL,
            sold_out BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8";

        try {
            $this->conn->exec($query);
            
            // Add sold_out column if it doesn't exist
            $alterQuery = "ALTER TABLE " . $this->table_name . " ADD COLUMN IF NOT EXISTS sold_out BOOLEAN DEFAULT FALSE";
            $this->conn->exec($alterQuery);
            
            return true;
        } catch(PDOException $exception) {
            echo "Table creation error: " . $exception->getMessage();
            return false;
        }
    }

    // Get all products
    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Get single product
    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->name = $row['name'];
            $this->processor = $row['processor'];
            $this->ram = $row['ram'];
            $this->graphics = $row['graphics'];
            $this->storage = $row['storage'];
            $this->purpose = $row['purpose'];
            $this->price = $row['price'];
            $this->image = $row['image'];
            $this->specs = $row['specs'];
            $this->tag = $row['tag'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }
        return false;
    }

    // Create product
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET name=:name, processor=:processor, ram=:ram, graphics=:graphics, 
                      storage=:storage, purpose=:purpose, price=:price, image=:image, 
                      specs=:specs, tag=:tag";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->processor = htmlspecialchars(strip_tags($this->processor));
        $this->ram = htmlspecialchars(strip_tags($this->ram));
        $this->graphics = htmlspecialchars(strip_tags($this->graphics));
        $this->storage = htmlspecialchars(strip_tags($this->storage));
        $this->purpose = htmlspecialchars(strip_tags($this->purpose));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->image = htmlspecialchars(strip_tags($this->image));
        $this->specs = htmlspecialchars(strip_tags($this->specs));
        $this->tag = htmlspecialchars(strip_tags($this->tag));

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":processor", $this->processor);
        $stmt->bindParam(":ram", $this->ram);
        $stmt->bindParam(":graphics", $this->graphics);
        $stmt->bindParam(":storage", $this->storage);
        $stmt->bindParam(":purpose", $this->purpose);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":image", $this->image);
        $stmt->bindParam(":specs", $this->specs);
        $stmt->bindParam(":tag", $this->tag);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Update product
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET name=:name, processor=:processor, ram=:ram, graphics=:graphics, 
                      storage=:storage, purpose=:purpose, price=:price, image=:image, 
                      specs=:specs, tag=:tag 
                  WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->processor = htmlspecialchars(strip_tags($this->processor));
        $this->ram = htmlspecialchars(strip_tags($this->ram));
        $this->graphics = htmlspecialchars(strip_tags($this->graphics));
        $this->storage = htmlspecialchars(strip_tags($this->storage));
        $this->purpose = htmlspecialchars(strip_tags($this->purpose));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->image = htmlspecialchars(strip_tags($this->image));
        $this->specs = htmlspecialchars(strip_tags($this->specs));
        $this->tag = htmlspecialchars(strip_tags($this->tag));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":processor", $this->processor);
        $stmt->bindParam(":ram", $this->ram);
        $stmt->bindParam(":graphics", $this->graphics);
        $stmt->bindParam(":storage", $this->storage);
        $stmt->bindParam(":purpose", $this->purpose);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":image", $this->image);
        $stmt->bindParam(":specs", $this->specs);
        $stmt->bindParam(":tag", $this->tag);
        $stmt->bindParam(":id", $this->id);

        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete product
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Search products
    public function search($keywords) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE name LIKE ? OR processor LIKE ? OR purpose LIKE ? OR tag LIKE ?
                  ORDER BY created_at DESC";

        $stmt = $this->conn->prepare($query);

        $keywords = htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
        $stmt->bindParam(4, $keywords);

        $stmt->execute();
        return $stmt;
    }

    // Filter products
    public function filter($filters) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE 1=1";
        $params = array();

        if (!empty($filters['processor'])) {
            $query .= " AND processor = ?";
            $params[] = $filters['processor'];
        }

        if (!empty($filters['ram'])) {
            $query .= " AND ram = ?";
            $params[] = $filters['ram'];
        }

        if (!empty($filters['graphics'])) {
            $query .= " AND graphics = ?";
            $params[] = $filters['graphics'];
        }

        if (!empty($filters['storage'])) {
            $query .= " AND storage = ?";
            $params[] = $filters['storage'];
        }

        if (!empty($filters['purpose'])) {
            $query .= " AND purpose = ?";
            $params[] = $filters['purpose'];
        }

        if (!empty($filters['min_price'])) {
            $query .= " AND price >= ?";
            $params[] = $filters['min_price'];
        }

        if (!empty($filters['max_price'])) {
            $query .= " AND price <= ?";
            $params[] = $filters['max_price'];
        }

        $query .= " ORDER BY created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt;
    }
}
?>
