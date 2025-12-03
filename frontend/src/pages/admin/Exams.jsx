import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Exams = () => {
    const { user } = useAuth();
    const [exams, setExams] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', description: '', class: '',
        total_marks: '', start_time: '', end_time: '', duration_minutes: '',
        questions: []
    });

    // Question state
    const [currentQuestion, setCurrentQuestion] = useState({
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: '',
        marks: 1
    });

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await axios.get('/api/admin.php?path=exams');
            if (Array.isArray(response.data)) {
                setExams(response.data);
            } else {
                setExams([]);
            }
        } catch (error) {
            console.error("Error fetching exams", error);
            setExams([]);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [...formData.questions, currentQuestion]
        });
        setCurrentQuestion({ question_text: '', options: ['', '', '', ''], correct_answer: '', marks: 1 });
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const examData = { ...formData, created_by: user.id };
            const response = await axios.post('/api/admin.php?path=exams', examData);
            if (response.data.status === 'success') {
                setShowModal(false);
                fetchExams();
                setFormData({ name: '', description: '', class: '', batch: '', total_marks: '', start_time: '', end_time: '', duration_minutes: '', questions: [] });
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error creating exam", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Exam Management</h2>
                <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                    <Plus size={18} className="mr-2" /> Create Exam
                </button>
            </div>

            {/* Exam List */}
            <div className="grid gap-4">
                {Array.isArray(exams) && exams.map(exam => (
                    <div key={exam.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{exam.name}</h3>
                            <p className="text-slate-500 text-sm">{exam.class} | {new Date(exam.start_time).toLocaleString()}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{exam.total_marks} Marks</span>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-10">
                    <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-6">Create New Exam</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input name="name" placeholder="Exam Name" required className="border p-2 rounded-lg" onChange={handleInputChange} value={formData.name} />
                                <input name="class" placeholder="Class" required className="border p-2 rounded-lg" onChange={handleInputChange} value={formData.class} />
                                <input name="total_marks" type="number" placeholder="Total Marks" required className="border p-2 rounded-lg" onChange={handleInputChange} value={formData.total_marks} />
                                <input name="start_time" type="datetime-local" required className="border p-2 rounded-lg" onChange={handleInputChange} value={formData.start_time} />
                                <input name="end_time" type="datetime-local" required className="border p-2 rounded-lg" onChange={handleInputChange} value={formData.end_time} />
                                <input name="duration_minutes" type="number" placeholder="Duration (mins)" required className="border p-2 rounded-lg" onChange={handleInputChange} value={formData.duration_minutes} />
                            </div>
                            <textarea name="description" placeholder="Description" className="w-full border p-2 rounded-lg" onChange={handleInputChange} value={formData.description} />

                            {/* Question Builder */}
                            <div className="border-t pt-4 mt-4">
                                <h3 className="font-bold mb-2">Add Questions</h3>
                                <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                                    <input
                                        placeholder="Question Text"
                                        className="w-full border p-2 rounded-lg"
                                        value={currentQuestion.question_text}
                                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        {currentQuestion.options.map((opt, idx) => (
                                            <input
                                                key={idx}
                                                placeholder={`Option ${idx + 1}`}
                                                className="border p-2 rounded-lg"
                                                value={opt}
                                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <select
                                            className="border p-2 rounded-lg flex-1"
                                            value={currentQuestion.correct_answer}
                                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                                        >
                                            <option value="">Select Correct Answer</option>
                                            {currentQuestion.options.map((opt, idx) => (
                                                opt && <option key={idx} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            placeholder="Marks"
                                            className="border p-2 rounded-lg w-20"
                                            value={currentQuestion.marks}
                                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) })}
                                        />
                                        <button type="button" onClick={addQuestion} className="bg-green-600 text-white px-4 rounded-lg hover:bg-green-700">Add</button>
                                    </div>
                                </div>

                                {/* Added Questions List */}
                                <div className="mt-4 space-y-2">
                                    {formData.questions.map((q, idx) => (
                                        <div key={idx} className="bg-slate-100 p-3 rounded flex justify-between items-center text-sm">
                                            <span>{idx + 1}. {q.question_text}</span>
                                            <span className="font-bold">{q.marks} Marks</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Exam</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Exams;
