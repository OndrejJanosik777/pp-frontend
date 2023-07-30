import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice';
import apiReducer from '../features/api/apiSlice';
import apiMiddleware from './middleware/api_middleware'
import counterMiddleware from './middleware/counter_middleware';

export default configureStore({
  reducer: {
    counter: counterReducer,
    api: apiReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiMiddleware).concat(counterMiddleware),
})