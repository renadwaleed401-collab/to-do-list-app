import React, { useState } from 'react';
import { Plus, Coffee } from 'lucide-react';
import TaskCard from './TaskCard.jsx';

export default function KanbanColumn({
  column,
  tasks,
  onToggleComplete,
  onMoveColumn,
  onEditTask,
  onDeleteTask,
  onQuickAddTask,
  onDropTask,
  draggedTaskId,
  onDragStart,
  onDragEnd,
  showAllTeam = false
}) {
  const [isOver, setIsOver] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Calculate percentage of tasks completed relative to total tasks in this category
  const totalTasks = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const percentCompleted = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isOver) setIsOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    if (draggedTaskId) {
      onDropTask(draggedTaskId, column.id);
    }
  };

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (quickTitle.trim()) {
      onQuickAddTask(quickTitle.trim(), column.id);
      setQuickTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-3xl bg-[#FAF7F2]/90 border transition-all duration-200 min-h-[640px] sm:min-h-[720px] max-h-[calc(100vh-140px)] overflow-hidden shadow-2xs ${
        isOver
          ? 'border-[#838F58] ring-3 ring-[#838F58]/15 bg-[#F4F7EE]'
          : 'border-[#EDE6DC]'
      }`}
    >
      {/* Column Header with Visual Progress Bar */}
      <div 
        className="px-5 pt-3.5 pb-3 border-b border-[#EDE6DC] bg-white/80 backdrop-blur-xs space-y-2.5"
        style={{ borderTop: `4px solid ${column.accentColor}` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-editorial font-bold text-[#282F1B] italic tracking-tight">
              {column.title}
            </h2>
            <span 
              className="px-2.5 py-0.5 rounded-full text-xs font-bold shadow-2xs"
              style={{ 
                backgroundColor: column.badgeBg,
                color: column.badgeText
              }}
            >
              {tasks.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="p-1.5 rounded-xl text-[#282F1B]/60 hover:text-[#838F58] hover:bg-[#F9D1D9]/30 transition-colors cursor-pointer"
            title={`Quick add task to ${column.title}`}
            aria-label={`Quick add task to ${column.title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#282F1B]/70">
            <span>{completedCount} of {totalTasks} completed</span>
            <span className="font-bold text-[#838F58] tabular-nums">
              {percentCompleted}%
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-[#EDE6DC] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${percentCompleted}%`,
                backgroundColor: percentCompleted === 100 
                  ? '#838F58' 
                  : column.id === 'todo' 
                    ? '#C96B7F' 
                    : '#838F58'
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick Add Inline Form */}
      {isAdding && (
        <form onSubmit={handleQuickSubmit} className="p-3.5 bg-white border-b border-[#EDE6DC] animate-in fade-in duration-150">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder={`Add to ${column.title}...`}
            className="w-full px-3.5 py-2 text-xs font-medium bg-[#FAF7F2] rounded-xl border border-[#EDE6DC] text-[#282F1B] placeholder-[#282F1B]/40 focus:outline-none focus:border-[#838F58] focus:bg-white"
            autoFocus
          />
          <div className="mt-2.5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setQuickTitle('');
              }}
              className="px-3 py-1 text-xs font-semibold text-[#282F1B]/60 hover:text-[#282F1B]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!quickTitle.trim()}
              className="px-3.5 py-1 text-xs font-semibold bg-[#838F58] hover:bg-[#535E32] text-[#F9D1D9] rounded-xl shadow-2xs disabled:opacity-50 transition-colors"
            >
              Add Card
            </button>
          </div>
        </form>
      )}

      {/* Task Cards Stack */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
        {tasks.length === 0 ? (
          <div className="h-44 border-2 border-dashed border-[#EDE6DC] rounded-2xl flex flex-col items-center justify-center text-center p-5">
            <div className="w-9 h-9 rounded-full bg-[#FDF2F4] text-[#838F58] flex items-center justify-center mb-2">
              <Coffee className="w-4 h-4" />
            </div>
            <p className="text-xs font-editorial italic font-bold text-[#282F1B]/70">No tasks here</p>
            <p className="text-[11px] text-[#282F1B]/45 mt-0.5">
              Drag notes here or tap &quot;+&quot; to begin
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onMoveColumn={onMoveColumn}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggedTaskId === task.id}
              showAllTeam={showAllTeam}
            />
          ))
        )}
      </div>

      {/* Bottom Add Trigger */}
      {!isAdding && (
        <div className="p-3 border-t border-[#EDE6DC] bg-white/60">
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full py-2 px-3 rounded-xl border border-dashed border-[#DCD5C8] hover:border-[#838F58] text-xs font-semibold text-[#282F1B]/70 hover:text-[#838F58] hover:bg-[#FDF2F4] transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add a task</span>
          </button>
        </div>
      )}
    </div>
  );
}
