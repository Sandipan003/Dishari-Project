import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Save } from 'lucide-react';

const StudentProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        full_name: '', email: '', phone: '', profile_picture_url: '', class: '', batch: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`/api/student.php?path=profile&student_id=${user.id}`);
            setProfile(response.data);
            setLoading(false);
        } catch (error) { console.error(error); setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('id', user.id);
            formData.append('full_name', profile.full_name);
            formData.append('email', profile.email);
            formData.append('phone', profile.phone);
            if (profile.profile_picture_file) {
                formData.append('profile_picture', profile.profile_picture_file);
            }

            const response = await axios.post('/api/student.php?path=update_profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.status === 'success') {
                alert('Profile updated successfully!');
                fetchProfile(); // Refresh to show new image
            } else {
                alert('Failed to update profile: ' + response.data.message);
            }
        } catch (error) { console.error(error); alert('Error updating profile'); }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">My Profile</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-4xl text-slate-400 font-bold overflow-hidden relative group">
                            {profile.profile_picture_url ? (
                                <img src={profile.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                profile.full_name ? profile.full_name[0] : 'U'
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <label htmlFor="profile-upload" className="text-white text-xs text-center p-1 cursor-pointer">Change Photo</label>
                            </div>
                        </div>
                        <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => setProfile({ ...profile, profile_picture_file: e.target.files[0] })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                <input
                                    className="pl-10 w-full border rounded-lg p-2"
                                    value={profile.full_name}
                                    onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                <input
                                    className="pl-10 w-full border rounded-lg p-2"
                                    value={profile.email}
                                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                <input
                                    className="pl-10 w-full border rounded-lg p-2"
                                    value={profile.phone || ''}
                                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                    placeholder="+91 9876543210"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Class</label>
                            <p className="font-bold text-slate-800">{profile.class}</p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center">
                            <Save size={18} className="mr-2" /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentProfile;
