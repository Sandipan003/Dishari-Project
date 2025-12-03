import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trophy, Users } from 'lucide-react';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get('/api/admin.php?path=analytics');
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching analytics", error);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading analytics...</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">Analytics & Reports</h2>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Total Students</h3>
                        <Users className="opacity-80" />
                    </div>
                    <p className="text-4xl font-bold">{stats?.total_students || 0}</p>
                    <p className="text-sm opacity-80 mt-2">Active learners</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                        <Trophy className="text-yellow-500 mr-2" /> Top Performers
                    </h3>
                    <div className="space-y-3">
                        {stats?.toppers?.map((student, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${index === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-200 text-slate-600'}`}>
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="font-medium text-slate-800">{student.full_name}</p>
                                        <p className="text-xs text-slate-500">{student.class}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-green-600">{parseFloat(student.avg_marks).toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-6">Class Performance Overview</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats?.toppers}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="full_name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="avg_marks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
