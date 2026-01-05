import React from 'react';
import './Card.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    isDragging?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, isDragging }) => {
    return (
        <div
            className={`card ${isDragging ? 'card--dragging' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
