<?php
require_once '../config.php';
require_once '../includes/auth.php';

requireAdmin();

$search = $_GET['search'] ?? '';
$class_filter = $_GET['class'] ?? '';

$query = "SELECT * FROM users WHERE role = 'student'";
$params = [];

if ($search) {
    $query .= " AND (name LIKE ? OR email LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

if ($class_filter) {
    $query .= " AND class = ?";
    $params[] = $class_filter;
}

$query .= " ORDER BY created_at DESC";

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$students = $stmt->fetchAll();

require_once '../includes/header.php';
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>Manage Students</h2>
    <a href="student_create.php" class="btn btn-primary"><i class="fas fa-plus"></i> Add Student</a>
</div>

<div class="card shadow-sm mb-4">
    <div class="card-body">
        <form method="GET" class="row g-3">
            <div class="col-md-4">
                <input type="text" class="form-control" name="search" placeholder="Search by name or email"
                    value="<?php echo htmlspecialchars($search); ?>">
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control" name="class" placeholder="Filter by Class"
                    value="<?php echo htmlspecialchars($class_filter); ?>">
            </div>
            <div class="col-md-2">
                <button type="submit" class="btn btn-secondary w-100">Filter</button>
            </div>
        </form>
    </div>
</div>

<div class="table-responsive">
    <table class="table table-striped table-hover">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Class</th>
                <th>Batch</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (count($students) > 0): ?>
                <?php foreach ($students as $student): ?>
                    <tr>
                        <td><?php echo $student['id']; ?></td>
                        <td><?php echo htmlspecialchars($student['name']); ?></td>
                        <td><?php echo htmlspecialchars($student['email']); ?></td>
                        <td><?php echo htmlspecialchars($student['class']); ?></td>
                        <td><?php echo htmlspecialchars($student['batch']); ?></td>
                        <td>
                            <span class="badge bg-<?php echo $student['status'] == 'active' ? 'success' : 'danger'; ?>">
                                <?php echo ucfirst($student['status']); ?>
                            </span>
                        </td>
                        <td>
                            <a href="student_edit.php?id=<?php echo $student['id']; ?>" class="btn btn-sm btn-warning"><i
                                    class="fas fa-edit"></i> Edit</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="7" class="text-center">No students found.</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<?php require_once '../includes/footer.php'; ?>