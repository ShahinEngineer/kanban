import { Draggable } from '@hello-pangea/dnd';
import type { Task } from '../../types';
import { Clock, MoreHorizontal } from 'lucide-react';


interface TaskCardProps {
    task: Task;
    index: number;
}

const priorityColors = {
    low: 'low',
    medium: 'medium',
    high: 'high',
};

// I'm using inline styles/classes mixture because I don't have tailwind fully set up with config, 
// but I am using vanilla CSS variables. 
// Actually, since I didn't install tailwind (I just used vanilla CSS in index.css), 
// using 'bg-emerald-500/10' won't work unless I define them or use Tailwind.
// The user request "Vanilla CSS" implies I should probably write CSS or use style objects, 
// OR I should have installed Tailwind if I wanted to use utility classes. 
// The prompt said: "Avoid using TailwindCSS unless the USER explicitly requests it".
// So I MUST NOT use Tailwind classes. I should use CSS Modules or just scoped CSS classes.
// I'll use standard CSS classes defined in a new file or inline styles for dynamic values.
// Let's use a CSS file for the board components: src/features/board/Board.css

export const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`task-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
                    style={{
                        ...provided.draggableProps.style,
                    }}
                >
                    <div className="task-header">
                        <span className={`priority-badge ${priorityColors[task.priority]}`}>
                            {task.priority}
                        </span>
                        <button className="btn-icon">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>

                    <h3 className="task-title">{task.title}</h3>

                    {task.description && (
                        <p className="task-description">{task.description}</p>
                    )}

                    <div className="task-footer">
                        <div className="task-meta">
                            <Clock size={14} />
                            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                        {task.assignee && (
                            <div className="task-assignee">
                                {/* Placeholder for avatar */}
                                <div className="avatar-circle">
                                    {task.assignee.substring(0, 2).toUpperCase()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
};
