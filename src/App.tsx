import React, { useState, useRef } from 'react';
import { KanbanSquare, LayoutDashboard, Settings, User, Bell } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { Button } from './components/ui/Button';
import { Column } from './components/ui/Column';
import { Card } from './components/ui/Card';
import { Modal } from './components/ui/Modal';
import { Input, Textarea } from './components/ui/Input';
import { useBoard } from './context/BoardContext';
import './components/layout/Layout.css';

function App() {
  const [activeTab, setActiveTab] = useState('board');
  const { state, dispatch } = useBoard();

  // Task Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentColumnId, setCurrentColumnId] = useState<string | null>(null);
  const newTaskContentRef = useRef<HTMLTextAreaElement>(null);

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
    setCurrentColumnId("col-1")
    console.log(currentColumnId);
    if (!newTaskContentRef.current?.value.trim()) return;

    dispatch({
      type: 'ADD_TASK',
      payload: {
        columnId: "col-1",
        content: newTaskContentRef.current.value,
      },
    });

    setIsTaskModalOpen(false);
  };

  const handleTaskClick = (taskId: string, taskContent: string) => {
    console.log(taskId);
    // newTaskContentRef.current!.value = taskContent;
    setIsTaskModalOpen(true);
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar__header">
          <div className="sidebar__title">
            <KanbanSquare size={28} />
            <span>BIM </span>
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
                                <Card isDragging={snapshot.isDragging} onClick={() => handleTaskClick(task.id, task.content)}>
                                  {task.content}
                                </Card>
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

            {/* <div className="w-[300px] min-w-[300px]">
              <Button
                variant="outline"
                className="w-full h-[50px] border-dashed"
                onClick={() => {
                  const title = window.prompt("Enter column title:");
                  if (title) {
                    dispatch({ type: 'ADD_COLUMN', payload: { title } });
                  }
                }}
              >
                + Add Column
              </Button>
            </div> */}
          </div>
        </DragDropContext>

        <Modal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          title="Create Task"
        >
          <div className="flex flex-col gap-4">
            <Textarea
              ref={newTaskContentRef}
              placeholder="What needs to be done?"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}

export default App;
