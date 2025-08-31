<?php
// Function to hash a password
function hashPassword($plainPassword) {
    // Using PASSWORD_DEFAULT for bcrypt hashing
    $hashedPassword = password_hash($plainPassword, PASSWORD_DEFAULT);
    return $hashedPassword;
}

// Example usage
$plainPassword = "admin2025"; // Replace with your password
$hashedPassword = hashPassword($plainPassword);

// Output results
echo "Plain Password: " . $plainPassword . "\n";
echo "Hashed Password: " . $hashedPassword . "\n";

// Optional: Verify password
if (password_verify($plainPassword, $hashedPassword)) {
    echo "Password verification successful!";
} else {
    echo "Password verification failed!";
}
?>