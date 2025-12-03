import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, MoreVertical, Eye, XCircle, Plus } from 'lucide-react';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [filter, setFilter] = useState({ class: '', search: '' });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentPerformance, setStudentPerformance] = useState([]);

    // Add Student State
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudent, setNewStudent] = useState({
        full_name: '', username: '', email: '', password: '', class: '', phone: ''
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        let result = Array.isArray(students) ? students : [];
        if (filter.class) {
            result = result.filter(s => s.class && s.class.includes(filter.class));
        }
        if (filter.search) {
            result = result.filter(s =>
                (s.full_name && s.full_name.toLowerCase().includes(filter.search.toLowerCase())) ||
                (s.username && s.username.toLowerCase().includes(filter.search.toLowerCase()))
            );
        }
        setFilteredStudents(result);
    }, [filter, students]);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('/api/admin.php?path=students');
            if (Array.isArray(response.data)) {
                setStudents(response.data);
                setFilteredStudents(response.data);
            } else {
                console.error("Invalid students data:", response.data);
                setStudents([]);
            }
        } catch (error) { console.error(error); setStudents([]); }
    };

    const handleViewStudent = async (student) => {
        setSelectedStudent(student);
        try {
            const response = await axios.get(`/api/admin.php?path=student_analytics&id=${student.id}`);
            setStudentPerformance(response.data);
        } catch (error) { console.error(error); }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/admin.php?path=students', newStudent);
            if (response.data.status === 'success') {
                setShowAddModal(false);
                setNewStudent({ full_name: '', username: '', email: '', password: '', class: '', phone: '' });
                fetchStudents();
                alert('Student added successfully');
            } else {
                alert('Failed to add student: ' + response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Error adding student');
        }
    };


    const [showEditModal, setShowEditModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const handleDeleteStudent = async (id) => {
        if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            try {
                const response = await axios.post('/api/admin.php?path=delete_student', { id });
                if (response.data.status === 'success') {
                    alert('Student deleted successfully');
                    fetchStudents();
                } else {
                    alert('Failed to delete student');
                }
            } catch (error) {
                console.error(error);
                alert('Error deleting student');
            }
        }
    };

    const handleEditClick = (student) => {
        setEditingStudent({ ...student });
        setShowEditModal(true);
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/admin.php?path=update_student', editingStudent);
            if (response.data.status === 'success') {
                setShowEditModal(false);
                setEditingStudent(null);
                fetchStudents();
                alert('Student updated successfully');
            } else {
                alert('Failed to update student: ' + response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Error updating student: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Students</h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                    >
                        <Plus size={18} className="mr-2" /> Add Student
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            placeholder="Search students..."
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={e => setFilter({ ...filter, search: e.target.value })}
                        />
                    </div>
                    <select
                        className="border rounded-lg px-4 py-2"
                        onChange={e => setFilter({ ...filter, class: e.target.value })}
                    >
                        <option value="">All Classes</option>
                        {[...new Set(students.map(s => s.class).filter(Boolean))].sort().map(cls => (
                            <option key={cls} value={cls}>Class {cls}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Name</th>
                            <th className="p-4 font-semibold text-slate-600">Class</th>

                            <th className="p-4 font-semibold text-slate-600">Contact</th>
                            <th className="p-4 font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(student => (
                            <tr key={student.id} className="border-b last:border-0 hover:bg-slate-50">
                                <td className="p-4 flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                        {student.full_name ? student.full_name[0] : 'U'}
                                    </div>
                                    {student.full_name}
                                </td>
                                <td className="p-4">{student.class}</td>

                                <td className="p-4 text-sm text-slate-500">{student.email}<br />{student.phone}</td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => handleViewStudent(student)} className="text-slate-400 hover:text-blue-600" title="View Analytics">
                                        <Eye size={20} />
                                    </button>
                                    <button onClick={() => handleEditClick(student)} className="text-slate-400 hover:text-green-600" title="Edit Student">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                    </button>
                                    <button onClick={() => handleDeleteStudent(student.id)} className="text-slate-400 hover:text-red-600" title="Delete Student">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl max-w-2xl w-full">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 mr-4">
                                    {selectedStudent.full_name ? selectedStudent.full_name[0] : 'U'}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedStudent.full_name}</h2>
                                    <p className="text-slate-500">{selectedStudent.email}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <h3 className="font-bold text-lg mb-4">Exam Performance</h3>
                        <div className="space-y-3">
                            {studentPerformance.length > 0 ? studentPerformance.map((perf, idx) => (
                                <div key={idx} className="flex justify-between p-3 bg-slate-50 rounded-lg">
                                    <span>Exam ID: {perf.exam_id}</span>
                                    <span className="font-bold text-blue-600">{perf.marks_obtained} Marks</span>
                                </div>
                            )) : (
                                <p className="text-slate-500">No exam records found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Student Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl max-w-lg w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Add New Student</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                                <XCircle size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddStudent} className="space-y-4">
                            <input
                                placeholder="Full Name"
                                className="w-full border p-2 rounded-lg"
                                value={newStudent.full_name}
                                onChange={e => setNewStudent({ ...newStudent, full_name: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Username"
                                    className="border p-2 rounded-lg"
                                    value={newStudent.username}
                                    onChange={e => setNewStudent({ ...newStudent, username: e.target.value })}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="border p-2 rounded-lg"
                                    value={newStudent.password}
                                    onChange={e => setNewStudent({ ...newStudent, password: e.target.value })}
                                    required
                                />
                            </div>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full border p-2 rounded-lg"
                                value={newStudent.email}
                                onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Class"
                                    className="border p-2 rounded-lg"
                                    value={newStudent.class}
                                    onChange={e => setNewStudent({ ...newStudent, class: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Phone (Optional)"
                                    className="border p-2 rounded-lg"
                                    value={newStudent.phone}
                                    onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                                    Create Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Student Modal */}
            {showEditModal && editingStudent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl max-w-lg w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Edit Student</h2>
                            <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                                <XCircle size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateStudent} className="space-y-4">
                            <input
                                placeholder="Full Name"
                                className="w-full border p-2 rounded-lg"
                                value={editingStudent.full_name}
                                onChange={e => setEditingStudent({ ...editingStudent, full_name: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Username"
                                    className="border p-2 rounded-lg"
                                    value={editingStudent.username}
                                    onChange={e => setEditingStudent({ ...editingStudent, username: e.target.value })}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="New Password (Optional)"
                                    className="border p-2 rounded-lg"
                                    value={editingStudent.password || ''}
                                    onChange={e => setEditingStudent({ ...editingStudent, password: e.target.value })}
                                />
                            </div>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full border p-2 rounded-lg"
                                value={editingStudent.email}
                                onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Class"
                                    className="border p-2 rounded-lg"
                                    value={editingStudent.class}
                                    onChange={e => setEditingStudent({ ...editingStudent, class: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Phone"
                                    className="border p-2 rounded-lg"
                                    value={editingStudent.phone}
                                    onChange={e => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                                    Update Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;
