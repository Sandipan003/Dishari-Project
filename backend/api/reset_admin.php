<?php
// backend/api/reset_admin.php
include_once '../config/db.php';

try {
    $username = 'admin';
    $password = 'admin123';
    $hash = password_hash($password, PASSWORD_DEFAULT);

    // Check if user exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$username]);

    if ($stmt->rowCount() > 0) {
        // Update
        $update = $conn->prepare("UPDATE users SET password_hash = ? WHERE username = ?");
        $update->execute([$hash, $username]);
        echo "Admin password updated to 'admin123'.<br>";
    } else {
        // Insert
        $insert = $conn->prepare("INSERT INTO users (role, username, email, password_hash, full_name) VALUES ('admin', 'admin', 'admin@dpa.com', ?, 'System Admin')");
        $insert->execute([$hash]);
        echo "Admin user created with password 'admin123'.<br>";
    }

    echo "Database connection is working.";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>