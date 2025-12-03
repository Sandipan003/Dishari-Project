import { Routes, Route } from 'react-router-dom';
import StudentSidebar from '../../components/StudentSidebar';
import StudentAssignments from './StudentAssignments';
import StudentExams from './StudentExams';
import ExamInterface from './ExamInterface';
import StudentProgress from './StudentProgress';
import StudentProfile from './StudentProfile'; // New
import StudentLeaderboard from './StudentLeaderboard'; // New
import StudentOverview from './StudentOverview'; // Extracted

const StudentDashboard = () => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <StudentSidebar />
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-slate-800">Student Portal</h1>
                    <div className="flex items-center space-x-4">
                        {/* Profile Pic Placeholder */}
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            S
                        </div>
                    </div>
                </header>
                <main className="p-8">
                    <Routes>
                        <Route path="dashboard" element={<StudentOverview />} />
                        <Route path="assignments" element={<StudentAssignments />} />
                        <Route path="exams" element={<StudentExams />} />
                        <Route path="exam/:examId" element={<ExamInterface />} />
                        <Route path="progress" element={<StudentProgress />} />
                        <Route path="profile" element={<StudentProfile />} />
                        <Route path="leaderboard" element={<StudentLeaderboard />} />
                        <Route path="*" element={<StudentOverview />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
