import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckSquare, AlertCircle, Clock, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { updateTask } from '../taskSlice';

export default function KanbanPage() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.items) || [];

  const columns = [
    { title: 'To Do', status: 'To Do', color: 'border-amber-200 bg-amber-50/30', headerColor: 'text-amber-600 bg-amber-50' },
    { title: 'In Progress', status: 'In Progress', color: 'border-blue-200 bg-blue-50/30', headerColor: 'text-blue-600 bg-blue-50' },
    { title: 'Done', status: 'Done', color: 'border-emerald-200 bg-emerald-50/30', headerColor: 'text-emerald-600 bg-emerald-50' },
  ];

  // Move task to next status
  const handleMoveStatus = (task, currentStatus) => {
    let nextStatus = currentStatus;
    if (currentStatus === 'To Do') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Done';

    dispatch(
      updateTask({
        ...task,
        status: nextStatus,
      })
    );
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

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-bold font-mono text-gray-900 tracking-tight">Kanban Board</h2>
        <p className="text-sm font-light font-mono text-gray-500 mt-1">
          Visual workflow board to track task progress across stages.
        </p>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {columns.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.status);

          return (
            <div key={col.status} className={`p-5 rounded-2xl border ${col.color} flex flex-col min-h-[500px]`}>
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200/60">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold  ${col.headerColor}`}>
                    {columnTasks.length}
                  </span>
                  <h3 className="font-bold font-mono text-gray-900 text-sm">{col.title}</h3>
                </div>
              </div>

              {/* Tasks List inside Column */}
              <div className="space-y-4 flex-1">
                {columnTasks.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-xs font-thin text-gray-400 border border-dashed border-gray-200 rounded-xl">
                    No tasks in {col.title}
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs hover:shadow-md transition space-y-3 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className= "text-gray-900 text-sm leading-snug">{task.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${getPriorityBadgeClass(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>

                      <p className="text-xs font-light text-gray-500 line-clamp-2">{task.description}</p>

                      <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                        <span className="text-[11px] font-light">Due: {task.dueDate}</span>

                        {task.status !== 'Done' && (
                          <button
                            onClick={() => handleMoveStatus(task, task.status)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition cursor-pointer"
                          >
                            <span>Advance</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}