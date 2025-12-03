import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Download, CheckCircle, XCircle, FileText, Calendar, Clock, Upload, Search, Filter, ChevronRight, Edit, Trash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Assignments = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [view, setView] = useState('list'); // 'list', 'submissions'
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [formData, setFormData] = useState({
        title: '', description: '', class: '', due_date: '', file: null
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Grading state
    const [gradingData, setGradingData] = useState({ id: null, marks: '', feedback: '' });

    useEffect(() => {
        fetchAssignments();
        fetchSubmissions();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await axios.get('/api/admin.php?path=assignments');
            setAssignments(Array.isArray(response.data) ? response.data : []);
        } catch (error) { console.error(error); setAssignments([]); }
    };

    const fetchSubmissions = async () => {
        try {
            const response = await axios.get('/api/admin.php?path=submissions');
            setSubmissions(Array.isArray(response.data) ? response.data : []);
        } catch (error) { console.error(error); setSubmissions([]); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const data = { ...formData, created_by: user.id };
            let response;
            if (isEditing) {
                response = await axios.post('/api/admin.php?path=update_assignment', { ...data, id: editingId });
            } else {
                response = await axios.post('/api/admin.php?path=assignments', data);
            }

            setShowCreateModal(false);
            setFormData({ title: '', description: '', class: '', due_date: '', file: null });
            setIsEditing(false);
            setEditingId(null);
            fetchAssignments();
            alert(isEditing ? 'Assignment updated successfully' : 'Assignment created successfully');
        } catch (error) { console.error(error); }
    };

    const handleGrade = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin.php?path=grade_submission', gradingData);
            setGradingData({ id: null, marks: '', feedback: '' });
            fetchSubmissions();
            alert('Submission graded successfully');
        } catch (error) { console.error(error); }
    };

    const handleApprove = async (id) => {
        try {
            const response = await axios.post('/api/admin.php?path=approve_submission', { id });
            if (response.data.status === 'success') {
                fetchSubmissions();
                alert('Submission approved');
            } else {
                alert('Failed to approve');
            }
        } catch (error) { console.error(error); }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditClick = (assign) => {
        setFormData({
            title: assign.title,
            description: assign.description,
            class: assign.class,
            due_date: assign.due_date,
            file: null
        });
        setEditingId(assign.id);
        setIsEditing(true);
        setShowCreateModal(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                const response = await axios.post('/api/admin.php?path=delete_assignment', { id });
                if (response.data.status === 'success') {
                    fetchAssignments();
                } else {
                    alert('Failed to delete assignment');
                }
            } catch (error) { console.error(error); }
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Assignments</h2>
                    <p className="text-slate-500 mt-1">Manage assignments and grade submissions</p>
                </div>
                <div className="flex gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <button
                        onClick={() => setView('list')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'list' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        All Assignments
                    </button>
                    <button
                        onClick={() => setView('submissions')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'submissions' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        Submissions
                    </button>
                </div>
                <button onClick={() => { setIsEditing(false); setEditingId(null); setFormData({ title: '', description: '', class: '', due_date: '', file: null }); setShowCreateModal(true); }} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 flex items-center shadow-lg shadow-indigo-200 transition-all font-medium">
                    <Plus size={20} className="mr-2" /> Create Assignment
                </button>
            </div>

            {/* Assignments Grid */}
            {view === 'list' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignments.map(assign => (
                        <div key={assign.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow group flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                                    <FileText size={24} />
                                </div>
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                                    {assign.class}
                                </span>
                            </div>

                            <h3 className="font-bold text-xl text-slate-800 mb-2">{assign.title}</h3>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">{assign.description}</p>

                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-indigo-400" />
                                    <span>Due: {new Date(assign.due_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleEditClick(assign)} className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDeleteClick(assign.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {assignments.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500 font-medium">No assignments found</p>
                            <p className="text-slate-400 text-sm mt-1">Create a new assignment to get started</p>
                        </div>
                    )}
                </div>
            )}

            {/* Submissions Table */}
            {view === 'submissions' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Student</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Assignment</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Submitted At</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {submissions.map(sub => (
                                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-slate-800">{sub.student_name}</div>
                                            <div className="text-xs text-slate-500">{sub.class}</div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{sub.assignment_title}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sub.status === 'graded' || sub.status === 'approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {(sub.status === 'graded' || sub.status === 'approved') ? <CheckCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                                                {sub.status ? (sub.status.charAt(0).toUpperCase() + sub.status.slice(1)) : 'Pending'}
                                            </span>
                                            {sub.marks_obtained && <div className="mt-1 text-xs font-bold text-slate-600">{sub.marks_obtained} Marks</div>}
                                        </td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {new Date(sub.submitted_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            {sub.file_path && (
                                                <a
                                                    href={sub.file_path}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-slate-600 hover:text-indigo-600 font-medium text-sm hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                                >
                                                    <Download size={14} /> View
                                                </a>
                                            )}
                                            {sub.status !== 'graded' && sub.status !== 'approved' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(sub.id)}
                                                        className="text-green-600 hover:text-green-800 font-medium text-sm hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                                    >
                                                        <CheckCircle size={14} /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => setGradingData({ id: sub.id, marks: '', feedback: '' })}
                                                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        Grade
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-slate-400 text-sm italic px-3 py-1.5">Completed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {submissions.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-500">No submissions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Assignment Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-800">{isEditing ? 'Edit Assignment' : 'Create New Assignment'}</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Title</label>
                                    <input
                                        name="title"
                                        required
                                        className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        onChange={handleInputChange}
                                        placeholder="e.g. Thermodynamics Problem Set 1"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Class/Batch</label>
                                        <input
                                            name="class"
                                            required
                                            className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                            onChange={handleInputChange}
                                            placeholder="e.g. Class 11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Due Date</label>
                                        <input
                                            name="due_date"
                                            type="datetime-local"
                                            required
                                            className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Description</label>
                                    <textarea
                                        name="description"
                                        className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32"
                                        onChange={handleInputChange}
                                        placeholder="Enter assignment details..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
                                    <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-200 transition-all">{isEditing ? 'Update Assignment' : 'Create Assignment'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Grading Modal */}
            {gradingData.id && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">Grade Submission</h3>
                            <button onClick={() => setGradingData({ id: null, marks: '', feedback: '' })} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleGrade} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Marks Obtained</label>
                                    <input
                                        type="number"
                                        placeholder="Enter marks"
                                        className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={gradingData.marks}
                                        onChange={e => setGradingData({ ...gradingData, marks: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Feedback</label>
                                    <textarea
                                        placeholder="Enter feedback for the student..."
                                        className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24"
                                        value={gradingData.feedback}
                                        onChange={e => setGradingData({ ...gradingData, feedback: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setGradingData({ id: null, marks: '', feedback: '' })} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-200 transition-all">Submit Grade</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assignments;
