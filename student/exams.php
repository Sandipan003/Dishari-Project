<?php
require_once '../config.php';
require_once '../includes/auth.php';

requireStudent();

$student_id = $_SESSION['user_id'];
$stmt = $pdo->prepare("SELECT class, batch FROM users WHERE id = ?");
$stmt->execute([$student_id]);
$student = $stmt->fetch();

$stmt = $pdo->prepare("SELECT e.*, 
    (SELECT COUNT(*) FROM exam_attempts WHERE exam_id = e.id AND student_id = ?) as is_attempted 
    FROM exams e 
    WHERE class = ? AND batch = ? 
    ORDER BY start_time DESC");
$stmt->execute([$student_id, $student['class'], $student['batch']]);
$exams = $stmt->fetchAll();

require_once '../includes/header.php';
?>

<div class="row mb-4">
    <div class="col-md-12">
        <h2>My Exams</h2>
    </div>
</div>

<div class="row">
    <?php if (count($exams) > 0): ?>
        <?php foreach ($exams as $exam): ?>
            <?php
            $now = new DateTime();
            $start = new DateTime($exam['start_time']);
            $end = new DateTime($exam['end_time']);
            $status = '';
            $btn_class = 'btn-secondary disabled';
            $btn_text = 'Upcoming';
            $link = '#';

            if ($exam['is_attempted']) {
                $status = 'Attempted';
                $btn_class = 'btn-success';
                $btn_text = 'View Result';
                $link = 'exam_result.php?id=' . $exam['id'];
            } elseif ($now >= $start && $now <= $end) {
                $status = 'Live';
                $btn_class = 'btn-primary';
                $btn_text = 'Take Exam';
                $link = 'exam_take.php?id=' . $exam['id'];
            } elseif ($now > $end) {
                $status = 'Expired';
                $btn_class = 'btn-danger disabled';
                $btn_text = 'Missed';
            } else {
                $status = 'Upcoming';
            }
            ?>
            <div class="col-md-6 mb-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <h5 class="card-title"><?php echo htmlspecialchars($exam['title']); ?></h5>
                            <span
                                class="badge bg-<?php echo ($status == 'Live' ? 'success' : ($status == 'Expired' ? 'secondary' : 'info')); ?>">
                                <?php echo $status; ?>
                            </span>
                        </div>
                        <p class="card-text text-muted">
                            Start: <?php echo $start->format('d M Y H:i'); ?><br>
                            Duration: <?php echo $exam['duration_minutes']; ?> mins
                        </p>
                        <p class="card-text"><?php echo htmlspecialchars($exam['description']); ?></p>

                        <div class="d-grid gap-2">
                            <a href="<?php echo $link; ?>" class="btn <?php echo $btn_class; ?>"><?php echo $btn_text; ?></a>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    <?php else: ?>
        <div class="col-12">
            <div class="alert alert-info">No exams scheduled for your class/batch.</div>
        </div>
    <?php endif; ?>
</div>

<?php require_once '../includes/footer.php'; ?>