import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash, Save, Eye, XCircle, Edit, Check, Clock, Calendar, FileText, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Exams = () => {
    const { user } = useAuth();
    const [exams, setExams] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '', description: '', class: '',
        start_time: '', end_time: '', duration_minutes: '',
        questions: []
    });

    // Question State
    const [currentQuestion, setCurrentQuestion] = useState({
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: '',
        marks: 1
    });
    const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

    // View Results State
    const [viewResultsModal, setViewResultsModal] = useState(false);
    const [selectedExamResults, setSelectedExamResults] = useState([]);
    const [selectedExamName, setSelectedExamName] = useState('');

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await axios.get('/api/admin.php?path=exams');
            setExams(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching exams", error);
            setExams([]);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Question Logic ---

    const handleOptionChange = (index, value) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    const addOrUpdateQuestion = () => {
        if (!currentQuestion.question_text || !currentQuestion.correct_answer) {
            alert("Please fill in the question text and select a correct answer.");
            return;
        }

        let updatedQuestions = [...formData.questions];
        if (editingQuestionIndex !== null) {
            // Update existing
            updatedQuestions[editingQuestionIndex] = currentQuestion;
            setEditingQuestionIndex(null);
        } else {
            // Add new
            updatedQuestions.push(currentQuestion);
        }

        setFormData({ ...formData, questions: updatedQuestions });
        setCurrentQuestion({ question_text: '', options: ['', '', '', ''], correct_answer: '', marks: 1 });
    };

    const editQuestion = (index) => {
        setCurrentQuestion(formData.questions[index]);
        setEditingQuestionIndex(index);
    };

    const deleteQuestion = (index) => {
        const updatedQuestions = formData.questions.filter((_, i) => i !== index);
        setFormData({ ...formData, questions: updatedQuestions });
        if (editingQuestionIndex === index) {
            setEditingQuestionIndex(null);
            setCurrentQuestion({ question_text: '', options: ['', '', '', ''], correct_answer: '', marks: 1 });
        }
    };

    const cancelQuestionEdit = () => {
        setEditingQuestionIndex(null);
        setCurrentQuestion({ question_text: '', options: ['', '', '', ''], correct_answer: '', marks: 1 });
    };

    // --- Exam Logic ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const totalMarks = formData.questions.reduce((sum, q) => sum + parseInt(q.marks || 0), 0);
            const examData = { ...formData, total_marks: totalMarks, created_by: user.id };

            let response;
            if (isEditing) {
                response = await axios.post('/api/admin.php?path=update_exam', { ...examData, id: editingId });
            } else {
                response = await axios.post('/api/admin.php?path=exams', examData);
            }

            if (response.data.status === 'success') {
                setShowModal(false);
                fetchExams();
                resetForm();
                alert(isEditing ? 'Exam updated successfully' : 'Exam created successfully');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error saving exam", error);
            alert("Error saving exam");
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', class: '', start_time: '', end_time: '', duration_minutes: '', questions: [] });
        setIsEditing(false);
        setEditingId(null);
        setEditingQuestionIndex(null);
        setCurrentQuestion({ question_text: '', options: ['', '', '', ''], correct_answer: '', marks: 1 });
    };

    const handleEditClick = async (exam) => {
        try {
            const response = await axios.get(`/api/admin.php?path=exam_details&id=${exam.id}`);
            const details = response.data;
            const formattedQuestions = details.questions.map(q => ({
                ...q,
                options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
            }));

            setFormData({
                name: details.name,
                description: details.description,
                class: details.class,
                start_time: details.start_time,
                end_time: details.end_time,
                duration_minutes: details.duration_minutes,
                questions: formattedQuestions
            });
            setEditingId(exam.id);
            setIsEditing(true);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching exam details", error);
            alert("Failed to load exam details");
        }
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
            try {
                const response = await axios.post('/api/admin.php?path=delete_exam', { id });
                if (response.data.status === 'success') {
                    fetchExams();
                } else {
                    alert('Failed to delete exam');
                }
            } catch (error) {
                console.error("Error deleting exam", error);
            }
        }
    };

    const handleViewResults = async (exam) => {
        setSelectedExamName(exam.name);
        try {
            const response = await axios.get(`/api/admin.php?path=exam_results&id=${exam.id}`);
            setSelectedExamResults(response.data);
            setViewResultsModal(true);
        } catch (error) {
            console.error("Error fetching exam results", error);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Exam Management</h2>
                    <p className="text-slate-500 mt-1">Create and manage exams for your students</p>
                </div>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 flex items-center shadow-lg shadow-indigo-200 transition-all">
                    <Plus size={20} className="mr-2" /> Create New Exam
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map(exam => (
                    <div key={exam.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                                <FileText size={24} />
                            </div>
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                                {exam.total_marks} Marks
                            </span>
                        </div>

                        <h3 className="font-bold text-xl text-slate-800 mb-2">{exam.name}</h3>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{exam.description || 'No description provided.'}</p>

                        <div className="space-y-2 text-sm text-slate-500 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{new Date(exam.start_time).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span>{exam.duration_minutes} mins</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <button onClick={() => handleViewResults(exam)} className="text-slate-400 hover:text-indigo-600 flex items-center gap-1 text-sm font-medium transition-colors">
                                <Eye size={18} /> Results
                            </button>
                            <div className="flex gap-2">
                                <button onClick={() => handleEditClick(exam)} className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDeleteClick(exam.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-2xl font-bold text-slate-800">{isEditing ? 'Edit Exam' : 'Create New Exam'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <XCircle size={28} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8">
                            <form id="examForm" onSubmit={handleSubmit} className="space-y-8">
                                {/* Section 1: Exam Details */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                                        <FileText size={20} className="text-indigo-600" /> Exam Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Exam Name</label>
                                            <input name="name" required className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" onChange={handleInputChange} value={formData.name} placeholder="e.g. Physics Mid-Term" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Class/Batch</label>
                                            <input name="class" required className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" onChange={handleInputChange} value={formData.class} placeholder="e.g. Class 12 - Batch A" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Start Date & Time</label>
                                            <input name="start_time" type="datetime-local" required className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" onChange={handleInputChange} value={formData.start_time} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">End Date & Time</label>
                                            <input name="end_time" type="datetime-local" required className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" onChange={handleInputChange} value={formData.end_time} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Duration (Minutes)</label>
                                            <input name="duration_minutes" type="number" required className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" onChange={handleInputChange} value={formData.duration_minutes} placeholder="60" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Total Marks</label>
                                            <div className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-500 font-medium">
                                                {formData.questions.reduce((sum, q) => sum + parseInt(q.marks || 0), 0)} (Auto-calculated)
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Description</label>
                                        <textarea name="description" className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24" onChange={handleInputChange} value={formData.description} placeholder="Enter exam instructions or details..." />
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Section 2: Question Builder */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                                        <HelpCircle size={20} className="text-indigo-600" /> Questions ({formData.questions.length})
                                    </h3>

                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Question Text</label>
                                            <input
                                                className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                                                value={currentQuestion.question_text}
                                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                                                placeholder="Type your question here..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {currentQuestion.options.map((opt, idx) => (
                                                <div key={idx} className="space-y-1">
                                                    <label className="text-xs font-medium text-slate-500">Option {idx + 1}</label>
                                                    <input
                                                        className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                                                        value={opt}
                                                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                        placeholder={`Option ${idx + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex gap-4 items-end">
                                            <div className="flex-1 space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Correct Answer</label>
                                                <select
                                                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                                                    value={currentQuestion.correct_answer}
                                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                                                >
                                                    <option value="">Select Correct Answer</option>
                                                    {currentQuestion.options.map((opt, idx) => (
                                                        opt && <option key={idx} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="w-32 space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Marks</label>
                                                <input
                                                    type="number"
                                                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                                                    value={currentQuestion.marks}
                                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) || 0 })}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                {editingQuestionIndex !== null && (
                                                    <button type="button" onClick={cancelQuestionEdit} className="bg-slate-200 text-slate-600 px-5 py-3 rounded-xl hover:bg-slate-300 font-medium transition-colors">
                                                        Cancel
                                                    </button>
                                                )}
                                                <button type="button" onClick={addOrUpdateQuestion} className={`px-6 py-3 rounded-xl text-white font-medium transition-colors flex items-center gap-2 ${editingQuestionIndex !== null ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                                                    {editingQuestionIndex !== null ? <><Save size={18} /> Update</> : <><Plus size={18} /> Add</>}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Questions List */}
                                    <div className="space-y-3">
                                        {formData.questions.map((q, idx) => (
                                            <div key={idx} className={`p-4 rounded-xl border transition-all ${editingQuestionIndex === idx ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100' : 'bg-white border-slate-200 hover:border-indigo-200'}`}>
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="bg-slate-100 text-slate-600 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">{idx + 1}</span>
                                                            <h4 className="font-medium text-slate-800">{q.question_text}</h4>
                                                        </div>
                                                        <div className="ml-8 text-sm text-slate-500 grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                                                            {q.options.map((opt, i) => (
                                                                <div key={i} className={`flex items-center gap-2 ${opt === q.correct_answer ? 'text-green-600 font-medium' : ''}`}>
                                                                    {opt === q.correct_answer && <Check size={14} />}
                                                                    {opt}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 ml-4">
                                                        <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-sm">{q.marks} Marks</span>
                                                        <div className="flex gap-1">
                                                            <button type="button" onClick={() => editQuestion(idx)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                                <Edit size={18} />
                                                            </button>
                                                            <button type="button" onClick={() => deleteQuestion(idx)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                                <Trash size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {formData.questions.length === 0 && (
                                            <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                No questions added yet. Use the form above to add questions.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-600 hover:bg-slate-200 rounded-xl font-medium transition-colors">Cancel</button>
                            <button type="submit" form="examForm" className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                                <Save size={20} /> Save Exam
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Results Modal */}
            {viewResultsModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Exam Results</h2>
                                <p className="text-slate-500">{selectedExamName}</p>
                            </div>
                            <button onClick={() => setViewResultsModal(false)} className="text-slate-400 hover:text-slate-600">
                                <XCircle size={28} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 sticky top-0">
                                    <tr>
                                        <th className="p-4 font-semibold text-slate-600 rounded-tl-xl">Student</th>
                                        <th className="p-4 font-semibold text-slate-600">Class</th>
                                        <th className="p-4 font-semibold text-slate-600">Score</th>
                                        <th className="p-4 font-semibold text-slate-600 rounded-tr-xl">Submitted At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {selectedExamResults.length > 0 ? (
                                        selectedExamResults.map((result, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-medium text-slate-800">{result.full_name}</div>
                                                    <div className="text-xs text-slate-500">{result.email}</div>
                                                </td>
                                                <td className="p-4 text-slate-600">{result.class}</td>
                                                <td className="p-4">
                                                    <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{result.marks_obtained}</span>
                                                </td>
                                                <td className="p-4 text-sm text-slate-500">{new Date(result.submitted_at).toLocaleString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-slate-500">No students have submitted this exam yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Exams;
