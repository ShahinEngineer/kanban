import { type BoardData } from '../types';

export const initialData: BoardData = {
    tasks: {
        'task-1': { id: 'task-1', content: 'Design system architecture', columnId: 'col-1' },
        'task-2': { id: 'task-2', content: 'Implement authentication', columnId: 'col-1' },
        'task-3': { id: 'task-3', content: 'Research competitors', columnId: 'col-2' },
        'task-4': { id: 'task-4', content: 'Draft product requirements', columnId: 'col-2' },
        'task-5': { id: 'task-5', content: 'Set up project repository', columnId: 'col-3' },
    },
    columns: {
        'col-1': {
            id: 'col-1',
            title: 'To Do',
            taskIds: ['task-1', 'task-2'],
        },
        'col-2': {
            id: 'col-2',
            title: 'In Progress',
            taskIds: ['task-3', 'task-4'],
        },
        'col-3': {
            id: 'col-3',
            title: 'Done',
            taskIds: ['task-5'],
        },
    },
    columnOrder: ['col-1', 'col-2', 'col-3'],
};
