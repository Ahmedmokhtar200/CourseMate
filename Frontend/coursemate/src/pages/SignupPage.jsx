
// src/pages/SignupPage.jsx (Updated)
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import Alert from '../components/UI/Alert';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { SignupIcon } from '../components/Icons';

function SignupPage({ onSignup }) { // onSignup from App.jsx
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignupSubmit = useCallback(async () => {
        setError("");
        if (!username || !email || !password || !confirmPassword) {
            setError("Please fill in all fields."); return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match."); return;
        }
        if (password.length < 8) { // Example: Basic password policy
            setError("Password must be at least 8 characters long."); return;
        }
        setIsLoading(true);
        try {
            await onSignup(username, email, password); // Call handler from App.jsx
            // Successful navigation is handled in App.jsx
        } catch (signupError) {
            // Attempt to parse backend error messages
            let detailedError = "Signup failed. Please try again.";
            if (signupError.data) {
                if (signupError.data.email) detailedError = `Email: ${signupError.data.email.join(', ')}`;
                else if (signupError.data.password) detailedError = `Password: ${signupError.data.password.join(', ')}`;
                else if (signupError.data.detail) detailedError = signupError.data.detail;
                else if (typeof signupError.data === 'string') detailedError = signupError.data;
            } else if (signupError.message) {
                detailedError = signupError.message;
            }
            setError(detailedError);
        } finally {
            setIsLoading(false);
        }
    }, [username, email, password, confirmPassword, onSignup]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-200">
                <div>
                    <SignupIcon className="mx-auto h-12 w-auto text-indigo-600" />
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Create your CourseMate account
                    </h2>
                </div>
                 <Alert message={error} type="error" onClose={() => setError("")} />
                <div className="mt-8 space-y-6">
                     <Input id="username" type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} label="Username" required />
                    <Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} label="Email Address" required />
                    <Input id="signup-password" type="password" placeholder="Create a password (min. 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)} label="Password" required />
                     <Input id="confirm-password" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} label="Confirm Password" required />
                    <Button onClick={handleSignupSubmit} disabled={isLoading}>
                        {isLoading ? <LoadingSpinner /> : 'Sign Up'}
                    </Button>
                     <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
export default SignupPage;
