<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers first
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include file upload handler
include_once '../includes/file_upload.php';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start output buffering to catch any unexpected output
ob_start();

try {
    include_once '../config/database.php';
    include_once '../classes/Product.php';

    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        throw new Exception("Database connection failed");
    }

    $product = new Product($db);

    $request_method = $_SERVER["REQUEST_METHOD"];

    switch($request_method) {
        case 'GET':
            if (isset($_GET['id'])) {
                get_product($_GET['id']);
            } else if (isset($_GET['search'])) {
                search_products($_GET['search']);
            } else if (isset($_GET['filter'])) {
                filter_products($_GET);
            } else {
                get_products();
            }
            break;
        
        case 'POST':
            // Check if this is actually a PUT request using _method field
            if (isset($_POST['_method']) && $_POST['_method'] === 'PUT' && isset($_GET['id'])) {
                update_product($_GET['id']);
            } else {
                create_product();
            }
            break;
        
        case 'PUT':
            if (isset($_GET['id'])) {
                update_product($_GET['id']);
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Product ID is required for update."));
            }
            break;
        
        case 'DELETE':
            if (isset($_GET['id'])) {
                delete_product($_GET['id']);
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Product ID is required for delete."));
            }
            break;
        
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Method not allowed."));
            break;
    }

} catch (Exception $e) {
    // Clear any buffered output
    ob_clean();
    
    http_response_code(500);
    echo json_encode(array(
        "error" => true,
        "message" => $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ));
} finally {
    // End output buffering
    ob_end_flush();
}

function get_products() {
    global $product;
    
    $stmt = $product->read();
    $num = $stmt->rowCount();

    if($num > 0) {
        $products_arr = array();
        $products_arr["products"] = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $product_item = array(
                "id" => $id,
                "name" => $name,
                "processor" => $processor,
                "ram" => $ram,
                "graphics" => $graphics,
                "storage" => $storage,
                "purpose" => $purpose,
                "price" => floatval($price),
                "image" => $image,
                "specs" => $specs,
                "tag" => $tag,
                "sold_out" => (bool)$sold_out,
                "created_at" => $created_at,
                "updated_at" => $updated_at
            );

            array_push($products_arr["products"], $product_item);
        }

        http_response_code(200);
        echo json_encode($products_arr);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "No products found."));
    }
}

function get_product($id) {
    global $product;
    
    $product->id = $id;

    if($product->readOne()) {
        $product_arr = array(
            "id" => $product->id,
            "name" => $product->name,
            "processor" => $product->processor,
            "ram" => $product->ram,
            "graphics" => $product->graphics,
            "storage" => $product->storage,
            "purpose" => $product->purpose,
            "price" => floatval($product->price),
            "image" => $product->image,
            "specs" => $product->specs,
            "tag" => $product->tag,
            "sold_out" => (bool)$product->sold_out,
            "created_at" => $product->created_at,
            "updated_at" => $product->updated_at
        );

        http_response_code(200);
        echo json_encode($product_arr);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Product not found."));
    }
}

function create_product() {
    global $product;
    
    try {
        // Check if we have FormData with files or JSON data
        if (!empty($_FILES) || !empty($_POST)) {
            // Handle form data with potential file upload
            $data = new stdClass();
            
            // Process form fields
            foreach ($_POST as $key => $value) {
                $data->$key = $value;
            }
            
            // Handle file upload
            if (isset($_FILES['product_image'])) {
                $data->image = handleFileUpload();
            }
        } else {
            // Handle JSON data (for backwards compatibility)
            $json = file_get_contents("php://input");
            
            if (empty($json)) {
                http_response_code(400);
                echo json_encode(array("message" => "No data received"));
                return;
            }
            
            $data = json_decode($json);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(array("message" => "Invalid JSON data: " . json_last_error_msg()));
                return;
            }
        }

        // Validate required fields
        $required_fields = ['name', 'processor', 'ram', 'graphics', 'storage', 'purpose', 'price'];
        $missing_fields = [];
        
        foreach ($required_fields as $field) {
            if (empty($data->$field)) {
                $missing_fields[] = $field;
            }
        }
        
        if (!empty($missing_fields)) {
            http_response_code(400);
            echo json_encode(array(
                "message" => "Missing required fields: " . implode(', ', $missing_fields),
                "missing_fields" => $missing_fields
            ));
            return;
        }

        // Validate price is numeric
        if (!is_numeric($data->price) || $data->price < 0) {
            http_response_code(400);
            echo json_encode(array("message" => "Price must be a valid positive number"));
            return;
        }

        $product->name = $data->name;
        $product->processor = $data->processor;
        $product->ram = $data->ram;
        $product->graphics = $data->graphics;
        $product->storage = $data->storage;
        $product->purpose = $data->purpose;
        $product->price = floatval($data->price);
        $product->image = $data->image ?? '';
        $product->specs = $data->specs ?? '';
        $product->tag = $data->tag ?? '';

        if($product->create()) {
            http_response_code(201);
            echo json_encode(array(
                "message" => "Product was created successfully.",
                "id" => $product->id,
                "product" => array(
                    "id" => $product->id,
                    "name" => $product->name,
                    "price" => $product->price
                )
            ));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create product. Database error."));
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array(
            "message" => "Server error: " . $e->getMessage(),
            "error_details" => $e->getTraceAsString()
        ));
    }
}

