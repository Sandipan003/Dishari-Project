import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FileText, GraduationCap, TrendingUp, Clock } from 'lucide-react';

const StudentOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        pending_assignments: 0,
        upcoming_exams: 0,
        average_score: 0,
        study_hours: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`/api/student.php?path=dashboard_stats&student_id=${user.id}`);
                if (response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Error fetching student stats", error);
            }
        };
        if (user) fetchStats();
    }, [user]);

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Welcome back, {user?.full_name}!</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard icon={FileText} label="Pending Assignments" value={stats.pending_assignments} color="bg-orange-500" />
                <StatCard icon={GraduationCap} label="Upcoming Exams" value={stats.upcoming_exams} color="bg-blue-500" />
                <StatCard icon={TrendingUp} label="Average Score" value={`${stats.average_score}%`} color="bg-green-500" />
                <StatCard icon={Clock} label="Study Hours" value={`${stats.study_hours}h`} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold mb-4">Recent Announcements</h3>
                    <p className="text-slate-500">No new announcements.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold mb-4">Upcoming Deadlines</h3>
                    <p className="text-slate-500">No upcoming deadlines.</p>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 mr-4`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
    </div>
);

export default StudentOverview;
