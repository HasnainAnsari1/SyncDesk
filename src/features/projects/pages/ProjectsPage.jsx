import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FolderKanban, Plus, Trash2, Edit3, Calendar } from 'lucide-react';
import { addProject, deleteProject, updateProject } from '../projectsSlice';
import { projectSchema } from '../../../utils/validationSchemas';

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.items) || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // React Hook Form Setup with Zod Resolver
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'In Progress',
      deadline: '',
    },
  });

  // Open Modal for Create
  const handleOpenCreate = () => {
    setIsEditing(false);
    reset({
      name: '',
      description: '',
      status: 'In Progress',
      deadline: '',
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (proj) => {
    setIsEditing(true);
    setCurrentId(proj.id);
    setValue('name', proj.name);
    setValue('description', proj.description);
    setValue('status', proj.status);
    setValue('deadline', proj.deadline);
    setIsModalOpen(true);
  };

  // Form Submit Handler
  const onSubmit = (data) => {
    if (isEditing) {
      dispatch(
        updateProject({
          id: currentId,
          ...data,
        })
      );
    } else {
      const newProj = {
        id: `proj-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
      };
      dispatch(addProject(newProj));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteProject(id));
  };

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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-mono text-gray-900 tracking-tight">Projects Management</h2>
          <p className="text-sm font-light font-mono text-gray-500 mt-1">
            Create, track, edit, and manage all team projects.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold font-mono px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-100 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:border-indigo-100 transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-light font-mono border ${getStatusBadgeClass(proj.status)}`}>
                  {proj.status}
                </span>
              </div>

              <h3 className="text-lg  font-thin text-gray-900 group-hover:text-indigo-600 transition">
                {proj.name}
              </h3>
              <p className="text-xs font-light text-gray-500 mt-2 line-clamp-2">
                {proj.description}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-light text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Due: {proj.deadline}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(proj)}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                  title="Edit Project"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal with React Hook Form & Zod Error Messages */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {isEditing ? 'Edit Project' : 'Create New Project'}
            </h3>
            <p className="text-xs font-light text-gray-500 mb-6">
              {isEditing ? 'Update project details with schema validation.' : 'Add validated project details.'}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mobile App Redesign"
                  {...register('name')}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
                {errors.name && (
                  <p className="text-xs text-rose-500 font-light mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief description of the project..."
                  {...register('description')}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none"
                />
                {errors.description && (
                  <p className="text-xs text-rose-500 font-light mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Status and Deadline Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
                  <select
                    {...register('status')}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  {errors.status && (
                    <p className="text-xs text-rose-500 font-light mt-1">{errors.status.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Deadline</label>
                  <input
                    type="date"
                    {...register('deadline')}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  {errors.deadline && (
                    <p className="text-xs text-rose-500 font-light mt-1">{errors.deadline.message}</p>
                  )}
                </div>
              </div>

              {/* Modal Buttons */}
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
                  {isEditing ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}