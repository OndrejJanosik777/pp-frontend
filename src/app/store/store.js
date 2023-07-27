import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/auth/authSlice';
import apiMiddleware from './middleware/api_middleware'
import counterMiddleware from './middleware/counter_middleware';

export default configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiMiddleware).concat(counterMiddleware),
})