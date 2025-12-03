<?php
// backend/api/admin.php
include_once 'cors.php';
include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_GET['path']) ? $_GET['path'] : '';

function getJsonInput()
{
    return json_decode(file_get_contents("php://input"), true);
}

if ($method === 'GET') {
    if ($path === 'students') {
        $stmt = $conn->prepare("SELECT id, username, email, full_name, class, role, profile_picture_url, phone FROM users WHERE role = 'student'");
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif ($path === 'assignments') {
        $stmt = $conn->prepare("SELECT a.*, u.full_name as creator_name FROM assignments a LEFT JOIN users u ON a.created_by = u.id ORDER BY a.created_at DESC");
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif ($path === 'submissions') {
        // Get submissions for grading
        $stmt = $conn->prepare("
            SELECT s.*, a.title as assignment_title, u.full_name as student_name, u.class 
            FROM assignment_submissions s 
            JOIN assignments a ON s.assignment_id = a.id 
            JOIN users u ON s.student_id = u.id 
            ORDER BY s.submitted_at DESC
        ");
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif ($path === 'exams') {
        $stmt = $conn->prepare("SELECT * FROM exams ORDER BY start_time DESC");
        $stmt->execute();
        $exams = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($exams);
    } elseif ($path === 'exam_details') {
        $exam_id = $_GET['id'];
        $stmt = $conn->prepare("SELECT * FROM exams WHERE id = ?");
        $stmt->execute([$exam_id]);
        $exam = $stmt->fetch(PDO::FETCH_ASSOC);

        $qStmt = $conn->prepare("SELECT * FROM exam_questions WHERE exam_id = ?");
        $qStmt->execute([$exam_id]);
        $exam['questions'] = $qStmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($exam);
    } elseif ($path === 'student_analytics') {
        $student_id = $_GET['id'];
        $stmt = $conn->prepare("SELECT * FROM exam_results WHERE student_id = ?");
        $stmt->execute([$student_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif ($path === 'exam_results') {
        $exam_id = $_GET['id'];
        $stmt = $conn->prepare("
            SELECT u.full_name, u.email, u.class, er.marks_obtained, er.submitted_at 
            FROM exam_results er 
            JOIN users u ON er.student_id = u.id 
            WHERE er.exam_id = ?
            ORDER BY er.marks_obtained DESC
        ");
        $stmt->execute([$exam_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif ($path === 'analytics') {
        // Dashboard Overview Stats
        $stats = [];

        // Total Students
        $stmt = $conn->query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
        $stats['total_students'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

        // Active Assignments (future due date)
        $stmt = $conn->query("SELECT COUNT(*) as count FROM assignments WHERE due_date >= CURDATE()");
        $stats['active_assignments'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

        // Pending Reviews (submissions not graded)
        $stmt = $conn->query("SELECT COUNT(*) as count FROM assignment_submissions WHERE status = 'submitted'");
        $stats['pending_reviews'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

        // Avg Performance (average marks in exams)
        $stmt = $conn->query("
            SELECT AVG((er.marks_obtained / e.total_marks) * 100) as avg_percentage 
            FROM exam_results er 
            JOIN exams e ON er.exam_id = e.id
        ");
        $avg = $stmt->fetch(PDO::FETCH_ASSOC)['avg_percentage'];
        $stats['avg_performance'] = $avg ? round($avg, 1) : 0;

        echo json_encode($stats);
    }
} elseif ($method === 'POST') {
    $data = getJsonInput();
    if ($path === 'students') {
        $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users (role, username, email, password_hash, full_name, class, phone) VALUES ('student', ?, ?, ?, ?, ?, ?)");
        if ($stmt->execute([$data['username'], $data['email'], $password_hash, $data['full_name'], $data['class'], $data['phone'] ?? null])) {
            echo json_encode(["status" => "success", "message" => "Student created"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to create student"]);
        }
    } elseif ($path === 'assignments') {
        $stmt = $conn->prepare("INSERT INTO assignments (title, description, class, due_date, file_path, created_by) VALUES (?, ?, ?, ?, ?, ?)");
        if ($stmt->execute([$data['title'], $data['description'], $data['class'], $data['due_date'], $data['file_path'] ?? null, $data['created_by']])) {
            echo json_encode(["status" => "success", "message" => "Assignment created"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to create assignment"]);
        }
    } elseif ($path === 'grade_submission') {
        $stmt = $conn->prepare("UPDATE assignment_submissions SET marks_obtained = ?, feedback = ?, status = 'graded' WHERE id = ?");
        if ($stmt->execute([$data['marks'], $data['feedback'], $data['id']])) {
            echo json_encode(["status" => "success", "message" => "Submission graded"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to grade"]);
        }
    } elseif ($path === 'exams') {
        // Create Exam with Questions
        $conn->beginTransaction();
        try {
            $stmt = $conn->prepare("INSERT INTO exams (name, description, class, total_marks, start_time, end_time, duration_minutes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$data['name'], $data['description'], $data['class'], $data['total_marks'], $data['start_time'], $data['end_time'], $data['duration_minutes'], $data['created_by']]);
            $exam_id = $conn->lastInsertId();

            if (isset($data['questions']) && is_array($data['questions'])) {
                $qStmt = $conn->prepare("INSERT INTO exam_questions (exam_id, question_text, options, correct_answer, marks) VALUES (?, ?, ?, ?, ?)");
                foreach ($data['questions'] as $q) {
                    $qStmt->execute([$exam_id, $q['question_text'], json_encode($q['options']), $q['correct_answer'], $q['marks']]);
                }
            }

            $conn->commit();
            echo json_encode(["status" => "success", "message" => "Exam created with questions"]);
        } catch (Exception $e) {
            $conn->rollBack();
            echo json_encode(["status" => "error", "message" => "Failed to create exam: " . $e->getMessage()]);
        }
    } elseif ($path === 'delete_exam') {
        $id = $data['id'];
        $stmt = $conn->prepare("DELETE FROM exams WHERE id = ?");
        if ($stmt->execute([$id])) {
            echo json_encode(["status" => "success", "message" => "Exam deleted"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to delete exam"]);
        }
    } elseif ($path === 'update_exam') {
        $conn->beginTransaction();
        try {
            $stmt = $conn->prepare("UPDATE exams SET name = ?, description = ?, class = ?, total_marks = ?, start_time = ?, end_time = ?, duration_minutes = ? WHERE id = ?");
            $stmt->execute([$data['name'], $data['description'], $data['class'], $data['total_marks'], $data['start_time'], $data['end_time'], $data['duration_minutes'], $data['id']]);

            // Delete old questions
            $stmt = $conn->prepare("DELETE FROM exam_questions WHERE exam_id = ?");
            $stmt->execute([$data['id']]);

            // Insert new questions
            if (isset($data['questions']) && is_array($data['questions'])) {
                $qStmt = $conn->prepare("INSERT INTO exam_questions (exam_id, question_text, options, correct_answer, marks) VALUES (?, ?, ?, ?, ?)");
                foreach ($data['questions'] as $q) {
                    $qStmt->execute([$data['id'], $q['question_text'], is_string($q['options']) ? $q['options'] : json_encode($q['options']), $q['correct_answer'], $q['marks']]);
                }
            }

            $conn->commit();
            echo json_encode(["status" => "success", "message" => "Exam updated"]);
        } catch (Exception $e) {
            $conn->rollBack();
            echo json_encode(["status" => "error", "message" => "Failed to update exam: " . $e->getMessage()]);
        }
    } elseif ($path === 'delete_student') {
        $id = $data['id'];
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ? AND role = 'student'");
        if ($stmt->execute([$id])) {
            echo json_encode(["status" => "success", "message" => "Student deleted"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to delete student"]);
        }
    } elseif ($path === 'update_student') {
        $id = $data['id'];
        $full_name = $data['full_name'];
        $email = $data['email'];
        $class = $data['class'];
        $phone = $data['phone'];
        $username = $data['username'];
        $password = isset($data['password']) && !empty($data['password']) ? $data['password'] : null;

        try {
            if ($password) {
                $password_hash = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $conn->prepare("UPDATE users SET full_name = ?, email = ?, class = ?, phone = ?, username = ?, password_hash = ? WHERE id = ? AND role = 'student'");
                $result = $stmt->execute([$full_name, $email, $class, $phone, $username, $password_hash, $id]);
            } else {
                $stmt = $conn->prepare("UPDATE users SET full_name = ?, email = ?, class = ?, phone = ?, username = ? WHERE id = ? AND role = 'student'");
                $result = $stmt->execute([$full_name, $email, $class, $phone, $username, $id]);
            }

            if ($result) {
                echo json_encode(["status" => "success", "message" => "Student updated"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to update student: " . implode(" ", $stmt->errorInfo())]);
            }
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
        }
    }
}
?>