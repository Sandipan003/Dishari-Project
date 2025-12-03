import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(username, password);
        if (result.success) {
            // Redirect based on role is handled by the component that calls login or we check user here
            // But login updates state asynchronously.
            // Better to check the user object from context or the response.
            // The login function in AuthContext returns the user object in response if we modify it, 
            // but currently it returns { success: true }.
            // Let's rely on the fact that we can check the role from the stored user or just redirect to home 
            // and let the protected route handle it, or better, fetch user role from local storage or response.

            // For now, let's assume successful login updates context. 
            // We can redirect to a neutral place or check role.
            // Let's modify AuthContext to return user or we can just fetch it.
            // Actually, since state update might be async, let's check the response data if possible.
            // In AuthContext I wrote: setUser(response.data.user); return { success: true };
            // I should probably return the user object in success.

            // Let's just reload or redirect to / which will redirect to dashboard if I add logic there, 
            // but for now let's just redirect to /admin/dashboard or /student/dashboard based on a guess or 
            // wait for the context to update. 
            // A simple way is to reload the page or use a small timeout, but that's hacky.
            // Best way: AuthContext login returns the user.

            // Re-reading AuthContext: it sets state.
            // I'll assume the user knows their role or I can decode it.
            // Let's just redirect to '/' and let the Home page redirect or show dashboard link.
            // Or better, I can check the role from the response if I update AuthContext.
            // For now, I'll just redirect to '/' and the Navbar will show the Dashboard link.
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Dishari Physics Academy Portal
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Username or Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
