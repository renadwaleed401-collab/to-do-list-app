import React, { useState } from 'react';
import { Search, Plus, X, ChevronDown, Check, RotateCw, Users } from 'lucide-react';
import { PEOPLE, getInitials } from '../data/mockUsers.js';

export default function Header({
  searchQuery,
  onSearchChange,
  activePerson,
  onSelectPerson,
  personTasks,
  allTasksCount,
  showAllTeam,
  onToggleShowAllTeam,
  onOpenNewTask,
  onRefreshApi,
  isLoading
}) {
  const [showPersonDropdown, setShowPersonDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#838F58] border-b border-[#737F4A] shadow-xs flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        
        {/* Left: Cute Logo, Site Title & Workspace Views */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Cute Strawberry Matcha To-Do Cup Logo */}
          <div 
            className="w-10 h-10 rounded-2xl bg-[#FAF7F2] border border-[#737F4A] shadow-xs flex items-center justify-center p-1 hover:rotate-3 transition-transform cursor-pointer shrink-0"
            title="to do · strawberry & matcha"
            onClick={() => onToggleShowAllTeam(false)}
          >
            <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
              {/* Cup silhouette */}
              <rect x="6.5" y="10" width="19" height="17" rx="6.5" fill="#FAF7F2" stroke="#838F58" strokeWidth="1.5" />
              {/* Matcha tea base */}
              <path d="M7.5 17.5C10 16.5 14 18.5 18 17.5C21 16.5 23.5 17 24.5 17.5V20.5C24.5 23.8 21.8 26.5 18.5 26.5H13.5C10.2 26.5 7.5 23.8 7.5 20.5V17.5Z" fill="#838F58" />
              {/* Strawberry foam top */}
              <path d="M7.5 17.5C9.5 16.5 13.5 18.5 17.5 17.5C21.5 16.5 23.5 17 24.5 17.5V15C24.5 12.2 22.3 10 19.5 10H12.5C9.7 10 7.5 12.2 7.5 15V17.5Z" fill="#F9D1D9" />
              {/* Mini To-Do Checkmark */}
              <path d="M13.5 22L15.5 24L18.5 20" stroke="#FAF7F2" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              {/* Sweet Matcha Sprout on top */}
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

          {/* Workspace Views */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Person Switcher Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPersonDropdown(!showPersonDropdown)}
                className={`group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border shadow-2xs transition-all cursor-pointer ${
                  !showAllTeam
                    ? 'bg-[#FAF7F2] border-[#F9D1D9] ring-2 ring-[#F9D1D9]/40 text-[#282F1B]'
                    : 'bg-white/15 hover:bg-white/25 border-white/25 text-[#FAF7F2]'
                }`}
                title="Switch personal workspace"
              >
                <div
                  className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs"
                  style={{ backgroundColor: activePerson.id % 2 === 1 ? '#838F58' : '#C96B7F' }}
                >
                  {getInitials(activePerson.name)}
                </div>

                <span className={`text-xs font-semibold hidden sm:inline ${!showAllTeam ? 'text-[#282F1B]' : 'text-[#FAF7F2]'}`}>
                  {activePerson.name.split(' ')[0]}
                </span>
                <ChevronDown className={`w-3 h-3 ${!showAllTeam ? 'text-[#282F1B]/60' : 'text-white/60'} group-hover:opacity-100 transition-opacity`} />
              </button>

              {/* Person Dropdown */}
              {showPersonDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowPersonDropdown(false)}
                  />
                  <div className="absolute left-0 mt-2 z-30 w-56 bg-white rounded-2xl shadow-xl border border-[#EDE6DC] p-1.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-[#282F1B]/40 border-b border-[#F5EFE6]">
                      Personal Workspaces
                    </div>
                    <div className="py-1 space-y-0.5">
                      {PEOPLE.map((person) => {
                        const isSelected = !showAllTeam && person.id === activePerson.id;
                        return (
                          <button
                            key={person.id}
                            type="button"
                            onClick={() => {
                              onSelectPerson(person);
                              onToggleShowAllTeam(false);
                              setShowPersonDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#FDF2F4] text-[#8E364A] font-bold'
                                : 'text-[#282F1B]/80 hover:bg-[#FAF7F2]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-5 h-5 rounded-full text-[10px] text-white flex items-center justify-center font-bold"
                                style={{ backgroundColor: person.id % 2 === 1 ? '#838F58' : '#C96B7F' }}
                              >
                                {person.name[0]}
                              </span>
                              <div className="text-left">
                                <div className="leading-tight">{person.name}</div>
                                <div className="text-[10px] text-[#282F1B]/50 font-normal">{person.role}</div>
                              </div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#838F58]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* All Team Tasks Button */}
            <button
              type="button"
              onClick={() => onToggleShowAllTeam(!showAllTeam)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                showAllTeam
                  ? 'bg-[#F9D1D9] text-[#465126] border-[#F9D1D9] ring-2 ring-white/30 shadow-xs font-bold'
                  : 'bg-white/15 hover:bg-white/25 text-[#FAF7F2] border-white/25'
              }`}
              title="View tasks for the entire team"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">all team</span>
              <span 
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  showAllTeam 
                    ? 'bg-black/15 text-[#465126]' 
                    : 'bg-black/20 text-[#FAF7F2]'
                }`}
              >
                {allTasksCount}
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
              placeholder="Search..."
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
            title="Reload DummyJSON API tasks"
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
