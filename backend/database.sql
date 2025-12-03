CREATE DATABASE IF NOT EXISTS dishari_project;
USE dishari_project;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('admin', 'student') NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    class VARCHAR(50),
    batch VARCHAR(50),
    profile_picture_url VARCHAR(255),
    phone VARCHAR(20),
    extra_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    class VARCHAR(50),
    batch VARCHAR(50),
    file_path VARCHAR(255),
    due_date DATETIME,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT,
    student_id INT,
    file_path VARCHAR(255),
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('submitted', 'graded', 'late') DEFAULT 'submitted',
    marks_obtained FLOAT,
    feedback TEXT,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    class VARCHAR(50),
    batch VARCHAR(50),
    total_marks INT,
    start_time DATETIME,
    end_time DATETIME,
    duration_minutes INT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS exam_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT,
    question_text TEXT NOT NULL,
    options JSON NOT NULL, -- Stores ["Option A", "Option B", "Option C", "Option D"]
    correct_answer VARCHAR(255) NOT NULL, -- Stores the correct option string or index
    marks INT DEFAULT 1,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exam_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT,
    student_id INT,
    marks_obtained FLOAT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('completed', 'absent', 'auto_submitted') DEFAULT 'completed',
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (role, username, email, password_hash, full_name) 
VALUES ('admin', 'admin', 'admin@dpa.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Admin')
ON DUPLICATE KEY UPDATE id=id;
