import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice';
import apiReducer from '../features/api/apiSlice';
import dashboardReducer from "../features/dashboardSlice";
import apiMiddleware from './middleware/api_middleware'
import counterMiddleware from './middleware/counter_middleware';

export default configureStore({
    reducer: {
        counter: counterReducer,
        api: apiReducer,
        dashboard: dashboardReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(apiMiddleware)
        .concat(counterMiddleware)
    ,
})