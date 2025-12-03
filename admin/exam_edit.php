<?php
require_once '../config.php';
require_once '../includes/auth.php';

requireAdmin();

$id = $_GET['id'] ?? 0;
$stmt = $pdo->prepare("SELECT * FROM exams WHERE id = ?");
$stmt->execute([$id]);
$exam = $stmt->fetch();

if (!$exam) {
    header("Location: exams.php");
    exit;
}

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
        $stmt = $pdo->prepare("UPDATE exams SET title = ?, description = ?, class = ?, batch = ?, start_time = ?, end_time = ?, duration_minutes = ? WHERE id = ?");
        if ($stmt->execute([$title, $description, $class, $batch, $start_time, $end_time, $duration, $id])) {
            $success = "Exam updated successfully.";
            // Refresh data
            $stmt = $pdo->prepare("SELECT * FROM exams WHERE id = ?");
            $stmt->execute([$id]);
            $exam = $stmt->fetch();
        } else {
            $error = "Failed to update exam.";
        }
    }
}

require_once '../includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-8">
        <div class="card shadow-sm">
            <div class="card-header bg-warning text-dark">
                <h4 class="mb-0">Edit Exam</h4>
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
                            <input type="text" class="form-control" name="title"
                                value="<?php echo htmlspecialchars($exam['title']); ?>" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Duration (Minutes)</label>
                            <input type="number" class="form-control" name="duration"
                                value="<?php echo $exam['duration_minutes']; ?>" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" name="description"
                            rows="2"><?php echo htmlspecialchars($exam['description']); ?></textarea>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Class</label>
                            <input type="text" class="form-control" name="class"
                                value="<?php echo htmlspecialchars($exam['class']); ?>" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Batch</label>
                            <input type="text" class="form-control" name="batch"
                                value="<?php echo htmlspecialchars($exam['batch']); ?>" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Start Time</label>
                            <input type="datetime-local" class="form-control" name="start_time"
                                value="<?php echo date('Y-m-d\TH:i', strtotime($exam['start_time'])); ?>" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">End Time</label>
                            <input type="datetime-local" class="form-control" name="end_time"
                                value="<?php echo date('Y-m-d\TH:i', strtotime($exam['end_time'])); ?>" required>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Update Exam Details</button>
                    <a href="exams.php" class="btn btn-secondary">Cancel</a>
                </form>
            </div>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>