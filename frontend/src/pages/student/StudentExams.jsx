import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, Eye, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StudentExams = () => {
    const { user } = useAuth();
    const [exams, setExams] = useState([]);
    const [selectedResult, setSelectedResult] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchExams();
        }
    }, [user]);

    const fetchExams = async () => {
        try {
            const response = await axios.get(`/api/student.php?path=exams&student_id=${user.id}`);
            if (Array.isArray(response.data)) {
                setExams(response.data);
            } else {
                console.error("Invalid exams data:", response.data);
                setExams([]);
            }
        } catch (error) {
            console.error("Error fetching exams", error);
            setExams([]);
        }
    };

    const handleStartExam = (examId) => {
        navigate(`/student/exam/${examId}`);
    };

    const handleViewResult = async (examId) => {
        try {
            const response = await axios.get(`/api/student.php?path=get_exam_result&student_id=${user.id}&exam_id=${examId}`);
            if (response.data && !response.data.error) {
                setSelectedResult(response.data);
                setShowModal(true);
            } else {
                alert("Result not found.");
            }
        } catch (error) {
            console.error("Error fetching result", error);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Exams</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.isArray(exams) && exams.length > 0 ? (
                    exams.map((exam) => (
                        <div key={exam.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-primary">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{exam.name}</h3>
                            <p className="text-gray-600 mb-4 text-sm">{exam.description}</p>
                            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                <span className="flex items-center"><Calendar size={16} className="mr-1" /> {new Date(exam.start_time).toLocaleString()}</span>
                                <span className="flex items-center"><Clock size={16} className="mr-1" /> {exam.duration_minutes} mins</span>
                            </div>
                            {exam.has_submitted > 0 ? (
                                <button
                                    onClick={() => handleViewResult(exam.id)}
                                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 flex justify-center items-center"
                                >
                                    View Result <Eye size={16} className="ml-2" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleStartExam(exam.id)}
                                    className="w-full bg-primary text-white py-2 rounded-md hover:bg-slate-800 flex justify-center items-center"
                                >
                                    Start Exam <ArrowRight size={16} className="ml-2" />
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full text-center py-8">No upcoming exams found.</p>
                )}
            </div>

            {/* Result Modal */}
            {showModal && selectedResult && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Exam Result</h2>
                        <p className="text-gray-500 text-center mb-6">{selectedResult.exam_name}</p>

                        <div className="bg-slate-50 rounded-xl p-6 text-center mb-6">
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-2">Score Obtained</p>
                            <div className="flex items-baseline justify-center">
                                <span className="text-5xl font-bold text-primary">{selectedResult.marks_obtained}</span>
                                <span className="text-xl text-gray-400 font-medium ml-2">/ {selectedResult.total_marks}</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                Percentage: <span className="font-bold text-gray-800">{Math.round((selectedResult.marks_obtained / selectedResult.total_marks) * 100)}%</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentExams;
