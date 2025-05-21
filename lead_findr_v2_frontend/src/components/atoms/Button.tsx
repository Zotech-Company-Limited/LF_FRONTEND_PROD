'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = {
    children: ReactNode;
    className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, className = '', type = 'button', ...props }: ButtonProps) => {
    return (
        <button
            type={type}
            className={`bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-sm ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
