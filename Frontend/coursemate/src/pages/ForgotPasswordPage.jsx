
// src/pages/ForgotPasswordPage.jsx
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import Alert from '../components/UI/Alert';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { ForgotPasswordIcon } from '../components/Icons';

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleResetRequest = useCallback(() => {
        setMessage("");
        setError("");
         if (!email) {
             setError("Please enter your email address.");
             return;
         }
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            console.log("Simulating password reset request for:", email);
            setMessage(`If an account exists for ${email}, a password reset link has been sent.`);
            setIsLoading(false);
            // setEmail(""); // Optionally clear email field
        }, 600);
    }, [email]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-200">
                <div>
                    <ForgotPasswordIcon className="mx-auto h-12 w-auto text-indigo-600" />
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Reset Your Password
                    </h2>
                     <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address below.
                    </p>
                </div>
                 <Alert message={error} type="error" onClose={() => setError("")} />
                 <Alert message={message} type="success" onClose={() => setMessage("")} />
                <div className="mt-8 space-y-6">
                    <Input id="reset-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} label="Email Address" required />
                    <Button onClick={handleResetRequest} disabled={isLoading}>
                        {isLoading ? <LoadingSpinner /> : 'Send Reset Link'}
                    </Button>
                     <p className="mt-6 text-center text-sm text-gray-600">
                        Remembered your password?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
export default ForgotPasswordPage;
