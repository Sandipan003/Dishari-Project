<?php
require_once '../config.php';
require_once '../includes/auth.php';

requireAdmin();

$id = $_GET['id'] ?? 0;
$stmt = $pdo->prepare("SELECT * FROM assignments WHERE id = ?");
$stmt->execute([$id]);
$assignment = $stmt->fetch();

if (!$assignment) {
    header("Location: assignments.php");
    exit;
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = trim($_POST['title']);
    $description = trim($_POST['description']);
    $class = trim($_POST['class']);
    $batch = trim($_POST['batch']);
    $due_date = $_POST['due_date'];

    if (empty($title) || empty($class) || empty($batch) || empty($due_date)) {
        $error = "Title, Class, Batch and Due Date are required.";
    } else {
        $stmt = $pdo->prepare("UPDATE assignments SET title = ?, description = ?, class = ?, batch = ?, due_date = ? WHERE id = ?");
        if ($stmt->execute([$title, $description, $class, $batch, $due_date, $id])) {
            $success = "Assignment updated successfully.";
            // Refresh data
            $stmt = $pdo->prepare("SELECT * FROM assignments WHERE id = ?");
            $stmt->execute([$id]);
            $assignment = $stmt->fetch();
        } else {
            $error = "Failed to update assignment.";
        }
    }
}

require_once '../includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-8">
        <div class="card shadow-sm">
            <div class="card-header bg-warning text-dark">
                <h4 class="mb-0">Edit Assignment</h4>
            </div>
            <div class="card-body">
                <?php if ($error): ?>
                    <div class="alert alert-danger"><?php echo $error; ?></div>
                <?php endif; ?>
                <?php if ($success): ?>
                    <div class="alert alert-success"><?php echo $success; ?></div>
                <?php endif; ?>

                <form method="POST" action="">
                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" name="title"
                            value="<?php echo htmlspecialchars($assignment['title']); ?>" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" name="description"
                            rows="3"><?php echo htmlspecialchars($assignment['description']); ?></textarea>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Class</label>
                            <input type="text" class="form-control" name="class"
                                value="<?php echo htmlspecialchars($assignment['class']); ?>" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Batch</label>
                            <input type="text" class="form-control" name="batch"
                                value="<?php echo htmlspecialchars($assignment['batch']); ?>" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Due Date</label>
                        <input type="date" class="form-control" name="due_date"
                            value="<?php echo date('Y-m-d', strtotime($assignment['due_date'])); ?>" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Update Assignment</button>
                    <a href="assignments.php" class="btn btn-secondary">Cancel</a>
                </form>
            </div>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>