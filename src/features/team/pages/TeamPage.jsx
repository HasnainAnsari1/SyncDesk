import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Mail, Trash2, ShieldCheck, CheckSquare } from 'lucide-react';
import { addTeamMember, deleteTeamMember } from '../teamSlice';
import { teamMemberSchema } from '../../../utils/validationSchemas';

export default function TeamPage() {
  const dispatch = useDispatch();
  const team = useSelector((state) => state.team.items) || [];
  const tasks = useSelector((state) => state.tasks.items) || [];

  const [isModalOpen, setIsModalOpen] = useState(false);

  // React Hook Form Setup with Zod Resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'Frontend Lead',
    },
  });

  const handleOpenCreate = () => {
    reset({
      name: '',
      email: '',
      role: 'Frontend Lead',
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    const newMember = {
      id: `user-${Date.now()}`,
      ...data,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=100`,
    };

    dispatch(addTeamMember(newMember));
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteTeamMember(id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-mono text-gray-900 tracking-tight">Team Members</h2>
          <p className="text-sm font-light font-mono text-gray-500 mt-1">
            Manage contributors.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold font-mono px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-100 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => {
          const assignedTasksCount = tasks.filter((t) => t.assigneeId === member.id).length;

          return (
            <div
              key={member.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:border-indigo-100 transition group relative"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-50"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
                      }}
                    />
                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full ring-2 ring-white"></span>
                  </div>

                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Remove Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-bold font-mono text-gray-900 group-hover:text-indigo-600 transition">
                  {member.name}
                </h3>
                <p className="text-xs font-light text-gray-400 mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  {member.role}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-light text-gray-500 bg-gray-50 px-3 py-2 rounded-xl">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-gray-50 flex items-center justify-between text-xs font-light text-gray-400">
                <div className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{assignedTasksCount} Assigned Tasks</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-normal border border-emerald-100">
                  Active
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal with Zod Validations */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Add Team Member</h3>
            <p className="text-xs font-light text-gray-500 mb-6">Invite a new member with validated details.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium font-mono text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  {...register('name')}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
                {errors.name && (
                  <p className="text-xs text-rose-500 font-light font-mono mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium font-mono text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="alex@taskflow.com"
                  {...register('email')}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
                {errors.email && (
                  <p className="text-xs text-rose-500 font-light mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium font-mono text-gray-700 mb-1.5">Role</label>
                <select
                  {...register('role')}
                  className="w-full font-mono bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                >
                  <option value="Frontend Lead">Frontend Lead</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="QA Engineer">QA Engineer</option>
                </select>
                {errors.role && (
                  <p className="text-xs text-rose-500 font-light mt-1">{errors.role.message}</p>
                )}
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
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}