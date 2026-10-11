import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from '../features/projects/projectsSlice';
import tasksReducer from '../features/tasks/taskSlice';
import teamReducer from '../features/team/teamSlice';
import authReducer from '../features/auth/authSlice';
import { loadState, saveState } from '../utils/localStorage';

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    tasks: tasksReducer,
    team: teamReducer,
    auth: authReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState({
    projects: store.getState().projects,
    tasks: store.getState().tasks,
    team: store.getState().team,
  });
});