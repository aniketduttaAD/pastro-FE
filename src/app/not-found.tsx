'use client';

import Link from 'next/link';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function NotFound() {
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
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 text-red-600 dark:text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                    >
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Page Not Found
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            The page you&apos;re looking for doesn&apos;t exist or has been moved.
                        </p>

                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                            <Link
                                href="/"
                                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 w-full"
                            >
                                <FiHome className="mr-2" />
                                Go to Home
                            </Link>
                            <button
                                onClick={() => window.history.back()}
                                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 w-full"
                            >
                                <FiArrowLeft className="mr-2" />
                                Go Back
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}