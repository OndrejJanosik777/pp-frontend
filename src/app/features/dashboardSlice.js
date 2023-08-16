import { createSlice } from '@reduxjs/toolkit'
// global state related to dashboard page and its components

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        dateOffset: -7,
        displayedDays: 0,
        spinnerFetchingProjects: true,
        activeProject: undefined,
        activeMilestone: undefined,
        activeTask: undefined,
        showModal_showModal_manageMilestoneTasks: false,    // toogle modal window
    },
    reducers: {
        set_spinnerFetchingProjects: (state, action) => {
            state.spinnerFetchingProjects = action.payload;
        },
        set_dateOffset: (state, action) => {
            state.dateOffset += action.payload;
        },
        set_activeProject: (state, action) => {
            state.activeProject = action.payload;
        },
        set_activeMilestone: (state, action) => {
            state.activeMilestone = action.payload;
        },
        set_activeTask: (state, action) => {
            state.activeTask = action.payload;
        },
        reset_dateOffset: (state, action) => {
            state.dateOffset = -7;
        },
        set_displayedDays: (state, action) => {
            state.displayedDays = action.payload;
        },
        set_showModal_manageMilestoneTasks: (state, action) => {
            state.showModal_manageMilestoneTasks = action.payload;
        }
    }
})

// Action creators are generated for each case reducer function
export const { 
    set_spinnerFetchingProjects,
    set_dateOffset,
    set_activeProject,
    set_activeMilestone,
    set_activeTask,
    reset_dateOffset,
    set_displayedDays,
    set_showModal_manageMilestoneTasks,
} = dashboardSlice.actions

export default dashboardSlice.reducer;