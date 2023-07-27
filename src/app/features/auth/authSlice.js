import { createSlice } from '@reduxjs/toolkit'
// import axios from 'axios';

export const authSlice = createSlice({
  name: 'auth',
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
  },
  reducers: {
    fetchUserProfile: (state, action) => {
      console.log('REDUCER: ');
      console.log('fetchUserProfile ', action);

      // state.userProfile = { ...action.payload }
    },
    fetchUserProfile_onSuccess: (state, action) => {
      console.log('REDUCER: ');
      console.log('fetchUserProfile_onSuccess: ', action);

      state.userProfile = { ...action.payload }
    }
  },
})

// Action creators are generated for each case reducer function
export const { fetchUserProfile, fetchUserProfile_onSuccess } = authSlice.actions

export default authSlice.reducer