"use client";

import React from "react";
import { motion } from "framer-motion";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 py-6 flex flex-col justify-center sm:py-12 transition-colors duration-200">
            <div className="relative py-3 max-w-6xl mx-auto w-full px-4 sm:px-8">
                <motion.div
                    className="relative px-6 py-10 bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            Pastro
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Paste. Share. Go.
                        </p>
                    </motion.div>
                    {children}
                </motion.div>
            </div>
            <motion.footer
                className="mt-8 text-center text-sm text-gray-500 dark:text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <p>© {new Date().getFullYear()} TextShare — Secure text sharing</p>
            </motion.footer>
        </div>
    );
};

export default Layout;
