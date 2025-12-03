import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('dpa_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // Direct URL to bypass potential proxy issues with spaces in path
            const API_URL = 'http://localhost/Dishari%20Project/backend/api/auth.php';
            const response = await axios.post(API_URL, { username, password });

            console.log("Login Response:", response.data); // Debugging

            if (response.data && response.data.status === 'success') {
                setUser(response.data.user);
                localStorage.setItem('dpa_user', JSON.stringify(response.data.user));
                return { success: true };
            } else {
                // Handle cases where response.data is not an object (e.g. PHP error string)
                const msg = (response.data && response.data.message) ? response.data.message : "Login failed (Invalid Server Response)";
                return { success: false, message: msg };
            }
        } catch (error) {
            console.error("Login error", error);
            const errMsg = error.response?.data?.message || error.message || "Network error";
            return { success: false, message: errMsg };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('dpa_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
