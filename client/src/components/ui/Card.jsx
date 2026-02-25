import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
    children,
    className = '',
    variant = 'solid', // glass, solid, outlined
    hover = true,
    onClick,
    ...props
}) => {

    const variants = {
        glass: 'glass-card',
        solid: 'bg-white border border-slate-100 shadow-sm',
        outlined: 'bg-transparent border-2 border-slate-200'
    };

    const hoverAnimation = hover ? {
        y: -4,
        boxShadow: 'var(--shadow-premium-hover)',
        borderColor: 'rgba(59, 130, 246, 0.4)' // Blue-500 with opacity
    } : {};

    return (
        <motion.div
            className={`rounded-2xl p-6 ${variants[variant]} ${className}`}
            whileHover={hover ? hoverAnimation : {}}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
