<?php
require_once 'config.php';
require_once 'includes/header.php';
?>

<div class="p-5 mb-4 bg-light rounded-3 text-center hero-section">
    <div class="container-fluid py-5">
        <h1 class="display-5 fw-bold text-primary">Dishari Physics Academy</h1>
        <p class="col-md-8 fs-4 mx-auto">Empowering students to master the laws of the universe. Join us to excel in
            Physics.</p>
        <a href="login.php" class="btn btn-primary btn-lg" type="button">Student Login</a>
    </div>
</div>

<div class="row mb-5">
    <div class="col-md-6">
        <h2>About Us</h2>
        <p>Dishari Physics Academy (DPA) is dedicated to providing top-quality physics education for competitive exams
            and board preparations. Our mission is to simplify complex concepts and foster a deep understanding of the
            subject.</p>
        <p>With experienced faculty and a structured curriculum, we ensure every student achieves their potential.</p>
    </div>
    <div class="col-md-6">
        <img src="https://via.placeholder.com/600x300?text=Physics+Classroom" class="img-fluid rounded shadow-sm"
            alt="About DPA">
    </div>
</div>

<div class="row mb-5">
    <div class="col-12 text-center mb-4">
        <h2>Success Stories</h2>
    </div>
    <div class="col-md-4">
        <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
                <img src="https://via.placeholder.com/100" class="rounded-circle mb-3" alt="Student 1">
                <h5 class="card-title">Rohan Das</h5>
                <p class="card-text">"DPA helped me crack JEE Advanced with a top rank. The concepts were taught so
                    clearly!"</p>
                <span class="badge bg-success">AIR 150</span>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
                <img src="https://via.placeholder.com/100" class="rounded-circle mb-3" alt="Student 2">
                <h5 class="card-title">Priya Roy</h5>
                <p class="card-text">"The regular exams and assignments at Dishari kept me on track for my Board exams."
                </p>
                <span class="badge bg-success">98% in Boards</span>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
                <img src="https://via.placeholder.com/100" class="rounded-circle mb-3" alt="Student 3">
                <h5 class="card-title">Amit Kumar</h5>
                <p class="card-text">"Best physics coaching in the city. The teachers are very supportive."</p>
                <span class="badge bg-success">NEET Rank 500</span>
            </div>
        </div>
    </div>
</div>

<div class="row text-center mb-5">
    <div class="col-12">
        <h3>Follow Us</h3>
        <div class="mt-3">
            <a href="#" class="btn btn-outline-danger btn-lg me-2"><i class="fab fa-youtube"></i> YouTube</a>
            <a href="#" class="btn btn-outline-primary btn-lg"><i class="fab fa-instagram"></i> Instagram</a>
        </div>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>