import { createSlice } from '@reduxjs/toolkit'
// import axios from 'axios';

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
      taskTypes: [],
      milestoneTypes: [],
  },
  reducers: {
    fetchUserProfile: (state, action) => { },
    fetchUserProfile_onSuccess: (state, action) => {
      state.userProfile = { ...action.payload };
    },
    fetch_taskTypes: (state, action) => { },
    fetchTaskTypes_onSuccess: (state, action) => {
      state.taskTypes = [...action.payload];
    },
    fetch_milestoneTypes: (state, action) => { },
    fetchMilestoneTypes_onSuccess: (state, action) => {
      state.milestoneTypes = [...action.payload];
    },
    set_BaseUrl: (state, action) => {
        // console.log('REDUCER: ');
        // console.log('setBaseUrl: ', action);

        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          // dev code
          state.baseUrl = 'http://127.0.0.1:8000';

          // return 'http://127.0.0.1:8000';
      } else {
          // production code
          state.baseUrl = 'https://pp--backend.herokuapp.com';

          // return 'https://pp--backend.herokuapp.com';
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const { 
  fetchUserProfile, 
  fetchUserProfile_onSuccess, 
  set_BaseUrl,
  fetch_taskTypes,
  fetchTaskTypes_onSuccess,
  fetch_milestoneTypes,
  fetchMilestoneTypes_onSuccess
} = apiSlice.actions

export default apiSlice.reducer