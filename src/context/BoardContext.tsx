import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import { type BoardData, type Task, type Column } from '../types';
import { initialData } from '../data/mock';

type Action =
    | { type: 'MOVE_TASK'; payload: { taskId: string; sourceColId: string; destColId: string; sourceIndex: number; destIndex: number } }
    | {
        type: 'ADD_TASK';
        payload: {
            columnId: string;
            content: string;
            description?: string;
            estimationTime?: string;
            projectId?: string;
            startAt?: string;
            endAt?: string;
            assignTo?: string;
        }
    }
    | { type: 'DELETE_TASK'; payload: { taskId: string; columnId: string } }
    | {
        type: 'UPDATE_TASK';
        payload: {
            taskId: string;
            content: string;
            description?: string;
            estimationTime?: string;
            projectId?: string;
            startAt?: string;
            endAt?: string;
            assignTo?: string;
        }
    }
    | { type: 'ADD_COLUMN'; payload: { title: string } };

interface BoardContextType {
    state: BoardData;
    dispatch: React.Dispatch<Action>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

const boardReducer = (state: BoardData, action: Action): BoardData => {
    switch (action.type) {
        case 'MOVE_TASK': {
            const { sourceColId, destColId, sourceIndex, destIndex } = action.payload;
            const sourceCol = state.columns[sourceColId];
            const destCol = state.columns[destColId];

            const sourceTaskIds = Array.from(sourceCol.taskIds);
            const [removedId] = sourceTaskIds.splice(sourceIndex, 1);

            if (sourceColId === destColId) {
                sourceTaskIds.splice(destIndex, 0, removedId);
                return {
                    ...state,
                    columns: {
                        ...state.columns,
                        [sourceColId]: { ...sourceCol, taskIds: sourceTaskIds },
                    },
                };
            }

            const destTaskIds = Array.from(destCol.taskIds);
            destTaskIds.splice(destIndex, 0, removedId);

            // Update task's columnId
            const task = state.tasks[removedId];
            const updatedTask = { ...task, columnId: destColId };

            return {
                ...state,
                tasks: { ...state.tasks, [removedId]: updatedTask },
                columns: {
                    ...state.columns,
                    [sourceColId]: { ...sourceCol, taskIds: sourceTaskIds },
                    [destColId]: { ...destCol, taskIds: destTaskIds },
                },
            };
        }
        case 'ADD_TASK': {
            const { columnId, content, description, estimationTime, projectId, startAt, endAt, assignTo } = action.payload;
            const newTaskId = `task-${Date.now()}`;
            const newTask: Task = {
                id: newTaskId,
                content,
                columnId,
                description,
                estimationTime,
                projectId,
                startAt,
                endAt,
                assignTo,
            };

            const column = state.columns[columnId];
            const updatedTaskIds = [...column.taskIds, newTaskId];

            return {
                ...state,
                tasks: { ...state.tasks, [newTaskId]: newTask },
                columns: {
                    ...state.columns,
                    [columnId]: { ...column, taskIds: updatedTaskIds }
                }
            };
        }
        case 'UPDATE_TASK': {
            const { taskId, content, description, estimationTime, projectId, startAt, endAt, assignTo } = action.payload;
            const task = state.tasks[taskId];
            const updatedTask = {
                ...task,
                content,
                description,
                estimationTime,
                projectId,
                startAt,
                endAt,
                assignTo,
            };

            return {
                ...state,
                tasks: { ...state.tasks, [taskId]: updatedTask },
            };
        }
        case 'DELETE_TASK': {
            const { taskId, columnId } = action.payload;
            const column = state.columns[columnId];
            const newTaskIds = column.taskIds.filter((id) => id !== taskId);
            const newTasks = { ...state.tasks };
            delete newTasks[taskId];

            return {
                ...state,
                columns: {
                    ...state.columns,
                    [columnId]: { ...column, taskIds: newTaskIds },
                },
                tasks: newTasks,
            };
        }
        case 'ADD_COLUMN': {
            const { title } = action.payload;
            const newColumnId = `col-${Date.now()}`;
            const newColumn: Column = { id: newColumnId, title, taskIds: [] };

            return {
                ...state,
                columns: { ...state.columns, [newColumnId]: newColumn },
                columnOrder: [...state.columnOrder, newColumnId]
            };
        }
        default:
            return state;
    }
};

export const BoardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(boardReducer, initialData, (initial) => {
        try {
            const saved = localStorage.getItem('kanban-board-data');
            return saved ? JSON.parse(saved) : initial;
        } catch (e) {
            console.error('Failed to load board data', e);
            return initial;
        }
    });

    React.useEffect(() => {
        try {
            localStorage.setItem('kanban-board-data', JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save board data', e);
        }
    }, [state]);

    return (
        <BoardContext.Provider value={{ state, dispatch }}>
            {children}
        </BoardContext.Provider>
    );
};

export const useBoard = () => {
    const context = useContext(BoardContext);
    if (!context) {
        throw new Error('useBoard must be used within a BoardProvider');
    }
    return context;
};
