<?php
require_once '../config.php';
require_once '../includes/auth.php';

requireStudent();

$exam_id = $_GET['id'] ?? 0;
$student_id = $_SESSION['user_id'];

// Fetch Exam
$stmt = $pdo->prepare("SELECT * FROM exams WHERE id = ?");
$stmt->execute([$exam_id]);
$exam = $stmt->fetch();

if (!$exam) {
    header("Location: exams.php");
    exit;
}

// Check validity
$now = new DateTime();
$start = new DateTime($exam['start_time']);
$end = new DateTime($exam['end_time']);

if ($now < $start || $now > $end) {
    die("Exam is not currently active.");
}

// Check if already attempted
$stmt = $pdo->prepare("SELECT id FROM exam_attempts WHERE exam_id = ? AND student_id = ?");
$stmt->execute([$exam_id, $student_id]);
if ($stmt->fetch()) {
    header("Location: exam_result.php?id=" . $exam_id);
    exit;
}

// Fetch Questions
$stmt = $pdo->prepare("SELECT * FROM exam_questions WHERE exam_id = ?");
$stmt->execute([$exam_id]);
$questions = $stmt->fetchAll();

// Handle Submission
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $answers = $_POST['answers'] ?? [];
    $total_marks = 0;
    $max_marks = 0;

    $pdo->beginTransaction();
    try {
        // Create Attempt
        $stmt = $pdo->prepare("INSERT INTO exam_attempts (exam_id, student_id, submitted_at) VALUES (?, ?, NOW())");
        $stmt->execute([$exam_id, $student_id]);
        $attempt_id = $pdo->lastInsertId();

        foreach ($questions as $q) {
            $q_id = $q['id'];
            $given_ans = $answers[$q_id] ?? null;
            $marks_obtained = 0;
            $max_marks += $q['marks'];

            if ($given_ans === $q['correct_option']) {
                $marks_obtained = $q['marks'];
                $total_marks += $marks_obtained;
            }

            $stmt = $pdo->prepare("INSERT INTO exam_answers (attempt_id, question_id, given_answer, obtained_marks) VALUES (?, ?, ?, ?)");
            $stmt->execute([$attempt_id, $q_id, $given_ans, $marks_obtained]);
        }

        // Update Attempt with total marks
        $stmt = $pdo->prepare("UPDATE exam_attempts SET total_marks = ?, max_marks = ? WHERE id = ?");
        $stmt->execute([$total_marks, $max_marks, $attempt_id]);

        $pdo->commit();
        header("Location: exam_result.php?id=" . $exam_id);
        exit;

    } catch (Exception $e) {
        $pdo->rollBack();
        die("Error submitting exam: " . $e->getMessage());
    }
}

require_once '../includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-10">
        <div class="d-flex justify-content-between align-items-center mb-3 sticky-top bg-white py-3 border-bottom">
            <h4><?php echo htmlspecialchars($exam['title']); ?></h4>
            <div class="text-danger fw-bold">
                Time Left: <span id="timer">00:00</span>
            </div>
        </div>

        <form id="examForm" method="POST" action="">
            <?php foreach ($questions as $index => $q): ?>
                <div class="card mb-4 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Q<?php echo $index + 1; ?>.
                            <?php echo htmlspecialchars($q['question_text']); ?></h5>
                        <div class="mt-3">
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="radio" name="answers[<?php echo $q['id']; ?>]"
                                    value="A" id="q<?php echo $q['id']; ?>a">
                                <label class="form-check-label" for="q<?php echo $q['id']; ?>a">A)
                                    <?php echo htmlspecialchars($q['option_a']); ?></label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="radio" name="answers[<?php echo $q['id']; ?>]"
                                    value="B" id="q<?php echo $q['id']; ?>b">
                                <label class="form-check-label" for="q<?php echo $q['id']; ?>b">B)
                                    <?php echo htmlspecialchars($q['option_b']); ?></label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="radio" name="answers[<?php echo $q['id']; ?>]"
                                    value="C" id="q<?php echo $q['id']; ?>c">
                                <label class="form-check-label" for="q<?php echo $q['id']; ?>c">C)
                                    <?php echo htmlspecialchars($q['option_c']); ?></label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="radio" name="answers[<?php echo $q['id']; ?>]"
                                    value="D" id="q<?php echo $q['id']; ?>d">
                                <label class="form-check-label" for="q<?php echo $q['id']; ?>d">D)
                                    <?php echo htmlspecialchars($q['option_d']); ?></label>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>

            <div class="d-grid mb-5">
                <button type="submit" class="btn btn-success btn-lg"
                    onclick="return confirm('Are you sure you want to submit?');">Submit Exam</button>
            </div>
        </form>
    </div>
</div>

<script>
    // Timer Logic
    let durationMinutes = <?php echo $exam['duration_minutes']; ?>;
    let timeRemaining = durationMinutes * 60; // seconds

    const timerDisplay = document.getElementById('timer');

    const countdown = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;

        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeRemaining <= 0) {
            clearInterval(countdown);
            alert("Time is up! Submitting your exam automatically.");
            document.getElementById('examForm').submit();
        }

        timeRemaining--;
    }, 1000);
</script>

<?php require_once '../includes/footer.php'; ?>