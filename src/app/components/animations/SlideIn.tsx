'use client';

import React from 'react';
import { motion } from 'framer-motion';
interface SlideInProps {
    children: React.ReactNode;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
    delay?: number;
    duration?: number;
}

export const SlideIn: React.FC<SlideInProps> = ({
    children,
    className = '',
    direction = 'up',
    delay = 0,
    duration = 0.5,
}) => {
    const directionMap = {
        up: { y: 20, x: 0 },
        down: { y: -20, x: 0 },
        left: { x: 20, y: 0 },
        right: { x: -20, y: 0 },
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directionMap[direction] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};