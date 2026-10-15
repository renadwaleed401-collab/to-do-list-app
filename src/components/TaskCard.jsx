import React, { useState } from 'react';
import { Check, Trash2, Edit3, ChevronDown } from 'lucide-react';
import { COLUMNS } from '../constants/palette.js';
import { getUserInfo, getInitials } from '../data/mockUsers.js';

export default function TaskCard({
  task,
  onToggleComplete,
  onMoveColumn,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging,
  showAllTeam = false,
  users = null
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [inlineText, setInlineText] = useState(task.todo);

  const handleInlineSave = () => {
    if (inlineText.trim() && inlineText !== task.todo) {
      onEdit({ ...task, todo: inlineText.trim() });
    }
    setIsEditingInline(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInlineSave();
    } else if (e.key === 'Escape') {
      setInlineText(task.todo);
      setIsEditingInline(false);
    }
  };

  const currentCol = COLUMNS.find(c => c.id === task.column) || COLUMNS[0];
  const assignedUser = getUserInfo(task.userId, users);

  return (
    <div
      draggable={!isEditingInline}
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      className={`group relative bg-white rounded-2xl p-4 border transition-all duration-200 cursor-grab active:cursor-grabbing shadow-2xs hover:shadow-md hover:-translate-y-0.5 ${
        task.completed
          ? 'border-[#E5ECD9] bg-[#FCFDF9]'
          : 'border-[#F2ECE4] hover:border-[#F9D1D9]'
      } ${isDragging ? 'opacity-35 scale-95 border-dashed border-[#838F58]' : ''}`}
    >
      <div className="flex items-start gap-3.5">
        {/* Satisfying Matcha / Strawberry Checkmark */}
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
            task.completed
              ? 'bg-[#838F58] border-[#838F58] text-white shadow-xs scale-105'
              : 'border-[#D9D3C7] bg-white hover:border-[#838F58] hover:bg-[#F9D1D9]/20'
          }`}
          title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <Check className={`w-3 h-3 stroke-[3] ${task.completed ? 'opacity-100' : 'opacity-0 hover:opacity-100 text-[#838F58]'}`} />
        </button>

        {/* Task description */}
        <div className="flex-1 min-w-0">
          {isEditingInline ? (
            <input
              type="text"
              value={inlineText}
              onChange={(e) => setInlineText(e.target.value)}
              onBlur={handleInlineSave}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full text-sm font-medium text-[#282F1B] bg-[#FAF7F2] px-2.5 py-1 rounded-xl border border-[#838F58] focus:outline-none focus:ring-2 focus:ring-[#838F58]/20"
            />
          ) : (
            <p
              onClick={() => setIsEditingInline(true)}
              className={`text-sm font-medium leading-relaxed tracking-tight cursor-text select-text transition-colors ${
                task.completed
                  ? 'line-through text-[#282F1B]/40'
                  : 'text-[#282F1B] hover:text-[#535E32]'
              }`}
              title="Click to edit task"
            >
              {task.todo}
            </p>
          )}

          {/* Bottom Bar: Status Pill & Actions */}
          <div className="mt-3 flex items-center justify-between gap-2 pt-2.5 border-t border-[#F5EFE6]">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* 1-Click Status Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer shadow-2xs hover:scale-102"
                  style={{
                    backgroundColor: currentCol.badgeBg,
                    color: currentCol.badgeText,
                    border: `1px solid ${currentCol.borderColor}`
                  }}
                  title="Change column"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: currentCol.dotColor }}
                  />
                  <span>{currentCol.title}</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {/* Status Dropdown */}
                {showStatusMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setShowStatusMenu(false)}
                    />
                    <div className="absolute left-0 bottom-full mb-1.5 z-30 w-36 bg-white rounded-2xl shadow-xl border border-[#EBE5DA] py-1.5 text-xs animate-in fade-in zoom-in-95 duration-150">
                      {COLUMNS.map((col) => (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => {
                            onMoveColumn(task.id, col.id);
                            setShowStatusMenu(false);
                          }}
                          className={`w-full text-left px-3.5 py-1.5 flex items-center justify-between hover:bg-[#FAF7F2] transition-colors cursor-pointer ${
                            task.column === col.id ? 'font-bold text-[#282F1B]' : 'text-[#282F1B]/75'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: col.accentColor }}
                            />
                            {col.title}
                          </span>
                          {task.column === col.id && (
                            <Check className="w-3 h-3 text-[#838F58]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Assignee badge with user name and color in all tasks view */}
              {showAllTeam && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF7F2] text-[#282F1B] border border-[#EDE6DC] shadow-2xs"
                  title={`Assigned to ${assignedUser.name}`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: assignedUser.avatarColor || '#838F58' }}
                  />
                  <span>{assignedUser.name}</span>
                </span>
              )}
            </div>

            {/* Clean, delicate action buttons */}
            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg text-[#282F1B]/60 hover:text-[#838F58] hover:bg-[#EFF3E6] transition-colors cursor-pointer"
                title="Full edit"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(task)}
                className="p-1.5 rounded-lg text-[#282F1B]/60 hover:text-[#8E364A] hover:bg-[#FDF2F4] transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
