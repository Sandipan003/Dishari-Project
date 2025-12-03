<?php
require_once '../config.php';
require_once '../includes/auth.php';

requireAdmin();

$stmt = $pdo->query("SELECT u.id, u.name, u.class, u.batch, 
    (SELECT COUNT(*) FROM assignment_submissions WHERE student_id = u.id) as completed_assignments,
    (SELECT COUNT(*) FROM exam_attempts WHERE student_id = u.id) as exams_taken
    FROM users u WHERE u.role = 'student' ORDER BY u.class, u.batch");
$students = $stmt->fetchAll();

require_once '../includes/header.php';
?>

<div class="row mb-4">
    <div class="col-md-12">
        <h2>Student Progress</h2>
    </div>
</div>

<div class="table-responsive">
    <table class="table table-bordered table-hover">
        <thead class="table-light">
            <tr>
                <th>Student Name</th>
                <th>Class</th>
                <th>Batch</th>
                <th>Assignments Submitted</th>
                <th>Exams Taken</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($students as $student): ?>
                <tr>
                    <td><?php echo htmlspecialchars($student['name']); ?></td>
                    <td><?php echo htmlspecialchars($student['class']); ?></td>
                    <td><?php echo htmlspecialchars($student['batch']); ?></td>
                    <td><?php echo $student['completed_assignments']; ?></td>
                    <td><?php echo $student['exams_taken']; ?></td>
                    <td>
                        <a href="student_edit.php?id=<?php echo $student['id']; ?>" class="btn btn-sm btn-info">View
                            Details</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

<?php require_once '../includes/footer.php'; ?>