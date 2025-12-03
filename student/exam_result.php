<?php
require_once '../config.php';
require_once '../includes/auth.php';

requireStudent();

$exam_id = $_GET['id'] ?? 0;
$student_id = $_SESSION['user_id'];

// Fetch Attempt
$stmt = $pdo->prepare("SELECT ea.*, e.title, e.description 
    FROM exam_attempts ea 
    JOIN exams e ON ea.exam_id = e.id 
    WHERE ea.exam_id = ? AND ea.student_id = ?");
$stmt->execute([$exam_id, $student_id]);
$attempt = $stmt->fetch();

if (!$attempt) {
    header("Location: exams.php");
    exit;
}

// Fetch Answers
$stmt = $pdo->prepare("SELECT ea.*, eq.question_text, eq.correct_option, eq.option_a, eq.option_b, eq.option_c, eq.option_d 
    FROM exam_answers ea 
    JOIN exam_questions eq ON ea.question_id = eq.id 
    WHERE ea.attempt_id = ?");
$stmt->execute([$attempt['id']]);
$answers = $stmt->fetchAll();

require_once '../includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-8">
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-success text-white text-center">
                <h3 class="mb-0">Result: <?php echo htmlspecialchars($attempt['title']); ?></h3>
            </div>
            <div class="card-body text-center">
                <h1 class="display-1 fw-bold text-primary">
                    <?php echo $attempt['total_marks']; ?> / <?php echo $attempt['max_marks']; ?>
                </h1>
                <p class="lead">Submitted on: <?php echo date('d M Y H:i', strtotime($attempt['submitted_at'])); ?></p>
                <a href="exams.php" class="btn btn-outline-primary">Back to Exams</a>
            </div>
        </div>

        <h4 class="mb-3">Detailed Review</h4>
        <?php foreach ($answers as $index => $ans): ?>
            <div
                class="card mb-3 <?php echo ($ans['given_answer'] == $ans['correct_option']) ? 'border-success' : 'border-danger'; ?>">
                <div class="card-body">
                    <h5 class="card-title">Q<?php echo $index + 1; ?>.
                        <?php echo htmlspecialchars($ans['question_text']); ?></h5>
                    <p class="mb-1"><strong>Your Answer:</strong> <?php echo $ans['given_answer'] ?? 'Not Answered'; ?>
                        <?php if ($ans['given_answer'] == $ans['correct_option']): ?>
                            <i class="fas fa-check text-success"></i>
                        <?php else: ?>
                            <i class="fas fa-times text-danger"></i>
                        <?php endif; ?>
                    </p>
                    <p class="mb-0 text-success"><strong>Correct Answer:</strong> <?php echo $ans['correct_option']; ?></p>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>