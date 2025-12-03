import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import Students from './Students';
import Assignments from './Assignments';
import Exams from './Exams';
import Analytics from './Analytics'; // New component
import DashboardOverview from './DashboardOverview'; // Extracted component

const AdminDashboard = () => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            A
                        </div>
                    </div>
                </header>
                <main className="p-8">
                    <Routes>
                        <Route path="dashboard" element={<DashboardOverview />} />
                        <Route path="students" element={<Students />} />
                        <Route path="assignments" element={<Assignments />} />
                        <Route path="exams" element={<Exams />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="*" element={<DashboardOverview />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
