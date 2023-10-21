import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice';
import apiReducer from '../features/api/apiSlice';
import dashboardReducer from "../features/dashboardSlice";
import sideBarReducer from '../features/sideBarSlice';
import testCenterReducer from '../features/testCenterSlice';
import apiMiddleware from './middleware/api_middleware'
import counterMiddleware from './middleware/counter_middleware';
import TCMiddleware from './middleware/TC_middleware';

export default configureStore({
    reducer: {
        counter: counterReducer,
        api: apiReducer,
        dashboard: dashboardReducer,
        sideBar: sideBarReducer,
        testCenter: testCenterReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(apiMiddleware)
        .concat(counterMiddleware)
        .concat(TCMiddleware)
    ,
})