function update_product($id) {
    global $product;
    
    // Check for FormData with _method=PUT or regular PUT with JSON
    $isPutMethod = false;
    $data = null;
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['_method']) && $_POST['_method'] === 'PUT') {
        $isPutMethod = true;
        
        // Process form data with potential file upload
        $data = new stdClass();
        
        // Process form fields
        foreach ($_POST as $key => $value) {
            if ($key !== '_method') { // Skip the method field
                $data->$key = $value;
            }
        }
        
        // Handle file upload
        if (isset($_FILES['product_image']) && $_FILES['product_image']['error'] != UPLOAD_ERR_NO_FILE) {
            $data->image = handleFileUpload();
        }
    } else {
        // Regular PUT with JSON
        $data = json_decode(file_get_contents("php://input"));
    }

    $product->id = $id;

    if(!empty($data->name) && !empty($data->processor) && !empty($data->ram) && 
       !empty($data->graphics) && !empty($data->storage) && !empty($data->purpose) && 
       !empty($data->price)) {

        $product->name = $data->name;
        $product->processor = $data->processor;
        $product->ram = $data->ram;
        $product->graphics = $data->graphics;
        $product->storage = $data->storage;
        $product->purpose = $data->purpose;
        $product->price = $data->price;
        $product->image = $data->image ?? '';
        $product->specs = $data->specs ?? '';
        $product->tag = $data->tag ?? '';

        if($product->update()) {
            http_response_code(200);
            echo json_encode(array("message" => "Product was updated."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update product."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update product. Data is incomplete."));
    }
}

function delete_product($id) {
    global $product;
    
    $product->id = $id;

    if($product->delete()) {
        http_response_code(200);
        echo json_encode(array("message" => "Product was deleted."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to delete product."));
    }
}

function search_products($keywords) {
    global $product;
    
    $stmt = $product->search($keywords);
    $num = $stmt->rowCount();

    if($num > 0) {
        $products_arr = array();
        $products_arr["products"] = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $product_item = array(
                "id" => $id,
                "name" => $name,
                "processor" => $processor,
                "ram" => $ram,
                "graphics" => $graphics,
                "storage" => $storage,
                "purpose" => $purpose,
                "price" => floatval($price),
                "image" => $image,
                "specs" => $specs,
                "tag" => $tag,
                "sold_out" => (bool)$sold_out,
                "created_at" => $created_at,
                "updated_at" => $updated_at
            );

            array_push($products_arr["products"], $product_item);
        }

        http_response_code(200);
        echo json_encode($products_arr);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "No products found matching the search criteria."));
    }
}

function filter_products($filters) {
    global $product;
    
    // Remove non-filter parameters
    unset($filters['filter']);
    
    $stmt = $product->filter($filters);
    $num = $stmt->rowCount();

    if($num > 0) {
        $products_arr = array();
        $products_arr["products"] = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $product_item = array(
                "id" => $id,
                "name" => $name,
                "processor" => $processor,
                "ram" => $ram,
                "graphics" => $graphics,
                "storage" => $storage,
                "purpose" => $purpose,
                "price" => floatval($price),
                "image" => $image,
                "specs" => $specs,
                "tag" => $tag,
                "sold_out" => (bool)$sold_out,
                "created_at" => $created_at,
                "updated_at" => $updated_at
            );

            array_push($products_arr["products"], $product_item);
        }

        http_response_code(200);
        echo json_encode($products_arr);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "No products found matching the filter criteria."));
    }
}
?>
