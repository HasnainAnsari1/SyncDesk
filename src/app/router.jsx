import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import LoginPage from '../features/auth/pages/LoginPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import ProjectsPage from '../features/projects/pages/ProjectsPage';
import TasksPage from '../features/tasks/pages/TasksPage';
import KanbanPage from '../features/tasks/pages/KanbanPage';
import TeamPage from '../features/team/pages/TeamPage';
import ReportsPage from '../features/reports/pages/ReportsPage';
import SettingsPage from '../features/settings/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'projects', element: <ProjectsPage /> },
          { path: 'tasks', element: <TasksPage /> },
          { path: 'kanban', element: <KanbanPage /> },
          { path: 'team', element: <TeamPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
]);