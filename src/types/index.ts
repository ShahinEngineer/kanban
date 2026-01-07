export interface Task {
    id: string;
    content: string;
    columnId: string;
    description?: string;
    estimationTime?: string;
    projectId?: string;
    startAt?: string;
    endAt?: string;
    assignTo?: string;
}

export interface Column {
    id: string;
    title: string;
    taskIds: string[];
}

export interface BoardData {
    tasks: Record<string, Task>;
    columns: Record<string, Column>;
    columnOrder: string[];
}
