<?php
// backend/api/auth.php
include_once 'cors.php';
include_once '../config/db.php';

try {
    $input = file_get_contents("php://input");
    $data = json_decode($input);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($data->username) && isset($data->password)) {
            $username = $data->username;
            $password = $data->password;

            // Check for both username and email
            $query = "SELECT * FROM users WHERE username = :username OR email = :username LIMIT 1";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(":username", $username);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                if (password_verify($password, $user['password_hash'])) {
                    // Success
                    $response = [
                        "status" => "success",
                        "message" => "Login successful",
                        "user" => [
                            "id" => $user['id'],
                            "username" => $user['username'],
                            "role" => $user['role'],
                            "full_name" => $user['full_name'],
                            "class" => $user['class'],
                            "batch" => $user['batch']
                        ]
                    ];
                    echo json_encode($response);
                } else {
                    echo json_encode(["status" => "error", "message" => "Invalid password"]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "User not found"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Incomplete data"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Server Error: " . $e->getMessage()]);
}
?>