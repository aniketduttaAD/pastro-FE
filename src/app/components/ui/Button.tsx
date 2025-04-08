'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    isLoading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    icon,
    isLoading = false,
    disabled = false,
    fullWidth = false,
    className = '',
}) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500';

    const variantClasses = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',
        outline: 'border border-indigo-500 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300',
        ghost: 'text-indigo-600 hover:bg-indigo-100 dark:text-indigo-400 dark:hover:bg-indigo-900/30',
    };

    const sizeClasses = {
        sm: 'text-xs px-2.5 py-1.5',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-6 py-3',
    };

    const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

    const classes = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        disabled || isLoading ? disabledClasses : '',
        className,
    ].join(' ');

    return (
        <motion.button
            whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled || isLoading}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </>
            ) : (
                <>
                    {icon && <span className="mr-2">{icon}</span>}
                    {children}
                </>
            )}
        </motion.button>
    );
};

export default Button;