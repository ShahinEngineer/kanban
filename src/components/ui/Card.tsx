import React from 'react';
import { Clock, Calendar, User, Folder, Edit2, Eye } from 'lucide-react';
import { type Task } from '../../types';
import './Card.css';

interface CardProps {
    task: Task;
    className?: string;
    onClick?: () => void;
    onEdit?: (e: React.MouseEvent, taskId: string) => void;
    onView?: (e: React.MouseEvent, taskId: string) => void;
    isDragging?: boolean;
}

export const Card: React.FC<CardProps> = ({ task, className = '', onClick, onEdit, onView, isDragging }) => {
    return (
        <div
            className={`card ${isDragging ? 'card--dragging' : ''} ${className}`}
            onClick={onClick}
        >
            <div className="card__header">
                <p className="card__content">{task.content}</p>
                <div className="card__actions">
                    <button
                        className="card__action-btn"
                        onClick={(e) => onView?.(e, task.id)}
                        title="View Details"
                    >
                        <Eye size={14} />
                    </button>
                    <button
                        className="card__action-btn"
                        onClick={(e) => onEdit?.(e, task.id)}
                        title="Edit Task"
                    >
                        <Edit2 size={14} />
                    </button>
                </div>
            </div>

            <div className="card__meta">
                {(task.estimationTime) && (
                    <div className="card__meta-item" title="Estimation">
                        <Clock size={12} />
                        <span>{task.estimationTime}</span>
                    </div>
                )}
                {(task.projectId) && (
                    <div className="card__meta-item" title="Project">
                        <Folder size={12} />
                        <span>{task.projectId}</span>
                    </div>
                )}
            </div>

            <div className="card__footer">
                {(task.assignTo) && (
                    <div className="card__meta-item" title="Assignee">
                        <User size={12} />
                        <span>{task.assignTo}</span>
                    </div>
                )}
                {(task.endAt || task.startAt) && (
                    <div className="card__meta-item" title="Due Date">
                        <Calendar size={12} />
                        <span>{task.endAt || task.startAt}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
