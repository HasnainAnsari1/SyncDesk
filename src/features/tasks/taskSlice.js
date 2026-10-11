import { createSlice } from '@reduxjs/toolkit';
import { initialTasks } from '../../data/mockData';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: initialTasks,
  },
  reducers: {
    addTask:(state, action)=>{
        state.items.push(action.payload)
    },
    deleteTask:(state,action)=>{
        state.items = state.items.filter(
            (task)=> task.id !== action.payload
        )
    },
    updateTask:(state,action)=>{
        const {id,title,description,projectId,assigneeId,priority,status,dueDate} = action.payload;
        const existingTask= state.items.find(task => task.id === id);
        if(existingTask){
            existingTask.title = title;
            existingTask.description = description;
            existingTask.projectId = projectId;
            existingTask.assigneeId = assigneeId;
            existingTask.priority = priority;
            existingTask.status = status;
            existingTask.dueDate = dueDate;
        }
    }
  },
});

export const {addTask,deleteTask,updateTask} = tasksSlice.actions
export default tasksSlice.reducer;