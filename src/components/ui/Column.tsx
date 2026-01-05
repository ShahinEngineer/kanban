import React from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Button } from './Button';
import './Column.css';

interface ColumnProps {
    title: string;
    count?: number;
    children: React.ReactNode;
    onAddClick?: () => void;
    onMenuClick?: () => void;
}

export const Column: React.FC<ColumnProps> = ({
    title,
    count = 0,
    children,
    onAddClick,
    onMenuClick
}) => {
    return (
        <div className="column">
            <div className="column__header">
                <div className="column__title-wrapper">
                    <h3 className="column__title">
                        {title}
                        <span className="column__count">{count}</span>
                    </h3>
                </div>
                {/* <div className="column__actions">
                    {onAddClick && (
                        <Button variant="ghost" size="icon" onClick={onAddClick} title="Add task">
                            <Plus size={16} />
                        </Button>
                    )}
                    {onMenuClick && (
                        <Button variant="ghost" size="icon" onClick={onMenuClick} title="Column options">
                            <MoreHorizontal size={16} />
                        </Button>
                    )}
                </div> */}
            </div>
            <div className="column__content">
                {children}
            </div>
        </div>
    );
};
