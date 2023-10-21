import { createSlice } from '@reduxjs/toolkit'
// global state related to dashboard page and its components

export const testCenterSlice = createSlice({
    name: 'testCenter',
    initialState: {
        TCItems: [],
    },
    reducers: {
        fetch_TCItems: (state, action) => {},
        set_TCItems: (state, action) => {
            let newTCItems = [...action.payload]

            newTCItems.sort((a, b) => {
                return a.Item_TC_Part_Number - b.Item_TC_Part_Number;
            })

            state.TCItems = [...newTCItems];
        }
    }
})

// Action creators are generated for each case reducer function
export const { 
    fetch_TCItems,
    set_TCItems,
} = testCenterSlice.actions

export default testCenterSlice.reducer;