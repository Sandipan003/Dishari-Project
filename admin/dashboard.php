<?php
require_once '../config.php';
require_once '../includes/auth.php';

requireAdmin();

// Fetch Stats
$stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'");
$student_count = $stmt->fetchColumn();

$stmt = $pdo->query("SELECT COUNT(*) FROM assignments");
$assignment_count = $stmt->fetchColumn();

$stmt = $pdo->query("SELECT COUNT(*) FROM exams");
$exam_count = $stmt->fetchColumn();

require_once '../includes/header.php';
?>

<div class="row mb-4">
    <div class="col-md-12">
        <h2>Admin Dashboard</h2>
        <p>Welcome back, <?php echo htmlspecialchars($_SESSION['name']); ?>!</p>
    </div>
</div>

<div class="row mb-4">
    <div class="col-md-4">
        <div class="card text-white bg-primary mb-3">
            <div class="card-header">Total Students</div>
            <div class="card-body">
                <h5 class="card-title display-4"><?php echo $student_count; ?></h5>
                <a href="students.php" class="text-white">Manage Students <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card text-white bg-success mb-3">
            <div class="card-header">Assignments</div>
            <div class="card-body">
                <h5 class="card-title display-4"><?php echo $assignment_count; ?></h5>
                <a href="assignments.php" class="text-white">Manage Assignments <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card text-white bg-warning mb-3">
            <div class="card-header">Exams</div>
            <div class="card-body">
                <h5 class="card-title display-4"><?php echo $exam_count; ?></h5>
                <a href="exams.php" class="text-white">Manage Exams <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-6">
        <div class="card shadow-sm">
            <div class="card-header">Quick Actions</div>
            <div class="list-group list-group-flush">
                <a href="student_create.php" class="list-group-item list-group-item-action">Add New Student</a>
                <a href="assignment_create.php" class="list-group-item list-group-item-action">Upload Assignment</a>
                <a href="exam_create.php" class="list-group-item list-group-item-action">Schedule Exam</a>
                <a href="progress.php" class="list-group-item list-group-item-action">View Progress</a>
            </div>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>