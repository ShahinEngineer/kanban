import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, ...props }, ref) => {
        return (
            <div className="input-field">
                {label && <label className="input-field__label">{label}</label>}
                <input
                    className={`input-field__input ${error ? 'input-field__input--error' : ''} ${className}`}
                    ref={ref}
                    {...props}
                />
                {error && <span className="input-field__error">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = '', label, error, ...props }, ref) => {
        return (
            <div className="input-field">
                {label && <label className="input-field__label">{label}</label>}
                <textarea
                    className={`input-field__input input-field__textarea ${error ? 'input-field__input--error' : ''} ${className}`}
                    ref={ref}
                    {...props}
                />
                {error && <span className="input-field__error">{error}</span>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
