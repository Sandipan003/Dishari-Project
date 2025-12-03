<?php
require_once '../config.php';
require_once '../includes/auth.php';

requireAdmin();

$id = $_GET['id'] ?? 0;
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ? AND role = 'student'");
$stmt->execute([$id]);
$student = $stmt->fetch();

if (!$student) {
    header("Location: students.php");
    exit;
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = trim($_POST['name']);
    $class = trim($_POST['class']);
    $batch = trim($_POST['batch']);
    $phone = trim($_POST['phone']);
    $status = $_POST['status'];

    if (empty($name)) {
        $error = "Name is required.";
    } else {
        $stmt = $pdo->prepare("UPDATE users SET name = ?, class = ?, batch = ?, phone = ?, status = ? WHERE id = ?");
        if ($stmt->execute([$name, $class, $batch, $phone, $status, $id])) {
            $success = "Student updated successfully.";
            // Refresh data
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$id]);
            $student = $stmt->fetch();
        } else {
            $error = "Failed to update student.";
        }
    }
}

require_once '../includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-8">
        <div class="card shadow-sm">
            <div class="card-header bg-warning text-dark">
                <h4 class="mb-0">Edit Student</h4>
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
                        <label class="form-label">Full Name</label>
                        <input type="text" class="form-control" name="name"
                            value="<?php echo htmlspecialchars($student['name']); ?>" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email Address</label>
                        <input type="email" class="form-control"
                            value="<?php echo htmlspecialchars($student['email']); ?>" disabled>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Class</label>
                            <input type="text" class="form-control" name="class"
                                value="<?php echo htmlspecialchars($student['class']); ?>">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Batch</label>
                            <input type="text" class="form-control" name="batch"
                                value="<?php echo htmlspecialchars($student['batch']); ?>">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Phone Number</label>
                        <input type="text" class="form-control" name="phone"
                            value="<?php echo htmlspecialchars($student['phone']); ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Status</label>
                        <select class="form-select" name="status">
                            <option value="active" <?php echo $student['status'] == 'active' ? 'selected' : ''; ?>>Active
                            </option>
                            <option value="inactive" <?php echo $student['status'] == 'inactive' ? 'selected' : ''; ?>>
                                Inactive</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Update Student</button>
                    <a href="students.php" class="btn btn-secondary">Cancel</a>
                </form>
            </div>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>