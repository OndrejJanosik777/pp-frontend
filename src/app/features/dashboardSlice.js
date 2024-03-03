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
        showModal_manageProjects: false,     // toogle modal window
        showModal_manageMilestoneTypes: false,
        showModal_manageTasks: false,    // toogle modal window
        showModal_manageDocuments: false,     // toogle modal window
        showModal_manageTaskTypes: false,
        showModal_manageMilestones: false,
        showModal_manageMonuments: false,
        showModal_manageProjectTasks: false,
        documents: [],
    },
    reducers: {
        fetch_documents: (state, action) => { },
        update_documents: (state, action) => {
            state.documents = [...action.payload];
        },
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
        set_showModal_manageTasks: (state, action) => {
            state.showModal_manageTasks = action.payload;
        },
        set_showModal_manageDocuments: (state, action) => {
            state.showModal_manageDocuments = action.payload;
        },
        set_showModal_manageProjects: (state, action) => {
            state.showModal_manageProjects = action.payload;
        },
        set_showModal_manageMilestoneTypes: (state, action) => {
            state.showModal_manageMilestoneTypes = action.payload;
        },
        set_showModal_manageTaskTypes: (state, action) => {
            state.showModal_manageTaskTypes = action.payload;
        },
        set_showModal_manageMilestones: (state, action) => {
            state.showModal_manageMilestones = action.payload;
        },
        set_showModal_manageMonuments: (state, action) => {
            state.showModal_manageMonuments = action.payload;
        },
        set_showModal_manageProjectTasks: (state, action) => {
            state.showModal_manageProjectTasks = action.payload;
        }
    }
})

// Action creators are generated for each case reducer function
export const { 
    fetch_documents,
    update_documents,
    set_spinnerFetchingProjects,
    set_dateOffset,
    set_activeProject,
    set_activeMilestone,
    set_activeTask,
    reset_dateOffset,
    set_displayedDays,
    set_showModal_manageTasks,
    set_showModal_manageDocuments,
    set_showModal_manageProjects,
    set_showModal_manageMilestoneTypes,
    set_showModal_manageTaskTypes,
    set_showModal_manageMilestones,
    set_showModal_manageMonuments,
    set_showModal_manageProjectTasks,
} = dashboardSlice.actions

export default dashboardSlice.reducer;