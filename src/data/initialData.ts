import type { BoardData } from '../types';

export const initialData: BoardData = {
    tasks: {
        'task-1': {
            id: 'task-1',
            title: 'Design System',
            description: 'Create a consistent design system with variables for colors, spacing, and typography.',
            priority: 'high',
            createdAt: Date.now(),
        },
        'task-2': {
            id: 'task-2',
            title: 'Board Layout',
            description: 'Implement the main board layout with scrollable columns.',
            priority: 'medium',
            createdAt: Date.now(),
        },
        'task-3': {
            id: 'task-3',
            title: 'Drag and Drop',
            description: 'Integrate @hello-pangea/dnd for task movement.',
            priority: 'high',
            createdAt: Date.now(),
        },
        'task-4': {
            id: 'task-4',
            title: 'Persistence',
            description: 'Save board state to local storage.',
            priority: 'low',
            createdAt: Date.now(),
        },
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'To Do',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
        },
        'column-2': {
            id: 'column-2',
            title: 'In Progress',
            taskIds: [],
        },
        'column-3': {
            id: 'column-3',
            title: 'Done',
            taskIds: [],
        },
    },
    columnOrder: ['column-1', 'column-2', 'column-3'],
};
