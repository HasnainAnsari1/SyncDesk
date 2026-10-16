import React from 'react';
import { useSelector } from 'react-redux';
import { BarChart3, FolderKanban, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ReportsPage() {
  const projects = useSelector((state) => state.projects.items) || [];
  const tasks = useSelector((state) => state.tasks.items) || [];

  // Analytics calculations
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const todoTasks = tasks.filter((t) => t.status === 'To Do').length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Bar chart mock/derived data for projects progress
  const barData = projects.map((p) => ({
    name: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name,
    tasks: tasks.filter((t) => t.projectId === p.id).length || 5,
  }));

  const pieData = [
    { name: 'To Do', value: todoTasks || 1, color: '#f59e0b' },
    { name: 'In Progress', value: inProgressTasks || 1, color: '#3b82f6' },
    { name: 'Done', value: completedTasks || 1, color: '#10b981' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-bold font-mono text-gray-900 tracking-tight">Reports & Analytics</h2>
        <p className="text-sm font-light font-mono  text-gray-500 mt-1">
          Detailed performance metrics, task breakdown, and project insights.
        </p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-light font-mono text-gray-400 uppercase tracking-wider">Overall Completion</p>
            <h3 className="text-3xl font-thin text-gray-900 mt-2">{completionRate}%</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-light font-mono text-gray-400 uppercase tracking-wider">Total Tasks Tracked</p>
            <h3 className="text-3xl font-thin text-gray-900 mt-2">{totalTasks}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-light font-mono text-gray-400 uppercase tracking-wider">Active Projects</p>
            <h3 className="text-3xl font-thin text-gray-900 mt-2">{totalProjects}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Tasks per Project */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <h3 className="text-base font-bold font-mono text-gray-900 mb-1">Project Load Distribution</h3>
          <p className="text-xs font-light font-mono text-gray-400 mb-6">Number of tasks associated per project</p>
          
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="tasks" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Status Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-mono text-gray-900 mb-1">Status Breakdown</h3>
            <p className="text-xs font-light font-mono text-gray-400 mb-2">Proportion of tasks in each status category</p>
          </div>

          <div className="w-full h-[200px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs font-light text-gray-500 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span>To Do ({todoTasks})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span>In Progress ({inProgressTasks})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>Done ({completedTasks})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}