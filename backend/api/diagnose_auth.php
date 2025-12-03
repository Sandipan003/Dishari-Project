<?php
// backend/api/diagnose_auth.php
include_once '../config/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Authentication Diagnosis</h2>";

$username = 'admin';
$password = 'admin123';

echo "<p>Testing credentials: Username: <strong>$username</strong>, Password: <strong>$password</strong></p>";

try {
    // 1. Check if user exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo "<p style='color:green'>User 'admin' found in database.</p>";
        echo "<ul>";
        echo "<li>ID: " . $user['id'] . "</li>";
        echo "<li>Role: " . $user['role'] . "</li>";
        echo "<li>Stored Hash: " . $user['password_hash'] . "</li>";
        echo "</ul>";

        // 2. Verify Password
        if (password_verify($password, $user['password_hash'])) {
            echo "<h3 style='color:green'>SUCCESS: Password matches!</h3>";
            echo "<p>The login API should work. If it fails, it might be a frontend/network issue.</p>";
        } else {
            echo "<h3 style='color:red'>FAILURE: Password does NOT match hash.</h3>";
            echo "<p>Resetting password now...</p>";

            // Force reset
            $new_hash = password_hash($password, PASSWORD_DEFAULT);
            $update = $conn->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
            $update->execute([$new_hash, $user['id']]);

            echo "<p>Password reset to 'admin123'. <strong>Please try logging in again.</strong></p>";
        }
    } else {
        echo "<p style='color:red'>User 'admin' NOT found.</p>";
        echo "<p>Creating admin user...</p>";

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $insert = $conn->prepare("INSERT INTO users (role, username, email, password_hash, full_name) VALUES ('admin', 'admin', 'admin@dpa.com', ?, 'System Admin')");
        $insert->execute([$hash]);

        echo "<p>Admin user created. <strong>Please try logging in again.</strong></p>";
    }

} catch (PDOException $e) {
    echo "<p style='color:red'>Database Error: " . $e->getMessage() . "</p>";
}
?>