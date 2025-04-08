'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
    children,
    className = '',
    delay = 0,
    duration = 0.5,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;