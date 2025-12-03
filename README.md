# Dishari Physics Academy (DPA) Website

A comprehensive academic website for Dishari Physics Academy.

## Requirements
- XAMPP (Apache + MySQL)
- PHP 8.0+

## Setup Instructions

1.  **Database Setup**:
    - Open phpMyAdmin (usually `http://localhost/phpmyadmin`).
    - Create a new database named `dpa_db`.
    - Import the `database.sql` file located in the project root into this database.

2.  **Project Configuration**:
    - Ensure the project folder is in your XAMPP `htdocs` directory (e.g., `C:\xampp\htdocs\Dishari Project`).
    - If your folder name is different, update the `BASE_URL` in `config.php`.

3.  **Run the Project**:
    - Start Apache and MySQL in XAMPP Control Panel.
    - Open your browser and navigate to `http://localhost/Dishari%20Project/`.

## Default Credentials

**Admin:**
- Email: `admin@dpa.com`
- Password: `password`

**Student:**
- Email: `student@dpa.com`
- Password: `password`

## Features
- **Admin**: Manage students, assignments, exams, and view progress.
- **Student**: View assignments, take exams, and track progress.
