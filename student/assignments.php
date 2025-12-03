<?php
require_once '../config.php';
require_once '../includes/auth.php';

requireStudent();

$student_id = $_SESSION['user_id'];
$stmt = $pdo->prepare("SELECT class, batch FROM users WHERE id = ?");
$stmt->execute([$student_id]);
$student = $stmt->fetch();

$stmt = $pdo->prepare("SELECT a.*, 
    (SELECT COUNT(*) FROM assignment_submissions WHERE assignment_id = a.id AND student_id = ?) as is_submitted 
    FROM assignments a 
    WHERE class = ? AND batch = ? 
    ORDER BY due_date ASC");
$stmt->execute([$student_id, $student['class'], $student['batch']]);
$assignments = $stmt->fetchAll();

require_once '../includes/header.php';
?>

<div class="row mb-4">
    <div class="col-md-12">
        <h2>My Assignments</h2>
    </div>
</div>

<div class="row">
    <?php if (count($assignments) > 0): ?>
        <?php foreach ($assignments as $assignment): ?>
            <div class="col-md-6 mb-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h5 class="card-title"><?php echo htmlspecialchars($assignment['title']); ?></h5>
                        <p class="card-text text-muted">Due: <?php echo date('d M Y', strtotime($assignment['due_date'])); ?>
                        </p>
                        <p class="card-text"><?php echo substr(htmlspecialchars($assignment['description']), 0, 100) . '...'; ?>
                        </p>

                        <?php if ($assignment['is_submitted']): ?>
                            <span class="badge bg-success mb-2">Submitted</span>
                        <?php else: ?>
                            <span class="badge bg-warning text-dark mb-2">Pending</span>
                        <?php endif; ?>

                        <div class="d-grid gap-2">
                            <a href="assignment_view.php?id=<?php echo $assignment['id']; ?>"
                                class="btn btn-outline-primary">View Details</a>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    <?php else: ?>
        <div class="col-12">
            <div class="alert alert-info">No assignments found for your class/batch.</div>
        </div>
    <?php endif; ?>
</div>

<?php require_once '../includes/footer.php'; ?>