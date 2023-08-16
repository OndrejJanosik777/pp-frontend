import { createSlice } from '@reduxjs/toolkit'
// global state related to api 

export const apiSlice = createSlice({
    name: 'api',
    initialState: {
        userProfile: {
            id: 0,
            password: "",
            last_login: "",
            is_superuser: false,
            username: "...",
            first_name: "",
            last_name: "",
            email: "",
            is_staff: "",
            is_active: "",
            date_joined: "",
            groups: [],
            user_permissions: [],
        },
        baseUrl: "",
        // dateOffset: 0,
        taskTypes: [],
        milestoneTypes: [],
        projects: [],
        // spinnerFetchingProjects: true,
    },
    reducers: {
        fetch_userProfile: (state, action) => { },
        update_userProfile: (state, action) => {
            state.userProfile = { ...action.payload };
        },
        fetch_taskTypes: (state, action) => { },
        update_TaskTypes: (state, action) => {
            state.taskTypes = [...action.payload];
        },
        fetch_milestoneTypes: (state, action) => { },
        update_milestoneTypes: (state, action) => {
            state.milestoneTypes = [...action.payload];
        },
        // 
        fetch_projects: (state, action) => { },
        update_projects: (state, action) => {
            state.projects = [...action.payload];
        },
        update_project: (state, action) => {
            let index = state.projects.findIndex(elem => elem.id === action.payload.id);
            let updatedProjects = [...state.projects];
            updatedProjects[index] = {...action.payload};
            state.projects = [...updatedProjects];
        },
        set_BaseUrl: (state, action) => {
            if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
              state.baseUrl = 'http://127.0.0.1:8000';
            } else {
                state.baseUrl = 'https://pp--backend.herokuapp.com';
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { 
  fetch_userProfile, 
  update_userProfile, 
  fetch_taskTypes,
  update_TaskTypes,
  fetch_milestoneTypes,
  update_milestoneTypes,
  fetch_projects,
  update_projects,
  update_project,
  set_BaseUrl,
} = apiSlice.actions

export default apiSlice.reducer