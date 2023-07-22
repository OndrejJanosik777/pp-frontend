import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../../features/counter/counterSlice'
import testMiddleware from './middleware/testMiddleware'

export default configureStore({
  reducer: {
    counter: counterReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(testMiddleware),
})