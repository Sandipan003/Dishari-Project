import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, GraduationCap, BarChart2, User, Award, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudentSidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const isActive = (path) => {
        return location.pathname.includes(path) ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white';
    };

    const menuItems = [
        { path: '/student/dashboard', icon: LayoutDashboard, label: 'Overview' },
        { path: '/student/assignments', icon: FileText, label: 'Assignments' },
        { path: '/student/exams', icon: GraduationCap, label: 'Exams' },
        { path: '/student/progress', icon: BarChart2, label: 'Progress' },
        { path: '/student/leaderboard', icon: Award, label: 'Leaderboard' },
        { path: '/student/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="w-64 bg-slate-900 min-h-screen flex flex-col text-white transition-all duration-300">
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    DPA Student
                </h2>
                <p className="text-xs text-slate-500 mt-1">Learning Portal</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(item.path)}`}
                    >
                        <item.icon size={20} className={`mr-3 ${location.pathname.includes(item.path) ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors"
                >
                    <LogOut size={20} className="mr-3" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default StudentSidebar;
