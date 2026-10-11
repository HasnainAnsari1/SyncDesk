import { createSlice } from '@reduxjs/toolkit';
import { initialTeam } from '../../data/mockData';

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    items: initialTeam,
  },
  reducers: {
    addTeamMember: (state, action) => {
      state.items.push(action.payload);
    },
    deleteTeamMember: (state, action) => {
      state.items = state.items.filter((member) => member.id !== action.payload);
    },
  },
});

export const { addTeamMember, deleteTeamMember } = teamSlice.actions;
export default teamSlice.reducer;