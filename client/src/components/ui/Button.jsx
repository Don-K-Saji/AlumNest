import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    variant = 'primary', // primary, outline, ghost, danger
    size = 'md', // sm, md, lg
    className = '',
    icon: Icon,
    isLoading = false,
    ...props
}) => {

    const baseStyles = "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "btn-primary shadow-blue-500/20",
        outline: "btn-outline bg-transparent hover:bg-slate-50",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
    };

    const sizes = {
        sm: "text-xs px-3 py-1.5 gap-1.5",
        md: "text-sm px-6 py-2.5 gap-2",
        lg: "text-base px-8 py-3.5 gap-2.5"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {!isLoading && Icon && <Icon size={size === 'sm' ? 14 : 18} />}
            {children}
        </motion.button>
    );
};

export default Button;
