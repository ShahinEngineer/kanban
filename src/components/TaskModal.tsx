import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Task, Priority } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Task) => void;
    initialTask?: Task | null;
    columnId?: string; // If creating new, which column?
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');

    useEffect(() => {
        if (initialTask) {
            setTitle(initialTask.title);
            setDescription(initialTask.description || '');
            setPriority(initialTask.priority);
        } else {
            setTitle('');
            setDescription('');
            setPriority('medium');
        }
    }, [initialTask, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const task: Task = {
            id: initialTask ? initialTask.id : uuidv4(),
            title,
            description,
            priority,
            createdAt: initialTask ? initialTask.createdAt : Date.now(),
            assignee: initialTask?.assignee,
        };

        onSave(task);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{initialTask ? 'Edit Issue' : 'Create Issue'}</h2>
                    <button className="btn-icon" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                            Title
                        </label>
                        <input
                            className="input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                            Description
                        </label>
                        <textarea
                            className="input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details..."
                            style={{ minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                            Priority
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPriority(p)}
                                    className={`btn ${priority === p ? `priority-badge ${p}` : 'btn-ghost'}`}
                                    style={{
                                        textTransform: 'capitalize',
                                        border: priority === p ? '1px solid currentColor' : '1px solid var(--color-border)',
                                        opacity: priority === p ? 1 : 0.7
                                    }}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                        <button type="button" className="btn btn-ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {initialTask ? 'Save Changes' : 'Create Issue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
