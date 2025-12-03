import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-primary">Dishari Physics Academy</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                        <Link to="/about" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">About</Link>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                                    Dashboard
                                </Link>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <User size={18} />
                                    <span className="text-sm font-medium">{user.username}</span>
                                </div>
                                <button onClick={handleLogout} className="flex items-center space-x-1 text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium">
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-primary focus:outline-none">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                        <Link to="/" className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>Home</Link>
                        <Link to="/about" className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>About</Link>
                        {user ? (
                            <>
                                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                                    Dashboard
                                </Link>
                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left block text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-base font-medium">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>Login</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
