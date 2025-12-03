<?php
require_once '../config.php';
require_once '../includes/auth.php';

requireAdmin();

$stmt = $pdo->query("SELECT a.*, u.name as created_by_name FROM assignments a JOIN users u ON a.created_by = u.id ORDER BY a.created_at DESC");
$assignments = $stmt->fetchAll();

require_once '../includes/header.php';
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>Manage Assignments</h2>
    <a href="assignment_create.php" class="btn btn-primary"><i class="fas fa-plus"></i> Create Assignment</a>
</div>

<div class="table-responsive">
    <table class="table table-striped table-hover">
        <thead class="table-dark">
            <tr>
                <th>Title</th>
                <th>Class</th>
                <th>Batch</th>
                <th>Due Date</th>
                <th>Created By</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (count($assignments) > 0): ?>
                <?php foreach ($assignments as $assignment): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($assignment['title']); ?></td>
                        <td><?php echo htmlspecialchars($assignment['class']); ?></td>
                        <td><?php echo htmlspecialchars($assignment['batch']); ?></td>
                        <td><?php echo date('d M Y', strtotime($assignment['due_date'])); ?></td>
                        <td><?php echo htmlspecialchars($assignment['created_by_name']); ?></td>
                        <td>
                            <a href="assignment_edit.php?id=<?php echo $assignment['id']; ?>" class="btn btn-sm btn-warning"><i
                                    class="fas fa-edit"></i> Edit</a>
                            <?php if ($assignment['file_path']): ?>
                                <a href="<?php echo BASE_URL . $assignment['file_path']; ?>" class="btn btn-sm btn-info"
                                    target="_blank"><i class="fas fa-download"></i> View File</a>
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="6" class="text-center">No assignments found.</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<?php require_once '../includes/footer.php'; ?>