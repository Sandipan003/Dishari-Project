<?php
// backend/api/fix_password.php
include_once '../config/db.php';

// Enable errors for this script only so user can see output
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $username = 'admin';
    $password = 'admin123';
    $hash = password_hash($password, PASSWORD_DEFAULT);

    // 1. Delete existing admin to be sure
    $delete = $conn->prepare("DELETE FROM users WHERE username = ?");
    $delete->execute([$username]);

    // 2. Re-insert admin
    $insert = $conn->prepare("INSERT INTO users (role, username, email, password_hash, full_name) VALUES ('admin', 'admin', 'admin@dpa.com', ?, 'System Admin')");
    $insert->execute([$hash]);

    echo "<h1>Success!</h1>";
    echo "<p>Admin user has been reset.</p>";
    echo "<ul>";
    echo "<li>Username: <strong>admin</strong></li>";
    echo "<li>Password: <strong>admin123</strong></li>";
    echo "</ul>";
    echo "<p><a href='http://localhost:5173/login'>Go back to Login Page</a></p>";

} catch (PDOException $e) {
    echo "<h1>Error</h1>";
    echo "<p>" . $e->getMessage() . "</p>";
}
?>