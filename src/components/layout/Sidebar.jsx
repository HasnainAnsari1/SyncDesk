import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Kanban,
  Users,
  BarChart3,
  Settings,
  Zap,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar() {
  const dispatch = useDispatch();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Kanban Board', path: '/kanban', icon: Kanban }, 
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Floating Hamburger Button (Visible only on small screens) */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-md text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-30 animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Component */}
      <aside className={`w-64 bg-white border-r border-gray-100 flex flex-col justify-between h-screen fixed lg:sticky top-0 z-40 shadow-sm transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Top Logo Section */}
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <div className="flex items-center gap-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-indigo-600 shadow-indigo-200">
                <Zap className="w-5 h-5" />
              </div>
              <span className="font-mono font-bold text-xl text-gray-900 tracking-tight">SyncDesk</span>
            </div>
            
            {/* Mobile Close Button inside sidebar header */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)} // Close sidebar on mobile item selection
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium font-mono text-sm transition-all duration-200 ${isActive
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Upgrade & Profile Section */}
        <div className="p-4 border-t border-gray-100 space-y-4">
          {/* Profile Bar */}
          <div className="flex items-center justify-between pt-2 px-2">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                alt="Easin Arafat"
                className="w-9 h-9 rounded-full object-cover border border-gray-200"
              />
              <div className="text-left">
                <p className="text-sm font-mono text-gray-800 leading-tight">Easin Arafat</p>
                <p className="text-xs font-light text-gray-400">Free Account</p>
              </div>
            </div>
            <button
              onClick={() => dispatch(logout())}
              className="text-gray-400 hover:text-red-500 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}