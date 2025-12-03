<?php
// backend/api/update_schema.php
include_once '../config/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $sql = "
    CREATE TABLE IF NOT EXISTS exam_questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        exam_id INT,
        question_text TEXT NOT NULL,
        options JSON NOT NULL,
        correct_answer VARCHAR(255) NOT NULL,
        marks INT DEFAULT 1,
        FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
    );
    ";

    $conn->exec($sql);
    echo "Schema updated successfully. 'exam_questions' table created/verified.";

} catch (PDOException $e) {
    echo "Error updating schema: " . $e->getMessage();
}
?>