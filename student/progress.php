<?php
require_once '../config.php';
require_once '../includes/auth.php';

requireStudent();

$student_id = $_SESSION['user_id'];

// Fetch Exam Scores
$stmt = $pdo->prepare("SELECT e.title, ea.total_marks, ea.max_marks, ea.submitted_at 
    FROM exam_attempts ea 
    JOIN exams e ON ea.exam_id = e.id 
    WHERE ea.student_id = ? 
    ORDER BY ea.submitted_at ASC");
$stmt->execute([$student_id]);
$exam_scores = $stmt->fetchAll();

// Fetch Assignment Stats
$stmt = $pdo->prepare("SELECT COUNT(*) FROM assignment_submissions WHERE student_id = ?");
$stmt->execute([$student_id]);
$submitted_assignments = $stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT COUNT(*) FROM assignments WHERE class = (SELECT class FROM users WHERE id = ?) AND batch = (SELECT batch FROM users WHERE id = ?)");
$stmt->execute([$student_id, $student_id]);
$total_assignments = $stmt->fetchColumn();

require_once '../includes/header.php';
?>

<div class="row mb-4">
    <div class="col-md-12">
        <h2>My Progress</h2>
    </div>
</div>

<div class="row mb-4">
    <div class="col-md-6">
        <div class="card shadow-sm h-100">
            <div class="card-header">Assignment Completion</div>
            <div class="card-body text-center">
                <h3 class="display-4"><?php echo $submitted_assignments; ?> / <?php echo $total_assignments; ?></h3>
                <div class="progress mt-3">
                    <?php
                    $percentage = ($total_assignments > 0) ? ($submitted_assignments / $total_assignments) * 100 : 0;
                    ?>
                    <div class="progress-bar bg-success" role="progressbar" style="width: <?php echo $percentage; ?>%"
                        aria-valuenow="<?php echo $percentage; ?>" aria-valuemin="0" aria-valuemax="100">
                        <?php echo round($percentage); ?>%</div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <div class="card shadow-sm h-100">
            <div class="card-header">Exam Performance History</div>
            <div class="card-body">
                <canvas id="examChart"></canvas>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-12">
        <div class="card shadow-sm">
            <div class="card-header">Recent Exam Results</div>
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead>
                        <tr>
                            <th>Exam</th>
                            <th>Date</th>
                            <th>Score</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($exam_scores as $score): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($score['title']); ?></td>
                                <td><?php echo date('d M Y', strtotime($score['submitted_at'])); ?></td>
                                <td><?php echo $score['total_marks']; ?> / <?php echo $score['max_marks']; ?></td>
                                <td>
                                    <?php
                                    $perc = ($score['max_marks'] > 0) ? ($score['total_marks'] / $score['max_marks']) * 100 : 0;
                                    echo round($perc, 1) . '%';
                                    ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    const ctx = document.getElementById('examChart').getContext('2d');
    const examChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: <?php echo json_encode(array_column($exam_scores, 'title')); ?>,
            datasets: [{
                label: 'Score (%)',
                data: <?php
                $percentages = array_map(function ($s) {
                    return ($s['max_marks'] > 0) ? ($s['total_marks'] / $s['max_marks']) * 100 : 0;
                }, $exam_scores);
                echo json_encode($percentages);
                ?>,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
</script>

<?php require_once '../includes/footer.php'; ?>