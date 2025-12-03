import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const StudentProgress = () => {
    const { user } = useAuth();
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch student's own analytics
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/admin.php?path=student_analytics&id=${user.id}`);
                // Transform data for charts if needed
                const formattedData = response.data.map(item => ({
                    name: `Exam ${item.exam_id}`,
                    marks: item.marks_obtained
                }));
                setData(formattedData);
            } catch (error) { console.error(error); }
        };
        fetchData();
    }, [user]);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">My Progress</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6">Performance History</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="marks" stroke="#4f46e5" strokeWidth={3} dot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6">Score Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="marks" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProgress;
