
// src/components/UI/Alert.jsx
import React from 'react';
import { ClearIcon } from '../Icons'; // Assuming ClearIcon is in Icons.jsx

function Alert({ message, type = 'error', onClose }) {
    if (!message) return null;

    const baseStyle = "p-4 mb-4 rounded-md border text-sm";
    const typeStyles = {
        error: "bg-red-100 border-red-300 text-red-700",
        success: "bg-green-100 border-green-300 text-green-800",
        info: "bg-blue-100 border-blue-300 text-blue-800",
    };

    return (
        <div className={`${baseStyle} ${typeStyles[type]} flex justify-between items-center`} role="alert">
            <span>{message}</span>
            {onClose && (
                <button onClick={onClose} className="ml-4 text-current opacity-70 hover:opacity-100" aria-label="Close message">
                    <ClearIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
export default Alert;