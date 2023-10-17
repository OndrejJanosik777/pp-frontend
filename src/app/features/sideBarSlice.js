import { createSlice } from '@reduxjs/toolkit'
// global state related to dashboard page and its components

export const sideBarSlice = createSlice({
    name: 'sideBar',
    initialState: {
        extendedSideBar: false,
    },
    reducers: {
        set_extendedSideBar: (state, action) => {
            state.extendedSideBar = action.payload;
        }
    }
})

// Action creators are generated for each case reducer function
export const { 
    set_extendedSideBar,
} = sideBarSlice.actions

export default sideBarSlice.reducer;