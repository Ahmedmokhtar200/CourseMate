
// src/components/UI/Button.jsx
import React from 'react';

function Button({ onClick, children, type = "button", variant = "primary", className = "", disabled = false }) {
    const baseStyle = "w-full inline-flex justify-center items-center px-4 py-2 font-semibold rounded-md shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-indigo-600 hover:bg-indigo-700 text-white focus-visible:outline-indigo-600",
        secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus-visible:outline-indigo-600",
        danger: "bg-red-600 hover:bg-red-700 text-white focus-visible:outline-red-600",
    };
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
export default Button;