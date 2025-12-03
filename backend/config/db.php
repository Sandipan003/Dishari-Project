<?php
$host = 'localhost';
$db_name = 'dishari_project';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Ensure JSON header is sent if not already
    if (!headers_sent()) {
        header('Content-Type: application/json');
    }
    echo json_encode(["status" => "error", "message" => "Database Connection Error: " . $e->getMessage()]);
    exit();
}
?>