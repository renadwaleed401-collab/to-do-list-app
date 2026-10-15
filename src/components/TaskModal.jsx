import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  defaultColumn = 'todo',
  defaultUserId = 1,
  users = []
}) {
  const [todo, setTodo] = useState('');
  const [column, setColumn] = useState('todo');
  const [userId, setUserId] = useState(defaultUserId);
  const [error, setError] = useState('');

  const isEditing = Boolean(initialData && initialData.id);

  useEffect(() => {
    if (initialData) {
      setTodo(initialData.todo || '');
      setColumn(initialData.column || 'todo');
      setUserId(initialData.userId || defaultUserId);
    } else {
      setTodo('');
      setColumn(defaultColumn || 'todo');
      setUserId(defaultUserId);
    }
    setError('');
  }, [initialData, defaultColumn, defaultUserId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!todo.trim()) {
      setError('Please provide a task description.');
      return;
    }

    onSave({
      id: initialData ? initialData.id : undefined,
      todo: todo.trim(),
      column,
      completed: column === 'completed',
      userId: Number(userId),
      createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#EDE6DC] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE6DC] bg-[#FAF7F2]">
          <h3 id="modal-title" className="text-base font-editorial font-bold text-[#282F1B] italic tracking-tight">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-[#282F1B]/60 hover:text-[#282F1B] hover:bg-[#F9D1D9]/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-[#FDF2F4] border border-[#F9D1D9] text-[#8E364A] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Task Title */}
          <div>
            <label htmlFor="task-todo" className="block text-xs font-bold text-[#282F1B] uppercase tracking-wider mb-1.5">
              Task Description <span className="text-[#8E364A]">*</span>
            </label>
            <textarea
              id="task-todo"
              rows={3}
              value={todo}
              onChange={(e) => {
                setTodo(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Complete review for current milestone..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#EDE6DC] text-sm text-[#282F1B] placeholder-[#282F1B]/40 focus:outline-none focus:ring-2 focus:ring-[#838F58]/20 focus:border-[#838F58] focus:bg-white transition-all resize-none"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Column Selector */}
            <div>
              <label htmlFor="task-column" className="block text-xs font-bold text-[#282F1B] uppercase tracking-wider mb-1.5">
                Column
              </label>
              <select
                id="task-column"
                value={column}
                onChange={(e) => setColumn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#EDE6DC] text-xs font-medium text-[#282F1B] focus:outline-none focus:ring-2 focus:ring-[#838F58]/20 focus:border-[#838F58]"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* User Assignee Selector */}
            {users?.length > 0 && (
              <div>
                <label htmlFor="task-assignee" className="block text-xs font-bold text-[#282F1B] uppercase tracking-wider mb-1.5">
                  Assign To User
                </label>
                <select
                  id="task-assignee"
                  value={userId}
                  onChange={(e) => setUserId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#EDE6DC] text-xs font-medium text-[#282F1B] focus:outline-none focus:ring-2 focus:ring-[#838F58]/20 focus:border-[#838F58]"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#EDE6DC]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#EDE6DC] text-xs font-semibold text-[#282F1B]/80 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#838F58] hover:bg-[#535E32] text-[#F9D1D9] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
