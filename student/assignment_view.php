<?php
require_once '../config.php';
require_once '../includes/auth.php';

requireStudent();

$assignment_id = $_GET['id'] ?? 0;
$student_id = $_SESSION['user_id'];

$stmt = $pdo->prepare("SELECT * FROM assignments WHERE id = ?");
$stmt->execute([$assignment_id]);
$assignment = $stmt->fetch();

if (!$assignment) {
    header("Location: assignments.php");
    exit;
}

// Check submission
$stmt = $pdo->prepare("SELECT * FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?");
$stmt->execute([$assignment_id, $student_id]);
$submission = $stmt->fetch();

$message = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && !$submission) {
    $submission_text = $_POST['submission_text'];

    // Handle File Upload
    $submission_file = null;
    if (isset($_FILES['submission_file']) && $_FILES['submission_file']['error'] == 0) {
        $target_dir = "../uploads/submissions/";
        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }
        $file_name = time() . '_' . basename($_FILES["submission_file"]["name"]);
        $target_file = $target_dir . $file_name;

        if (move_uploaded_file($_FILES["submission_file"]["tmp_name"], $target_file)) {
            $submission_file = "uploads/submissions/" . $file_name;
        }
    }

    $stmt = $pdo->prepare("INSERT INTO assignment_submissions (assignment_id, student_id, submission_file, submission_text) VALUES (?, ?, ?, ?)");
    if ($stmt->execute([$assignment_id, $student_id, $submission_file, $submission_text])) {
        $message = "Assignment submitted successfully!";
        // Refresh
        $stmt = $pdo->prepare("SELECT * FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?");
        $stmt->execute([$assignment_id, $student_id]);
        $submission = $stmt->fetch();
    } else {
        $message = "Failed to submit assignment.";
    }
}

require_once '../includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-8">
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
                <h4 class="mb-0"><?php echo htmlspecialchars($assignment['title']); ?></h4>
            </div>
            <div class="card-body">
                <p><strong>Due Date:</strong> <?php echo date('d M Y', strtotime($assignment['due_date'])); ?></p>
                <p><?php echo nl2br(htmlspecialchars($assignment['description'])); ?></p>

                <?php if ($assignment['file_path']): ?>
                    <a href="<?php echo BASE_URL . $assignment['file_path']; ?>" class="btn btn-outline-info mb-3"
                        target="_blank"><i class="fas fa-download"></i> Download Attachment</a>
                <?php endif; ?>

                <hr>

                <?php if ($submission): ?>
                    <div class="alert alert-success">
                        <h5><i class="fas fa-check-circle"></i> Submitted</h5>
                        <p>Submitted on: <?php echo date('d M Y H:i', strtotime($submission['submitted_at'])); ?></p>
                        <?php if ($submission['submission_file']): ?>
                            <a href="<?php echo BASE_URL . $submission['submission_file']; ?>" target="_blank">View Your
                                File</a>
                        <?php endif; ?>
                    </div>
                <?php else: ?>
                    <?php if ($message): ?>
                        <div class="alert alert-info"><?php echo $message; ?></div>
                    <?php endif; ?>

                    <h5>Submit Assignment</h5>
                    <form method="POST" action="" enctype="multipart/form-data">
                        <div class="mb-3">
                            <label class="form-label">Your Answer / Notes</label>
                            <textarea class="form-control" name="submission_text" rows="3"></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Upload File (Optional)</label>
                            <input type="file" class="form-control" name="submission_file">
                        </div>
                        <button type="submit" class="btn btn-success">Submit</button>
                    </form>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>