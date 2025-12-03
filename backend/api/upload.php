<?php
// backend/api/upload.php
include_once 'cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file'])) {
        $file = $_FILES['file'];
        $targetDir = "../uploads/assignments/";

        // Create directory if not exists
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $fileName = time() . '_' . basename($file['name']);
        $targetFilePath = $targetDir . $fileName;

        if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
            // Return relative path for storage
            echo json_encode(["status" => "success", "file_path" => "uploads/assignments/" . $fileName]);
        } else {
            echo json_encode(["status" => "error", "message" => "File upload failed"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "No file uploaded"]);
    }
}
?>