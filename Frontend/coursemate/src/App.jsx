// src/App.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

// Import API service methods
import { loginUser, signupUser, fetchAuthenticatedUser, logoutUser as apiLogoutUser } from './services/api';

// Import Page Components
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import CourseDetailPage from './pages/CourseDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Import Layout and Helper Components
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import LoadingSpinner from './components/UI/LoadingSpinner'; // For initial auth check

// Main Application Component
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(); // Stores the full user object from backend
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // For initial token check

    const navigate = useNavigate();
    const location = useLocation();

    // Check for existing token on initial app load
    useEffect(() => {
        const attemptAutoLogin = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const userData = await fetchAuthenticatedUser(); // Fetches user with stored token
                    if (userData) {
                        setCurrentUser(userData);
                        console.log(userData);
                        setIsLoggedIn(true);
                    } else {
                        // Token might be invalid or expired
                        localStorage.removeItem('authToken');
                    }
                } catch (error) {
                    console.error('Auto-login failed:', error);
                    localStorage.removeItem('authToken'); // Clear invalid token
                }
            }
            setIsLoadingAuth(false);
        };
        attemptAutoLogin();
    }, []);

    const handleLogin = useCallback(async (username, password) => {
        // LoginPage will call this. It should return a promise.
        try {
            const response = await loginUser({ username, password });
            // Assuming backend returns { token: '...', user: { ... } } or just { token: '...' }
            // If only token, then fetchAuthenticatedUser will be called by the effect above.
            if (response.access) { // Django Simple JWT often uses 'access' for access token
                localStorage.setItem('authToken', response.access);
                // If user data is part of login response:
                if (response.user) {
                    setCurrentUser(response.user);
                } else {
                    // Fetch user data separately if not in login response
                    const userData = await fetchAuthenticatedUser();
                    setCurrentUser(userData);
                }
                setIsLoggedIn(true);
                navigate(location.state?.from?.pathname || '/', { replace: true });
                return "Login successful"; // For LoginPage to handle UI
            } else {
                 // Handle cases where token might be under a different key or not present
                throw new Error(response.detail || "Login failed: No token received.");
            }
        } catch (error) {
            console.error("Login error in App.jsx:", error);
            throw error; // Re-throw for LoginPage to display
        }
    }, [navigate, location.state]);

    const handleSignup = useCallback(async (username, email, password) => {
        // SignupPage will call this.
        try {
            // Assuming backend expects username, email, password
            // And returns { token: '...', user: { ... } } or similar to login
            const response = await signupUser({ username, email, password });
             if (response.access) { // Or whatever your token key is
                localStorage.setItem('authToken', response.access);
                 if (response.user) {
                    setCurrentUser(response.user);
                } else {
                    const userData = await fetchAuthenticatedUser();
                    setCurrentUser(userData);
                }
                setIsLoggedIn(true);
                navigate('/'); // Navigate to home on successful signup
                return "Signup successful";
            } else {
                throw new Error(response.detail || "Signup failed: No token received.");
            }
        } catch (error) {
            console.error("Signup error in App.jsx:", error);
            throw error; // Re-throw for SignupPage
        }
    }, [navigate]);

    const handleLogout = useCallback(async () => {
        try {
            await apiLogoutUser(); // Call API to invalidate token on backend
        } catch (error) {
            console.warn("Backend logout error or no endpoint:", error);
            // Proceed with local logout regardless
        } finally {
            localStorage.removeItem('authToken');
            setIsLoggedIn(false);
            setCurrentUser(null);
            navigate('/login');
        }
    }, [navigate]);

    // Context-like value to pass down auth state and functions
    // In a larger app, React Context API would be better here.
    const authProps = useMemo(() => ({
        isLoggedIn,
        currentUser, // Pass the full user object
        isLoadingAuth, // For initial loading state
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
    }), [isLoggedIn, currentUser, isLoadingAuth, handleLogin, handleSignup, handleLogout]);


    if (isLoadingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        ); // Show a loading spinner during initial auth check
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <SignupPage onSignup={handleSignup} />} />
            <Route path="/forgot-password" element={isLoggedIn ? <Navigate to="/" /> : <ForgotPasswordPage />} />

            {/* Protected Routes: Wrapped by MainLayout */}
            <Route
                path="/*" // Catch-all for routes that require login
                element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                        {console.log(authProps)}
                        <MainLayout auth={authProps} location={location}>
                            {/* Nested routes for logged-in area */}
                            <Routes>
                                <Route index element={<HomePage />} /> {/* Default page after login */}
                                <Route path="course/:courseId" element={<CourseDetailPage />} />
                                {/* Add other protected routes here, e.g., /profile */}
                                <Route path="*" element={<NotFoundPage />} /> {/* Fallback for unmatched protected routes */}
                            </Routes>
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
