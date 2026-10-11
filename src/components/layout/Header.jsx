import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, Bell, ChevronDown, FolderKanban, CheckSquare, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.projects.items) || [];
  const tasks = useSelector((state) => state.tasks.items) || [];
  const team = useSelector((state) => state.team.items) || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Filter matching items across projects, tasks, and team members
  const matchedProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const matchedTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const matchedTeam = team.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasResults = searchQuery.trim() !== '' && (matchedProjects.length > 0 || matchedTasks.length > 0 || matchedTeam.length > 0);

  return (
    <header className="h-20 bg-white border-b border-gray-100 px-4 sm:px-8 flex items-center justify-between relative z-30">
      {/* Search Bar with Responsive Left Spacing for Mobile Hamburger */}
      <div className="relative w-full max-w-xs sm:max-w-sm md:w-96 pl-12 lg:pl-0 transition-all duration-200">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects, tasks, team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow clicking result
            className="w-full bg-gray-50 border border-gray-200 pl-11 pr-4 py-2.5 rounded-2xl text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        {/* Live Search Results Dropdown */}
        {isFocused && hasResults && (
          <div className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 max-h-80 overflow-y-auto space-y-3 z-50">
            {/* Projects */}
            {matchedProjects.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase px-2 mb-1">Projects</p>
                {matchedProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate('/projects')}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer transition text-xs font-semibold text-gray-800"
                  >
                    <FolderKanban className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="truncate">{p.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tasks */}
            {matchedTasks.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase px-2 mb-1">Tasks</p>
                {matchedTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => navigate('/tasks')}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer transition text-xs font-semibold text-gray-800"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
                    <span className="truncate">{t.title}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Team Members */}
            {matchedTeam.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase px-2 mb-1">Team Members</p>
                {matchedTeam.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => navigate('/team')}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer transition text-xs font-semibold text-gray-800"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="truncate">{m.name} ({m.role})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right User Profile / Notification Info */}
      <div className="flex items-center gap-4 shrink-0">
        <button className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition relative cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
}