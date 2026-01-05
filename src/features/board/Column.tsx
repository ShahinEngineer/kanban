import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import type { Column as ColumnType, Task } from '../../types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

interface ColumnProps {
    column: ColumnType;
    tasks: Task[];
}

export const Column: React.FC<ColumnProps> = ({ column, tasks }) => {
    return (
        <div className="board-column">
            <div className="column-header">
                <div className="column-title">
                    {column.title}
                    <span className="task-count">{tasks.length}</span>
                </div>
                <button className="btn-icon">
                    <Plus size={18} />
                </button>
            </div>

            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        className="column-content"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                            backgroundColor: snapshot.isDraggingOver ? 'var(--color-bg-app)' : undefined,
                            transition: 'background-color 0.2s ease'
                        }}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard key={task.id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};
