import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Edit3, User, Folder } from 'lucide-react';
import { addTask, deleteTask, updateTask } from '../taskSlice';
import { taskSchema } from '../../../utils/validationSchemas';

export default function TasksPage() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.items) || [];
  const projects = useSelector((state) => state.projects.items) || [];
  const team = useSelector((state) => state.team.items) || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  // React Hook Form Setup with Zod Resolver
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      projectId: projects[0]?.id || '',
      assigneeId: team[0]?.id || '',
      priority: 'Medium',
      status: 'To Do',
      dueDate: '',
    },
  });

  const handleOpenCreate = () => {
    setIsEditing(false);
    reset({
      title: '',
      description: '',
      projectId: projects[0]?.id || '',
      assigneeId: team[0]?.id || '',
      priority: 'Medium',
      status: 'To Do',
      dueDate: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setIsEditing(true);
    setCurrentId(task.id);
    setValue('title', task.title);
    setValue('description', task.description);
    setValue('projectId', task.projectId || projects[0]?.id || '');
    setValue('assigneeId', task.assigneeId || team[0]?.id || '');
    setValue('priority', task.priority);
    setValue('status', task.status);
    setValue('dueDate', task.dueDate);
    setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    if (isEditing) {
      dispatch(
        updateTask({
          id: currentId,
          ...data,
        })
      );
    } else {
      const newTask = {
        id: `task-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
      };
      dispatch(addTask(newTask));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  const filteredTasks = statusFilter === 'All' 
    ? tasks 
    : tasks.filter(t => t.status === statusFilter);

  const getProjectName = (projId) => {
    const proj = projects.find((p) => p.id === projId);
    return proj ? proj.name : 'General Project';
  };

  const getAssigneeName = (userId) => {
    const user = team.find((u) => u.id === userId);
    return user ? user.name : 'Unassigned';
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Medium':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Low':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Done':
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-mono text-gray-900 tracking-tight">Tasks Management</h2>
          <p className="text-sm font-light font-mono text-gray-500 mt-1">
            Assign, track, and manage all tasks.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold font-mono px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-100 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
        {['All', 'To Do', 'In Progress', 'Done'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs  font-thin transition cursor-pointer ${
              statusFilter === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-light text-gray-400 uppercase bg-gray-50/50">
                <th className="py-3 px-6 font-normal">Task Title</th>
                <th className="py-3 px-6 font-normal">Project</th>
                <th className="py-3 px-6 font-normal">Assignee</th>
                <th className="py-3 px-6 font-normal">Priority</th>
                <th className="py-3 px-6 font-normal">Status</th>
                <th className="py-3 px-6 font-normal">Due Date</th>
                <th className="py-3 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-xs font-light text-gray-400">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6">
                      <p className="text-gray-800">{task.title}</p>
                      <p className="text-xs font-light text-gray-400 line-clamp-1 mt-0.5">{task.description}</p>
                    </td>
                    <td className="py-4 px-6 text-xs font-light text-gray-600">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200">
                        <Folder className="w-3.5 h-3.5 text-indigo-500" />
                        {getProjectName(task.projectId)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs font-light text-gray-600">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/50 border border-indigo-100 text-indigo-700 font-medium">
                        <User className="w-3.5 h-3.5 text-indigo-500" />
                        {getAssigneeName(task.assigneeId)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-light border ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-light border ${getStatusBadgeClass(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs font-light text-gray-500">
                      {task.dueDate}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                          title="Edit Task"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal with Zod Validations */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h3>
            <p className="text-xs font-light text-gray-500 mb-6">
              {isEditing ? 'Update task details.' : 'Fill in task details below.'}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Design Landing Page"
                  {...register('title')}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
                {errors.title && (
                  <p className="text-xs text-rose-500 font-light mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows="2"
                  placeholder="Task details..."
                  {...register('description')}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none"
                />
                {errors.description && (
                  <p className="text-xs text-rose-500 font-light mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Project Association</label>
                  <select
                    {...register('projectId')}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  >
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                  {errors.projectId && (
                    <p className="text-xs text-rose-500 font-light mt-1">{errors.projectId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Assign to Member</label>
                  <select
                    {...register('assigneeId')}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  >
                    {team.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.role})
                      </option>
                    ))}
                  </select>
                  {errors.assigneeId && (
                    <p className="text-xs text-rose-500 font-light mt-1">{errors.assigneeId.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Priority</label>
                  <select
                    {...register('priority')}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  {errors.priority && (
                    <p className="text-xs text-rose-500 font-light mt-1">{errors.priority.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
                  <select
                    {...register('status')}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                  {errors.status && (
                    <p className="text-xs text-rose-500 font-light mt-1">{errors.status.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Due Date</label>
                  <input
                    type="date"
                    {...register('dueDate')}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  {errors.dueDate && (
                    <p className="text-xs text-rose-500 font-light mt-1">{errors.dueDate.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition shadow-sm cursor-pointer"
                >
                  {isEditing ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}