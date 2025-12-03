# Dishari Physics Academy (DPA) Website

A comprehensive academic portal for Dishari Physics Academy featuring Admin and Student dashboards, assignment management, and online exams.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, React Router, Recharts, Lucide React
- **Backend**: PHP (Vanilla), MySQL
- **Environment**: XAMPP (Apache/MySQL)

---

## Setup Instructions

### Prerequisites
- **Node.js & npm**: Download and install from [nodejs.org](https://nodejs.org/).
- **XAMPP (Windows/Mac)**: Download and install from [apachefriends.org](https://www.apachefriends.org/).
  - *Note for Mac Users*: You can also use MAMP if preferred, but XAMPP is recommended for consistency.

### 1. Database Setup
1.  Start **Apache** and **MySQL** from the XAMPP Control Panel.
2.  Open your browser and navigate to `http://localhost/phpmyadmin`.
3.  Click **New** in the sidebar to create a database.
4.  Name the database `dishari_project` and click **Create**.
5.  Select the `dishari_project` database.
6.  Go to the **Import** tab.
7.  Click **Choose File** and select `backend/database.sql` from the project directory.
8.  Click **Import** at the bottom of the page.

### 2. Backend Setup
1.  Move the entire project folder to your XAMPP `htdocs` directory.
    - **Windows**: `C:\xampp\htdocs\Dishari Project`
    - **Mac**: `/Applications/XAMPP/xamppfiles/htdocs/Dishari Project`
2.  Open `backend/config/db.php` and verify the database credentials:
    ```php
    $host = 'localhost';
    $db_name = 'dishari_project';
    $username = 'root';
    $password = ''; // Default for XAMPP is empty. MAMP users might need 'root'.
    ```

### 3. Frontend Setup
1.  Open a terminal (Command Prompt, PowerShell, or Terminal).
2.  Navigate to the `frontend` directory inside the project folder:
    ```bash
    cd "path/to/Dishari Project/frontend"
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
5.  The application will start, usually at `http://localhost:5173`. Open this URL in your browser.

---

## Usage Guide

### Admin Portal
- **Login**: Use the default admin credentials.
    - **Username**: `admin`
    - **Password**: `admin123`
- **Features**:
    - **Dashboard**: View overall statistics.
    - **Students**: Add, edit, and view student profiles.
    - **Assignments**: Create and manage assignments.
    - **Exams**: Create exams with MCQ questions.
    - **Reports**: View student performance analytics.

### Student Portal
- **Login**: Use the credentials created by the Admin.
- **Features**:
    - **Dashboard**: View personal stats (pending assignments, upcoming exams).
    - **Assignments**: Download assignments and submit work.
    - **Exams**: Take timed online exams and view results immediately.
    - **Profile**: Update personal details and profile picture.

---

## Troubleshooting

### Common Issues
- **API Connection Failed**:
    - Ensure Apache and MySQL are running in XAMPP.
    - Check if the project is correctly placed in the `htdocs` folder.
    - Verify the `backend/config/db.php` credentials.
- **CORS Errors**:
    - The backend includes `cors.php` to handle cross-origin requests. Ensure your frontend is running on `localhost:5173` and backend on `localhost`.
- **"Result Not Found"**:
    - Ensure you have submitted the exam first. The result is only generated after submission.

### Mac-Specific Notes
- If using MAMP, the MySQL port might be `8889`. Update `db.php` accordingly:
    ```php
    $dsn = "mysql:host=$host;port=8889;dbname=$db_name";
    ```
- Permissions: If you face permission issues with file uploads, ensure the `backend/uploads` directory has write permissions:
    ```bash
    chmod -R 777 backend/uploads
    ```
