import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, GraduationCap, BarChart2, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const isActive = (path) => {
        return location.pathname.includes(path) ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white';
    };

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
        { path: '/admin/students', icon: Users, label: 'Students' },
        { path: '/admin/assignments', icon: FileText, label: 'Assignments' },
        { path: '/admin/exams', icon: GraduationCap, label: 'Exams' },
        { path: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
    ];

    return (
        <div className="w-64 bg-slate-900 min-h-screen flex flex-col text-white transition-all duration-300">
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    DPA Admin
                </h2>
                <p className="text-xs text-slate-500 mt-1">Academic Portal</p>
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

export default AdminSidebar;
