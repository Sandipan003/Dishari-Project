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
    $due_date = $_POST['due_date'];

    $file_path = null;

    if (empty($title) || empty($class) || empty($batch) || empty($due_date)) {
        $error = "Title, Class, Batch and Due Date are required.";
    } else {
        // Handle File Upload
        if (isset($_FILES['assignment_file']) && $_FILES['assignment_file']['error'] == 0) {
            $target_dir = "../uploads/assignments/";
            if (!file_exists($target_dir)) {
                mkdir($target_dir, 0777, true);
            }
            $file_name = time() . '_' . basename($_FILES["assignment_file"]["name"]);
            $target_file = $target_dir . $file_name;

            if (move_uploaded_file($_FILES["assignment_file"]["tmp_name"], $target_file)) {
                $file_path = "uploads/assignments/" . $file_name;
            } else {
                $error = "Sorry, there was an error uploading your file.";
            }
        }

        if (!$error) {
            $stmt = $pdo->prepare("INSERT INTO assignments (title, description, class, batch, file_path, due_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)");
            if ($stmt->execute([$title, $description, $class, $batch, $file_path, $due_date, $_SESSION['user_id']])) {
                $success = "Assignment created successfully.";
            } else {
                $error = "Failed to create assignment.";
            }
        }
    }
}

require_once '../includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-8">
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h4 class="mb-0">Create Assignment</h4>
            </div>
            <div class="card-body">
                <?php if ($error): ?>
                    <div class="alert alert-danger"><?php echo $error; ?></div>
                <?php endif; ?>
                <?php if ($success): ?>
                    <div class="alert alert-success"><?php echo $success; ?></div>
                <?php endif; ?>

                <form method="POST" action="" enctype="multipart/form-data">
                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" name="title" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" name="description" rows="3"></textarea>
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
                    <div class="mb-3">
                        <label class="form-label">Due Date</label>
                        <input type="date" class="form-control" name="due_date" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Attachment (PDF, Image, Doc)</label>
                        <input type="file" class="form-control" name="assignment_file">
                    </div>
                    <button type="submit" class="btn btn-primary">Create Assignment</button>
                    <a href="assignments.php" class="btn btn-secondary">Cancel</a>
                </form>
            </div>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>