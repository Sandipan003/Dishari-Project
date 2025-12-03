import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal } from 'lucide-react';

const StudentLeaderboard = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('/api/student.php?path=leaderboard');
                setLeaders(response.data);
            } catch (error) { console.error(error); }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center">
                    <Trophy className="text-yellow-500 mr-3" size={32} /> Class Leaderboard
                </h2>
                <p className="text-slate-500 mt-2">Top performers based on total exam scores</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                {leaders.map((student, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between p-6 border-b last:border-0 hover:bg-slate-50 transition-colors ${index < 3 ? 'bg-yellow-50/30' : ''}`}
                    >
                        <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-6 ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                    index === 1 ? 'bg-slate-200 text-slate-600' :
                                        index === 2 ? 'bg-orange-100 text-orange-600' :
                                            'bg-slate-100 text-slate-400'
                                }`}>
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{student.full_name}</h3>
                                <p className="text-sm text-slate-500">Class {student.class}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Medal className={`mr-2 ${index === 0 ? 'text-yellow-500' :
                                    index === 1 ? 'text-slate-400' :
                                        index === 2 ? 'text-orange-500' :
                                            'text-transparent'
                                }`} size={20} />
                            <span className="font-bold text-xl text-indigo-600">{student.total_score} pts</span>
                        </div>
                    </div>
                ))}
                {leaders.length === 0 && (
                    <div className="p-8 text-center text-slate-500">No data available yet.</div>
                )}
            </div>
        </div>
    );
};

export default StudentLeaderboard;
