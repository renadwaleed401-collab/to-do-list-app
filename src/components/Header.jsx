import React, { useState } from 'react';
import { Search, Plus, X, ChevronDown, Check, RotateCw, Users, UserPlus, Edit2, Trash2 } from 'lucide-react';
import { getInitials, AVATAR_COLORS } from '../data/mockUsers.js';

export default function Header({
  searchQuery,
  onSearchChange,
  activePerson,
  onSelectPerson,
  users = [],
  onAddUser,
  onRenameUser,
  onDeleteUser,
  tasks = [],
  showAllTeam,
  onToggleShowAllTeam,
  onOpenNewTask,
  onRefreshApi,
  isLoading
}) {
  const [showPersonDropdown, setShowPersonDropdown] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[1]); // default Strawberry/Matcha tone
  
  // Inline rename state
  const [editingUserId, setEditingUserId] = useState(null);
  const [renameText, setRenameText] = useState('');

  const handleStartAdd = () => {
    const nextNum = users.length + 1;
    setNewUserName(`User ${nextNum}`);
    setSelectedColor(AVATAR_COLORS[(nextNum - 1) % AVATAR_COLORS.length]);
    setIsAddingUser(true);
    setEditingUserId(null);
  };

  const handleConfirmAdd = (e) => {
    e?.preventDefault();
    if (newUserName.trim() && onAddUser) {
      onAddUser(newUserName.trim(), selectedColor);
      setIsAddingUser(false);
      setNewUserName('');
      setShowPersonDropdown(false);
    }
  };

  const handleStartRename = (user, e) => {
    e.stopPropagation();
    setEditingUserId(user.id);
    setRenameText(user.name);
    setIsAddingUser(false);
  };

  const handleConfirmRename = (userId, e) => {
    e?.preventDefault();
    if (renameText.trim() && onRenameUser) {
      onRenameUser(userId, renameText.trim());
    }
    setEditingUserId(null);
  };

  // Helper to count tasks for a user
  const getUserTaskMetrics = (userId) => {
    const userTasks = tasks.filter(t => t.userId === userId);
    const completed = userTasks.filter(t => t.completed).length;
    return {
      total: userTasks.length,
      completed,
      percent: userTasks.length > 0 ? Math.round((completed / userTasks.length) * 100) : 0
    };
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#838F58] border-b border-[#737F4A] shadow-xs flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        
        {/* Left: Cute Logo, Site Title & User Switcher */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Strawberry Matcha To-Do Cup Logo */}
          <div 
            className="w-10 h-10 rounded-2xl bg-[#FAF7F2] border border-[#737F4A] shadow-xs flex items-center justify-center p-1 hover:rotate-3 transition-transform cursor-pointer shrink-0"
            title="to do · strawberry & matcha"
            onClick={() => onToggleShowAllTeam(false)}
          >
            <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
              <rect x="6.5" y="10" width="19" height="17" rx="6.5" fill="#FAF7F2" stroke="#838F58" strokeWidth="1.5" />
              <path d="M7.5 17.5C10 16.5 14 18.5 18 17.5C21 16.5 23.5 17 24.5 17.5V20.5C24.5 23.8 21.8 26.5 18.5 26.5H13.5C10.2 26.5 7.5 23.8 7.5 20.5V17.5Z" fill="#838F58" />
              <path d="M7.5 17.5C9.5 16.5 13.5 18.5 17.5 17.5C21.5 16.5 23.5 17 24.5 17.5V15C24.5 12.2 22.3 10 19.5 10H12.5C9.7 10 7.5 12.2 7.5 15V17.5Z" fill="#F9D1D9" />
              <path d="M13.5 22L15.5 24L18.5 20" stroke="#FAF7F2" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 10C16 7.5 18 5.5 20.5 5.5C20.5 8 18.5 10 16 10Z" fill="#838F58" />
              <path d="M16 10C15.5 8 14 6.5 12 6.5C12 8.5 14 10 16 10Z" fill="#B2BD8D" />
            </svg>
          </div>

          {/* Title */}
          <div className="flex items-baseline">
            <span className="font-editorial italic font-normal text-2xl sm:text-3xl text-[#FAF7F2] tracking-tight select-none">
              to do
            </span>
            <span className="text-xl font-editorial font-bold text-[#F9D1D9] ml-0.5">.</span>
          </div>

          {/* Subtle Divider */}
          <div className="hidden md:block h-5 w-[1px] bg-white/20" />

          {/* User Controls: Switcher & Add User */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* User Switcher Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowPersonDropdown(!showPersonDropdown);
                  setIsAddingUser(false);
                  setEditingUserId(null);
                }}
                className={`group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border shadow-2xs transition-all cursor-pointer ${
                  !showAllTeam
                    ? 'bg-[#FAF7F2] border-[#F9D1D9] ring-2 ring-[#F9D1D9]/40 text-[#282F1B]'
                    : 'bg-white/15 hover:bg-white/25 border-white/25 text-[#FAF7F2]'
                }`}
                title="Switch active user or manage users"
              >
                <div
                  className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs"
                  style={{ backgroundColor: activePerson.avatarColor || '#838F58' }}
                >
                  {getInitials(activePerson.name)}
                </div>

                <span className={`text-xs font-semibold ${!showAllTeam ? 'text-[#282F1B]' : 'text-[#FAF7F2]'}`}>
                  {activePerson.name}
                </span>
                <ChevronDown className={`w-3 h-3 ${!showAllTeam ? 'text-[#282F1B]/60' : 'text-white/60'} group-hover:opacity-100 transition-opacity`} />
              </button>

              {/* Users Dropdown Menu */}
              {showPersonDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => {
                      setShowPersonDropdown(false);
                      setIsAddingUser(false);
                      setEditingUserId(null);
                    }}
                  />
                  <div className="absolute left-0 mt-2 z-30 w-72 bg-white rounded-2xl shadow-xl border border-[#EDE6DC] p-2.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2 py-1 text-[11px] uppercase font-bold tracking-wider text-[#282F1B]/50 border-b border-[#F5EFE6] flex items-center justify-between">
                      <span>Users ({users.length})</span>
                      <span className="text-[10px] text-[#838F58] font-semibold lowercase">click to switch</span>
                    </div>

                    {/* Users list */}
                    <div className="py-1.5 max-h-56 overflow-y-auto space-y-1">
                      {users.map((person) => {
                        const isSelected = !showAllTeam && person.id === activePerson.id;
                        const metrics = getUserTaskMetrics(person.id);
                        const isEditingThis = editingUserId === person.id;

                        if (isEditingThis) {
                          return (
                            <form
                              key={person.id}
                              onSubmit={(e) => handleConfirmRename(person.id, e)}
                              className="flex items-center gap-1.5 p-1.5 bg-[#FAF7F2] rounded-xl border border-[#838F58]/40"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="text"
                                value={renameText}
                                onChange={(e) => setRenameText(e.target.value)}
                                autoFocus
                                className="flex-1 px-2 py-0.5 text-xs bg-white rounded-lg border border-[#EDE6DC] text-[#282F1B] focus:outline-none focus:border-[#838F58]"
                              />
                              <button
                                type="submit"
                                className="px-2 py-0.5 text-[11px] font-bold bg-[#838F58] text-[#F9D1D9] rounded-lg"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingUserId(null)}
                                className="px-1.5 py-0.5 text-[11px] text-[#282F1B]/50 hover:text-[#282F1B]"
                              >
                                ✕
                              </button>
                            </form>
                          );
                        }

                        return (
                          <div
                            key={person.id}
                            onClick={() => {
                              onSelectPerson(person);
                              onToggleShowAllTeam(false);
                              setShowPersonDropdown(false);
                            }}
                            className={`group w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#FDF2F4] text-[#8E364A] font-bold'
                                : 'text-[#282F1B]/80 hover:bg-[#FAF7F2]'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="w-6 h-6 rounded-full text-[11px] text-white flex items-center justify-center font-bold shrink-0 shadow-2xs"
                                style={{ backgroundColor: person.avatarColor || '#838F58' }}
                              >
                                {getInitials(person.name)}
                              </span>
                              <div className="text-left truncate">
                                <div className="leading-tight truncate">{person.name}</div>
                                <div className="text-[10px] text-[#282F1B]/50 font-normal">
                                  {metrics.total} tasks &bull; {metrics.percent}% done
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#838F58] mr-1" />}
                              
                              {/* Edit Name Button */}
                              <button
                                type="button"
                                onClick={(e) => handleStartRename(person, e)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-[#838F58] hover:bg-white rounded transition-opacity"
                                title="Rename user"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>

                              {/* Delete User Button (only if > 1 user) */}
                              {users.length > 1 && onDeleteUser && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Delete ${person.name} and reassign their tasks to User 1?`)) {
                                      onDeleteUser(person.id);
                                    }
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-[#8E364A] hover:bg-white rounded transition-opacity"
                                  title="Delete user"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add User Section */}
                    <div className="pt-2 mt-1 border-t border-[#F5EFE6]">
                      {isAddingUser ? (
                        <form onSubmit={handleConfirmAdd} className="space-y-2 p-2 bg-[#FAF7F2] rounded-xl border border-[#EDE6DC]">
                          <div className="text-[11px] font-bold text-[#282F1B]">Add New User</div>
                          <input
                            type="text"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            placeholder="e.g. User 2 or work"
                            autoFocus
                            className="w-full px-2.5 py-1 text-xs bg-white rounded-lg border border-[#EDE6DC] text-[#282F1B] focus:outline-none focus:border-[#838F58]"
                          />
                          
                          {/* Avatar Color Swatches */}
                          <div className="flex items-center gap-1.5 pt-0.5">
                            <span className="text-[10px] text-[#282F1B]/60 font-medium">Color:</span>
                            {AVATAR_COLORS.map(color => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setSelectedColor(color)}
                                className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${selectedColor === color ? 'ring-2 ring-offset-1 ring-[#838F58] scale-110' : 'opacity-70 hover:opacity-100'}`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>

                          <div className="flex items-center justify-end gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => setIsAddingUser(false)}
                              className="px-2 py-0.5 text-[11px] text-[#282F1B]/60 hover:text-[#282F1B]"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={!newUserName.trim()}
                              className="px-3 py-1 text-[11px] font-bold bg-[#838F58] hover:bg-[#535E32] text-[#F9D1D9] rounded-lg disabled:opacity-50 transition-colors shadow-2xs"
                            >
                              Add User
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          type="button"
                          onClick={handleStartAdd}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#838F58] hover:bg-[#FDF2F4] transition-colors cursor-pointer border border-dashed border-[#838F58]/30"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>+ Add User</span>
                        </button>
                      )}
                    </div>

                  </div>
                </>
              )}
            </div>

            {/* Quick direct "+ User" Button in Header */}
            <button
              type="button"
              onClick={() => {
                setShowPersonDropdown(true);
                handleStartAdd();
              }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-medium text-[#FAF7F2] bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer shadow-2xs"
              title="Add another user workspace"
            >
              <UserPlus className="w-3 h-3" />
              <span className="hidden sm:inline">+ user</span>
            </button>

            {/* All Tasks Toggle Button */}
            <button
              type="button"
              onClick={() => onToggleShowAllTeam(!showAllTeam)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                showAllTeam
                  ? 'bg-[#F9D1D9] text-[#465126] border-[#F9D1D9] ring-2 ring-white/30 shadow-xs font-bold'
                  : 'bg-white/15 hover:bg-white/25 text-[#FAF7F2] border-white/25'
              }`}
              title="View all tasks from all users"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">all tasks</span>
              <span 
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  showAllTeam 
                    ? 'bg-black/15 text-[#465126]' 
                    : 'bg-black/20 text-[#FAF7F2]'
                }`}
              >
                {tasks.length}
              </span>
            </button>
          </div>
        </div>

        {/* Right: Search, Reset & New Task */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative w-28 sm:w-44 md:w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#282F1B]/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-8 pr-6 py-1.5 rounded-full bg-[#FAF7F2] border border-[#737F4A] text-xs text-[#282F1B] placeholder-[#282F1B]/45 focus:outline-none focus:ring-2 focus:ring-[#F9D1D9]/40 focus:border-[#F9D1D9] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-[#282F1B]/50 hover:text-[#282F1B]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Refresh */}
          <button
            type="button"
            onClick={onRefreshApi}
            disabled={isLoading}
            className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-[#FAF7F2] hover:text-[#F9D1D9] border border-white/25 transition-colors disabled:opacity-40 cursor-pointer shrink-0"
            title="Reload tasks from DummyJSON API"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#F9D1D9]' : ''}`} />
          </button>

          {/* + new task */}
          <button
            type="button"
            onClick={onOpenNewTask}
            className="px-3 sm:px-3.5 py-1.5 rounded-full bg-[#F9D1D9] hover:bg-[#F3BEC9] text-[#465126] text-xs font-bold flex items-center gap-1 shadow-2xs hover:shadow-xs transition-all active:scale-98 cursor-pointer shrink-0 border border-[#F2AAB8]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">new task</span>
            <span className="sm:hidden">new</span>
          </button>
        </div>

      </div>
    </header>
  );
}
