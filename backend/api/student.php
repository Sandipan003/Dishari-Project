<?php
// backend/api/student.php
include_once 'cors.php';
include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_GET['path']) ? $_GET['path'] : '';
$student_id = isset($_GET['student_id']) ? $_GET['student_id'] : null;

function getJsonInput()
{
    return json_decode(file_get_contents("php://input"), true);
}

if ($method === 'GET') {
    if ($path === 'profile' && $student_id) {
        $stmt = $conn->prepare("SELECT id, username, email, full_name, class, batch, phone, profile_picture_url, extra_details FROM users WHERE id = ?");
        $stmt->execute([$student_id]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    } elseif ($path === 'assignments' && $student_id) {
        $stmt = $conn->prepare("SELECT class FROM users WHERE id = ?");
        $stmt->execute([$student_id]);
        $student = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($student) {
            // Fetch assignments with submission status
            $query = "
                SELECT a.*, s.status, s.marks_obtained, s.feedback 
                FROM assignments a 
                LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND s.student_id = ?
                WHERE a.class = ?
            ";
            $stmt = $conn->prepare($query);
            $stmt->execute([$student_id, $student['class']]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
    } elseif ($path === 'exams' && $student_id) {
        $stmt = $conn->prepare("SELECT class FROM users WHERE id = ?");
        $stmt->execute([$student_id]);
        $student = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($student) {
            $query = "
                SELECT e.*, 
                (SELECT COUNT(*) FROM exam_results er WHERE er.exam_id = e.id AND er.student_id = ?) as has_submitted
                FROM exams e 
                WHERE e.class = ?
            ";
            $stmt = $conn->prepare($query);
            $stmt->execute([$student_id, $student['class']]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
    } elseif ($path === 'exam_questions') {
        $exam_id = $_GET['exam_id'];
        $student_id = isset($_GET['student_id']) ? $_GET['student_id'] : null;

        // Check if already submitted
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM exam_results WHERE exam_id = ? AND student_id = ?");
        $stmt->execute([$exam_id, $student_id]);
        $submitted = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

        if ($submitted > 0) {
            echo json_encode(["error" => "Exam already submitted"]);
            exit;
        }

        $stmt = $conn->prepare("SELECT id, exam_id, question_text, options, marks FROM exam_questions WHERE exam_id = ?");
        $stmt->execute([$exam_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif ($path === 'leaderboard') {
        $stmt = $conn->query("
            SELECT u.full_name, u.class, SUM(er.marks_obtained) as total_score 
            FROM exam_results er 
            JOIN users u ON er.student_id = u.id 
            GROUP BY u.id 
            ORDER BY total_score DESC 
            LIMIT 10
        ");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif ($path === 'dashboard_stats' && $student_id) {
        $stats = [];

        // Pending Assignments
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM assignments a LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND s.student_id = ? WHERE s.status IS NULL OR s.status = 'late'");
        $stmt->execute([$student_id]);
        $stats['pending_assignments'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

        // Upcoming Exams
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM exams WHERE start_time > NOW()");
        $stmt->execute();
        $stats['upcoming_exams'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

        // Average Score
        $stmt = $conn->prepare("SELECT AVG((er.marks_obtained / e.total_marks) * 100) as avg_percentage FROM exam_results er JOIN exams e ON er.exam_id = e.id WHERE er.student_id = ?");
        $stmt->execute([$student_id]);
        $avg = $stmt->fetch(PDO::FETCH_ASSOC)['avg_percentage'];
        $stats['average_score'] = $avg ? round($avg, 1) : 0;

        // Study Hours (Mock for now as we don't track login time)
        $stats['study_hours'] = 0;

        echo json_encode($stats);
    } elseif ($path === 'get_exam_result' && $student_id) {
        $exam_id = $_GET['exam_id'];
        $stmt = $conn->prepare("
            SELECT er.marks_obtained, e.total_marks, e.name as exam_name
            FROM exam_results er
            JOIN exams e ON er.exam_id = e.id
            WHERE er.exam_id = ? AND er.student_id = ?
        ");
        $stmt->execute([$exam_id, $student_id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            echo json_encode($result);
        } else {
            echo json_encode(["error" => "Result not found"]);
        }
    }
} elseif ($method === 'POST') {
    $data = getJsonInput();
    if ($path === 'update_profile') {
        $stmt = $conn->prepare("UPDATE users SET full_name = ?, email = ?, phone = ?, profile_picture_url = ? WHERE id = ?");
        if ($stmt->execute([$data['full_name'], $data['email'], $data['phone'], $data['profile_picture_url'], $data['id']])) {
            echo json_encode(["status" => "success", "message" => "Profile updated"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update profile"]);
        }
    } elseif ($path === 'submit_exam') {
        // Auto-grading logic
        $exam_id = $data['exam_id'];
        $student_id = $data['student_id'];
        $answers = $data['answers']; // Array of {question_id: ..., selected_option: ...}

        $total_marks = 0;

        // Fetch correct answers
        $stmt = $conn->prepare("SELECT id, correct_answer, marks FROM exam_questions WHERE exam_id = ?");
        $stmt->execute([$exam_id]);
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($questions as $q) {
            // Find student answer for this question
            foreach ($answers as $ans) {
                if ($ans['question_id'] == $q['id']) {
                    if ($ans['selected_option'] === $q['correct_answer']) {
                        $total_marks += $q['marks'];
                    }
                    break;
                }
            }
        }

        $stmt = $conn->prepare("INSERT INTO exam_results (exam_id, student_id, marks_obtained, status) VALUES (?, ?, ?, 'completed')");
        if ($stmt->execute([$exam_id, $student_id, $total_marks])) {
            echo json_encode(["status" => "success", "message" => "Exam submitted", "score" => $total_marks]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to submit exam"]);
        }
    }
}
?>