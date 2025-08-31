<?php
// File upload handler for product images
// This will be used by the products API

function handleFileUpload() {
    $targetDir = "../uploads/images/";
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    $maxFileSize = 5 * 1024 * 1024; // 5MB
    
    // Check if the uploads directory exists
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0755, true);
    }
    
    // Check if file was uploaded
    if (!isset($_FILES['product_image']) || $_FILES['product_image']['error'] == UPLOAD_ERR_NO_FILE) {
        // No file uploaded, return default image path
        return "/src/assets/images/pc1.svg";
    }
    
    $file = $_FILES['product_image'];
    $fileName = basename($file['name']);
    $fileType = $file['type'];
    $fileSize = $file['size'];
    $error = $file['error'];
    
    // Validate file
    if ($error !== UPLOAD_ERR_OK) {
        throw new Exception("Upload failed with error code: $error");
    }
    
    if ($fileSize > $maxFileSize) {
        throw new Exception("File is too large. Maximum size is 5MB");
    }
    
    if (!in_array($fileType, $allowedTypes)) {
        throw new Exception("Invalid file type. Allowed types: JPG, PNG, GIF, SVG, WEBP");
    }
    
    // Generate unique filename
    $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
    $uniqueName = uniqid('product_') . '.' . $fileExtension;
    $targetFile = $targetDir . $uniqueName;
    
    // Move the file
    if (move_uploaded_file($file['tmp_name'], $targetFile)) {
        // Return the relative path to the file
        return "/backend/uploads/images/" . $uniqueName;
    } else {
        throw new Exception("Failed to move uploaded file");
    }
}
?>
