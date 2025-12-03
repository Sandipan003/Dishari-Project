import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FileText, CheckCircle, TrendingUp } from 'lucide-react';

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        total_students: 0,
        active_assignments: 0,
        pending_reviews: 0,
        avg_performance: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/admin.php?path=analytics');
                if (response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard icon={Users} label="Total Students" value={stats.total_students} color="bg-blue-500" />
                <StatCard icon={FileText} label="Active Assignments" value={stats.active_assignments} color="bg-purple-500" />
                <StatCard icon={CheckCircle} label="Pending Reviews" value={stats.pending_reviews} color="bg-orange-500" />
                <StatCard icon={TrendingUp} label="Avg. Performance" value={`${stats.avg_performance}%`} color="bg-green-500" />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <p className="text-slate-500">No recent activity.</p>
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

export default DashboardOverview;
