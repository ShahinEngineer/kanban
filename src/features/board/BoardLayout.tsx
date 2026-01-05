import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useBoard } from '../../context/BoardContext';
import { Column } from './Column';
import './Board.css';
import { KanbanSquare } from 'lucide-react';
import { TaskModal } from '../../components/TaskModal';
import { useState } from 'react';
import type { Task } from '../../types';

export const BoardLayout: React.FC = () => {
    const { boardData, setBoardData, addTask } = useBoard();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleCreateTask = (task: Task) => {
        // Determine the first column ID (typically "To Do")
        const firstColumnId = boardData.columnOrder[0];
        addTask(firstColumnId, task);
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };


    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const startColumn = boardData.columns[source.droppableId];
        const finishColumn = boardData.columns[destination.droppableId];

        // Moving within the same column
        if (startColumn === finishColumn) {
            const newTaskIds = Array.from(startColumn.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...startColumn,
                taskIds: newTaskIds,
            };

            setBoardData((prev) => ({
                ...prev,
                columns: {
                    ...prev.columns,
                    [newColumn.id]: newColumn,
                },
            }));
            return;
        }

        // Moving from one column to another
        const startTaskIds = Array.from(startColumn.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...startColumn,
            taskIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finishColumn.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finishColumn,
            taskIds: finishTaskIds,
        };

        setBoardData((prev) => ({
            ...prev,
            columns: {
                ...prev.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        }));
    };

    return (
        <div className="board-layout">
            <header className="board-header">
                <div className="board-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        backgroundColor: 'var(--color-primary)',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex'
                    }}>
                        <KanbanSquare color="white" size={24} />
                    </div>
                    Kanban Board
                </div>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    Create Issue
                </button>
            </header>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="board-content">
                    {boardData.columnOrder.map((columnId) => {
                        const column = boardData.columns[columnId];
                        const tasks = column.taskIds.map((taskId) => boardData.tasks[taskId]);

                        return <Column key={column.id} column={column} tasks={tasks} />;
                    })}
                </div>
            </DragDropContext>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleCreateTask}
                initialTask={editingTask}
            />
        </div>
    );
};
