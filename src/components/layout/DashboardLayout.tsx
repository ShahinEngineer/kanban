import React, { useState } from 'react';
import { LayoutDashboard, Settings, User, Bell } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { Button } from '../ui/Button';
import { Column } from '../ui/Column';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { useBoard } from '../../context/BoardContext';
import logo from '../../assets/logo.png';
import './Layout.css';

export const DashboardLayout = () => {
    const [activeTab, setActiveTab] = useState('board');
    const { state, dispatch } = useBoard();

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [currentColumnId, setCurrentColumnId] = useState<string | null>(null);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [newTaskData, setNewTaskData] = useState({
        content: '',
        description: '',
        estimationTime: '',
        projectId: '',
        startAt: '',
        endAt: '',
        assignTo: ''
    });

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        dispatch({
            type: 'MOVE_TASK',
            payload: {
                taskId: draggableId,
                sourceColId: source.droppableId,
                destColId: destination.droppableId,
                sourceIndex: source.index,
                destIndex: destination.index,
            },
        });
    };

    const handleAddClick = (columnId: string) => {
        setCurrentColumnId(columnId);
        setIsTaskModalOpen(true);
    };

    const handleCreateTask = () => {
        const targetColumnId = currentColumnId || state.columnOrder[0];

        if (!newTaskData.content.trim()) return;

        if (editingTaskId) {
            dispatch({
                type: 'UPDATE_TASK',
                payload: {
                    taskId: editingTaskId,
                    content: newTaskData.content,
                    description: newTaskData.description,
                    estimationTime: newTaskData.estimationTime,
                    projectId: newTaskData.projectId,
                    startAt: newTaskData.startAt,
                    endAt: newTaskData.endAt,
                    assignTo: newTaskData.assignTo,
                },
            });
        } else {
            dispatch({
                type: 'ADD_TASK',
                payload: {
                    columnId: targetColumnId,
                    content: newTaskData.content,
                    description: newTaskData.description,
                    estimationTime: newTaskData.estimationTime,
                    projectId: newTaskData.projectId,
                    startAt: newTaskData.startAt,
                    endAt: newTaskData.endAt,
                    assignTo: newTaskData.assignTo,
                },
            });
        }

        setIsTaskModalOpen(false);
        setNewTaskData({
            content: '',
            description: '',
            estimationTime: '',
            projectId: '',
            startAt: '',
            endAt: '',
            assignTo: ''
        });
        setEditingTaskId(null);
    };

    const handleEditTask = (e: React.MouseEvent, taskId: string) => {
        e.stopPropagation();
        const task = state.tasks[taskId];
        setNewTaskData({
            content: task.content,
            description: task.description || '',
            estimationTime: task.estimationTime || '',
            projectId: task.projectId || '',
            startAt: task.startAt || '',
            endAt: task.endAt || '',
            assignTo: task.assignTo || ''
        });
        setEditingTaskId(taskId);
        setIsTaskModalOpen(true);
    };

    const handleViewTask = (e: React.MouseEvent, taskId: string) => {
        e.stopPropagation();
        handleEditTask(e, taskId);
    };

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar__header">
                    <div className="sidebar__title">
                        <img src={logo} alt="SolveX" style={{ height: '82px', width: '82px' }} />
                        <span>SolveX</span>
                    </div>
                </div>
                <nav className="sidebar__nav">
                    <div
                        className={`nav-item ${activeTab === 'board' ? 'active' : ''}`}
                        onClick={() => setActiveTab('board')}
                    >
                        <LayoutDashboard size={20} />
                        <span>Board</span>
                    </div>
                    <div
                        className={`nav-item ${activeTab === 'members' ? 'active' : ''}`}
                        onClick={() => setActiveTab('members')}
                    >
                        <User size={20} />
                        <span>Team Members</span>
                    </div>
                    <div
                        className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <Settings size={20} />
                        <span>Settings</span>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h1 className="text-lg">Roadmap</h1>
                        <Button variant="outline" className="w-full h-[50px] border-dashed"
                            onClick={() => { setIsTaskModalOpen(true) }}
                        >
                            + Add Task
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon">
                            <Bell size={20} />
                        </Button>
                        <div className="flex items-center gap-2">
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#cbd5e1' }}></div>
                        </div>
                    </div>
                </header>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="board-area">
                        {state.columnOrder.map((columnId) => {
                            const column = state.columns[columnId];
                            const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

                            return (
                                <Column
                                    key={column.id}
                                    title={column.title}
                                    count={tasks.length}
                                    onAddClick={() => handleAddClick(column.id)}
                                    onMenuClick={() => { }}
                                >
                                    <Droppable droppableId={column.id}>
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                style={{ minHeight: '100px', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                                            >
                                                {tasks.map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    // Lock to vertical axis if needed, typically auto handled
                                                                }}
                                                            >
                                                                <Card
                                                                    task={task}
                                                                    isDragging={snapshot.isDragging}
                                                                    onClick={() => handleViewTask({ stopPropagation: () => { } } as React.MouseEvent, task.id)}
                                                                    onEdit={handleEditTask}
                                                                    onView={handleViewTask}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </Column>
                            );
                        })}
                    </div>
                </DragDropContext>

                <Modal
                    isOpen={isTaskModalOpen}
                    onClose={() => { setIsTaskModalOpen(false); setEditingTaskId(null); }}
                    title={editingTaskId ? "Edit Task" : "Create Task"}
                >
                    <div className="flex flex-col gap-4">
                        <Textarea
                            value={newTaskData.content}
                            onChange={(e) => setNewTaskData({ ...newTaskData, content: e.target.value })}
                            placeholder="What needs to be done?"
                            autoFocus
                            label="Task Content"
                        />

                        <Textarea
                            value={newTaskData.description}
                            onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                            placeholder="Detailed description..."
                            label="Description"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                value={newTaskData.estimationTime}
                                onChange={(e) => setNewTaskData({ ...newTaskData, estimationTime: e.target.value })}
                                placeholder="e.g., 2h, 3 days"
                                label="Estimation Time"
                            />
                            <Input
                                value={newTaskData.projectId}
                                onChange={(e) => setNewTaskData({ ...newTaskData, projectId: e.target.value })}
                                placeholder="Project ID"
                                label="Project ID"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="date"
                                value={newTaskData.startAt}
                                onChange={(e) => setNewTaskData({ ...newTaskData, startAt: e.target.value })}
                                label="Start At"
                            />
                            <Input
                                type="date"
                                value={newTaskData.endAt}
                                onChange={(e) => setNewTaskData({ ...newTaskData, endAt: e.target.value })}
                                label="End At"
                            />
                        </div>

                        <Input
                            value={newTaskData.assignTo}
                            onChange={(e) => setNewTaskData({ ...newTaskData, assignTo: e.target.value })}
                            placeholder="Assignee Name"
                            label="Assign To"
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateTask}>
                                {editingTaskId ? "Update Task" : "Create Task"}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </main>
        </div>
    );
};
