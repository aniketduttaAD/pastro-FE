'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FiAlertTriangle, FiHome, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-5 bg-gray-100 dark:bg-gray-900">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
                            <FiAlertTriangle className="h-16 w-16 text-red-600 dark:text-red-400" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                    >
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Something Went Wrong
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            We encountered an error while processing your request. Please try again.
                        </p>

                        {error?.digest && (
                            <div className="mb-4 px-3 py-2 bg-gray-100 dark:bg-gray-900 rounded text-xs font-mono text-gray-700 dark:text-gray-300 overflow-auto">
                                Error ID: {error.digest}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={reset}
                                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 w-full"
                            >
                                <FiRefreshCw className="mr-2" />
                                Try Again
                            </button>
                            <Link
                                href="/"
                                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 w-full"
                            >
                                <FiHome className="mr-2" />
                                Go to Home
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}