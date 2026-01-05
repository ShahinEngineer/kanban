
import React, { type ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    className = '',
    disabled,
    ...props
}) => {
    // Convert custom properties to inline styles if needed for the variables to work in the string interpolation 
    // But here we are using standard module composition. Since we are using vanilla CSS variables, we can't fully compile utility classes like Tailwind.
    // So I'll write a small accompanying CSS module or use inline styles for the dynamic parts? 
    // Wait, I said I'm using Vanilla CSS. I shouldn't be using Tailwind syntax like `bg - [var(--primary)]`.
    // I need to use either BEM or CSS Modules. Let's switch to a CSS file for components.

    return (
        <button
            className={`btn btn--${variant} btn--${size} ${className} `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <span className="loader">...</span> : children}
        </button>
    );
};
