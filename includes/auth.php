<?php
// Check if user is logged in
function isLoggedIn()
{
    return isset($_SESSION['user_id']);
}

// Redirect if not logged in
function requireLogin()
{
    if (!isLoggedIn()) {
        header("Location: " . BASE_URL . "login.php");
        exit;
    }
}

// Redirect if not admin
function requireAdmin()
{
    requireLogin();
    if ($_SESSION['role'] !== 'admin') {
        header("Location: " . BASE_URL . "student/dashboard.php"); // Redirect to student dashboard if not admin
        exit;
    }
}

// Redirect if not student
function requireStudent()
{
    requireLogin();
    if ($_SESSION['role'] !== 'student') {
        header("Location: " . BASE_URL . "admin/dashboard.php"); // Redirect to admin dashboard if not student
        exit;
    }
}

// Redirect if already logged in (for login page)
function redirectIfLoggedIn()
{
    if (isLoggedIn()) {
        if ($_SESSION['role'] === 'admin') {
            header("Location: " . BASE_URL . "admin/dashboard.php");
        } else {
            header("Location: " . BASE_URL . "student/dashboard.php");
        }
        exit;
    }
}
?>