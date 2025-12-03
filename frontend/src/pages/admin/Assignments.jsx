import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Download, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Assignments = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [view, setView] = useState('list'); // 'list', 'create', 'submissions'
    const [formData, setFormData] = useState({
        title: '', description: '', class: '', due_date: '', file: null
    });

    // Grading state
    const [gradingData, setGradingData] = useState({ id: null, marks: '', feedback: '' });

    useEffect(() => {
        fetchAssignments();
        fetchSubmissions();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await axios.get('/api/admin.php?path=assignments');
            if (Array.isArray(response.data)) {
                setAssignments(response.data);
            } else {
                setAssignments([]);
            }
        } catch (error) { console.error(error); setAssignments([]); }
    };

    const fetchSubmissions = async () => {
        try {
            const response = await axios.get('/api/admin.php?path=submissions');
            if (Array.isArray(response.data)) {
                setSubmissions(response.data);
            } else {
                setSubmissions([]);
            }
        } catch (error) { console.error(error); setSubmissions([]); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        // File upload logic would go here (using FormData)
        // For simplicity, sending JSON first
        try {
            const data = { ...formData, created_by: user.id };
            await axios.post('/api/admin.php?path=assignments', data);
            setView('list');
            fetchAssignments();
        } catch (error) { console.error(error); }
    };

    const handleGrade = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin.php?path=grade_submission', gradingData);
            setGradingData({ id: null, marks: '', feedback: '' });
            fetchSubmissions();
        } catch (error) { console.error(error); }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Assignments</h2>
                <div className="space-x-2">
                    <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg ${view === 'list' ? 'bg-slate-200' : 'text-slate-600'}`}>All Assignments</button>
                    <button onClick={() => setView('submissions')} className={`px-4 py-2 rounded-lg ${view === 'submissions' ? 'bg-slate-200' : 'text-slate-600'}`}>Submissions</button>
                    <button onClick={() => setView('create')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center inline-flex">
                        <Plus size={18} className="mr-2" /> Create
                    </button>
                </div>
            </div>

            {view === 'list' && (
                <div className="grid gap-4">
                    {Array.isArray(assignments) && assignments.map(assign => (
                        <div key={assign.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-lg">{assign.title}</h3>
                            <p className="text-slate-500 text-sm mb-2">{assign.class} | Due: {new Date(assign.due_date).toLocaleDateString()}</p>
                            <p className="text-slate-600">{assign.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {view === 'submissions' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Student</th>
                                <th className="p-4 font-semibold text-slate-600">Assignment</th>
                                <th className="p-4 font-semibold text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-slate-600">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(submissions) && submissions.map(sub => (
                                <tr key={sub.id} className="border-b last:border-0">
                                    <td className="p-4">
                                        <p className="font-medium">{sub.student_name}</p>
                                        <p className="text-xs text-slate-500">{sub.class}</p>
                                    </td>
                                    <td className="p-4">{sub.assignment_title}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${sub.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {sub.status}
                                        </span>
                                        {sub.marks_obtained && <span className="ml-2 font-bold">{sub.marks_obtained} Marks</span>}
                                    </td>
                                    <td className="p-4">
                                        {sub.status !== 'graded' ? (
                                            <button
                                                onClick={() => setGradingData({ id: sub.id, marks: '', feedback: '' })}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Grade
                                            </button>
                                        ) : (
                                            <span className="text-slate-400">Graded</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Grading Modal */}
            {gradingData.id && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96">
                        <h3 className="font-bold text-lg mb-4">Grade Submission</h3>
                        <form onSubmit={handleGrade} className="space-y-4">
                            <input
                                type="number"
                                placeholder="Marks"
                                className="w-full border p-2 rounded-lg"
                                value={gradingData.marks}
                                onChange={e => setGradingData({ ...gradingData, marks: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Feedback"
                                className="w-full border p-2 rounded-lg"
                                value={gradingData.feedback}
                                onChange={e => setGradingData({ ...gradingData, feedback: e.target.value })}
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setGradingData({ id: null, marks: '', feedback: '' })} className="px-4 py-2 text-slate-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Submit Grade</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {view === 'create' && (
                <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl">
                    <h3 className="font-bold text-lg mb-4">Create Assignment</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <input name="title" placeholder="Title" className="w-full border p-2 rounded-lg" onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <div className="grid grid-cols-2 gap-4">
                            <input name="class" placeholder="Class" className="border p-2 rounded-lg" onChange={e => setFormData({ ...formData, class: e.target.value })} />
                            <input name="due_date" type="datetime-local" className="border p-2 rounded-lg" onChange={e => setFormData({ ...formData, due_date: e.target.value })} />
                        </div>
                        <textarea name="description" placeholder="Description" className="w-full border p-2 rounded-lg h-32" onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Create Assignment</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Assignments;
