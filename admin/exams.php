<?php
require_once '../config.php';
require_once '../includes/auth.php';

requireAdmin();

$stmt = $pdo->query("SELECT e.*, u.name as created_by_name FROM exams e JOIN users u ON e.created_by = u.id ORDER BY e.start_time DESC");
$exams = $stmt->fetchAll();

require_once '../includes/header.php';
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>Manage Exams</h2>
    <a href="exam_create.php" class="btn btn-primary"><i class="fas fa-plus"></i> Schedule Exam</a>
</div>

<div class="table-responsive">
    <table class="table table-striped table-hover">
        <thead class="table-dark">
            <tr>
                <th>Title</th>
                <th>Class</th>
                <th>Batch</th>
                <th>Start Time</th>
                <th>Duration (mins)</th>
                <th>Created By</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (count($exams) > 0): ?>
                <?php foreach ($exams as $exam): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($exam['title']); ?></td>
                        <td><?php echo htmlspecialchars($exam['class']); ?></td>
                        <td><?php echo htmlspecialchars($exam['batch']); ?></td>
                        <td><?php echo date('d M Y H:i', strtotime($exam['start_time'])); ?></td>
                        <td><?php echo $exam['duration_minutes']; ?></td>
                        <td><?php echo htmlspecialchars($exam['created_by_name']); ?></td>
                        <td>
                            <a href="exam_edit.php?id=<?php echo $exam['id']; ?>" class="btn btn-sm btn-warning"><i
                                    class="fas fa-edit"></i> Edit</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="7" class="text-center">No exams scheduled.</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<?php require_once '../includes/footer.php'; ?>