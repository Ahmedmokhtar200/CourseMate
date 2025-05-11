
// src/components/UI/Input.jsx
import React from 'react';

function Input({ id, type, placeholder, value, onChange, label, required = false, ariaDescribedby, onKeyPress }) {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyPress={onKeyPress}
                required={required}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                aria-label={label}
                aria-describedby={ariaDescribedby}
                aria-required={required ? "true" : "false"}
            />
        </div>
    );
}
export default Input;