<?php
require_once '../config.php';
require_once '../includes/auth.php';

requireStudent();

$student_id = $_SESSION['user_id'];

// Fetch Student Details
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$student_id]);
$student = $stmt->fetch();

// Fetch Pending Assignments Count
$stmt = $pdo->prepare("SELECT COUNT(*) FROM assignments WHERE class = ? AND batch = ? AND id NOT IN (SELECT assignment_id FROM assignment_submissions WHERE student_id = ?)");
$stmt->execute([$student['class'], $student['batch'], $student_id]);
$pending_assignments = $stmt->fetchColumn();

// Fetch Upcoming Exams Count
$stmt = $pdo->prepare("SELECT COUNT(*) FROM exams WHERE class = ? AND batch = ? AND start_time > NOW()");
$stmt->execute([$student['class'], $student['batch']]);
$upcoming_exams = $stmt->fetchColumn();

require_once '../includes/header.php';
?>

<div class="row mb-4">
    <div class="col-md-12">
        <h2>Student Dashboard</h2>
        <p>Welcome, <?php echo htmlspecialchars($student['name']); ?>!</p>
    </div>
</div>

<div class="row mb-4">
    <div class="col-md-4">
        <div class="card text-white bg-info mb-3">
            <div class="card-header">My Profile</div>
            <div class="card-body">
                <h5 class="card-title"><?php echo htmlspecialchars($student['name']); ?></h5>
                <p class="card-text">Class: <?php echo htmlspecialchars($student['class']); ?> | Batch:
                    <?php echo htmlspecialchars($student['batch']); ?></p>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card text-white bg-warning mb-3">
            <div class="card-header">Pending Assignments</div>
            <div class="card-body">
                <h5 class="card-title display-4"><?php echo $pending_assignments; ?></h5>
                <a href="assignments.php" class="text-white">View Assignments <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card text-white bg-danger mb-3">
            <div class="card-header">Upcoming Exams</div>
            <div class="card-body">
                <h5 class="card-title display-4"><?php echo $upcoming_exams; ?></h5>
                <a href="exams.php" class="text-white">View Exams <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-6">
        <div class="card shadow-sm">
            <div class="card-header">Quick Links</div>
            <div class="list-group list-group-flush">
                <a href="assignments.php" class="list-group-item list-group-item-action">My Assignments</a>
                <a href="exams.php" class="list-group-item list-group-item-action">My Exams</a>
                <a href="progress.php" class="list-group-item list-group-item-action">My Progress</a>
            </div>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>