<?php
require_once '../config.php';
require_once '../includes/auth.php';

requireAdmin();

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = trim($_POST['title']);
    $description = trim($_POST['description']);
    $class = trim($_POST['class']);
    $batch = trim($_POST['batch']);
    $start_time = $_POST['start_time'];
    $end_time = $_POST['end_time'];
    $duration = $_POST['duration'];

    if (empty($title) || empty($class) || empty($batch) || empty($start_time) || empty($duration)) {
        $error = "Title, Class, Batch, Start Time and Duration are required.";
    } else {
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare("INSERT INTO exams (title, description, class, batch, start_time, end_time, duration_minutes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $description, $class, $batch, $start_time, $end_time, $duration, $_SESSION['user_id']]);
            $exam_id = $pdo->lastInsertId();

            // Add Questions (Simple implementation: 3 fixed questions for demo)
            // In a real app, this would be dynamic JS form
            if (isset($_POST['questions'])) {
                $q_stmt = $pdo->prepare("INSERT INTO exam_questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_option, marks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($_POST['questions'] as $q) {
                    if (!empty($q['text'])) {
                        $q_stmt->execute([$exam_id, $q['text'], $q['a'], $q['b'], $q['c'], $q['d'], $q['correct'], $q['marks']]);
                    }
                }
            }

            $pdo->commit();
            $success = "Exam scheduled successfully.";
        } catch (Exception $e) {
            $pdo->rollBack();
            $error = "Failed to schedule exam: " . $e->getMessage();
        }
    }
}

require_once '../includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-10">
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h4 class="mb-0">Schedule New Exam</h4>
            </div>
            <div class="card-body">
                <?php if ($error): ?>
                    <div class="alert alert-danger"><?php echo $error; ?></div>
                <?php endif; ?>
                <?php if ($success): ?>
                    <div class="alert alert-success"><?php echo $success; ?></div>
                <?php endif; ?>

                <form method="POST" action="">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Exam Title</label>
                            <input type="text" class="form-control" name="title" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Duration (Minutes)</label>
                            <input type="number" class="form-control" name="duration" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" name="description" rows="2"></textarea>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Class</label>
                            <input type="text" class="form-control" name="class" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Batch</label>
                            <input type="text" class="form-control" name="batch" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Start Time</label>
                            <input type="datetime-local" class="form-control" name="start_time" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">End Time</label>
                            <input type="datetime-local" class="form-control" name="end_time" required>
                        </div>
                    </div>

                    <hr>
                    <h5>Questions (Add up to 3 for Demo)</h5>

                    <?php for ($i = 1; $i <= 3; $i++): ?>
                        <div class="card mb-3 bg-light">
                            <div class="card-body">
                                <h6>Question <?php echo $i; ?></h6>
                                <div class="mb-2">
                                    <input type="text" class="form-control" name="questions[<?php echo $i; ?>][text]"
                                        placeholder="Question Text">
                                </div>
                                <div class="row g-2 mb-2">
                                    <div class="col-md-6"><input type="text" class="form-control form-control-sm"
                                            name="questions[<?php echo $i; ?>][a]" placeholder="Option A"></div>
                                    <div class="col-md-6"><input type="text" class="form-control form-control-sm"
                                            name="questions[<?php echo $i; ?>][b]" placeholder="Option B"></div>
                                    <div class="col-md-6"><input type="text" class="form-control form-control-sm"
                                            name="questions[<?php echo $i; ?>][c]" placeholder="Option C"></div>
                                    <div class="col-md-6"><input type="text" class="form-control form-control-sm"
                                            name="questions[<?php echo $i; ?>][d]" placeholder="Option D"></div>
                                </div>
                                <div class="row g-2">
                                    <div class="col-md-6">
                                        <select class="form-select form-select-sm"
                                            name="questions[<?php echo $i; ?>][correct]">
                                            <option value="">Select Correct Option</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                            <option value="D">D</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <input type="number" class="form-control form-control-sm"
                                            name="questions[<?php echo $i; ?>][marks]" value="1" placeholder="Marks">
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endfor; ?>

                    <button type="submit" class="btn btn-primary">Schedule Exam</button>
                    <a href="exams.php" class="btn btn-secondary">Cancel</a>
                </form>
            </div>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>