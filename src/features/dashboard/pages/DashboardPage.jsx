import React from 'react';
import { useSelector } from 'react-redux';
import { FolderKanban, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import TaskCompletionChart from '../components/TaskCompletionChart';
import TaskAnalyticsChart from '../components/TaskAnalyticsChart';

export default function DashboardPage() {
  const projects = useSelector((state) => state.projects.items) || [];
  const tasks = useSelector((state) => state.tasks.items) || [];

  const totalProjects = projects.length;
  const completedTasks = tasks.filter((t) => t.status === 'Done').length;
  const pendingTasks = tasks.filter((t) => t.status === 'In Progress' || t.status === 'To Do').length;
  const highPriorityTasks = tasks.filter((t) => t.priority === 'High').length;

  const statCards = [
    { title: 'Total Projects', value: totalProjects, icon: FolderKanban, bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600' },
    { title: 'Completed Tasks', value: completedTasks, icon: CheckCircle2, bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { title: 'Pending Tasks', value: pendingTasks, icon: Clock, bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
    { title: 'High Priority', value: highPriorityTasks, icon: AlertCircle, bgColor: 'bg-rose-50', iconColor: 'text-rose-600' },
  ];

  // DashboardPage ke andar helper function:
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'In Progress':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'To Do':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-mono text-gray-900 tracking-tight">Overview Dashboard</h2>
        <p className="text-sm font-light font-mono text-gray-500 mt-1">
          Welcome back! Here is what is happening across your projects today.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-5">
              <div className={`w-12 h-12 rounded-2xl ${card.bgColor} flex items-center justify-center ${card.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-3xl  font-thin text-gray-900 ">{card.value}</h3>
                <p className="text-xs font-light text-gray-400 uppercase tracking-wider">{card.title}</p>
              </div>

            </div>
          );
        })}
      </div>

      {/* Charts Section (Figma Inspired) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TaskCompletionChart />
        </div>
        <div>
          <TaskAnalyticsChart />
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Active Projects</h3>
          <span className="text-xs font-light text-indigo-600 hover:underline cursor-pointer">View All</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-light text-gray-400 uppercase">
                <th className="pb-3 font-normal">Project Name</th>
                <th className="pb-3 font-normal">Status</th>
                <th className="pb-3 font-normal">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-4 font-semibold font-mono text-gray-800">{proj.name}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-light border ${getStatusBadgeClass(proj.status)}`}>
                      {proj.status}
                    </span>
                  </td>
                  <td className="py-4 text-xs font-light text-gray-500">{proj.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}