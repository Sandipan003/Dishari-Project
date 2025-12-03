import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Clock, CheckCircle } from 'lucide-react';

const ExamInterface = () => {
    const { examId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { question_id: selected_option }
    const [timeLeft, setTimeLeft] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);

    useEffect(() => {
        fetchExamDetails();
    }, []);

    useEffect(() => {
        if (timeLeft === 0) {
            handleSubmit();
        }
        if (!timeLeft) return;

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);

    const fetchExamDetails = async () => {
        try {
            // Fetch Exam Meta
            const examRes = await axios.get(`/api/admin.php?path=exam_details&id=${examId}`);
            setExam(examRes.data);

            // Fetch Questions (Student View)
            const qRes = await axios.get(`/api/student.php?path=exam_questions&exam_id=${examId}&student_id=${user.id}`);

            if (qRes.data.error === "Exam already submitted") {
                alert("You have already submitted this exam.");
                navigate('/student/exams');
                return;
            }

            setQuestions(qRes.data);

            // Calculate Time Left
            const endTime = new Date(examRes.data.end_time).getTime();
            const now = new Date().getTime();
            const diff = Math.floor((endTime - now) / 1000);
            setTimeLeft(diff > 0 ? diff : 0);

        } catch (error) { console.error(error); }
    };

    const handleOptionSelect = (questionId, option) => {
        setAnswers({ ...answers, [questionId]: option });
    };

    const handleSubmit = async () => {
        if (submitted) return;
        try {
            const payload = {
                exam_id: examId,
                student_id: user.id,
                answers: Object.entries(answers).map(([qid, opt]) => ({ question_id: qid, selected_option: opt }))
            };

            const response = await axios.post('/api/student.php?path=submit_exam', payload);
            if (response.data.status === 'success') {
                setSubmitted(true);
                setScore(response.data.score);
            } else {
                alert('Submission failed');
            }
        } catch (error) { console.error(error); }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (!exam) return <div>Loading Exam...</div>;

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20">
                <div className="bg-white p-10 rounded-xl shadow-lg border border-green-100">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Exam Submitted!</h2>
                    <p className="text-slate-500 mb-6">Your answers have been recorded.</p>
                    <div className="bg-slate-50 p-6 rounded-xl inline-block">
                        <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Your Score</p>
                        <p className="text-4xl font-bold text-indigo-600 mt-2">{score} / {exam.total_marks}</p>
                    </div>
                    <div className="mt-8">
                        <button onClick={() => navigate('/student/dashboard')} className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900">
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6 flex justify-between items-center sticky top-20 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{exam.name}</h1>
                    <p className="text-slate-500">Total Marks: {exam.total_marks}</p>
                </div>
                <div className={`flex items-center px-4 py-2 rounded-lg font-mono font-bold text-xl ${timeLeft < 300 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    <Clock className="mr-2" size={24} />
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
                {questions.map((q, idx) => (
                    <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-bold text-lg text-slate-800">Question {idx + 1}</h3>
                            <span className="text-sm font-bold text-slate-400">{q.marks} Marks</span>
                        </div>
                        <p className="text-slate-700 mb-6 text-lg">{q.question_text}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {JSON.parse(q.options).map((opt, optIdx) => (
                                <button
                                    key={optIdx}
                                    onClick={() => handleOptionSelect(q.id, opt)}
                                    className={`p-4 rounded-lg border-2 text-left transition-all ${answers[q.id] === opt
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <span className="mr-3 font-bold text-slate-400">{String.fromCharCode(65 + optIdx)}.</span>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Submit */}
            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all"
                >
                    Submit Exam
                </button>
            </div>
        </div>
    );
};

export default ExamInterface;
