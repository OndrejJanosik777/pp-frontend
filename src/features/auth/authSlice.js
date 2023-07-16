import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

export const authSlice = createSlice({
  name: 'counter',
  initialState: {
    userProfile: {},
  },
  reducers: {
    fetchUser: (state, action) => {
        let baseUrl = 'https://pp--backend.herokuapp.com';

        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') 
            baseUrl = 'http://127.0.0.1:8000';

        axios({
            method: 'get',
            url: baseUrl + '/company/my-profile/',
            headers: {
                "Authorization": action.payload
            }
        })
        .then((response => {
            // console.log('user data fetched: ', response.data)

            // set_loggedUser(response.data)

            state.userProfile = response.data
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with fetching user data..');
        })
    }
  },
})

// Action creators are generated for each case reducer function
export const { fetchUser } = authSlice.actions

export default authSlice.reducer