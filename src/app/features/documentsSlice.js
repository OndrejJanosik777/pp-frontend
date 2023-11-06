import { createSlice } from '@reduxjs/toolkit'
// global state related to dashboard page and its components

export const documentSlice = createSlice({
    name: 'documents',
    initialState: {
        documents: [],
        projectNumber_filter: [],
        milestoneType_filter: [],
        certificationDocument_deadline_from: undefined,
        certificationDocument_deadline_to: undefined,
        certificationDocument_status: [],
        certificationDocument_author: [],
    },
    reducers: {
        fetch_Documents: (state, action) => {},
        set_Documents: (state, action) => {
            let newDocuments = [...action.payload]

            // newTCItems.sort((a, b) => {
            //     return a.Item_TC_Part_Number - b.Item_TC_Part_Number;
            // })

            state.documents = [...newDocuments];
        },
        set_projectNumber_filter: (state, action) => {
            state.projectNumber_filter = [...action.payload];
        },
        set_milestoneType_filter: (state, action) => {
            state.milestoneType_filter = [...action.payload];
        },
        set_certificationDocument_deadline_from: (state, action) => {
            state.certificationDocument_deadline_from = action.payload;
        },
        set_certificationDocument_deadline_to: (state, action) => {
            state.certificationDocument_deadline_to = action.payload;
        },
        set_certificationDocument_status: (state, action) => {
            state.certificationDocument_status = [...action.payload];
        },
        set_certificationDocument_author: (state, action) => {
            state.certificationDocument_author = [...action.payload];
        },
    }
})

// Action creators are generated for each case reducer function
export const { 
    fetch_Documents,
    set_Documents,
    set_projectNumber_filter,
    set_certificationDocument_deadline_from,
    set_certificationDocument_deadline_to,
    set_certificationDocument_status,
    set_certificationDocument_author
} = documentSlice.actions

export default documentSlice.reducer;