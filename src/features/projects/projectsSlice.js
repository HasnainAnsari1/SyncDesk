import { createSlice } from "@reduxjs/toolkit";
import { initialProjects } from "../../data/mockData";

const projectsSlice = createSlice({
    name:"projects",
    initialState:{
        items:initialProjects
    },
    reducers:{
        addProject:(state, action)=>{
            state.items.push(action.payload);
        },
        deleteProject:(state, action)=>{
            state.items = state.items.filter(
                (project)=> project.id !== action.payload
            )
        },
        updateProject:(state,action)=>{
            const {id,name,description,status,deadline} = action.payload;
            const existingProject = state.items.find(project => project.id === id);
            if(existingProject){
                existingProject.name = name;
                existingProject.description = description;
                existingProject.status = status;
                existingProject.deadline = deadline;
            }
        }
    }
});

export const {addProject,deleteProject,updateProject} = projectsSlice.actions
export default projectsSlice.reducer;