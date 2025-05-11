// src/pages/LoginPage.jsx (Updated)
import React, { useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import Alert from '../components/UI/Alert';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { AppLogoIcon } from '../components/Icons';

function LoginPage({ onLogin }) { // onLogin is passed from App.jsx
    const [email, setEmail] = useState(""); // Pre-fill for easier testing if desired
    const [password, setPassword] = useState(""); // Pre-fill for easier testing
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // useNavigate and useLocation are now handled in App.jsx for redirection after login

    const handleLoginSubmit = useCallback(async () => {
        setError("");
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        setIsLoading(true);
        try {
            await onLogin(email, password); // Call the login handler from App.jsx
            // Successful navigation is handled within onLogin in App.jsx
        } catch (loginError) {
            const errorMessage = loginError.data?.detail || loginError.data?.non_field_errors?.[0] || loginError.message || "Login failed. Please check your credentials.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [email, password, onLogin]);

    const handleKeyPress = useCallback((event) => {
        if (event.key === 'Enter' && email && password) {
            handleLoginSubmit();
        }
    }, [handleLoginSubmit, email, password]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-200">
                <div>
                    <AppLogoIcon className="mx-auto h-12 w-auto text-indigo-600" />
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Log in to CourseMate
                    </h2>
                </div>
                <Alert message={error} type="error" onClose={() => setError("")} />
                <div className="mt-8 space-y-6">
                    <Input id="email" type="email" placeholder="username" value={email} onChange={(e) => setEmail(e.target.value)} label="Username" required />
                    <Input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} label="Password" required onKeyPress={handleKeyPress}/>
                    <div className="flex items-center justify-end mb-6">
                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>
                    <Button onClick={handleLoginSubmit} disabled={isLoading}>
                        {isLoading ? <LoadingSpinner /> : 'Log In'}
                    </Button>
                     <p className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
export default LoginPage;
