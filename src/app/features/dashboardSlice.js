import { createSlice } from '@reduxjs/toolkit'
// global state related to dashboard page and its components

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        dateOffset: 0,
        displayedDays: 0,
        spinnerFetchingProjects: true,
    },
    reducers: {
        set_spinnerFetchingProjects: (state, action) => {
            state.spinnerFetchingProjects = action.payload;
        },
        set_dateOffset: (state, action) => {
            state.dateOffset += action.payload;
        },
        set_displayedDays: (state, action) => {
            state.displayedDays = action.payload;
        }
    }
})

// Action creators are generated for each case reducer function
export const { 
    set_spinnerFetchingProjects,
    set_dateOffset,
    set_displayedDays,
} = dashboardSlice.actions

export default dashboardSlice.reducer;