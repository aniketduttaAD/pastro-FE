'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
}

const Card: React.FC<CardProps> = ({
    children,
    title,
    subtitle,
    className = '',
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}
        >
            <div className="p-3">
                {(title || subtitle) && (
                    <div className="mb-6">
                        {title && (
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
                {children}
            </div>
        </motion.div>
    );
};

export default Card;