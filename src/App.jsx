import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header.jsx';
import KanbanColumn from './components/KanbanColumn.jsx';
import TaskModal from './components/TaskModal.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';
import Toast from './components/Toast.jsx';
import { COLUMNS } from './constants/palette.js';
import { DEFAULT_USERS, AVATAR_COLORS } from './data/mockUsers.js';
import { fetchTodosFromApi } from './utils/api.js';
import { RefreshCw, UserCheck, Layers } from 'lucide-react';

const STORAGE_KEY = 'strawberry_matcha_tasks_v15';
const USERS_STORAGE_KEY = 'strawberry_matcha_users_v4';

export default function App() {
  // Dynamic users state - default to User 1
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sanitize: ensure no legacy mock people names remain
          const isLegacy = parsed.some(u => /Evelyn|Marcus|Aria|Julian|Chloe/i.test(u.name));
          if (!isLegacy) return parsed;
        }
      } catch (e) {
        console.error('Error parsing stored users:', e);
      }
    }
    return DEFAULT_USERS;
  });

  const [activePerson, setActivePerson] = useState(() => users[0] || DEFAULT_USERS[0]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllTeam, setShowAllTeam] = useState(false);

  // Drag & drop state
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultColumnForNew, setDefaultColumnForNew] = useState('todo');
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Toast & Undo
  const [toast, setToast] = useState(null);
  const [lastDeletedTask, setLastDeletedTask] = useState(null);

  const showToast = (message, type = 'success', canUndo = false) => {
    setToast({ message, type, canUndo });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Persist users
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // Keep activePerson in sync
  useEffect(() => {
    const found = users.find(u => u.id === activePerson.id);
    if (found) {
      if (found.name !== activePerson.name || found.avatarColor !== activePerson.avatarColor) {
        setActivePerson(found);
      }
    } else {
      setActivePerson(users[0] || DEFAULT_USERS[0]);
    }
  }, [users, activePerson]);

  // Load initial tasks from localStorage or API
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Guarantee all initial tasks are assigned to User 1
          const sanitized = parsed.map(t => ({ ...t, userId: 1 }));
          setTasks(sanitized);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error('Error parsing stored tasks:', e);
      }
    }
    loadFromApi();
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  const loadFromApi = async () => {
    setIsLoading(true);
    const data = await fetchTodosFromApi();
    // All tasks belong strictly to User 1
    const user1Tasks = data.map(t => ({ ...t, userId: 1 }));
    setTasks(user1Tasks);
    setIsLoading(false);
    showToast(`Loaded ${user1Tasks.length} tasks for User 1`, 'info');
  };

  // Add new user function - adds user without auto-generating tasks (all tasks remain for User 1)
  const handleAddUser = (customName, customColor) => {
    const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const finalName = customName?.trim() || `User ${nextId}`;
    const newUser = {
      id: nextId,
      name: finalName,
      role: `Workspace ${nextId}`,
      avatarColor: customColor || AVATAR_COLORS[(nextId - 1) % AVATAR_COLORS.length]
    };

    setUsers(prev => [...prev, newUser]);
    setActivePerson(newUser);
    setShowAllTeam(false);
    showToast(`Added ${newUser.name}! Switched to their workspace.`);
  };

  // Rename an existing user
  const handleRenameUser = (userId, newName) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, name: newName } : u))
    );
    showToast(`Renamed to "${newName}"`);
  };

  // Delete a user (and reassign their tasks to the remaining primary user)
  const handleDeleteUser = (userId) => {
    if (users.length <= 1) {
      showToast('Cannot delete the only remaining user', 'info');
      return;
    }
    const remainingUsers = users.filter(u => u.id !== userId);
    const targetFallbackUser = remainingUsers[0];

    // Reassign deleted user's tasks
    setTasks(prev =>
      prev.map(t => (t.userId === userId ? { ...t, userId: targetFallbackUser.id } : t))
    );

    setUsers(remainingUsers);
    if (activePerson.id === userId) {
      setActivePerson(targetFallbackUser);
    }
    showToast(`User deleted. Tasks moved to ${targetFallbackUser.name}.`);
  };

  // Filter tasks to the active user
  const personTasks = useMemo(() => {
    return tasks.filter(t => t.userId === activePerson.id);
  }, [tasks, activePerson]);

  // Tasks to display: single user view vs all tasks view + search filter
  const displayedTasks = useMemo(() => {
    let list = showAllTeam ? tasks : personTasks;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => t.todo.toLowerCase().includes(q));
    }

    return list;
  }, [tasks, personTasks, showAllTeam, searchQuery]);

  // Quick 1-click Add Task from column
  const handleQuickAddTask = (title, columnId) => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const newTask = {
      id: newId,
      todo: title,
      column: columnId,
      completed: columnId === 'completed',
      userId: activePerson.id,
      priority: 'medium',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks(prev => [newTask, ...prev]);
    showToast(`Added to ${columnId === 'todo' ? 'To Do' : columnId === 'in-progress' ? 'In Progress' : 'Completed'}`);
  };

  // Drag and Drop handlers
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', String(taskId));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDropTask = (taskId, targetColumnId) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            column: targetColumnId,
            completed: targetColumnId === 'completed' ? true : task.completed
          };
        }
        return task;
      })
    );

    const col = COLUMNS.find(c => c.id === targetColumnId);
    showToast(`Moved to ${col ? col.title : targetColumnId}`);
    setDraggedTaskId(null);
  };

  // Toggle checkbox completion in place
  const handleToggleComplete = (taskId) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const nextCompleted = !task.completed;
          return {
            ...task,
            completed: nextCompleted
          };
        }
        return task;
      })
    );
  };

  // Move Column directly
  const handleMoveColumn = (taskId, nextColumnId) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            column: nextColumnId,
            completed: nextColumnId === 'completed' ? true : task.completed
          };
        }
        return task;
      })
    );
  };

  // Open modal for full create
  const handleOpenNewTask = (columnId = 'todo') => {
    setEditingTask(null);
    setDefaultColumnForNew(columnId);
    setIsTaskModalOpen(true);
  };

  // Open modal for edit
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Save task from modal
  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      setTasks(prev =>
        prev.map(t => (t.id === taskData.id ? { ...t, ...taskData } : t))
      );
      showToast('Task updated');
    } else {
      const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      const newTask = {
        ...taskData,
        id: newId,
        userId: taskData.userId || activePerson.id
      };
      setTasks(prev => [newTask, ...prev]);
      showToast('Task created');
    }
  };

  // Delete flow
  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = (taskId) => {
    const toDelete = tasks.find(t => t.id === taskId);
    if (toDelete) {
      setLastDeletedTask(toDelete);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      showToast(`Removed "${toDelete.todo.slice(0, 20)}..."`, 'info', true);
    }
    setTaskToDelete(null);
  };

  const handleUndoDelete = () => {
    if (lastDeletedTask) {
      setTasks(prev => [lastDeletedTask, ...prev]);
      showToast('Task restored');
      setLastDeletedTask(null);
    }
  };

  // Overall workspace completion stats
  const activeTasksList = showAllTeam ? tasks : personTasks;
  const activeCompletedCount = activeTasksList.filter(t => t.completed).length;
  const activePercent = activeTasksList.length > 0 ? Math.round((activeCompletedCount / activeTasksList.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#282F1B] flex flex-col antialiased">
      {/* Header with User 1, User Selector, + User button */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activePerson={activePerson}
        onSelectPerson={setActivePerson}
        users={users}
        onAddUser={handleAddUser}
        onRenameUser={handleRenameUser}
        onDeleteUser={handleDeleteUser}
        tasks={tasks}
        showAllTeam={showAllTeam}
        onToggleShowAllTeam={setShowAllTeam}
        onOpenNewTask={() => handleOpenNewTask('todo')}
        onRefreshApi={loadFromApi}
        isLoading={isLoading}
      />

      {/* Main Kanban Columns */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Workspace Sub-header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 bg-white/70 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-[#EDE6DC] shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: showAllTeam ? '#838F58' : activePerson.avatarColor || '#838F58' }}
            />
            <div className="flex items-baseline gap-2">
              <h1 className="text-sm sm:text-base font-editorial font-bold text-[#282F1B] italic">
                {showAllTeam ? 'All Workspaces (All Tasks)' : `${activePerson.name}'s To-Do Board`}
              </h1>
              <span className="text-xs text-[#282F1B]/50 font-sans">
                {activeCompletedCount} of {activeTasksList.length} completed ({activePercent}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!showAllTeam ? (
              <button
                type="button"
                onClick={() => setShowAllTeam(true)}
                className="text-xs text-[#838F58] hover:text-[#535E32] font-semibold hover:underline cursor-pointer flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>View all tasks</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowAllTeam(false)}
                className="text-xs text-[#838F58] hover:text-[#535E32] font-semibold hover:underline cursor-pointer flex items-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Back to {activePerson.name}</span>
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="h-80 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-[#838F58] animate-spin" />
            <p className="text-sm font-editorial italic font-bold text-[#282F1B]">
              {showAllTeam ? 'Brewing all tasks...' : `Brewing ${activePerson.name}'s tasks...`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {COLUMNS.map(column => {
              const columnTasks = displayedTasks.filter(t => t.column === column.id);

              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  onToggleComplete={handleToggleComplete}
                  onMoveColumn={handleMoveColumn}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteClick}
                  onQuickAddTask={handleQuickAddTask}
                  onDropTask={handleDropTask}
                  draggedTaskId={draggedTaskId}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  showAllTeam={showAllTeam}
                  users={users}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Footer in Exact Same Size & Height as Header (h-16) */}
      <footer className="h-16 bg-[#838F58] text-[#FAF7F2] border-t border-[#737F4A] shadow-xs mt-auto flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 text-xs">
          {/* Left: Brand & Tagline */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-baseline">
              <span className="font-editorial italic font-normal text-2xl text-[#FAF7F2] tracking-tight select-none">
                to do
              </span>
              <span className="text-xl font-editorial font-bold text-[#F9D1D9] ml-0.5">.</span>
            </div>
            <span className="hidden sm:inline text-xs text-[#FAF7F2]/75">
              &bull; bloom one task at a time
            </span>
          </div>

          {/* Center: Workspaces & Aesthetic Tag */}
          <div className="flex items-center gap-3 text-[#FAF7F2]/85 text-xs truncate">
            <button
              type="button"
              onClick={() => setShowAllTeam(!showAllTeam)}
              className="hover:text-[#F9D1D9] transition-colors cursor-pointer font-medium truncate"
            >
              {showAllTeam ? 'All Tasks' : `${activePerson.name}'s Workspace`}
            </button>
            <span className="text-[#F9D1D9]/60">&bull;</span>
            <span className="text-[#F9D1D9] font-medium truncate">
              mindful daily flow
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 text-[#FAF7F2]/80 shrink-0">
            <button
              type="button"
              onClick={loadFromApi}
              className="hover:text-[#F9D1D9] transition-colors cursor-pointer hidden md:inline text-xs"
              title="Reload tasks"
            >
              Reload API
            </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#F9D1D9] hover:underline cursor-pointer font-semibold text-xs"
            >
              &uarr; Top
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialData={editingTask}
        defaultColumn={defaultColumnForNew}
        defaultUserId={activePerson.id}
        users={users}
      />

      <DeleteConfirmModal
        isOpen={Boolean(taskToDelete)}
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <Toast
        toast={toast}
        onClose={() => setToast(null)}
        onUndo={handleUndoDelete}
      />
    </div>
  );
}
