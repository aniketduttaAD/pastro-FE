'use client';

import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface PasswordFieldProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    autoFocus?: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
    label,
    value,
    onChange,
    placeholder = 'Enter password',
    error,
    autoFocus = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            {label && (
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <div className="relative rounded-md shadow-sm">
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    className={`block w-full pr-10 py-2 px-3 sm:text-sm rounded-md border ${error
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoFocus={autoFocus}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer focus:outline-none"
                >
                    {showPassword ? (
                        <FiEyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                        <FiEye className="h-5 w-5" aria-hidden="true" />
                    )}
                </button>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
};

export default PasswordField;