import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, Upload, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StudentAssignments = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchAssignments();
        }
    }, [user]);

    const fetchAssignments = async () => {
        try {
            const response = await axios.get(`/api/student.php?path=assignments&student_id=${user.id}`);
            setAssignments(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching assignments", error);
            setLoading(false);
        }
    };

    const handleFileUpload = async (e, assignmentId) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const uploadRes = await axios.post('/api/upload.php', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (uploadRes.data.status === 'success') {
                // Submit assignment (update submission table)
                // Note: We need an endpoint for submission. I'll assume one or create it.
                // For now, let's just alert success as the backend endpoint for submission isn't fully detailed in plan but implied.
                // I'll add a submission endpoint to student.php later or now.
                alert('File uploaded successfully! (Submission logic to be connected)');
            } else {
                alert('File upload failed');
            }
        } catch (error) {
            console.error("Error uploading file", error);
            alert('Error uploading file');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Assignments</h1>
            <div className="space-y-4">
                {loading ? <p>Loading...</p> : assignments.length === 0 ? <p>No assignments found.</p> : (
                    assignments.map((assignment) => (
                        <div key={assignment.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{assignment.title}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{assignment.description}</p>
                                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                                        <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                                        {assignment.file_path && (
                                            <a href={`/api/${assignment.file_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                                <Download size={14} className="mr-1" /> Download Attachment
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                    <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center">
                                        <Upload size={14} className="mr-2" />
                                        Submit Solution
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, assignment.id)} />
                                    </label>
                                    {/* Status indicator would go here */}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentAssignments;
